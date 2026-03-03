// Heist Browser - Fetches and categorizes prompts from the fabric patterns repository
import { db, HeistPrompt } from '../../../lib/db';
import { callDevToolsLLM } from './llm-client';

const FABRIC_PATTERNS_API = 'https://api.github.com/repos/danielmiessler/fabric/git/trees/main?recursive=1';
const FABRIC_RAW_BASE = 'https://raw.githubusercontent.com/danielmiessler/fabric/main/patterns';

interface RawPrompt {
  slug: string;
  name: string;
  content: string;
}

export async function fetchFabricPrompts(): Promise<RawPrompt[]> {
  const res = await fetch(FABRIC_PATTERNS_API);
  if (!res.ok) throw new Error(`Failed to fetch fabric tree: ${res.status}`);

  const data = await res.json();
  const patternPaths = (data.tree as Array<{ path: string; type: string }>)
    .filter(f => f.path.startsWith('patterns/') && f.path.endsWith('/system.md') && f.type === 'blob')
    .map(f => f.path);

  const prompts: RawPrompt[] = [];
  for (const path of patternPaths.slice(0, 100)) {
    const slug = path.split('/')[1];
    const name = slug.replace(/_/g, ' ').replace(/-/g, ' ');
    try {
      const contentRes = await fetch(`${FABRIC_RAW_BASE}/${slug}/system.md`);
      if (contentRes.ok) {
        const content = await contentRes.text();
        prompts.push({ slug, name, content });
      }
    } catch {
      // Skip failed fetches
    }
  }

  return prompts;
}

export async function savePromptsToDb(rawPrompts: RawPrompt[]): Promise<void> {
  const heistPrompts: HeistPrompt[] = rawPrompts.map(p => ({
    id: p.slug,
    name: p.name,
    content: p.content,
    wordCount: p.content.split(/\s+/).length,
    category: 'other',
    qualityScore: 50,
    useCases: [],
    lastUpdated: Date.now(),
  }));

  await db.heistPrompts.bulkPut(heistPrompts);
}

export async function categorizePrompts(rawPrompts: RawPrompt[]): Promise<HeistPrompt[]> {
  const categorized: HeistPrompt[] = [];

  for (const prompt of rawPrompts) {
    try {
      const result = await callDevToolsLLM({
        model: 'google/gemini-flash-1.5',
        systemPrompt: 'You are a prompt categorizer. Respond with a JSON object: { "category": string, "qualityScore": number, "useCases": string[] }. Categories: reasoning, writing, analysis, coding, research, evaluation, creativity, extraction, other.',
        userPrompt: `Categorize this prompt:\n\nName: ${prompt.name}\nContent (first 500 chars): ${prompt.content.slice(0, 500)}`,
        responseFormat: { type: 'json_object' },
        maxTokens: 200,
        temperature: 0.1,
      });

      const parsed = JSON.parse(result.content);
      const heistPrompt: HeistPrompt = {
        id: prompt.slug,
        name: prompt.name,
        content: prompt.content,
        wordCount: prompt.content.split(/\s+/).length,
        category: parsed.category || 'other',
        qualityScore: parsed.qualityScore || 50,
        useCases: parsed.useCases || [],
        lastUpdated: Date.now(),
      };
      await db.heistPrompts.put(heistPrompt);
      categorized.push(heistPrompt);
    } catch {
      // Skip prompts that fail categorization
    }
  }

  return categorized;
}

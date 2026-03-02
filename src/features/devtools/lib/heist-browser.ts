import { db, HeistPrompt } from '../../../lib/db';

const FABRIC_BASE = 'https://api.github.com/repos/danielmiessler/fabric/contents/patterns';

export async function fetchFabricPrompts(githubToken?: string): Promise<HeistPrompt[]> {
  const headers: HeadersInit = { Accept: 'application/vnd.github.v3+json' };
  if (githubToken) headers['Authorization'] = `Bearer ${githubToken}`;

  const res = await fetch(FABRIC_BASE, { headers });
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  const dirs: Array<{ name: string; url: string }> = await res.json();

  const results: HeistPrompt[] = [];
  // Batch 8 at a time to respect rate limits
  for (let i = 0; i < dirs.length; i += 8) {
    const batch = dirs.slice(i, i + 8);
    const settled = await Promise.allSettled(
      batch.map(d => fetchSinglePattern(d.name, headers))
    );
    settled.forEach(r => { if (r.status === 'fulfilled' && r.value) results.push(r.value); });
    if (i + 8 < dirs.length) await new Promise(r => setTimeout(r, 1200)); // rate limit pause
  }
  return results;
}

async function fetchSinglePattern(name: string, headers: HeadersInit): Promise<HeistPrompt | null> {
  const url = `https://raw.githubusercontent.com/danielmiessler/fabric/main/patterns/${name}/system.md`;
  const res = await fetch(url, { headers });
  if (!res.ok) return null;
  const content = await res.text();
  return {
    slug: name,
    name: name.replace(/_/g, ' '),
    content,
    wordCount: content.split(/\s+/).length,
    category: 'other',
    qualityScore: 50,
    lastUpdated: Date.now(),
  };
}

export async function savePromptsToDb(prompts: HeistPrompt[]): Promise<number> {
  let saved = 0;
  for (const prompt of prompts) {
    const existing = await db.heistPrompts.where('slug').equals(prompt.slug).first();
    if (existing) {
      await db.heistPrompts.update(existing.id!, prompt);
    } else {
      await db.heistPrompts.add(prompt);
    }
    saved++;
  }
  return saved;
}

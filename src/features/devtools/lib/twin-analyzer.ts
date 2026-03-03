// Twin Analyzer - LLM-powered code DNA comparison between your repo and a target
import { callDevToolsLLM } from './llm-client';

export interface TwinDimension {
  name: string;
  yourScore: number;
  targetScore: number;
}

export interface AdoptionItem {
  priority: number;
  change: string;
  estimatedImpact: string;
  effort: 'low' | 'medium' | 'high';
}

export interface TwinProfile {
  targetRepoName: string;
  alignmentScore: number;
  dimensions: TwinDimension[];
  adoptionPlan: AdoptionItem[];
}

interface FileInput {
  path: string;
  content: string;
}

export async function analyzeTwinDNA(
  yourFiles: FileInput[],
  targetRepo: string
): Promise<TwinProfile> {
  // Fetch target repo README and key files for comparison
  const readmeRes = await fetch(
    `https://api.github.com/repos/${targetRepo}/readme`,
    { headers: { Accept: 'application/vnd.github.v3.raw' } }
  );
  const targetReadme = readmeRes.ok ? await readmeRes.text() : '';

  const treeRes = await fetch(`https://api.github.com/repos/${targetRepo}/git/trees/HEAD?recursive=1`);
  const targetFiles = treeRes.ok
    ? ((await treeRes.json()).tree as Array<{ path: string }>).map(f => f.path).slice(0, 50)
    : [];

  const yourCodeSummary = yourFiles
    .map(f => `--- ${f.path} ---\n${f.content.slice(0, 1000)}`)
    .join('\n\n');

  const result = await callDevToolsLLM({
    model: 'google/gemini-flash-1.5',
    systemPrompt: `You are a code architecture analyst. Compare two codebases and return a JSON object with:
{
  "alignmentScore": number (0-100),
  "dimensions": [{ "name": string, "yourScore": number (0-100), "targetScore": number (0-100) }],
  "adoptionPlan": [{ "priority": number, "change": string, "estimatedImpact": string, "effort": "low"|"medium"|"high" }]
}
Dimensions should include: Architecture, Error Handling, Type Safety, Testing, Documentation, Performance, DX.`,
    userPrompt: `Compare YOUR codebase with TARGET repo "${targetRepo}".

YOUR CODE:
${yourCodeSummary}

TARGET README:
${targetReadme.slice(0, 2000)}

TARGET FILE STRUCTURE:
${targetFiles.join('\n')}`,
    responseFormat: { type: 'json_object' },
    maxTokens: 1500,
    temperature: 0.3,
  });

  const parsed = JSON.parse(result.content);

  return {
    targetRepoName: targetRepo,
    alignmentScore: parsed.alignmentScore ?? 50,
    dimensions: parsed.dimensions ?? [],
    adoptionPlan: parsed.adoptionPlan ?? [],
  };
}

import { get, set } from 'idb-keyval';
import { GITHUB_OWNER, GITHUB_REPO } from '@/lib/config';
const CACHE_PREFIX = 'knowledge_base_';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

interface CacheEntry {
  content: string;
  timestamp: number;
}
export async function consultKnowledgeBase(filename: string): Promise<string> {
  const cacheKey = `${CACHE_PREFIX}${filename}`;
  try {
    // Try cache first
    const cached = await get<CacheEntry>(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_EXPIRY) {
      return cached.content;
    }
    const user = GITHUB_OWNER;
    const repo = GITHUB_REPO;
    const branch = "main";
    const url = `https://raw.githubusercontent.com/${user}/${repo}/${branch}/src/lib/knowledge-base/${filename}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Knowledge file not found");
    const content = await response.text();

    // Update cache
    await set(cacheKey, {
      content,
      timestamp: Date.now()
    });
    return content;
  } catch (error) {
    console.error("Knowledge retrieval failed:", error);
    return `I could not find information about ${filename} in the knowledge base.`;
  }
}
export async function loadKnowledgeSet(files: string[]): Promise<Map<string, string>> {
  const results = new Map<string, string>();
  await Promise.all(files.map(async file => {
    const content = await consultKnowledgeBase(file);
    results.set(file, content);
  }));
  return results;
}
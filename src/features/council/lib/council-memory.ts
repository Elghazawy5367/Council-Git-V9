// Council Memory - Cross-Session Persistent Memory System
import { get, set } from 'idb-keyval';

// Memory entry types
export type MemoryType = 'insight' | 'pattern' | 'user_preference' | 'domain_knowledge';

export interface MemoryEntry {
  id: string;
  timestamp: Date;
  sessionId: string;
  type: MemoryType;
  content: string;
  tags: string[];
  relevanceScore: number;
}

export interface CouncilMemory {
  entries: MemoryEntry[];
  userPreferences: Record<string, unknown>;
  domainKnowledge: Record<string, string[]>;
  enabled: boolean;
}

// Storage key
const MEMORY_KEY = 'council_memory_v18';
const MAX_ENTRIES = 100;

// Default memory state
const DEFAULT_MEMORY: CouncilMemory = {
  entries: [],
  userPreferences: {},
  domainKnowledge: {},
  enabled: true,
};

/**
 * Load memory from IndexedDB
 */
export async function loadMemory(): Promise<CouncilMemory> {
  try {
    const memory = await get<CouncilMemory>(MEMORY_KEY);
    if (memory && memory.entries) {
      // Convert timestamp strings back to Date objects and ensure tags exist
      return {
        ...memory,
        entries: memory.entries.map(e => ({
          ...e,
          timestamp: new Date(e.timestamp),
          tags: e.tags || [],
        })),
      };
    }
    return DEFAULT_MEMORY;
  } catch (error) {
    console.error('Failed to load council memory:', error);
    return DEFAULT_MEMORY;
  }
}

/**
 * Save memory to IndexedDB
 */
export async function saveMemory(memory: CouncilMemory): Promise<void> {
  try {
    await set(MEMORY_KEY, memory);
  } catch (error) {
    console.error('Failed to save council memory:', error);
  }
}

/**
 * Add a new memory entry
 */
export async function addMemoryEntry(entry: Omit<MemoryEntry, 'id' | 'timestamp'>): Promise<MemoryEntry> {
  const memory = await loadMemory();
  
  const newEntry: MemoryEntry = {
    ...entry,
    id: `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date(),
  };
  
  memory.entries.unshift(newEntry);
  
  // Prune old low-relevance entries if over max
  if (memory.entries.length > MAX_ENTRIES) {
    memory.entries
      .sort((a, b) => {
        // Keep high relevance and recent entries
        const recencyA = Date.now() - new Date(a.timestamp).getTime();
        const recencyB = Date.now() - new Date(b.timestamp).getTime();
        const scoreA = a.relevanceScore - (recencyA / (1000 * 60 * 60 * 24 * 7)); // Decay over a week
        const scoreB = b.relevanceScore - (recencyB / (1000 * 60 * 60 * 24 * 7));
        return scoreB - scoreA;
      })
      .slice(0, MAX_ENTRIES);
  }
  
  await saveMemory(memory);
  return newEntry;
}

/**
 * Add multiple memory entries at once
 */
export async function addMemoryEntries(entries: Omit<MemoryEntry, 'id' | 'timestamp'>[]): Promise<MemoryEntry[]> {
  const memory = await loadMemory();
  
  const newEntries: MemoryEntry[] = entries.map(entry => ({
    ...entry,
    id: `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date(),
  }));
  
  memory.entries.unshift(...newEntries);
  
  // Prune if over max
  if (memory.entries.length > MAX_ENTRIES) {
    memory.entries = memory.entries
      .sort((a, b) => {
        const recencyA = Date.now() - new Date(a.timestamp).getTime();
        const recencyB = Date.now() - new Date(b.timestamp).getTime();
        const scoreA = a.relevanceScore - (recencyA / (1000 * 60 * 60 * 24 * 7));
        const scoreB = b.relevanceScore - (recencyB / (1000 * 60 * 60 * 24 * 7));
        return scoreB - scoreA;
      })
      .slice(0, MAX_ENTRIES);
  }
  
  await saveMemory(memory);
  return newEntries;
}

/**
 * Delete a memory entry
 */
export async function deleteMemoryEntry(id: string): Promise<void> {
  const memory = await loadMemory();
  memory.entries = memory.entries.filter(e => e.id !== id);
  await saveMemory(memory);
}

/**
 * Clear all memory
 */
export async function clearMemory(): Promise<void> {
  await saveMemory(DEFAULT_MEMORY);
}

/**
 * Toggle memory enabled state
 */
export async function setMemoryEnabled(enabled: boolean): Promise<void> {
  const memory = await loadMemory();
  memory.enabled = enabled;
  await saveMemory(memory);
}

/**
 * Find relevant memories for a given task
 */
export function findRelevantMemories(
  memories: MemoryEntry[],
  task: string,
  maxResults: number = 5
): MemoryEntry[] {
  if (!task.trim()) return [];
  
  const taskWords = task.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  
  const scored = memories.map(memory => {
    // Calculate keyword overlap score
    const memoryWords = memory.content.toLowerCase().split(/\s+/);
    const tagWords = (memory.tags || []).map(t => t.toLowerCase()); // <-- FIX: Add fallback for tags
    
    let keywordScore = 0;
    taskWords.forEach(word => {
      if (memoryWords.some(mw => mw.includes(word))) keywordScore += 1;
      if (tagWords.some(tw => tw.includes(word))) keywordScore += 2;
    });
    
    // Calculate recency score (0-1, higher for recent)
    const ageMs = Date.now() - new Date(memory.timestamp).getTime();
    const ageDays = ageMs / (1000 * 60 * 60 * 24);
    const recencyScore = Math.max(0, 1 - (ageDays / 30)); // Decay over 30 days
    
    // Combined score
    const totalScore = (keywordScore * 0.6) + (memory.relevanceScore * 0.3) + (recencyScore * 0.1);
    
    return { memory, score: totalScore };
  });
  
  return scored
    .filter(s => s.score > 0.1)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map(s => s.memory);
}

/**
 * Format memories for injection into expert context
 */
export function formatMemoriesForContext(memories: MemoryEntry[]): string {
  if (memories.length === 0) return '';
  
  const insightMemories = memories.filter(m => m.type === 'insight');
  const prefMemories = memories.filter(m => m.type === 'user_preference');
  const domainMemories = memories.filter(m => m.type === 'domain_knowledge');
  const patternMemories = memories.filter(m => m.type === 'pattern');
  
  let context = '\n--- COUNCIL MEMORY ---\n';
  
  if (insightMemories.length > 0) {
    context += 'Previous insights relevant to this query:\n';
    insightMemories.forEach(m => {
      context += `${m.content}\n`;
    });
    context += '\n';
  }
  
  context += buildContext(prefMemories, domainMemories, patternMemories);
  
  context += '--- END COUNCIL MEMORY ---\n';
  
  return context;
}

/**
 * Extract memories from synthesis output (simple keyword-based extraction)
 */
export function extractMemoriesFromSynthesis(
  synthesisContent: string,
  sessionId: string,
  task: string
): Omit<MemoryEntry, 'id' | 'timestamp'>[] {
  const memories: Omit<MemoryEntry, 'id' | 'timestamp'>[] = [];
  
  // Extract insights marked as IMPORTANT
  const importantMatches = synthesisContent.match(/(?:IMPORTANT|KEY INSIGHT|CRITICAL):\s*([^\n]+)/gi);
  if (importantMatches) {
    importantMatches.forEach(match => {
      const content = match.replace(/(?:IMPORTANT|KEY INSIGHT|CRITICAL):\s*/i, '').trim();
      if (content.length > 10) {
        memories.push({
          sessionId,
          type: 'insight',
          content,
          tags: extractTags(content, task),
          relevanceScore: 0.8,
        });
      }
    });
  }
  
  // Extract recommendations
  const recommendMatches = synthesisContent.match(/(?:RECOMMEND|SUGGESTION|ADVICE):\s*([^\n]+)/gi);
  if (recommendMatches) {
    recommendMatches.forEach(match => {
      const content = match.replace(/(?:RECOMMEND|SUGGESTION|ADVICE):\s*/i, '').trim();
      if (content.length > 10) {
        memories.push({
          sessionId,
          type: 'insight',
          content,
          tags: extractTags(content, task),
          relevanceScore: 0.7,
        });
      }
    });
  }
  
  // Extract user preferences (look for "user prefers", "user wants", etc.)
  const prefMatches = synthesisContent.match(/(?:user prefers?|user wants?|user needs?|client prefers?)\s+([^.]+)/gi);
  if (prefMatches) {
    prefMatches.forEach(match => {
      memories.push({
        sessionId,
        type: 'user_preference',
        content: match.trim(),
        tags: extractTags(match, task),
        relevanceScore: 0.9,
      });
    });
  }
  
  // Extract domain knowledge (look for industry/market mentions)
  const domainMatches = synthesisContent.match(/(?:in the|within the|for the)\s+([A-Z][a-zA-Z\s]+)\s+(?:industry|market|sector|space)/gi);
  if (domainMatches) {
    domainMatches.forEach(match => {
      memories.push({
        sessionId,
        type: 'domain_knowledge',
        content: match.trim(),
        tags: extractTags(match, task),
        relevanceScore: 0.7,
      });
    });
  }
  
  return memories;
}

/**
 * Extract tags from content
 */
function extractTags(content: string, task: string): string[] {
  const tags: string[] = [];
  const combined = (content + ' ' + task).toLowerCase();
  
  // Common business terms to tag
  const businessTerms = ['saas', 'b2b', 'b2c', 'startup', 'bootstrap', 'enterprise', 'pricing', 'revenue', 'growth', 'marketing', 'product', 'strategy', 'technology', 'ai', 'automation'];
  
  businessTerms.forEach(term => {
    if (combined.includes(term)) {
      tags.push(term);
    }
  });
  
  return tags.slice(0, 5); // Max 5 tags
}

/**
 * Format relative time for display
 */
export function formatMemoryTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString();
}

/**
 * Get memory type label
 */
export function getMemoryTypeLabel(type: MemoryType): string {
  const labels: Record<MemoryType, string> = {
    insight: '💡 Insight',
    pattern: '🔄 Pattern',
    user_preference: '⚙️ Preference',
    domain_knowledge: '📚 Domain',
  };
  return labels[type];
}

/**
 * Build context string from memory arrays
 */
export function buildContext(
  prefMemories: MemoryEntry[],
  domainMemories: MemoryEntry[],
  patternMemories: MemoryEntry[]
): string {
  let context = '';

  if (prefMemories.length > 0) {
    context += 'User preferences:\n';
    prefMemories.forEach(m => {
      context += `- ${m.content}\n`;
    });
    context += '\n';
  }

  if (domainMemories.length > 0) {
    context += 'Domain context:\n';
    domainMemories.forEach(m => {
      context += `- ${m.content}\n`;
    });
    context += '\n';
  }

  if (patternMemories.length > 0) {
    context += 'Observed patterns:\n';
    patternMemories.forEach(m => {
      context += `- ${m.content}\n`;
    });
  }

  return context;
}

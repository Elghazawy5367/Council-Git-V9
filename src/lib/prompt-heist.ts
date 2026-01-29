/**
 * Prompt Heist - Dynamic Prompt Loading System
 * Loads battle-tested prompts from danielmiessler/fabric with caching
 * 
 * Usage:
 *   const prompt = await promptVault.loadPrompt('extract_wisdom');
 *   const enhanced = enhancePrompt(prompt, 'Focus on Blue Ocean opportunities');
 */

import fs from 'fs';
import path from 'path';
export interface HeistPrompt {
  name: string;
  content: string;
  source: 'fabric' | 'custom';
  category: string;
  description?: string;
  lastUpdated: Date;
  url?: string;
}
class PromptVault {
  private cache: Map<string, HeistPrompt> = new Map();
  private promptsDir = path.join(process.cwd(), 'prompts', 'fabric');

  /**
   * Load a prompt from the vault (local first, then GitHub fallback)
   */
  async loadPrompt(name: string): Promise<string> {
    // Check cache first
    if (this.cache.has(name)) {
      return this.cache.get(name)!.content;
    }

    // Try to load from local file system
    const localPrompt = await this.loadFromLocal(name);
    if (localPrompt) {
      this.cache.set(name, localPrompt);
      return localPrompt.content;
    }

    // Fallback: fetch from GitHub directly (development mode)

    const remotePrompt = await this.fetchFromGitHub(name);
    if (remotePrompt) {
      this.cache.set(name, remotePrompt);
      return remotePrompt.content;
    }
    throw new Error(`Pattern ${name} not found locally or on GitHub. Run 'npm run heist' to download patterns.`);
  }

  /**
   * Load prompt from local file system
   */
  private async loadFromLocal(name: string): Promise<HeistPrompt | null> {
    // Search all category directories
    const categories = ['analysis', 'validation', 'synthesis', 'strategy', 'extraction', 'improvement'];
    for (const category of categories) {
      const filePath = path.join(this.promptsDir, category, `${name}.md`);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');

        // Extract metadata from header comment
        const metadata = this.extractMetadata(content);
        return {
          name,
          content: this.stripMetadata(content),
          source: 'fabric',
          category,
          description: metadata.description,
          lastUpdated: new Date(metadata.heisted || Date.now()),
          url: metadata.url
        };
      }
    }
    return null;
  }

  /**
   * Fetch prompt directly from GitHub (fallback)
   */
  private async fetchFromGitHub(patternName: string): Promise<HeistPrompt | null> {
    const url = `https://raw.githubusercontent.com/danielmiessler/fabric/main/data/patterns/${patternName}/system.md`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        return null;
      }
      const content = await response.text();
      return {
        name: patternName,
        content,
        source: 'fabric',
        category: this.inferCategory(patternName),
        lastUpdated: new Date(),
        url
      };
    } catch (error) {
      console.error(`[PromptVault] Failed to fetch ${patternName} from GitHub:`, error);
      return null;
    }
  }

  /**
   * Extract metadata from pattern header
   */
  private extractMetadata(content: string): Record<string, string> {
    const metadata: Record<string, string> = {};
    const headerMatch = content.match(/<!--\s*([\s\S]*?)\s*-->/);
    if (headerMatch) {
      const header = headerMatch[1];
      const lines = header.split('\n');
      lines.forEach(line => {
        const match = line.match(/^\s*(\w+):\s*(.+)$/);
        if (match) {
          metadata[match[1].toLowerCase()] = match[2].trim();
        }
      });
    }
    return metadata;
  }

  /**
   * Strip metadata header from content
   */
  private stripMetadata(content: string): string {
    return content.replace(/<!--\s*[\s\S]*?\s*-->\s*\n*/, '');
  }

  /**
   * Infer category from pattern name
   */
  private inferCategory(name: string): string {
    if (name.includes('extract') || name.includes('analyze')) return 'analysis';
    if (name.includes('validate') || name.includes('rate') || name.includes('find')) return 'validation';
    if (name.includes('create') || name.includes('improve') || name.includes('write')) return 'synthesis';
    if (name.includes('threat') || name.includes('strategy') || name.includes('prepare')) return 'strategy';
    return 'general';
  }

  /**
   * List all available patterns (from local directory)
   */
  listAvailable(): string[] {
    const patterns: string[] = [];
    if (!fs.existsSync(this.promptsDir)) {
      return patterns;
    }
    const categories = ['analysis', 'validation', 'synthesis', 'strategy', 'extraction', 'improvement'];
    categories.forEach(category => {
      const categoryPath = path.join(this.promptsDir, category);
      if (fs.existsSync(categoryPath)) {
        const files = fs.readdirSync(categoryPath);
        files.forEach(file => {
          if (file.endsWith('.md') && file !== 'INDEX.md') {
            patterns.push(path.basename(file, '.md'));
          }
        });
      }
    });
    return patterns;
  }

  /**
   * Get patterns by category
   */
  getPatternsByCategory(): Record<string, string[]> {
    const byCategory: Record<string, string[]> = {
      analysis: [],
      validation: [],
      synthesis: [],
      strategy: [],
      extraction: [],
      improvement: []
    };
    if (!fs.existsSync(this.promptsDir)) {
      return byCategory;
    }
    Object.keys(byCategory).forEach(category => {
      const categoryPath = path.join(this.promptsDir, category);
      if (fs.existsSync(categoryPath)) {
        const files = fs.readdirSync(categoryPath);
        files.forEach(file => {
          if (file.endsWith('.md') && file !== 'INDEX.md') {
            byCategory[category].push(path.basename(file, '.md'));
          }
        });
      }
    });
    return byCategory;
  }

  /**
   * Clear cache (useful for development/testing)
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    size: number;
    patterns: string[];
  } {
    return {
      size: this.cache.size,
      patterns: Array.from(this.cache.keys())
    };
  }
}

// Singleton instance
export const promptVault = new PromptVault();

/**
 * Enhance a heisted prompt with Council-specific context
 * 
 * @param heistedPrompt - The fabric pattern prompt
 * @param customContext - Council-specific instructions
 * @param frameworks - Optional frameworks to apply (ERRC, Mom Test, etc.)
 * @returns Enhanced prompt ready for The Council
 */
export function enhancePrompt(heistedPrompt: string, customContext: string, frameworks?: string[]): string {
  let enhanced = heistedPrompt;

  // Add separator
  enhanced += '\n\n---\n\n';

  // Add Council context header
  enhanced += '# COUNCIL CONTEXT\n\n';
  enhanced += customContext + '\n';

  // Add framework instructions if provided
  if (frameworks && frameworks.length > 0) {
    enhanced += '\n## FRAMEWORKS TO APPLY\n\n';
    frameworks.forEach(framework => {
      enhanced += `- ${framework}\n`;
    });
  }

  // Add execution instructions
  enhanced += '\n## COUNCIL EXECUTION INSTRUCTIONS\n\n';
  enhanced += '1. Follow the pattern methodology above\n';
  enhanced += '2. Apply Council-specific context and frameworks\n';
  enhanced += '3. Ensure output aligns with The Council\'s mission: Blue Ocean discovery\n';
  enhanced += '4. Maintain ruthless quality standards\n';
  return enhanced;
}

/**
 * Combine multiple fabric patterns into a single prompt
 * 
 * @param patternNames - Array of pattern names to combine
 * @param synthesisInstructions - How to combine the patterns
 * @returns Combined prompt
 */
export async function combinePatterns(patternNames: string[], synthesisInstructions: string): Promise<string> {
  let combined = '# MULTI-PATTERN SYNTHESIS\n\n';
  combined += synthesisInstructions + '\n\n';
  combined += '---\n\n';
  for (const name of patternNames) {
    const prompt = await promptVault.loadPrompt(name);
    combined += `## PATTERN: ${name}\n\n`;
    combined += prompt + '\n\n';
    combined += '---\n\n';
  }
  combined += '# SYNTHESIS INSTRUCTIONS\n\n';
  combined += 'Apply all patterns above in sequence:\n\n';
  patternNames.forEach((name, i) => {
    combined += `${i + 1}. ${name}\n`;
  });
  combined += '\nThen synthesize the results into a unified Council verdict.\n';
  return combined;
}

/**
 * Create a Council-optimized hybrid prompt
 * 
 * @param fabricPattern - Name of the fabric pattern
 * @param councilPersona - The Council persona (Blue Ocean Strategist, Ruthless Validator, etc.)
 * @param customFramework - Council framework to apply
 * @returns Hybrid prompt combining Fabric + Council
 */
export async function createHybridPrompt(fabricPattern: string, councilPersona: string, customFramework: string): Promise<string> {
  const fabricPrompt = await promptVault.loadPrompt(fabricPattern);
  let hybrid = `# HYBRID PROMPT: ${fabricPattern} + ${councilPersona}\n\n`;
  hybrid += '## PART 1: FABRIC METHODOLOGY\n\n';
  hybrid += fabricPrompt + '\n\n';
  hybrid += '---\n\n';
  hybrid += '## PART 2: COUNCIL FRAMEWORK\n\n';
  hybrid += customFramework + '\n\n';
  hybrid += '---\n\n';
  hybrid += '## EXECUTION INSTRUCTIONS\n\n';
  hybrid += `You are "${councilPersona}" using the ${fabricPattern} methodology.\n\n`;
  hybrid += 'Steps:\n';
  hybrid += '1. Apply the Fabric pattern methodology (Part 1)\n';
  hybrid += '2. Filter results through the Council framework (Part 2)\n';
  hybrid += '3. Ensure output matches both pattern structure AND Council philosophy\n';
  hybrid += '4. Prioritize Blue Ocean opportunities and market gaps\n';
  return hybrid;
}
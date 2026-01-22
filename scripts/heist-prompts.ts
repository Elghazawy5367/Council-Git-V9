#!/usr/bin/env node
/**
 * The HEIST - Prompt Engineering Exploit Script
 * Legally imports world-class prompts from danielmiessler/fabric
 * 
 * Usage:
 *   npm run heist              # Download all patterns
 *   npm run heist:update       # Force re-download (ignores cache)
 */

import fs from 'fs';
import path from 'path';

interface FabricPattern {
  name: string;
  url: string;
  category: 'analysis' | 'validation' | 'synthesis' | 'strategy' | 'extraction' | 'improvement';
  description: string;
}

// Curated patterns optimized for The Council
const FABRIC_PATTERNS: FabricPattern[] = [
  // Analysis Patterns (Market Research, Blue Ocean)
  {
    name: 'extract_wisdom',
    url: 'https://raw.githubusercontent.com/danielmiessler/fabric/main/data/patterns/extract_wisdom/system.md',
    category: 'analysis',
    description: 'Extract surprising insights, ideas, quotes, and recommendations from any content'
  },
  {
    name: 'analyze_tech_impact',
    url: 'https://raw.githubusercontent.com/danielmiessler/fabric/main/data/patterns/analyze_tech_impact/system.md',
    category: 'analysis',
    description: 'Evaluate technology projects for societal impact and strategic positioning'
  },
  {
    name: 'find_hidden_message',
    url: 'https://raw.githubusercontent.com/danielmiessler/fabric/main/data/patterns/find_hidden_message/system.md',
    category: 'analysis',
    description: 'Uncover concealed meanings, implications, and hidden agendas in content'
  },
  {
    name: 'analyze_paper',
    url: 'https://raw.githubusercontent.com/danielmiessler/fabric/main/data/patterns/analyze_paper/system.md',
    category: 'analysis',
    description: 'Analyze research papers for findings, rigor, and quality assessment'
  },
  
  // Validation Patterns (Ruthless Validator)
  {
    name: 'analyze_claims',
    url: 'https://raw.githubusercontent.com/danielmiessler/fabric/main/data/patterns/analyze_claims/system.md',
    category: 'validation',
    description: 'Fact-check claims with evidence, counter-arguments, and confidence scoring'
  },
  {
    name: 'find_logical_fallacies',
    url: 'https://raw.githubusercontent.com/danielmiessler/fabric/main/data/patterns/find_logical_fallacies/system.md',
    category: 'validation',
    description: 'Identify and analyze logical fallacies to evaluate argument validity'
  },
  {
    name: 'analyze_product_feedback',
    url: 'https://raw.githubusercontent.com/danielmiessler/fabric/main/data/patterns/analyze_product_feedback/system.md',
    category: 'validation',
    description: 'Process user feedback to identify themes and prioritize insights'
  },
  {
    name: 'rate_content',
    url: 'https://raw.githubusercontent.com/danielmiessler/fabric/main/data/patterns/rate_content/system.md',
    category: 'validation',
    description: 'Quality scoring system for evaluating content value and relevance'
  },
  
  // Synthesis Patterns (Judge/Synthesis Engine)
  {
    name: 'create_summary',
    url: 'https://raw.githubusercontent.com/danielmiessler/fabric/main/data/patterns/create_summary/system.md',
    category: 'synthesis',
    description: 'Create concise summaries with main points and key takeaways'
  },
  {
    name: 'improve_writing',
    url: 'https://raw.githubusercontent.com/danielmiessler/fabric/main/data/patterns/improve_writing/system.md',
    category: 'synthesis',
    description: 'Enhance writing quality, clarity, and professional polish'
  },
  {
    name: 'create_idea_compass',
    url: 'https://raw.githubusercontent.com/danielmiessler/fabric/main/data/patterns/create_idea_compass/system.md',
    category: 'synthesis',
    description: 'Organize thoughts analyzing definitions, evidence, relationships, implications'
  },
  
  // Strategic Planning Patterns
  {
    name: 'create_stride_threat_model',
    url: 'https://raw.githubusercontent.com/danielmiessler/fabric/main/data/patterns/create_stride_threat_model/system.md',
    category: 'strategy',
    description: 'Security and risk assessment using STRIDE framework'
  },
  {
    name: 'analyze_candidates',
    url: 'https://raw.githubusercontent.com/danielmiessler/fabric/main/data/patterns/analyze_candidates/system.md',
    category: 'strategy',
    description: 'Compare competitive positioning and strategic differentiation'
  },
  {
    name: 'prepare_7s_strategy',
    url: 'https://raw.githubusercontent.com/danielmiessler/fabric/main/data/patterns/prepare_7s_strategy/system.md',
    category: 'strategy',
    description: 'McKinsey 7S strategic framework analysis'
  },
  
  // Extraction Patterns (Data Mining)
  {
    name: 'extract_insights',
    url: 'https://raw.githubusercontent.com/danielmiessler/fabric/main/data/patterns/extract_insights/system.md',
    category: 'extraction',
    description: 'Extract powerful insights about life, technology, and business'
  },
  {
    name: 'extract_predictions',
    url: 'https://raw.githubusercontent.com/danielmiessler/fabric/main/data/patterns/extract_predictions/system.md',
    category: 'extraction',
    description: 'Identify predictions, claims, confidence levels, and verification methods'
  },
  {
    name: 'extract_recommendations',
    url: 'https://raw.githubusercontent.com/danielmiessler/fabric/main/data/patterns/extract_recommendations/system.md',
    category: 'extraction',
    description: 'Extract actionable recommendations organized for implementation'
  },
  {
    name: 'extract_business_ideas',
    url: 'https://raw.githubusercontent.com/danielmiessler/fabric/main/data/patterns/extract_business_ideas/system.md',
    category: 'extraction',
    description: 'Extract and elaborate on business opportunities with differentiators'
  },
  
  // Improvement Patterns (Code Review, Enhancement)
  {
    name: 'improve_prompt',
    url: 'https://raw.githubusercontent.com/danielmiessler/fabric/main/data/patterns/improve_prompt/system.md',
    category: 'improvement',
    description: 'Enhance AI prompts for clarity, specificity, and effectiveness'
  },
  {
    name: 'improve_academic_writing',
    url: 'https://raw.githubusercontent.com/danielmiessler/fabric/main/data/patterns/improve_academic_writing/system.md',
    category: 'improvement',
    description: 'Enhance academic writing quality and scholarly rigor'
  }
];

interface HeistStats {
  attempted: number;
  successful: number;
  failed: number;
  skipped: number;
  errors: string[];
}

async function heistPrompts(forceUpdate: boolean = false): Promise<HeistStats> {
  const stats: HeistStats = {
    attempted: 0,
    successful: 0,
    failed: 0,
    skipped: 0,
    errors: []
  };

  console.log('🎭 ════════════════════════════════════════════════════');
  console.log('🎭  THE HEIST - Prompt Engineering Exploit');
  console.log('🎭  Target: danielmiessler/fabric (MIT License)');
  console.log('🎭 ════════════════════════════════════════════════════\n');

  // Create base directory structure
  const baseDir = path.join(process.cwd(), 'prompts', 'fabric');
  const categories = ['analysis', 'validation', 'synthesis', 'strategy', 'extraction', 'improvement'];
  
  for (const category of categories) {
    const categoryDir = path.join(baseDir, category);
    if (!fs.existsSync(categoryDir)) {
      fs.mkdirSync(categoryDir, { recursive: true });
      console.log(`📁 Created directory: prompts/fabric/${category}`);
    }
  }

  console.log('\n🎯 Starting heist operation...\n');

  for (const pattern of FABRIC_PATTERNS) {
    stats.attempted++;
    
    try {
      const outputPath = path.join(baseDir, pattern.category, `${pattern.name}.md`);
      
      // Skip if file exists and not forcing update
      if (fs.existsSync(outputPath) && !forceUpdate) {
        console.log(`⏭️  Skipped: ${pattern.name} (already exists)`);
        stats.skipped++;
        continue;
      }

      console.log(`📥 Heisting: ${pattern.name}...`);
      
      const response = await fetch(pattern.url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const prompt = await response.text();
      
      // Add attribution header
      const attribution = `<!-- 
  Source: danielmiessler/fabric - ${pattern.name}
  License: MIT
  URL: ${pattern.url}
  Description: ${pattern.description}
  Heisted: ${new Date().toISOString()}
-->

`;
      
      const fullContent = attribution + prompt;
      
      fs.writeFileSync(outputPath, fullContent);
      
      console.log(`✅ Success: ${pattern.name} → prompts/fabric/${pattern.category}/${pattern.name}.md`);
      stats.successful++;
      
      // Be polite to GitHub (1 second delay between requests)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`❌ Failed: ${pattern.name}`);
      if (error instanceof Error) {
        console.error(`   Error: ${error.message}`);
        stats.errors.push(`${pattern.name}: ${error.message}`);
      }
      stats.failed++;
    }
  }

  // Create index file with all patterns
  await createPatternIndex(baseDir);

  return stats;
}

async function createPatternIndex(baseDir: string): Promise<void> {
  const indexPath = path.join(baseDir, 'INDEX.md');
  
  let index = `# Fabric Patterns - Heisted from danielmiessler/fabric

**License:** MIT  
**Source:** https://github.com/danielmiessler/fabric  
**Last Updated:** ${new Date().toISOString()}

---

## Pattern Categories

`;

  const categories = {
    analysis: 'Market Research, Insight Extraction, Blue Ocean Discovery',
    validation: 'Fact-Checking, Claim Analysis, Quality Scoring',
    synthesis: 'Summarization, Writing Enhancement, Idea Organization',
    strategy: 'Risk Assessment, Competitive Analysis, Strategic Planning',
    extraction: 'Data Mining, Business Intelligence, Prediction Analysis',
    improvement: 'Prompt Engineering, Writing Enhancement, Quality Improvement'
  };

  for (const [category, description] of Object.entries(categories)) {
    index += `### ${category.charAt(0).toUpperCase() + category.slice(1)}\n`;
    index += `*${description}*\n\n`;
    
    const patterns = FABRIC_PATTERNS.filter(p => p.category === category);
    patterns.forEach(pattern => {
      index += `- **${pattern.name}**: ${pattern.description}\n`;
    });
    
    index += '\n';
  }

  index += `---

## Usage in The Council

### Integration Example:

\`\`\`typescript
import { promptVault } from '@/lib/prompt-heist';

// Load a fabric pattern
const wisdomPrompt = await promptVault.loadPrompt('extract_wisdom');

// Combine with Council context
const councilPrompt = \`\${wisdomPrompt}

---

COUNCIL CONTEXT:
Apply this pattern to Blue Ocean market analysis.
Focus on identifying untapped opportunities and non-customer insights.
\`;
\`\`\`

### Available Patterns:

${FABRIC_PATTERNS.map(p => `- \`${p.name}\``).join('\n')}

---

## Legal Notice

All patterns are sourced from danielmiessler/fabric under MIT License.  
Attribution is included in each pattern file header.  
Original repository: https://github.com/danielmiessler/fabric

The Council integrates these patterns with custom frameworks (ERRC Grid, Mom Test, ROT Analysis, etc.)
to create hybrid, Council-optimized prompts.
`;

  fs.writeFileSync(indexPath, index);
  console.log(`\n📚 Created pattern index: prompts/fabric/INDEX.md`);
}

function printSummary(stats: HeistStats): void {
  console.log('\n🎉 ════════════════════════════════════════════════════');
  console.log('🎉  HEIST COMPLETE');
  console.log('🎉 ════════════════════════════════════════════════════\n');
  
  console.log(`📊 Statistics:`);
  console.log(`   Total Attempted: ${stats.attempted}`);
  console.log(`   ✅ Successful: ${stats.successful}`);
  console.log(`   ⏭️  Skipped: ${stats.skipped}`);
  console.log(`   ❌ Failed: ${stats.failed}`);
  
  if (stats.errors.length > 0) {
    console.log(`\n⚠️  Errors:`);
    stats.errors.forEach(error => console.log(`   - ${error}`));
  }
  
  console.log(`\n📁 Location: prompts/fabric/`);
  console.log(`📚 Index: prompts/fabric/INDEX.md`);
  console.log(`\n💡 Next Steps:`);
  console.log(`   1. Review heisted patterns in prompts/fabric/`);
  console.log(`   2. Test one pattern with your Blue Ocean Strategist`);
  console.log(`   3. Create hybrid prompts (Fabric + Council frameworks)`);
  console.log(`   4. Integrate with prompt-heist.ts loader`);
  console.log('\n🎭 The vault is now yours. Use it wisely.\n');
}

// Main execution
const forceUpdate = process.argv.includes('--force') || process.argv.includes('-f');

if (forceUpdate) {
  console.log('🔄 Force update mode: Re-downloading all patterns\n');
}

heistPrompts(forceUpdate)
  .then(stats => {
    printSummary(stats);
    process.exit(stats.failed > 0 ? 1 : 0);
  })
  .catch(error => {
    console.error('\n💥 HEIST FAILED:', error);
    process.exit(1);
  });

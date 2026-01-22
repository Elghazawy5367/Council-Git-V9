#!/usr/bin/env node
/**
 * Test Script: The HEIST Integration Demo
 * 
 * Demonstrates how heisted fabric patterns enhance Council prompts
 * 
 * Usage:
 *   npm run test:heist
 */

import { promptVault, enhancePrompt } from '../src/lib/prompt-heist';

async function demonstrateHeist() {
  console.log('🎭 ════════════════════════════════════════════════════');
  console.log('🎭  THE HEIST - Integration Demo');
  console.log('🎭 ════════════════════════════════════════════════════\n');

  // List all available patterns
  console.log('📚 Available Patterns:');
  const patterns = promptVault.listAvailable();
  console.log(`   Total: ${patterns.length} patterns heisted\n`);

  // Show patterns by category
  const byCategory = promptVault.getPatternsByCategory();
  Object.entries(byCategory).forEach(([category, items]) => {
    console.log(`   ${category}: ${items.length} patterns`);
  });

  console.log('\n─────────────────────────────────────────────────────\n');

  // Demo 1: Load a basic pattern
  console.log('📥 Demo 1: Loading extract_wisdom pattern...');
  const wisdomPrompt = await promptVault.loadPrompt('extract_wisdom');
  console.log(`✅ Loaded: ${wisdomPrompt.length} characters`);
  console.log(`   Preview: ${wisdomPrompt.substring(0, 200)}...\n`);

  // Demo 2: Enhance with Council context
  console.log('🔧 Demo 2: Enhancing with Council context...');
  const enhanced = enhancePrompt(
    wisdomPrompt.substring(0, 500), // Use first part for demo
    'Apply this to Blue Ocean market research. Focus on identifying untapped opportunities.',
    ['ERRC Grid', 'Noncustomer Analysis']
  );
  console.log(`✅ Enhanced: ${enhanced.length} characters`);
  console.log(`   Council context added successfully\n`);

  // Demo 3: Show cache stats
  console.log('💾 Demo 3: Cache Performance...');
  const stats = promptVault.getCacheStats();
  console.log(`✅ Cache: ${stats.size} patterns cached`);
  console.log(`   Patterns: ${stats.patterns.join(', ')}\n`);

  // Demo 4: Compare prompt structures
  console.log('📊 Demo 4: Pattern Analysis...');
  
  const patterns_to_analyze = [
    'extract_wisdom',
    'analyze_claims',
    'create_summary'
  ];

  for (const name of patterns_to_analyze) {
    const prompt = await promptVault.loadPrompt(name);
    const lines = prompt.split('\n').length;
    const hasSteps = prompt.includes('# STEPS');
    const hasOutput = prompt.includes('# OUTPUT');
    
    console.log(`   ${name}:`);
    console.log(`      Lines: ${lines}`);
    console.log(`      Has STEPS section: ${hasSteps ? '✅' : '❌'}`);
    console.log(`      Has OUTPUT section: ${hasOutput ? '✅' : '❌'}`);
  }

  console.log('\n─────────────────────────────────────────────────────\n');

  // Demo 5: Integration Example
  console.log('🎯 Demo 5: Council Integration Example\n');
  console.log('Example code for persona-library.ts:');
  console.log(`
import { promptVault, enhancePrompt } from '@/lib/prompt-heist';

// In your Blue Ocean Strategist persona:
const fabricWisdom = await promptVault.loadPrompt('extract_wisdom');

const enhancedPersona = enhancePrompt(
  fabricWisdom,
  \`You are the Blue Ocean Strategist.
  
  Apply wisdom extraction to identify:
  - Red Ocean competitors (existing market)
  - Blue Ocean opportunities (untapped spaces)
  - Noncustomer insights (who should buy but doesn't)
  - ERRC Grid factors
  \`,
  ['Blue Ocean Strategy', 'ERRC Grid', 'Value Innovation']
);

// Use enhancedPersona as your basePersona
  `);

  console.log('\n─────────────────────────────────────────────────────\n');

  console.log('✅ Demo Complete!\n');
  console.log('📚 Next Steps:');
  console.log('   1. Review heisted patterns in prompts/fabric/');
  console.log('   2. Check examples in src/lib/prompt-heist-examples.ts');
  console.log('   3. Integrate one pattern into persona-library.ts');
  console.log('   4. Test with Council execution mode');
  console.log('   5. Compare output quality (before vs. after)\n');

  console.log('🎭 The vault is ready. Time to deploy world-class prompts.\n');
}

// Run demo
demonstrateHeist()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('\n💥 Demo failed:', error);
    process.exit(1);
  });

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
  // List all available patterns

  const patterns = promptVault.listAvailable();
  // Show patterns by category
  const byCategory = promptVault.getPatternsByCategory();
  Object.entries(byCategory).forEach(([category, items]) => {});

  // Demo 1: Load a basic pattern

  const wisdomPrompt = await promptVault.loadPrompt('extract_wisdom');

  // Demo 2: Enhance with Council context

  const enhanced = enhancePrompt(wisdomPrompt.substring(0, 500),
  // Use first part for demo
  'Apply this to Blue Ocean market research. Focus on identifying untapped opportunities.', ['ERRC Grid', 'Noncustomer Analysis']);

  // Demo 3: Show cache stats

  const stats = promptVault.getCacheStats();

  // Demo 4: Compare prompt structures

  const patterns_to_analyze = ['extract_wisdom', 'analyze_claims', 'create_summary'];
  for (const name of patterns_to_analyze) {
    const prompt = await promptVault.loadPrompt(name);
    const lines = prompt.split('\n').length;
    const hasSteps = prompt.includes('# STEPS');
    const hasOutput = prompt.includes('# OUTPUT');
  }

  // Demo 5: Integration Example
}

// Run demo
demonstrateHeist().then(() => process.exit(0)).catch(error => {
  console.error('\n💥 Demo failed:', error);
  process.exit(1);
});
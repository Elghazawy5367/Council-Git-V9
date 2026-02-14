#!/usr/bin/env tsx
/**
 * Quality Pipeline Intelligence - Runner Script
 * 
 * Executes the Quality Pipeline feature to filter and score
 * all intelligence reports for high-quality opportunities.
 */

import { runQualityPipeline } from '../src/lib/quality-pipeline-intelligence';

async function main(): Promise<void> {
  try {
    await runQualityPipeline();
    process.exit(0);
  } catch (error) {
    console.error('❌ Quality Pipeline failed:', error);
    process.exit(1);
  }
}

main();

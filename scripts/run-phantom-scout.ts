#!/usr/bin/env tsx
/**
 * Phantom Scout Runner - Multi-Niche Intelligence Gathering
 * 
 * Executes Phantom Scout across all enabled niches in config/target-niches.yaml
 * Generates intelligence reports for Blue Ocean opportunities, pain points, and trends.
 * 
 * Usage: npm run phantom-scout
 */

import { runPhantomScout } from '../src/lib/scout';

async function main(): Promise<void> {
  try {
    await runPhantomScout();
    process.exit(0);
  } catch (error) {
    console.error('❌ Phantom Scout mission failed:', error);
    process.exit(1);
  }
}

main();

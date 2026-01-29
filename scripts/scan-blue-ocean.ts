#!/usr/bin/env tsx
/**
 * Blue Ocean Scanner - Standalone Script
 * 
 * Finds abandoned goldmines with proven demand.
 * Usage: npx tsx scripts/scan-blue-ocean.ts [topic]
 */
import { scanBlueOcean } from "../src/lib/scout";
async function main(): Promise<void> {
  const topic = process.argv[2] || process.env.TARGET_NICHE || "developer-tools";
  try {
    const opportunities = await scanBlueOcean(topic);
    opportunities.slice(0, 10).forEach((opp, idx) => {
      if (opp.isAbandoned) // eslint-disable-next-line no-empty
        {}});
    const goldmines = opportunities.filter((o) => o.isAbandoned && o.hasProvenDemand);
    process.exit(0);
  } catch (error) {
    console.error("Scanner failed:", error);
    process.exit(1);
  }
}
main();
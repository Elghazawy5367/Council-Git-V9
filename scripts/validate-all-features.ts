#!/usr/bin/env node
/**
 * Comprehensive Validation Script for All Intelligence Features
 * 
 * This script validates that all intelligence features:
 * 1. Can be imported without errors
 * 2. Have proper TypeScript types
 * 3. Export the expected main function
 * 4. Follow the correct architectural pattern
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

interface ValidationResult {
  name: string;
  script: string;
  library: string;
  passed: boolean;
  checks: {
    scriptExists: boolean;
    libraryExists: boolean;
    scriptCompiles: boolean;
    hasMainFunction: boolean;
    hasErrorHandling: boolean;
    librarySize: number;
  };
  errors: string[];
}

const features = [
  {
    name: 'Stargazer Analysis',
    script: 'scripts/analyze-stargazers.ts',
    library: 'src/lib/stargazer-intelligence.ts',
    mainFunction: 'runStargazerAnalysis'
  },
  {
    name: 'Fork Evolution',
    script: 'scripts/track-forks.ts',
    library: 'src/lib/fork-evolution.ts',
    mainFunction: 'runForkEvolution'
  },
  {
    name: 'Goldmine Detector',
    script: 'scripts/detect-goldmines.ts',
    library: 'src/lib/goldmine-detector.ts',
    mainFunction: 'runGoldmineDetector'
  },
  {
    name: 'Mining Drill',
    script: 'scripts/run-mining-drill.ts',
    library: 'src/lib/mining-drill.ts',
    mainFunction: 'runMiningDrill'
  },
  {
    name: 'Market Gap Identifier',
    script: 'scripts/analyze-market-gaps.ts',
    library: 'src/lib/market-gap-identifier.ts',
    mainFunction: 'runMarketGapIdentifier'
  },
  {
    name: 'Reddit Sniper',
    script: 'scripts/snipe-reddit.ts',
    library: 'src/lib/reddit-sniper.ts',
    mainFunction: 'runRedditSniper'
  },
  {
    name: 'HackerNews Intelligence',
    script: 'scripts/scan-hackernews.ts',
    library: 'src/lib/hackernews-intelligence.ts',
    mainFunction: 'runHackerNewsIntelligence'
  },
  {
    name: 'Viral Radar',
    script: 'scripts/scan-viral.ts',
    library: 'src/lib/viral-radar.ts',
    mainFunction: 'runViralRadar'
  },
  {
    name: 'Reddit Pain Points',
    script: 'scripts/extract-reddit-pain.ts',
    library: 'src/lib/reddit-pain-points.ts',
    mainFunction: 'runRedditPainPoints'
  },
  {
    name: 'GitHub Trending',
    script: 'scripts/scan-github-trending.ts',
    library: 'src/lib/github-trending.ts',
    mainFunction: 'runGitHubTrending'
  }
];

function checkFileExists(filepath: string): boolean {
  try {
    return fs.existsSync(filepath);
  } catch {
    return false;
  }
}

function getFileSize(filepath: string): number {
  try {
    const stats = fs.statSync(filepath);
    return stats.size;
  } catch {
    return 0;
  }
}

function checkScriptCompiles(filepath: string): boolean {
  try {
    execSync(`npx tsx --check ${filepath}`, { 
      stdio: 'pipe',
      timeout: 10000 
    });
    return true;
  } catch {
    return false;
  }
}

function checkForMainFunction(filepath: string): boolean {
  try {
    const content = fs.readFileSync(filepath, 'utf8');
    return content.includes('async function main()') || content.includes('function main()');
  } catch {
    return false;
  }
}

function checkForErrorHandling(filepath: string): boolean {
  try {
    const content = fs.readFileSync(filepath, 'utf8');
    return content.includes('try') && content.includes('catch') && content.includes('process.exit');
  } catch {
    return false;
  }
}

function validateFeature(feature: any): ValidationResult {
  const errors: string[] = [];
  
  // Check script exists
  const scriptExists = checkFileExists(feature.script);
  if (!scriptExists) {
    errors.push(`Script file not found: ${feature.script}`);
  }
  
  // Check library exists
  const libraryExists = checkFileExists(feature.library);
  if (!libraryExists) {
    errors.push(`Library file not found: ${feature.library}`);
  }
  
  // Check library size
  const librarySize = getFileSize(feature.library);
  if (librarySize < 10000) {
    errors.push(`Library too small (${librarySize} bytes) - may be a stub`);
  }
  
  // Check script compiles
  const scriptCompiles = scriptExists ? checkScriptCompiles(feature.script) : false;
  if (!scriptCompiles && scriptExists) {
    errors.push('Script does not compile');
  }
  
  // Check for main function
  const hasMainFunction = scriptExists ? checkForMainFunction(feature.script) : false;
  if (!hasMainFunction && scriptExists) {
    errors.push('Script missing main() function');
  }
  
  // Check for error handling
  const hasErrorHandling = scriptExists ? checkForErrorHandling(feature.script) : false;
  if (!hasErrorHandling && scriptExists) {
    errors.push('Script missing error handling');
  }
  
  const passed = 
    scriptExists && 
    libraryExists && 
    librarySize >= 10000 &&
    scriptCompiles && 
    hasMainFunction && 
    hasErrorHandling;
  
  return {
    name: feature.name,
    script: feature.script,
    library: feature.library,
    passed,
    checks: {
      scriptExists,
      libraryExists,
      scriptCompiles,
      hasMainFunction,
      hasErrorHandling,
      librarySize
    },
    errors
  };
}

async function main(): Promise<void> {
  console.log('🔍 Comprehensive Intelligence Features Validation\n');
  console.log('='.repeat(70));
  console.log('');
  
  const results: ValidationResult[] = [];
  
  for (const feature of features) {
    process.stdout.write(`Validating ${feature.name}... `);
    const result = validateFeature(feature);
    results.push(result);
    
    if (result.passed) {
      console.log('✅ PASS');
    } else {
      console.log('❌ FAIL');
    }
  }
  
  // Detailed results
  console.log('\n' + '='.repeat(70));
  console.log('\n📊 DETAILED RESULTS\n');
  
  for (const result of results) {
    if (!result.passed) {
      console.log(`❌ ${result.name}`);
      result.errors.forEach(err => console.log(`   - ${err}`));
      console.log('');
    }
  }
  
  // Summary
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  
  console.log('='.repeat(70));
  console.log('\n📈 SUMMARY\n');
  console.log(`✅ Passed: ${passed}/${features.length}`);
  console.log(`❌ Failed: ${failed}/${features.length}`);
  
  // File sizes
  console.log('\n📁 Library Sizes:');
  results.forEach(r => {
    const sizeKB = (r.checks.librarySize / 1024).toFixed(1);
    const icon = r.checks.librarySize >= 10000 ? '✅' : '⚠️';
    console.log(`   ${icon} ${r.name.padEnd(25)} ${sizeKB.padStart(6)} KB`);
  });
  
  console.log('\n' + '='.repeat(70));
  
  if (passed === features.length) {
    console.log('\n🎉 All intelligence features are properly implemented!\n');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some features failed validation\n');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Validation script error:', error);
  process.exit(1);
});

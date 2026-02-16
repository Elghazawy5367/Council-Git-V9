import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

const execAsync = promisify(exec);

interface FeatureTypeCheck {
  feature: string;
  requestedFile: string;
  resolvedFile: string;
}

interface TypeCheckResult {
  feature: string;
  requestedFile: string;
  resolvedFile: string;
  status: 'PASSED' | 'FAILED';
  errors: number;
  details: string;
}

function resolveFeatureFile(requestedFile: string): string {
  if (fs.existsSync(requestedFile)) {
    return requestedFile;
  }

  if (requestedFile.endsWith('quality-pipeline.ts')) {
    const fallback = requestedFile.replace('quality-pipeline.ts', 'quality-pipeline-intelligence.ts');
    if (fs.existsSync(fallback)) {
      return fallback;
    }
  }

  if (requestedFile.endsWith('phantom-scout.ts')) {
    const fallback = requestedFile.replace('phantom-scout.ts', 'scout.ts');
    if (fs.existsSync(fallback)) {
      return fallback;
    }
  }

  return requestedFile;
}

async function runTypeCheck(): Promise<boolean> {
  console.log('🔍 Running TypeScript Type Checks...\n');

  const requestedFeatures: FeatureTypeCheck[] = [
    { feature: 'mining-drill', requestedFile: 'src/lib/mining-drill.ts', resolvedFile: '' },
    { feature: 'stargazer-intelligence', requestedFile: 'src/lib/stargazer-intelligence.ts', resolvedFile: '' },
    { feature: 'fork-evolution', requestedFile: 'src/lib/fork-evolution.ts', resolvedFile: '' },
    { feature: 'goldmine-detector', requestedFile: 'src/lib/goldmine-detector.ts', resolvedFile: '' },
    { feature: 'hackernews-intelligence', requestedFile: 'src/lib/hackernews-intelligence.ts', resolvedFile: '' },
    { feature: 'reddit-sniper', requestedFile: 'src/lib/reddit-sniper.ts', resolvedFile: '' },
    { feature: 'viral-radar', requestedFile: 'src/lib/viral-radar.ts', resolvedFile: '' },
    { feature: 'reddit-pain-points', requestedFile: 'src/lib/reddit-pain-points.ts', resolvedFile: '' },
    { feature: 'market-gap-identifier', requestedFile: 'src/lib/market-gap-identifier.ts', resolvedFile: '' },
    { feature: 'github-trending', requestedFile: 'src/lib/github-trending.ts', resolvedFile: '' },
    { feature: 'quality-pipeline', requestedFile: 'src/lib/quality-pipeline.ts', resolvedFile: '' },
    { feature: 'phantom-scout', requestedFile: 'src/lib/phantom-scout.ts', resolvedFile: '' }
  ].map((item) => ({ ...item, resolvedFile: resolveFeatureFile(item.requestedFile) }));

  let totalErrors = 0;
  const results: TypeCheckResult[] = [];

  for (const feature of requestedFeatures) {
    console.log(`\n📝 Checking: ${feature.feature}...`);

    if (!fs.existsSync(feature.resolvedFile)) {
      totalErrors += 1;
      results.push({
        feature: feature.feature,
        requestedFile: feature.requestedFile,
        resolvedFile: feature.resolvedFile,
        status: 'FAILED',
        errors: 1,
        details: `File not found: ${feature.requestedFile}`
      });
      console.log(`   ❌ File not found: ${feature.requestedFile}`);
      continue;
    }

    try {
      await execAsync(`npx tsc --noEmit ${feature.resolvedFile}`);
      results.push({
        feature: feature.feature,
        requestedFile: feature.requestedFile,
        resolvedFile: feature.resolvedFile,
        status: 'PASSED',
        errors: 0,
        details: 'No type errors'
      });
      console.log('   ✅ No type errors');
    } catch (error: unknown) {
      const execError = error as { stdout?: string; stderr?: string; message?: string };
      const details = execError.stderr || execError.stdout || execError.message || 'Unknown type checking error';
      const errorCount = (details.match(/error TS/gi) || []).length || 1;
      totalErrors += errorCount;

      results.push({
        feature: feature.feature,
        requestedFile: feature.requestedFile,
        resolvedFile: feature.resolvedFile,
        status: 'FAILED',
        errors: errorCount,
        details
      });

      console.log(`   ❌ ${errorCount} type error(s)`);
    }
  }

  console.log('\n\n📊 TYPE CHECK SUMMARY');
  console.log('='.repeat(50));
  console.log(`Total Features: ${requestedFeatures.length}`);
  console.log(`Passed: ${results.filter((r) => r.status === 'PASSED').length}`);
  console.log(`Failed: ${results.filter((r) => r.status === 'FAILED').length}`);
  console.log(`Total Type Errors: ${totalErrors}`);

  const report = generateTypeCheckReport(results);
  fs.mkdirSync(path.join(process.cwd(), 'reports'), { recursive: true });
  fs.writeFileSync(path.join(process.cwd(), 'reports', 'type-check-report.md'), report);
  console.log('\n✅ Full report: reports/type-check-report.md');

  return totalErrors === 0;
}

function generateTypeCheckReport(results: TypeCheckResult[]): string {
  let markdown = '# TypeScript Type Check Report\n\n';
  markdown += `**Date:** ${new Date().toISOString()}\n`;
  markdown += `**Features Checked:** ${results.length}\n\n`;

  markdown += '## Summary\n\n';
  markdown += '| Feature | Requested File | Checked File | Status | Errors |\n';
  markdown += '|---------|----------------|--------------|--------|--------|\n';

  results.forEach((r) => {
    markdown += `| ${r.feature} | \`${r.requestedFile}\` | \`${r.resolvedFile}\` | ${r.status} | ${r.errors} |\n`;
  });

  markdown += '\n## Detailed Results\n\n';

  results.forEach((r) => {
    markdown += `### ${r.feature}\n\n`;
    markdown += `- **Requested File:** \`${r.requestedFile}\`\n`;
    markdown += `- **Checked File:** \`${r.resolvedFile}\`\n`;
    markdown += `- **Status:** ${r.status}\n`;
    markdown += `- **Errors:** ${r.errors}\n\n`;

    if (r.details && r.details !== 'No type errors') {
      markdown += '**Details:**\n';
      markdown += '```\n';
      markdown += `${r.details}\n`;
      markdown += '```\n\n';
    }
  });

  return markdown;
}

runTypeCheck().then((success) => {
  process.exit(success ? 0 : 1);
});

import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

const execAsync = promisify(exec);
const FEATURE_TIMEOUT_MS = 300000;
const EXEC_MAX_BUFFER = 1024 * 1024 * 50;

interface FeatureTestDefinition {
  feature: string;
  script: string;
  fallbackScript?: string;
  command: string;
  fallbackCommand?: string;
  reportDir: string;
  reportPrefix: string;
  reportPattern?: RegExp;
  expectedReports: number;
}

interface TestResult {
  feature: string;
  scriptUsed: string;
  commandUsed: string;
  status: 'SUCCESS' | 'FAILED' | 'PARTIAL';
  executionTime: number;
  reportsGenerated: number;
  expectedReports: number;
  reportFiles: string[];
  errors: string[];
  warnings: string[];
}

function resolveScript(feature: FeatureTestDefinition): { script: string; command: string } {
  if (fs.existsSync(feature.script)) {
    return { script: feature.script, command: feature.command };
  }

  if (feature.fallbackScript && feature.fallbackCommand && fs.existsSync(feature.fallbackScript)) {
    return { script: feature.fallbackScript, command: feature.fallbackCommand };
  }

  return { script: feature.script, command: feature.command };
}

function buildReportMatcher(prefix: string): RegExp {
  return new RegExp(`^${prefix}-.+-\\d{4}-\\d{2}-\\d{2}\\.md$`);
}

async function testAllFeatures(): Promise<void> {
  console.log('🧪 COMPREHENSIVE FEATURE EXECUTION TESTING');
  console.log('='.repeat(60));
  console.log('This will ACTUALLY RUN each feature and verify reports.\n');

  const features: FeatureTestDefinition[] = [
    { feature: 'Mining Drill', script: 'scripts/run-mining-drill.ts', command: 'npm run mining-drill', reportDir: 'data/reports', reportPrefix: 'mining-drill', expectedReports: 4 },
    { feature: 'Stargazer Analysis', script: 'scripts/run-stargazer.ts', fallbackScript: 'scripts/analyze-stargazers.ts', command: 'npm run stargazer', fallbackCommand: 'npm run stargazer', reportDir: 'data/reports', reportPrefix: 'stargazer', expectedReports: 4 },
    { feature: 'Fork Evolution', script: 'scripts/run-fork-evolution.ts', fallbackScript: 'scripts/track-forks.ts', command: 'npm run fork-evolution', fallbackCommand: 'npm run fork-evolution', reportDir: 'data/reports', reportPrefix: 'fork-evolution', expectedReports: 4 },
    { feature: 'Goldmine Detector', script: 'scripts/test-goldmine.ts', fallbackScript: 'scripts/detect-goldmines.ts', command: 'npm run goldmine', fallbackCommand: 'npm run goldmine', reportDir: 'data/reports', reportPrefix: 'goldmine', expectedReports: 4 },
    { feature: 'HackerNews Intelligence', script: 'scripts/run-hackernews.ts', fallbackScript: 'scripts/scan-hackernews.ts', command: 'npm run hackernews', fallbackCommand: 'npm run hackernews', reportDir: 'data/reports', reportPrefix: 'hackernews', expectedReports: 4 },
    { feature: 'Reddit Sniper', script: 'scripts/snipe-reddit.ts', command: 'npm run reddit-sniper', reportDir: 'data/reports', reportPrefix: 'reddit-sniper', expectedReports: 4 },
    { feature: 'Viral Radar', script: 'scripts/scan-viral.ts', command: 'npm run viral-radar', reportDir: 'data/reports', reportPrefix: 'viral-radar', expectedReports: 4 },
    { feature: 'Reddit Pain Points', script: 'scripts/extract-reddit-pain.ts', command: 'npm run reddit-pain-points', reportDir: 'data/reports', reportPrefix: 'reddit-pain-points', expectedReports: 4 },
    { feature: 'Market Gap Identifier', script: 'scripts/analyze-market-gaps.ts', command: 'npm run market-gaps', reportDir: 'data/intelligence', reportPrefix: 'market-gaps', reportPattern: /^market-gaps-(?!consolidated).+-\d{4}-\d{2}-\d{2}\.md$/, expectedReports: 4 },
    { feature: 'GitHub Trending', script: 'scripts/scan-github-trending.ts', command: 'npm run github-trending', reportDir: 'data/reports', reportPrefix: 'github-trending', expectedReports: 4 },
    { feature: 'Quality Pipeline', script: 'scripts/run-quality-pipeline.ts', fallbackScript: 'scripts/run-quality-pipeline-intelligence.ts', command: 'npm run quality-pipeline', fallbackCommand: 'npm run quality-pipeline', reportDir: 'data/intelligence', reportPrefix: 'quality-pipeline', expectedReports: 4 },
    { feature: 'Phantom Scout', script: 'scripts/run-phantom-scout.ts', fallbackScript: 'src/lib/scout.ts', command: 'npm run phantom-scout', fallbackCommand: 'npm run scout', reportDir: 'data/reports', reportPrefix: 'phantom-scout', expectedReports: 4 }
  ];

  const results: TestResult[] = [];

  for (const feature of features) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🧪 Testing: ${feature.feature}`);
    console.log('='.repeat(60));

    const resolved = resolveScript(feature);
    const result: TestResult = {
      feature: feature.feature,
      scriptUsed: resolved.script,
      commandUsed: resolved.command,
      status: 'FAILED',
      executionTime: 0,
      reportsGenerated: 0,
      expectedReports: feature.expectedReports,
      reportFiles: [],
      errors: [],
      warnings: []
    };

    const startTime = Date.now();
    try {

      if (!fs.existsSync(resolved.script)) {
        result.errors.push(`Script not found: ${resolved.script}`);
        results.push(result);
        console.log('❌ FAILED: Script not found');
        continue;
      }

      const reportsDirAbsolute = path.join(process.cwd(), feature.reportDir);
      const reportMatcher = feature.reportPattern || buildReportMatcher(feature.reportPrefix);

      if (fs.existsSync(reportsDirAbsolute)) {
        const oldReports = fs.readdirSync(reportsDirAbsolute).filter((file) => reportMatcher.test(file));
        oldReports.forEach((file) => fs.unlinkSync(path.join(reportsDirAbsolute, file)));
      }

      console.log('⏱️  Starting execution...');

      const { stdout, stderr } = await execAsync(resolved.command, {
        timeout: FEATURE_TIMEOUT_MS,
        maxBuffer: EXEC_MAX_BUFFER
      });

      result.executionTime = (Date.now() - startTime) / 1000;
      console.log(`⏱️  Execution time: ${result.executionTime.toFixed(2)}s`);

      if (stderr && /error|failed|exception/i.test(stderr)) {
        result.errors.push(stderr.trim());
      }

      if (/❌|ERROR|FAILED/i.test(stdout)) {
        result.warnings.push('Error indicators found in stdout output.');
      }

      if (fs.existsSync(reportsDirAbsolute)) {
        const reportFiles = fs.readdirSync(reportsDirAbsolute).filter((file) => reportMatcher.test(file));
        result.reportFiles = reportFiles;
        result.reportsGenerated = reportFiles.length;

        console.log(`📄 Reports found: ${result.reportsGenerated}/${result.expectedReports}`);

        for (const reportFile of reportFiles) {
          const reportPath = path.join(reportsDirAbsolute, reportFile);
          const content = fs.readFileSync(reportPath, 'utf8');

          if (content.trim().length < 100) {
            result.warnings.push(`${reportFile} is suspiciously short (${content.length} chars).`);
          }

          if (!content.includes('#')) {
            result.warnings.push(`${reportFile} appears to be missing markdown headers.`);
          }
        }
      } else {
        result.errors.push(`Reports directory does not exist: ${feature.reportDir}`);
      }

      if (result.errors.length > 0) {
        result.status = 'FAILED';
        console.log(`❌ FAILED: ${result.errors.length} error(s)`);
      } else if (result.reportsGenerated === result.expectedReports) {
        result.status = 'SUCCESS';
        console.log(`✅ SUCCESS: All ${result.expectedReports} reports generated`);
      } else if (result.reportsGenerated > 0) {
        result.status = 'PARTIAL';
        console.log(`⚠️  PARTIAL: ${result.reportsGenerated}/${result.expectedReports} reports generated`);
      } else {
        result.status = 'FAILED';
        result.errors.push('No reports generated');
        console.log('❌ FAILED: No reports generated');
      }

      if (result.warnings.length > 0) {
        console.log(`⚠️  Warnings: ${result.warnings.length}`);
      }
    } catch (error: unknown) {
      const execError = error as { message?: string; stderr?: string };
      result.executionTime = (Date.now() - startTime) / 1000;
      result.errors.push(execError.stderr?.trim() || execError.message || 'Unknown execution error');
      result.status = 'FAILED';
      console.log(`❌ FAILED: ${execError.message || 'Unknown execution error'}`);
    }

    results.push(result);
  }

  console.log('\n\n' + '='.repeat(60));
  console.log('📊 COMPREHENSIVE TEST RESULTS');
  console.log('='.repeat(60));

  const successCount = results.filter((r) => r.status === 'SUCCESS').length;
  const partialCount = results.filter((r) => r.status === 'PARTIAL').length;
  const failedCount = results.filter((r) => r.status === 'FAILED').length;
  const totalReports = results.reduce((sum, r) => sum + r.reportsGenerated, 0);
  const expectedTotal = results.reduce((sum, r) => sum + r.expectedReports, 0);

  console.log(`\n📈 Success Rate: ${successCount}/${results.length} (${((successCount / results.length) * 100).toFixed(1)}%)`);
  console.log(`✅ Successful: ${successCount}`);
  console.log(`⚠️  Partial: ${partialCount}`);
  console.log(`❌ Failed: ${failedCount}`);
  console.log(`📄 Total Reports: ${totalReports}/${expectedTotal}`);

  console.log('\n⏱️  Execution Times:');
  results.forEach((r) => {
    const statusIcon = r.status === 'SUCCESS' ? '✅' : r.status === 'PARTIAL' ? '⚠️' : '❌';
    console.log(`   ${statusIcon} ${r.feature}: ${r.executionTime.toFixed(2)}s (${r.reportsGenerated}/${r.expectedReports} reports)`);
  });

  const totalTime = results.reduce((sum, r) => sum + r.executionTime, 0);
  console.log(`\n⏱️  Total Execution Time: ${(totalTime / 60).toFixed(2)} minutes`);

  const report = generateExecutionReport(results);
  fs.mkdirSync(path.join(process.cwd(), 'reports'), { recursive: true });
  fs.writeFileSync(path.join(process.cwd(), 'reports', 'execution-test-report.md'), report);
  console.log('\n✅ Full report saved: reports/execution-test-report.md');

  process.exit(failedCount === 0 ? 0 : 1);
}

function generateExecutionReport(results: TestResult[]): string {
  let markdown = '# Feature Execution Test Report\n\n';
  markdown += `**Date:** ${new Date().toISOString()}\n`;
  markdown += `**Features Tested:** ${results.length}\n\n`;

  markdown += '## Summary\n\n';
  markdown += '| Feature | Script Used | Command Used | Status | Time (s) | Reports | Issues |\n';
  markdown += '|---------|-------------|--------------|--------|----------|---------|--------|\n';

  results.forEach((r) => {
    const statusIcon = r.status === 'SUCCESS' ? '✅' : r.status === 'PARTIAL' ? '⚠️' : '❌';
    const issues = r.errors.length + r.warnings.length;
    markdown += `| ${r.feature} | \`${r.scriptUsed}\` | \`${r.commandUsed}\` | ${statusIcon} ${r.status} | ${r.executionTime.toFixed(2)} | ${r.reportsGenerated}/${r.expectedReports} | ${issues} |\n`;
  });

  markdown += '\n## Detailed Results\n\n';

  results.forEach((r) => {
    markdown += `### ${r.feature}\n\n`;
    markdown += `- **Script Used:** \`${r.scriptUsed}\`\n`;
    markdown += `- **Command Used:** \`${r.commandUsed}\`\n`;
    markdown += `- **Status:** ${r.status}\n`;
    markdown += `- **Execution Time:** ${r.executionTime.toFixed(2)}s\n`;
    markdown += `- **Reports Generated:** ${r.reportsGenerated}/${r.expectedReports}\n\n`;

    if (r.reportFiles.length > 0) {
      markdown += '**Report Files:**\n';
      r.reportFiles.forEach((file) => {
        markdown += `- ${file}\n`;
      });
      markdown += '\n';
    }

    if (r.errors.length > 0) {
      markdown += '**Errors:**\n';
      r.errors.forEach((error) => {
        markdown += `- ${error.replace(/\n/g, '\\n')}\n`;
      });
      markdown += '\n';
    }

    if (r.warnings.length > 0) {
      markdown += '**Warnings:**\n';
      r.warnings.forEach((warning) => {
        markdown += `- ${warning}\n`;
      });
      markdown += '\n';
    }

    markdown += '---\n\n';
  });

  return markdown;
}

testAllFeatures();

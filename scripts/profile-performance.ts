import { execSync } from 'child_process';

interface FeatureRun {
  name: string;
  file: string;
  cmd: string;
}

interface ProfileResult {
  feature: string;
  time: number;
  memory: number;
  status: 'SUCCESS' | 'FAILED';
  errorType?: string;
  notes?: string;
}

console.log('⏱️  PERFORMANCE PROFILING\n');
console.log('='.repeat(60));
console.log('\n⚠️  This will attempt to run all features\n');
console.log('   Features without credentials or with runtime issues may fail quickly\n');

const features: FeatureRun[] = [
  { name: 'Mining Drill', file: 'mining-drill', cmd: 'mining-drill' },
  { name: 'Stargazer', file: 'stargazer-intelligence', cmd: 'stargazer' },
  { name: 'Fork Evolution', file: 'fork-evolution', cmd: 'fork-evolution' },
  { name: 'Goldmine', file: 'goldmine-detector', cmd: 'goldmine' },
  { name: 'HackerNews', file: 'hackernews-intelligence', cmd: 'hackernews' },
  { name: 'Reddit Sniper', file: 'reddit-sniper', cmd: 'reddit-sniper' },
  { name: 'Viral Radar', file: 'viral-radar', cmd: 'viral-radar' },
  { name: 'Reddit Pain', file: 'reddit-pain-points', cmd: 'reddit-pain-points' },
  { name: 'Market Gap', file: 'market-gap-identifier', cmd: 'market-gaps' },
  { name: 'GitHub Trending', file: 'github-trending', cmd: 'github-trending' },
  { name: 'Quality Pipeline', file: 'quality-pipeline-intelligence', cmd: 'quality-pipeline' },
  { name: 'Phantom Scout', file: 'scout', cmd: 'scout' }
];

const results: ProfileResult[] = [];

for (const feature of features) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`⏱️  Profiling: ${feature.name}`);
  console.log('='.repeat(60));

  const startTime = Date.now();
  const startMem = process.memoryUsage();

  try {
    console.log(`\n   Running: npm run ${feature.cmd}`);

    const output = execSync(`npm run ${feature.cmd}`, {
      timeout: 60000,
      stdio: 'pipe',
      encoding: 'utf8'
    });

    const endTime = Date.now();
    const endMem = process.memoryUsage();

    const duration = (endTime - startTime) / 1000;
    const memUsed = (endMem.heapUsed - startMem.heapUsed) / 1024 / 1024;

    console.log(`   Output snapshot: ${(output || '').split('\n').slice(-3).join(' | ')}`);
    console.log(`\n   ⏱️  Time: ${duration.toFixed(2)}s`);
    console.log(`   💾 Memory: ${memUsed.toFixed(2)} MB`);
    console.log('   ✅ Status: SUCCESS');

    results.push({
      feature: feature.name,
      time: duration,
      memory: memUsed,
      status: 'SUCCESS'
    });
  } catch (error) {
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    const err = error as {
      message?: string;
      stderr?: string;
      stdout?: string;
      status?: number;
      signal?: string;
    };

    const message = err.message || err.stderr || err.stdout || 'Unknown error';
    console.log(`\n   ⏱️  Time: ${duration.toFixed(2)}s`);
    console.log('   ❌ Status: FAILED');
    console.log(`   Error: ${message.substring(0, 180).replace(/\n/g, ' ')}...`);

    let errorType = 'Unknown';
    if (message.includes('GITHUB_TOKEN')) {
      errorType = 'Missing GitHub token';
    } else if (message.toUpperCase().includes('REDDIT_')) {
      errorType = 'Missing Reddit credentials';
    } else if (message.toLowerCase().includes('timed out') || err.signal === 'SIGTERM') {
      errorType = 'Timeout (>60s)';
    } else if (message.includes('TypeError: niche.github_search_queries is not iterable')) {
      errorType = 'Config iteration bug';
    } else if (err.status === 1) {
      errorType = 'Exit code 1';
    }

    results.push({
      feature: feature.name,
      time: duration,
      memory: 0,
      status: 'FAILED',
      errorType
    });
  }
}

console.log(`\n\n${'='.repeat(60)}`);
console.log('📊 PERFORMANCE SUMMARY');
console.log('='.repeat(60));

const successResults = results.filter((r) => r.status === 'SUCCESS');
const failedResults = results.filter((r) => r.status === 'FAILED');

console.log(`\n✅ Successful: ${successResults.length}/${features.length}`);
console.log(`❌ Failed: ${failedResults.length}/${features.length}`);

if (successResults.length > 0) {
  console.log('\n⏱️  Execution Times (successful only):');

  successResults.sort((a, b) => a.time - b.time);

  for (const r of successResults) {
    console.log(`   ${r.feature}: ${r.time.toFixed(2)}s`);
  }

  const totalTime = successResults.reduce((sum, r) => sum + r.time, 0);
  const avgTime = totalTime / successResults.length;
  const fastest = successResults[0];
  const slowest = successResults[successResults.length - 1];

  console.log('\n📈 Statistics:');
  console.log(`   Fastest: ${fastest.feature} (${fastest.time.toFixed(2)}s)`);
  console.log(`   Slowest: ${slowest.feature} (${slowest.time.toFixed(2)}s)`);
  console.log(`   Average: ${avgTime.toFixed(2)}s`);
  console.log(`   Total: ${(totalTime / 60).toFixed(2)} minutes`);
}

if (failedResults.length > 0) {
  console.log('\n❌ Failures by Type:');

  const errorTypes: Record<string, number> = {};
  failedResults.forEach((r) => {
    const key = r.errorType || 'Unknown';
    errorTypes[key] = (errorTypes[key] || 0) + 1;
  });

  for (const [type, count] of Object.entries(errorTypes)) {
    console.log(`   ${type}: ${count} features`);
  }
}

console.log('\n');

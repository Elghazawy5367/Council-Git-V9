import * as fs from 'fs';
import * as path from 'path';
import { pathToFileURL } from 'url';

interface DryRunStatus {
  feature: string;
  moduleLoads: boolean;
  hasLogic: boolean;
  error: string | null;
  exports: string[];
  reportCount: number;
  latestReport: string | null;
}

type FeatureDef = {
  name: string;
  file: string;
};

const mockedFetch: typeof fetch = async (input) => {
  const requestUrl =
    typeof input === 'string'
      ? input
      : input instanceof URL
        ? input.toString()
        : input.url;
  let parsedUrl: URL | null = null;
  try {
    parsedUrl = new URL(requestUrl);
  } catch {
    parsedUrl = null;
  }

  if (parsedUrl?.hostname === 'raw.githubusercontent.com') {
    return new Response('mock-content', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' }
    });
  }

  let payload: unknown = {};

  if (parsedUrl?.pathname.includes('/search/repositories')) {
    payload = { items: [], total_count: 0 };
  } else if (parsedUrl?.pathname.includes('/issues')) {
    payload = [];
  } else if (parsedUrl?.pathname.includes('/rate_limit')) {
    payload = { rate: { limit: 5000, remaining: 4999, reset: Math.floor(Date.now() / 1000) + 3600 } };
  }

  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'X-RateLimit-Remaining': '5000',
      'X-RateLimit-Reset': `${Math.floor(Date.now() / 1000) + 3600}`
    }
  });
};

globalThis.fetch = mockedFetch;

console.log('🧪 DRY RUN TESTING - No External APIs\n');
console.log('='.repeat(60));
console.log('\nTesting feature logic with mock data...\n');
console.log('🔒 Network calls are mocked (fetch overridden)\n');

const mockNiche = {
  id: 'test-niche',
  name: 'Test Niche',
  keywords: ['test', 'example', 'mock', 'sample'],
  github_topics: ['testing', 'example'],
  github_search_queries: ['test query', 'example search'],
  subreddits: ['r/test', 'r/example']
};

const mockGitHubIssue = {
  id: 1,
  title: 'Need help with test automation',
  body: 'Looking for a test framework that can handle example cases',
  comments: 15,
  created_at: '2026-02-01T00:00:00Z',
  reactions: { '+1': 8, total_count: 12 },
  html_url: 'https://github.com/test/repo/issues/1',
  user: { login: 'testuser' },
  labels: [{ name: 'help wanted' }]
};

const mockRedditPost = {
  id: 'abc123',
  title: 'Looking for test tools - budget $500',
  selftext: 'I need a test automation tool, willing to pay',
  score: 45,
  num_comments: 23,
  created_utc: 1706745600,
  subreddit: 'test',
  author: 'testuser'
};

const mockIssueLooksValid =
  typeof mockGitHubIssue.title === 'string' &&
  typeof mockGitHubIssue.body === 'string' &&
  typeof mockGitHubIssue.comments === 'number';

const mockRedditLooksValid =
  typeof mockRedditPost.title === 'string' &&
  typeof mockRedditPost.selftext === 'string' &&
  typeof mockRedditPost.score === 'number';

console.log(`🧩 Mock GitHub issue shape: ${mockIssueLooksValid ? 'valid' : 'invalid'}`);
console.log(`🧩 Mock Reddit post shape: ${mockRedditLooksValid ? 'valid' : 'invalid'}\n`);

const features: FeatureDef[] = [
  { name: 'Mining Drill', file: 'mining-drill' },
  { name: 'Stargazer', file: 'stargazer-intelligence' },
  { name: 'Fork Evolution', file: 'fork-evolution' },
  { name: 'Goldmine', file: 'goldmine-detector' },
  { name: 'HackerNews', file: 'hackernews-intelligence' },
  { name: 'Reddit Sniper', file: 'reddit-sniper' },
  { name: 'Viral Radar', file: 'viral-radar' },
  { name: 'Reddit Pain', file: 'reddit-pain-points' },
  { name: 'Market Gap', file: 'market-gap-identifier' },
  { name: 'GitHub Trending', file: 'github-trending' },
  { name: 'Quality Pipeline', file: 'quality-pipeline-intelligence' },
  { name: 'Phantom Scout', file: 'scout' }
];

const results: DryRunStatus[] = [];

const reportPrefixByFeature: Record<string, string[]> = {
  'mining-drill': ['mining-drill-'],
  'stargazer-intelligence': ['stargazer-'],
  'fork-evolution': ['fork-evolution-'],
  'goldmine-detector': ['goldmine-'],
  'hackernews-intelligence': ['hackernews-'],
  'reddit-sniper': ['reddit-sniper-'],
  'viral-radar': ['viral-radar-'],
  'reddit-pain-points': ['reddit-pain-points-'],
  'market-gap-identifier': ['market-gaps-'],
  'github-trending': ['github-trending-'],
  'quality-pipeline-intelligence': ['quality-pipeline-'],
  scout: ['scout-report-', 'phantom-scout-']
};

const reportDirs = ['data/reports', 'data/intelligence'];

for (const feature of features) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Testing: ${feature.name}`);
  console.log('='.repeat(60));

  const status: DryRunStatus = {
    feature: feature.name,
    moduleLoads: false,
    hasLogic: false,
    error: null,
    exports: [],
    reportCount: 0,
    latestReport: null
  };

  try {
    console.log('\n1️⃣  Module Loading Test:');

    const candidatePaths = [
      path.resolve(process.cwd(), 'src/lib', `${feature.file}.ts`),
      path.resolve(process.cwd(), 'src/lib', feature.file, 'index.ts')
    ];

    const existingPath = candidatePaths.find((p) => fs.existsSync(p));

    if (!existingPath) {
      throw new Error(`Feature module file not found for ${feature.file}`);
    }

    try {
      if (feature.file === 'scout') {
        const source = fs.readFileSync(existingPath, 'utf8');
        const hasRunScout = /export\s+async\s+function\s+runScout\s*\(/.test(source);
        console.log('   ⚠️  Skipped live import for scout.ts (has top-level runScout side effects)');
        status.exports = hasRunScout ? ['runScout'] : [];
        status.hasLogic = hasRunScout;
        if (hasRunScout) {
          console.log('   ✅ Static check found runScout entry point');
        } else {
          console.log('   ⚠️  Could not detect runScout entry point from source');
        }
      } else {
        const featureModule = await import(pathToFileURL(existingPath).href);
        console.log('   ✅ Module imports successfully');
        status.moduleLoads = true;

        status.exports = Object.keys(featureModule);
        console.log(`   📦 Exports: ${status.exports.length} items`);

        const hasEntryPoint =
          status.exports.includes('run') ||
          status.exports.includes('main') ||
          status.exports.includes('default') ||
          status.exports.some((exportName) => exportName.toLowerCase().startsWith('run'));

        if (hasEntryPoint) {
          console.log('   ✅ Has run/main/default entry point');
          status.hasLogic = true;
        } else {
          console.log('   ⚠️  No obvious entry point (run/main/default)');
          console.log(`      Available: ${status.exports.join(', ') || '(none)'}`);
        }
      }
    } catch (importError) {
      const message = importError instanceof Error ? importError.message : String(importError);
      console.log(`   ❌ Import failed: ${message}`);
      status.error = `Import: ${message}`;
    }

    console.log('\n2️⃣  Config Compatibility Test:');
    const requiredFields: Array<keyof typeof mockNiche> = [
      'keywords',
      'github_topics',
      'github_search_queries',
      'subreddits'
    ];

    const hasAllFields = requiredFields.every((field) => Array.isArray(mockNiche[field]));

    if (hasAllFields) {
      console.log('   ✅ Mock niche has all required fields');
    } else {
      console.log('   ⚠️  Mock niche missing some fields');
    }

    console.log('\n3️⃣  Report File Check:');
    const prefixes = reportPrefixByFeature[feature.file] ?? [`${feature.file}-`];
    console.log(`   Looking for prefixes: ${prefixes.join(', ')}`);

    const foundReports: string[] = [];

    for (const reportDir of reportDirs) {
      const dirPath = path.resolve(process.cwd(), reportDir);
      if (!fs.existsSync(dirPath)) {
        continue;
      }

      const files = fs.readdirSync(dirPath);
      for (const file of files) {
        if (prefixes.some((prefix) => file.startsWith(prefix)) && file.endsWith('.md')) {
          foundReports.push(path.join(reportDir, file));
        }
      }
    }

    status.reportCount = foundReports.length;

    if (foundReports.length > 0) {
      console.log(`   ✅ Found ${foundReports.length} existing reports`);
      const latest = foundReports.sort().reverse()[0];
      status.latestReport = latest;
      const content = fs.readFileSync(path.resolve(process.cwd(), latest), 'utf8');
      console.log(`   📄 Latest: ${latest} (${content.length} chars)`);

      if (content.length < 100) {
        console.log('   ⚠️  Report very short - may be empty/error');
      }
    } else {
      console.log('   ⚠️  No reports found (expected if never run)');
    }

    console.log(`\n✅ ${feature.name}: DRY RUN PASSED`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(`\n❌ ${feature.name}: DRY RUN FAILED`);
    console.log(`   Error: ${message}`);
    status.error = message;
  }

  results.push(status);
}

console.log(`\n\n${'='.repeat(60)}`);
console.log('📊 DRY RUN SUMMARY');
console.log('='.repeat(60));

const modulesLoaded = results.filter((r) => r.moduleLoads).length;
const hasLogicCount = results.filter((r) => r.hasLogic).length;
const failedCount = results.filter((r) => r.error !== null).length;

console.log('\n📈 Results:');
console.log(`   ✅ Modules load: ${modulesLoaded}/${features.length}`);
console.log(`   ✅ Has logic: ${hasLogicCount}/${features.length}`);
console.log(`   ✅ Report files found: ${results.filter((r) => r.reportCount > 0).length}/${features.length}`);
console.log(`   ❌ Failed: ${failedCount}/${features.length}`);

if (failedCount > 0) {
  console.log('\n❌ Failures:');
  results
    .filter((r) => r.error)
    .forEach((r) => {
      console.log(`   - ${r.feature}: ${r.error}`);
    });
}

console.log('\n📝 Note: This is a DRY RUN (no API calls)');
console.log('   Full execution testing requires API credentials');
console.log('   See Part 3B for live API testing\n');

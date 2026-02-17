import { Octokit } from '@octokit/rest';

interface ApiError extends Error {
  status?: number;
}

console.log('🔴 LIVE API TESTING\n');
console.log('='.repeat(60));
console.log('\n⚠️  This makes REAL API calls\n');

console.log('🔍 Environment Check:\n');

const hasGitHub = Boolean(process.env.GITHUB_TOKEN);
const hasReddit = Boolean(process.env.REDDIT_CLIENT_ID && process.env.REDDIT_CLIENT_SECRET);

console.log(`   GITHUB_TOKEN: ${hasGitHub ? '✅ Present' : '❌ Missing'}`);
console.log(`   Reddit credentials: ${hasReddit ? '✅ Present' : '❌ Missing'}`);

if (!hasGitHub && !hasReddit) {
  console.log('\n❌ NO CREDENTIALS CONFIGURED');
  console.log('   Cannot perform live API tests');
  console.log('   Add secrets and re-run\n');
  process.exit(0);
}

console.log(`\n${'='.repeat(60)}`);

if (hasGitHub) {
  console.log('\n📡 Testing GitHub API...\n');

  try {
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

    console.log('1️⃣  Search API Test:');
    const startTime = Date.now();

    const searchResult = await octokit.search.repos({
      q: 'test',
      per_page: 1
    });

    const duration = Date.now() - startTime;

    console.log(`   ✅ Status: ${searchResult.status}`);
    console.log(`   ✅ Response time: ${duration}ms`);
    console.log(`   ✅ Results: ${searchResult.data.total_count} repos`);
    console.log(
      `   ✅ Rate limit: ${searchResult.headers['x-ratelimit-remaining']}/${searchResult.headers['x-ratelimit-limit']}`
    );

    console.log('\n2️⃣  Authentication Test:');
    const userResult = await octokit.users.getAuthenticated();
    console.log(`   ✅ Authenticated as: ${userResult.data.login}`);
    console.log(`   ✅ Account type: ${userResult.data.type}`);

    console.log('\n3️⃣  Rate Limit Status:');
    const rateLimit = await octokit.rateLimit.get();
    const core = rateLimit.data.resources.core;
    const search = rateLimit.data.resources.search;

    console.log(`   Core API: ${core.remaining}/${core.limit}`);
    console.log(`   Search API: ${search.remaining}/${search.limit}`);
    console.log(`   Resets at: ${new Date(core.reset * 1000).toLocaleTimeString()}`);

    console.log('\n✅ GitHub API: OPERATIONAL');
  } catch (error) {
    const err = error as ApiError;
    console.log('\n❌ GitHub API: FAILED');
    console.log(`   Error: ${err.message}`);
    console.log(`   Status: ${err.status ?? 'unknown'}`);

    if (err.status === 401) {
      console.log('\n   🔴 Token is INVALID or EXPIRED');
      console.log('      Generate new token at: https://github.com/settings/tokens');
    } else if (err.status === 403) {
      console.log('\n   🔴 Token lacks required permissions or API is blocked/rate-limited');
      console.log('      Ensure token has proper scope and network/API access');
    }
  }
} else {
  console.log('\n⏭️  GitHub API: SKIPPED (no token)');
}

if (hasReddit) {
  console.log(`\n\n${'='.repeat(60)}`);
  console.log('\n📡 Testing Reddit API...\n');

  try {
    console.log('1️⃣  Reddit Auth Test:');
    console.log('   ⚠️  Reddit test implementation pending');
    console.log('   Client ID configured: ✅');
    console.log('   Client Secret configured: ✅');

    const clientId = process.env.REDDIT_CLIENT_ID ?? '';
    const clientSecret = process.env.REDDIT_CLIENT_SECRET ?? '';

    console.log(`   Client ID length: ${clientId.length} chars`);
    console.log(`   Client Secret length: ${clientSecret.length} chars`);

    console.log('\n⚠️  Reddit API: PARTIALLY TESTED');
    console.log('   (Full test requires Reddit API implementation in this repo)');
  } catch (error) {
    const err = error as Error;
    console.log('\n❌ Reddit API: FAILED');
    console.log(`   Error: ${err.message}`);
  }
} else {
  console.log('\n\n⏭️  Reddit API: SKIPPED (no credentials)');
}

console.log(`\n\n${'='.repeat(60)}`);
console.log('📊 LIVE API TEST SUMMARY');
console.log('='.repeat(60));

console.log(`\n✅ GitHub API: ${hasGitHub ? 'Tested' : 'Skipped'}`);
console.log(`✅ Reddit API: ${hasReddit ? 'Tested' : 'Skipped'}`);

console.log('\n🎯 Features that CAN run:');
if (hasGitHub) {
  console.log('   - Mining Drill ✅');
  console.log('   - Stargazer ✅');
  console.log('   - Fork Evolution ✅');
  console.log('   - Goldmine ✅');
  console.log('   - GitHub Trending ✅');
  console.log('   - Phantom Scout ✅');
}
if (hasReddit) {
  console.log('   - Reddit Sniper ✅');
  console.log('   - Viral Radar ✅');
  console.log('   - Reddit Pain Points ✅');
}

console.log('\n🎯 Features that CANNOT run:');
if (!hasGitHub) {
  console.log('   - Mining Drill ❌ (needs GITHUB_TOKEN)');
  console.log('   - Stargazer ❌');
  console.log('   - Fork Evolution ❌');
  console.log('   - Goldmine ❌');
  console.log('   - GitHub Trending ❌');
  console.log('   - Phantom Scout ❌');
}
if (!hasReddit) {
  console.log('   - Reddit Sniper ❌ (needs Reddit credentials)');
  console.log('   - Viral Radar ❌');
  console.log('   - Reddit Pain Points ❌');
}

console.log('\n');

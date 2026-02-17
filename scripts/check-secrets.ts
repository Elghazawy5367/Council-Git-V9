const requiredSecrets = [
  'GITHUB_TOKEN',
  'REDDIT_CLIENT_ID',
  'REDDIT_CLIENT_SECRET',
  'REDDIT_USERNAME',
  'REDDIT_PASSWORD'
] as const;

type SecretName = (typeof requiredSecrets)[number];

console.log('🔐 Checking GitHub Secrets Availability\n');
console.log('='.repeat(50));

for (const secret of requiredSecrets) {
  const value = process.env[secret];
  const exists = value !== undefined;
  const hasValue = exists && value.length > 0;
  const length = value?.length ?? 0;

  const status = hasValue ? '✅ CONFIGURED' : '❌ MISSING';

  console.log(`\n${secret}:`);
  console.log(`  Exists: ${exists ? '✅' : '❌'}`);
  console.log(`  Has Value: ${hasValue ? '✅' : '❌'}`);
  console.log(`  Length: ${length} characters`);
  console.log(`  Status: ${status}`);
}

console.log(`\n${'='.repeat(50)}`);

const githubToken = process.env.GITHUB_TOKEN;
const redditConfigured = Boolean(process.env.REDDIT_CLIENT_ID && process.env.REDDIT_CLIENT_SECRET);

console.log('\n📊 IMPACT ANALYSIS:\n');

if (!githubToken) {
  console.log('❌ GITHUB_TOKEN missing:');
  console.log('   Affected features: 6/12');
  console.log('   - Mining Drill');
  console.log('   - Stargazer');
  console.log('   - Fork Evolution');
  console.log('   - Goldmine Detector');
  console.log('   - GitHub Trending');
  console.log('   - Phantom Scout');
} else {
  console.log('✅ GITHUB_TOKEN configured');
}

if (!redditConfigured) {
  console.log('\n❌ Reddit credentials missing:');
  console.log('   Affected features: 3/12');
  console.log('   - Reddit Sniper');
  console.log('   - Viral Radar');
  console.log('   - Reddit Pain Points');
} else {
  console.log('\n✅ Reddit credentials configured');
}

const configuredCount = requiredSecrets.filter((secret: SecretName) => {
  const value = process.env[secret];
  return value !== undefined && value.length > 0;
}).length;

console.log(`\n${'='.repeat(50)}`);
console.log(`\n🎯 SECRETS CONFIGURED: ${configuredCount}/${requiredSecrets.length}\n`);

if (configuredCount === 0) {
  console.log('🔴 CRITICAL: NO secrets configured');
  console.log('   Impact: 9/12 features CANNOT run');
  console.log('   Action: Add secrets to GitHub repository');
  console.log('   Location: Settings → Secrets and variables → Actions');
}

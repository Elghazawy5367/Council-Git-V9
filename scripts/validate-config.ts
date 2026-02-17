import * as fs from 'fs';
import * as yaml from 'js-yaml';

interface MonitoringConfig {
  keywords?: unknown;
  github_topics?: unknown;
  github_search_queries?: unknown;
  subreddits?: unknown;
}

interface NicheConfig {
  id?: unknown;
  name?: unknown;
  keywords?: unknown;
  github_topics?: unknown;
  github_search_queries?: unknown;
  subreddits?: unknown;
  monitoring?: MonitoringConfig;
}

interface RootConfig {
  niches?: unknown;
}

const requiredFields = [
  'id',
  'name',
  'keywords',
  'github_topics',
  'github_search_queries',
  'subreddits'
] as const;

console.log('📋 Validating config/target-niches.yaml\n');
console.log('='.repeat(60));

const configPath = 'config/target-niches.yaml';

let config: RootConfig;
try {
  const fileContents = fs.readFileSync(configPath, 'utf8');
  config = (yaml.load(fileContents) as RootConfig) ?? {};
  console.log('\n✅ YAML file is valid\n');
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.log(`\n❌ YAML parsing failed: ${message}\n`);
  process.exit(1);
}

const nichesRaw = config.niches;
const niches: NicheConfig[] = Array.isArray(nichesRaw) ? (nichesRaw as NicheConfig[]) : [];
console.log(`📂 Found ${niches.length} niches\n`);

if (niches.length === 0) {
  console.log('❌ ERROR: No niches found in config');
  process.exit(1);
}

let hasErrors = false;

const getFieldValue = (niche: NicheConfig, field: keyof MonitoringConfig | 'id' | 'name'): unknown => {
  if (field === 'id' || field === 'name') {
    return niche[field];
  }

  const flatValue = niche[field];
  if (flatValue !== undefined) {
    return flatValue;
  }

  return niche.monitoring?.[field];
};

for (const niche of niches) {
  const nicheId = typeof niche.id === 'string' ? niche.id : 'UNNAMED';
  console.log('='.repeat(60));
  console.log(`\nNiche: ${nicheId}\n`);

  for (const field of requiredFields) {
    const value = getFieldValue(niche, field as keyof MonitoringConfig | 'id' | 'name');
    const exists = value !== undefined;
    const isArray = field === 'id' || field === 'name' ? false : Array.isArray(value);
    const length =
      typeof value === 'string'
        ? value.length
        : Array.isArray(value)
          ? value.length
          : 0;

    const isValid =
      field === 'id' || field === 'name'
        ? exists && typeof value === 'string' && value.length > 0
        : exists && isArray;

    const status = isValid ? '✅' : '❌';

    console.log(`  ${field}:`);
    console.log(`    Exists: ${exists ? '✅' : '❌'}`);
    if (field === 'id' || field === 'name') {
      console.log(`    Is String: ${typeof value === 'string' ? '✅' : '⚠️'}`);
    } else {
      console.log(`    Is Array: ${isArray ? '✅' : '⚠️'}`);
    }
    console.log(`    Count: ${length}`);
    console.log(`    Status: ${status}`);

    if (!exists) {
      console.log('    ⚠️  MISSING - will cause crashes!');
      hasErrors = true;
    }

    if (field !== 'id' && field !== 'name' && exists && !isArray) {
      console.log('    ⚠️  NOT AN ARRAY - will cause crashes!');
      hasErrors = true;
    }

    if (field !== 'id' && field !== 'name' && exists && isArray && length === 0) {
      console.log('    ⚠️  EMPTY - features may not work');
    }
  }

  const keywordsValue = getFieldValue(niche, 'keywords');
  if (Array.isArray(keywordsValue)) {
    const keywordSet = new Set(keywordsValue);
    if (keywordSet.size !== keywordsValue.length) {
      const duplicates = keywordsValue.length - keywordSet.size;
      console.log(`\n  ⚠️  Duplicate keywords: ${duplicates} duplicates found`);
    }
  }

  console.log();
}

console.log('='.repeat(60));

if (hasErrors) {
  console.log('\n❌ VALIDATION FAILED: Critical errors found');
  console.log('   Some features WILL crash due to missing/invalid config');
  process.exit(1);
} else {
  console.log('\n✅ VALIDATION PASSED: Config structure is valid');
}

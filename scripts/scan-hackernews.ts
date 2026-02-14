import { runHackerNewsIntelligence } from '../src/lib/hackernews-intelligence';

async function main(): Promise<void> {
  try {
    await runHackerNewsIntelligence();
    process.exit(0);
  } catch (error) {
    console.error('❌ HackerNews Intelligence failed:', error);
    process.exit(1);
  }
}

main();

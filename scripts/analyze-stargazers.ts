import { runStargazerAnalysis } from '../src/lib/stargazer-intelligence';

async function main(): Promise<void> {
  try {
    await runStargazerAnalysis();
    process.exit(0);
  } catch (error) {
    console.error('❌ Stargazer Analysis failed:', error);
    process.exit(1);
  }
}

main();

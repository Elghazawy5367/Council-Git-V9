import { runGoldmineDetector } from '../src/lib/goldmine-detector';

async function main(): Promise<void> {
  try {
    await runGoldmineDetector();
    process.exit(0);
  } catch (error) {
    console.error('❌ Goldmine Detector failed:', error);
    process.exit(1);
  }
}

main();

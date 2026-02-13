import { runForkEvolution } from '../src/lib/fork-evolution';

async function main(): Promise<void> {
  try {
    await runForkEvolution();
    process.exit(0);
  } catch (error) {
    console.error('❌ Fork Evolution failed:', error);
    process.exit(1);
  }
}

main();

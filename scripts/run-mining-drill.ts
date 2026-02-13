import { runMiningDrill } from '../src/lib/mining-drill';

async function main(): Promise<void> {
  try {
    await runMiningDrill();
    process.exit(0);
  } catch (error) {
    console.error('❌ Mining Drill failed:', error);
    process.exit(1);
  }
}

main();

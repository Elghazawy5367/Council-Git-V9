import { runRedditPainPoints } from '../src/lib/reddit-pain-points';

async function main(): Promise<void> {
  try {
    await runRedditPainPoints();
    process.exit(0);
  } catch (error) {
    console.error('❌ Reddit Pain Points failed:', error);
    process.exit(1);
  }
}

main();

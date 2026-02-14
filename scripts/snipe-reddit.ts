import { runRedditSniper } from '../src/lib/reddit-sniper';

async function main(): Promise<void> {
  try {
    await runRedditSniper();
    process.exit(0);
  } catch (error) {
    console.error('❌ Reddit Sniper failed:', error);
    process.exit(1);
  }
}

main();

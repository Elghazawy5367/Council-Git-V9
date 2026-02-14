import { runGitHubTrending } from '../src/lib/github-trending';

async function main(): Promise<void> {
  try {
    await runGitHubTrending();
    process.exit(0);
  } catch (error) {
    console.error('❌ GitHub Trending failed:', error);
    process.exit(1);
  }
}

main();

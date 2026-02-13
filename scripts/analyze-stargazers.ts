/**
 * Stargazer Analysis - Wrapper Script
 * Runs stargazer analysis across all configured niches
 */

import { runStargazerAnalysis } from '../src/lib/stargazer-intelligence';

async function main(): Promise<void> {
  try {
    console.log('⭐ Starting Stargazer Analysis...\n');
    
    // Check for GitHub token
    if (!process.env.GITHUB_TOKEN) {
      console.error('❌ Error: GITHUB_TOKEN environment variable is required');
      console.error('   Set it with: export GITHUB_TOKEN=your_token_here');
      process.exit(1);
    }
    
    // Run the analysis
    await runStargazerAnalysis();
    
    console.log('\n✅ Stargazer Analysis completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Stargazer Analysis failed:', error);
    
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      if (error.stack) {
        console.error('Stack trace:', error.stack);
      }
    }
    
    process.exit(1);
  }
}

// Run the script
main();

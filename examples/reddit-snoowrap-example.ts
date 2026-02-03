/**
 * Example usage of Reddit Snoowrap Service
 * 
 * This demonstrates how to use the new snoowrap-based Reddit API service.
 * Run with: tsx examples/reddit-snoowrap-example.ts
 */

import {
  getRedditSnoowrapService,
  getRedditAuthConfigFromEnv,
} from '../src/services/reddit-snoowrap.service';

async function main(): Promise<void> {
  console.log('🎯 Reddit Snoowrap Service Example\n');

  const service = getRedditSnoowrapService();

  // Step 1: Authenticate
  console.log('Step 1: Authenticating with Reddit...');
  const config = getRedditAuthConfigFromEnv();
  
  if (!config) {
    console.error('❌ Missing Reddit credentials in environment');
    console.log('\nPlease set the following environment variables:');
    console.log('  - REDDIT_CLIENT_ID');
    console.log('  - REDDIT_CLIENT_SECRET');
    console.log('  - REDDIT_USERNAME (optional)');
    console.log('  - REDDIT_PASSWORD (optional)');
    console.log('\nSee REDDIT_SNOOWRAP_GUIDE.md for setup instructions.');
    return;
  }

  try {
    await service.authenticate(config);
    console.log('✓ Authentication successful!\n');
  } catch (error) {
    console.error('❌ Authentication failed:', error);
    return;
  }

  // Step 2: Fetch hot posts from a subreddit
  console.log('Step 2: Fetching hot posts from r/SaaS...');
  try {
    const hotPosts = await service.getHotPosts('SaaS', { limit: 5 });
    console.log(`✓ Found ${hotPosts.length} hot posts:`);
    hotPosts.forEach((post, i) => {
      console.log(`  ${i + 1}. ${post.title}`);
      console.log(`     Score: ${post.score} | Comments: ${post.num_comments}`);
      console.log(`     URL: https://reddit.com${post.permalink}\n`);
    });
  } catch (error) {
    console.error('❌ Failed to fetch hot posts:', error);
  }

  // Step 3: Search for posts
  console.log('\nStep 3: Searching for "project management" posts...');
  try {
    const searchResults = await service.searchPosts(
      'project management tool',
      'Entrepreneur',
      {
        sort: 'relevance',
        time: 'week',
        limit: 3,
      }
    );
    console.log(`✓ Found ${searchResults.length} search results:`);
    searchResults.forEach((post, i) => {
      console.log(`  ${i + 1}. ${post.title}`);
      console.log(`     Author: u/${post.author} | Score: ${post.score}\n`);
    });
  } catch (error) {
    console.error('❌ Failed to search posts:', error);
  }

  // Step 4: Get top posts
  console.log('\nStep 4: Fetching top posts from r/startups (this week)...');
  try {
    const topPosts = await service.getTopPosts('startups', {
      time: 'week',
      limit: 5,
    });
    console.log(`✓ Found ${topPosts.length} top posts:`);
    topPosts.forEach((post, i) => {
      console.log(`  ${i + 1}. ${post.title}`);
      console.log(`     Score: ${post.score} | Upvote Ratio: ${(post.upvote_ratio * 100).toFixed(1)}%\n`);
    });
  } catch (error) {
    console.error('❌ Failed to fetch top posts:', error);
  }

  // Step 5: Fetch from multiple subreddits
  console.log('\nStep 5: Fetching from multiple subreddits...');
  try {
    const multiPosts = await service.getMultipleSubredditPosts(
      ['SaaS', 'Entrepreneur', 'startups'],
      {
        sort: 'hot',
        limit: 3, // per subreddit
      }
    );
    console.log(`✓ Found ${multiPosts.length} total posts from 3 subreddits`);
    
    // Group by subreddit
    const bySubreddit = multiPosts.reduce((acc, post) => {
      if (!acc[post.subreddit]) acc[post.subreddit] = [];
      acc[post.subreddit].push(post);
      return acc;
    }, {} as Record<string, typeof multiPosts>);
    
    Object.entries(bySubreddit).forEach(([subreddit, posts]) => {
      console.log(`\n  r/${subreddit}: ${posts.length} posts`);
    });
  } catch (error) {
    console.error('❌ Failed to fetch from multiple subreddits:', error);
  }

  // Step 6: Filter posts
  console.log('\n\nStep 6: Demonstrating filtering capabilities...');
  try {
    const posts = await service.getNewPosts('indiehackers', { limit: 20 });
    console.log(`✓ Fetched ${posts.length} new posts from r/indiehackers`);
    
    // Filter by keywords
    const filteredPosts = service.filterPostsByKeywords(
      posts,
      ['looking for', 'recommendation', 'need help'],
      ['spam']
    );
    console.log(`  - After keyword filtering: ${filteredPosts.length} posts`);
    
    // Filter by engagement
    const engagedPosts = service.filterByEngagement(filteredPosts, 5, 2);
    console.log(`  - After engagement filtering: ${engagedPosts.length} posts (min 5 upvotes, 2 comments)`);
  } catch (error) {
    console.error('❌ Failed to filter posts:', error);
  }

  console.log('\n✅ Example complete!');
  console.log('\nFor more examples, see REDDIT_SNOOWRAP_GUIDE.md');
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

export { main };

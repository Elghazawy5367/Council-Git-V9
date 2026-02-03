# Reddit Snoowrap Service - Official API Implementation

## Overview

This service replaces the custom Reddit JSON API scraping with the official Reddit API using **snoowrap**, providing full OAuth2 authentication and comprehensive API access.

## Features

- ✅ OAuth2 authentication (both user and userless modes)
- ✅ Hot/Top/New/Rising posts from subreddits
- ✅ Full search functionality
- ✅ Complete comment threading
- ✅ Built-in rate limiting (60 requests/minute)
- ✅ Automatic retry logic with exponential backoff
- ✅ Error handling and recovery

## Installation

```bash
npm install snoowrap @types/snoowrap
```

## Authentication

### Option 1: User Authentication (Recommended)

1. Create a Reddit app at https://www.reddit.com/prefs/apps
2. Choose "script" as the app type
3. Add environment variables:

```bash
# .env.local
REDDIT_CLIENT_ID=your_client_id
REDDIT_CLIENT_SECRET=your_client_secret
REDDIT_USERNAME=your_reddit_username
REDDIT_PASSWORD=your_reddit_password
```

### Option 2: Userless Authentication (Public Data Only)

For read-only access to public data:

```bash
# .env.local
REDDIT_CLIENT_ID=your_client_id
REDDIT_CLIENT_SECRET=your_client_secret
```

## Usage Examples

### Basic Setup

```typescript
import { 
  RedditSnoowrapService, 
  getRedditAuthConfigFromEnv 
} from '@/services/reddit-snoowrap.service';

// Initialize service
const redditService = new RedditSnoowrapService();

// Authenticate with user credentials
const authConfig = getRedditAuthConfigFromEnv();
if (authConfig) {
  await redditService.authenticate(authConfig);
} else {
  // Or authenticate without user (public data only)
  await redditService.authenticateUserless(
    'client_id',
    'client_secret',
    'MyApp/1.0.0'
  );
}
```

### Fetch Hot Posts

```typescript
// Get hot posts from a subreddit
const posts = await redditService.getHotPosts('SaaS', {
  limit: 25
});

posts.forEach(post => {
  console.log(`${post.title} - ${post.score} upvotes`);
});
```

### Fetch Top Posts

```typescript
// Get top posts from last week
const topPosts = await redditService.getTopPosts('Entrepreneur', {
  time: 'week',
  limit: 50
});

// Get top posts from all time
const allTimeTop = await redditService.getTopPosts('startups', {
  time: 'all',
  limit: 100
});
```

### Search Functionality

```typescript
// Search across all of Reddit
const searchResults = await redditService.searchPosts(
  'project management tool',
  undefined, // no specific subreddit
  {
    sort: 'relevance',
    time: 'month',
    limit: 100
  }
);

// Search within a specific subreddit
const subredditSearch = await redditService.searchPosts(
  'CRM alternative',
  'SaaS',
  {
    sort: 'top',
    time: 'week',
    limit: 50
  }
);
```

### Comment Threading

```typescript
// Get all comments from a post with full threading
const comments = await redditService.getPostComments('abc123');

// Process comments recursively
function processComments(comments, depth = 0) {
  comments.forEach(comment => {
    console.log(`${'  '.repeat(depth)}${comment.author}: ${comment.body}`);
    
    if (comment.replies) {
      processComments(comment.replies, depth + 1);
    }
  });
}

processComments(comments);
```

### Multiple Subreddits

```typescript
// Fetch from multiple subreddits at once
const posts = await redditService.getMultipleSubredditPosts(
  ['SaaS', 'Entrepreneur', 'startups', 'indiehackers'],
  {
    sort: 'hot',
    limit: 25 // per subreddit
  }
);

console.log(`Total posts: ${posts.length}`);
```

### Filtering

```typescript
// Filter by keywords
const filteredPosts = redditService.filterPostsByKeywords(
  posts,
  ['looking for', 'recommendation', 'alternative'], // include
  ['spam', 'promotional'] // exclude
);

// Filter by engagement
const popularPosts = redditService.filterByEngagement(
  posts,
  10, // minimum upvotes
  5   // minimum comments
);
```

### Get Single Post

```typescript
// Get a specific post by ID
const post = await redditService.getPostById('abc123');

if (post) {
  console.log(`Title: ${post.title}`);
  console.log(`Author: ${post.author}`);
  console.log(`Score: ${post.score}`);
  console.log(`Comments: ${post.num_comments}`);
}
```

## Service Class Structure

```typescript
class RedditSnoowrapService {
  // Authentication
  authenticate(config: RedditAuthConfig): Promise<void>
  authenticateUserless(clientId, clientSecret, userAgent): Promise<void>
  isAuthenticated(): boolean
  
  // Fetching Posts
  getHotPosts(subreddit, options?): Promise<RedditPost[]>
  getTopPosts(subreddit, options?): Promise<RedditPost[]>
  getNewPosts(subreddit, options?): Promise<RedditPost[]>
  getRisingPosts(subreddit, options?): Promise<RedditPost[]>
  
  // Search
  searchPosts(query, subreddit?, options?): Promise<RedditPost[]>
  
  // Comments
  getPostComments(postId, subreddit?): Promise<RedditComment[]>
  
  // Multiple Subreddits
  getMultipleSubredditPosts(subreddits, options?): Promise<RedditPost[]>
  
  // Single Post
  getPostById(postId): Promise<RedditPost | null>
  
  // Filtering
  filterPostsByKeywords(posts, keywords, exclude?): RedditPost[]
  filterByEngagement(posts, minUpvotes?, minComments?): RedditPost[]
  
  // Utilities
  resetRateLimiter(): void
}
```

## Rate Limiting

The service implements automatic rate limiting:

- **Default:** 60 requests per minute (Reddit's limit)
- **Request Delay:** 1 second between requests (snoowrap default)
- **Auto-retry:** 3 attempts with exponential backoff
- **Continues after rate limit:** Waits and retries automatically

### Manual Rate Limit Reset

```typescript
// Reset rate limiter (useful for testing)
redditService.resetRateLimiter();
```

## Error Handling

The service provides comprehensive error handling:

```typescript
try {
  const posts = await redditService.getHotPosts('SaaS');
} catch (error) {
  if (error.message.includes('authentication')) {
    console.error('Authentication failed - check credentials');
  } else if (error.message.includes('rate limit')) {
    console.error('Rate limit exceeded - wait before retrying');
  } else {
    console.error('Reddit API error:', error);
  }
}
```

### Common Errors

1. **Authentication Failed**: Check credentials in environment variables
2. **Rate Limit Exceeded**: Service auto-retries, but manual intervention may be needed
3. **Subreddit Not Found**: Verify subreddit name exists and is public
4. **Post Not Found**: Check post ID and ensure it's not deleted

## Authentication Flow

### 1. Create Reddit App

Visit: https://www.reddit.com/prefs/apps

1. Click "create an app" or "create another app..."
2. Choose "script" for personal use
3. Fill in:
   - **name**: Your app name
   - **description**: Brief description
   - **redirect uri**: http://localhost:8080 (required but not used for scripts)

### 2. Configure Environment

```bash
# .env.local
REDDIT_CLIENT_ID=abc123def456  # from "personal use script" line
REDDIT_CLIENT_SECRET=xyz789abc123def456  # from "secret" line
REDDIT_USERNAME=your_reddit_username
REDDIT_PASSWORD=your_reddit_password
```

### 3. Initialize Service

```typescript
import { 
  getRedditSnoowrapService, 
  getRedditAuthConfigFromEnv 
} from '@/services/reddit-snoowrap.service';

const service = getRedditSnoowrapService();
const config = getRedditAuthConfigFromEnv();

if (config) {
  await service.authenticate(config);
  console.log('✓ Authenticated successfully');
} else {
  console.error('✗ Missing Reddit credentials');
}
```

## Example: Reddit Lead Generation

```typescript
import { getRedditSnoowrapService } from '@/services/reddit-snoowrap.service';

async function findLeads() {
  const service = getRedditSnoowrapService();
  
  // Authenticate
  const config = getRedditAuthConfigFromEnv();
  await service.authenticate(config);
  
  // Search for leads
  const posts = await service.searchPosts(
    'looking for project management tool',
    undefined,
    { time: 'week', limit: 100 }
  );
  
  // Filter high-intent leads
  const buyingIntentKeywords = [
    'willing to pay',
    'budget',
    'recommendation',
    'alternative to'
  ];
  
  const highIntentLeads = service.filterPostsByKeywords(
    posts,
    buyingIntentKeywords
  );
  
  // Filter by engagement
  const qualifiedLeads = service.filterByEngagement(
    highIntentLeads,
    5,  // min 5 upvotes
    2   // min 2 comments
  );
  
  console.log(`Found ${qualifiedLeads.length} qualified leads`);
  
  return qualifiedLeads;
}
```

## Example: Comment Analysis

```typescript
async function analyzeDiscussion(postId: string) {
  const service = getRedditSnoowrapService();
  await service.authenticate(getRedditAuthConfigFromEnv());
  
  // Get post
  const post = await service.getPostById(postId);
  console.log(`Analyzing: ${post.title}`);
  
  // Get comments
  const comments = await service.getPostComments(postId);
  
  // Analyze sentiment
  const painPoints = comments.filter(comment =>
    comment.body.toLowerCase().includes('problem') ||
    comment.body.toLowerCase().includes('frustrated') ||
    comment.body.toLowerCase().includes('difficult')
  );
  
  console.log(`Found ${painPoints.length} comments with pain points`);
  
  return {
    post,
    comments,
    painPoints
  };
}
```

## Migration from Old Service

### Before (JSON API)

```typescript
import { getRedditService } from '@/services/reddit.service';

const service = getRedditService();
const { posts } = await service.getSubredditPosts('SaaS', {
  sort: 'hot',
  limit: 25
});
```

### After (Snoowrap)

```typescript
import { getRedditSnoowrapService } from '@/services/reddit-snoowrap.service';

const service = getRedditSnoowrapService();
await service.authenticate(getRedditAuthConfigFromEnv());

const posts = await service.getHotPosts('SaaS', {
  limit: 25
});
```

## Key Differences

| Feature | JSON API (Old) | Snoowrap (New) |
|---------|---------------|----------------|
| Authentication | None (public only) | OAuth2 |
| Rate Limiting | Manual | Automatic |
| API Access | Limited | Full API |
| Comment Threading | Manual parsing | Native support |
| Error Recovery | Basic | Advanced retry logic |
| Type Safety | Partial | Complete |

## Performance Considerations

1. **Rate Limiting**: 60 requests/minute max
2. **Request Delay**: 1 second between requests
3. **Comment Expansion**: Can be slow for large threads
4. **Memory Usage**: Listings are lazy-loaded
5. **Retry Logic**: Adds latency but improves reliability

## Best Practices

1. **Always authenticate** before making requests
2. **Use rate limiter** to avoid hitting limits
3. **Cache results** when possible to reduce API calls
4. **Handle errors gracefully** with try-catch
5. **Use filtering** to reduce data processing
6. **Monitor rate limits** in production

## Troubleshooting

### Issue: "Reddit client not authenticated"

**Solution**: Call `authenticate()` before making requests

```typescript
await service.authenticate(config);
```

### Issue: Rate limit exceeded

**Solution**: Wait 60 seconds or implement exponential backoff

```typescript
service.resetRateLimiter();
await new Promise(resolve => setTimeout(resolve, 60000));
```

### Issue: Invalid credentials

**Solution**: Verify environment variables are set correctly

```bash
echo $REDDIT_CLIENT_ID
echo $REDDIT_CLIENT_SECRET
```

## Support

For issues or questions:
1. Check Reddit API documentation: https://www.reddit.com/dev/api
2. Check snoowrap docs: https://not-an-aardvark.github.io/snoowrap/
3. Review authentication setup in `.env.local`
4. Test with `npm run typecheck`

## Related Files

- `src/services/reddit-snoowrap.service.ts` - Main service implementation
- `src/lib/reddit-sniper.ts` - Lead generation using this service
- `.env.example` - Environment variable template

---

**Last Updated**: 2026-02-03  
**Status**: ✅ Complete  
**Authentication**: OAuth2 with snoowrap  
**Rate Limiting**: Automatic (60/min)

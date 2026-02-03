/**
 * Reddit API Client for Features Automation
 * Now uses snoowrap (official Reddit API wrapper) with OAuth2
 */

import {
  getRedditSnoowrapService,
  getRedditAuthConfigFromEnv,
  RedditPost,
  RedditComment,
} from '@/services/reddit-snoowrap.service';

// Re-export types for convenience
export type { RedditPost, RedditComment };

export class RedditAPIClient {
  private service = getRedditSnoowrapService();
  private initialized = false;

  /**
   * Initialize authentication
   */
  private async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      const config = getRedditAuthConfigFromEnv();
      if (config) {
        await this.service.authenticate(config);
      } else {
        // Fallback to userless auth
        const clientId = import.meta.env.VITE_REDDIT_CLIENT_ID || process.env.REDDIT_CLIENT_ID;
        const clientSecret = import.meta.env.VITE_REDDIT_CLIENT_SECRET || process.env.REDDIT_CLIENT_SECRET;

        if (clientId && clientSecret) {
          await this.service.authenticateUserless(
            clientId,
            clientSecret,
            'Council-Intelligence-Gatherer/2.0'
          );
        }
      }
      this.initialized = true;
    } catch (error) {
      console.error('Reddit authentication failed:', error);
      throw error;
    }
  }
  /**
   * Get posts from a subreddit
   */
  async getSubredditPosts(subreddit: string, options: {
    sort?: 'hot' | 'new' | 'top' | 'rising';
    timeRange?: 'hour' | 'day' | 'week' | 'month' | 'year' | 'all';
    limit?: number;
    after?: string;
  } = {}): Promise<{
    posts: RedditPost[];
    after: string | null;
  }> {
    await this.initialize();

    const { sort = 'hot', timeRange = 'week', limit = 25 } = options;

    let posts: RedditPost[];

    switch (sort) {
      case 'hot':
        posts = await this.service.getHotPosts(subreddit, { limit });
        break;
      case 'top':
        posts = await this.service.getTopPosts(subreddit, { time: timeRange, limit });
        break;
      case 'new':
        posts = await this.service.getNewPosts(subreddit, { limit });
        break;
      case 'rising':
        posts = await this.service.getRisingPosts(subreddit, { limit });
        break;
      default:
        posts = await this.service.getHotPosts(subreddit, { limit });
    }

    return {
      posts,
      after: null, // Snoowrap pagination handled internally
    };
  }

  /**
   * Get posts from multiple subreddits
   */
  async getMultipleSubredditPosts(subreddits: string[], options: {
    sort?: 'hot' | 'new' | 'top' | 'rising';
    timeRange?: 'hour' | 'day' | 'week' | 'month' | 'year' | 'all';
    limitPerSubreddit?: number;
  } = {}): Promise<RedditPost[]> {
    await this.initialize();

    const { sort = 'hot', timeRange = 'week', limitPerSubreddit = 25 } = options;

    return await this.service.getMultipleSubredditPosts(subreddits, {
      sort,
      time: timeRange,
      limit: limitPerSubreddit,
    });
  }

  /**
   * Search posts across Reddit
   */
  async searchPosts(query: string, options: {
    subreddit?: string;
    sort?: 'relevance' | 'hot' | 'top' | 'new' | 'comments';
    timeRange?: 'hour' | 'day' | 'week' | 'month' | 'year' | 'all';
    limit?: number;
  } = {}): Promise<RedditPost[]> {
    await this.initialize();

    const { subreddit, sort = 'relevance', timeRange = 'week', limit = 50 } = options;

    return await this.service.searchPosts(query, subreddit, {
      sort,
      time: timeRange,
      limit,
    });
  }

  /**
   * Get comments from a post
   */
  async getPostComments(subreddit: string, postId: string, options: {
    sort?: 'confidence' | 'top' | 'new' | 'controversial' | 'old';
    limit?: number;
  } = {}): Promise<RedditComment[]> {
    await this.initialize();

    // Get comments with full threading
    const comments = await this.service.getPostComments(postId, subreddit);

    // Flatten comment tree if needed
    const flatComments: RedditComment[] = [];
    const flatten = (commentList: RedditComment[]): void => {
      commentList.forEach(comment => {
        flatComments.push(comment);
        if (comment.replies) {
          flatten(comment.replies);
        }
      });
    };
    flatten(comments);

    // Apply limit if specified
    const { limit = 100 } = options;
    return flatComments.slice(0, limit);
  }

  /**
   * Filter posts by keywords
   */
  filterPostsByKeywords(posts: RedditPost[], keywords: string[], excludeKeywords: string[] = []): RedditPost[] {
    return this.service.filterPostsByKeywords(posts, keywords, excludeKeywords);
  }

  /**
   * Filter posts by minimum engagement
   */
  filterByEngagement(posts: RedditPost[], minUpvotes = 10, minComments = 5): RedditPost[] {
    return this.service.filterByEngagement(posts, minUpvotes, minComments);
  }

  /**
   * Get posts with negative sentiment indicators
   */
  filterNegativeSentiment(posts: RedditPost[]): RedditPost[] {
    const negativeKeywords = ['problem', 'issue', 'frustrated', 'annoying', 'difficult', 'struggle', 'hate', 'worst', 'terrible', 'awful', 'sucks', 'wish', 'need', 'missing', 'lacking', 'pain', 'nightmare'];
    return posts.filter((post) => {
      const text = `${post.title} ${post.selftext}`.toLowerCase();
      return negativeKeywords.some((keyword) => text.includes(keyword));
    });
  }
}

// Singleton instance
let redditClientInstance: RedditAPIClient | null = null;
export function getRedditClient(): RedditAPIClient {
  if (!redditClientInstance) {
    redditClientInstance = new RedditAPIClient();
  }
  return redditClientInstance;
}

// Export default instance for convenience
export const redditClient = new RedditAPIClient();
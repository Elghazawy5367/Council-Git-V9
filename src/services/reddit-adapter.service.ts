/**
 * Reddit Service Adapter
 * 
 * Provides backward compatibility with the old RedditService interface
 * while using the new snoowrap-based implementation under the hood.
 * 
 * This allows existing code (like reddit-sniper.ts) to work without changes.
 */

import {
  RedditSnoowrapService,
  getRedditSnoowrapService,
  getRedditAuthConfigFromEnv,
  RedditPost as SnoowrapPost,
} from './reddit-snoowrap.service';

/**
 * Old RedditPost interface (for backward compatibility)
 */
export interface RedditPost {
  id: string;
  title: string;
  selftext: string;
  author: string;
  subreddit: string;
  score: number;
  num_comments: number;
  created_utc: number;
  url: string;
  permalink: string;
  link_flair_text: string | null;
  upvote_ratio: number;
}

/**
 * Old RedditService interface
 */
export class RedditService {
  private snoowrapService: RedditSnoowrapService;
  private authenticated = false;

  constructor() {
    this.snoowrapService = getRedditSnoowrapService();
    this.autoAuthenticate();
  }

  /**
   * Attempt to auto-authenticate on initialization
   */
  private async autoAuthenticate(): Promise<void> {
    try {
      const config = getRedditAuthConfigFromEnv();
      if (config) {
        await this.snoowrapService.authenticate(config);
        this.authenticated = true;
      } else {
        // Try userless authentication if we have at least client credentials
        const clientId = import.meta.env.VITE_REDDIT_CLIENT_ID || process.env.REDDIT_CLIENT_ID;
        const clientSecret = import.meta.env.VITE_REDDIT_CLIENT_SECRET || process.env.REDDIT_CLIENT_SECRET;
        
        if (clientId && clientSecret) {
          await this.snoowrapService.authenticateUserless(
            clientId,
            clientSecret,
            'Council-Intelligence-Gatherer/2.0'
          );
          this.authenticated = true;
        }
      }
    } catch (error) {
      console.warn('Reddit auto-authentication failed, will retry on first request:', error);
    }
  }

  /**
   * Ensure authenticated before making requests
   */
  private async ensureAuthenticated(): Promise<void> {
    if (this.authenticated) return;
    await this.autoAuthenticate();
    if (!this.authenticated) {
      throw new Error(
        'Reddit authentication failed. Please configure REDDIT_CLIENT_ID and REDDIT_CLIENT_SECRET in .env'
      );
    }
  }

  /**
   * Get posts from a subreddit (backward compatible)
   */
  async getSubredditPosts(
    subreddit: string,
    options: {
      sort?: 'hot' | 'new' | 'top' | 'rising';
      timeRange?: 'hour' | 'day' | 'week' | 'month' | 'year' | 'all';
      limit?: number;
      after?: string;
    } = {}
  ): Promise<{
    posts: RedditPost[];
    after: string | null;
  }> {
    await this.ensureAuthenticated();

    const { sort = 'hot', timeRange = 'week', limit = 25 } = options;

    let posts: SnoowrapPost[];

    switch (sort) {
      case 'hot':
        posts = await this.snoowrapService.getHotPosts(subreddit, { limit });
        break;
      case 'top':
        posts = await this.snoowrapService.getTopPosts(subreddit, { time: timeRange, limit });
        break;
      case 'new':
        posts = await this.snoowrapService.getNewPosts(subreddit, { limit });
        break;
      case 'rising':
        posts = await this.snoowrapService.getRisingPosts(subreddit, { limit });
        break;
      default:
        posts = await this.snoowrapService.getHotPosts(subreddit, { limit });
    }

    return {
      posts: this.convertPosts(posts),
      after: null, // Snoowrap handles pagination differently
    };
  }

  /**
   * Search posts across Reddit or within a subreddit
   */
  async searchPosts(
    query: string,
    options: {
      sort?: 'relevance' | 'hot' | 'top' | 'new' | 'comments';
      timeRange?: 'hour' | 'day' | 'week' | 'month' | 'year' | 'all';
      limit?: number;
      subreddit?: string;
    } = {}
  ): Promise<RedditPost[]> {
    await this.ensureAuthenticated();

    const { sort = 'relevance', timeRange = 'week', limit = 50, subreddit } = options;

    const posts = await this.snoowrapService.searchPosts(query, subreddit, {
      sort,
      time: timeRange,
      limit,
    });

    return this.convertPosts(posts);
  }

  /**
   * Get posts from multiple subreddits
   */
  async getMultipleSubredditPosts(
    subreddits: string[],
    options: {
      sort?: 'hot' | 'new' | 'top' | 'rising';
      timeRange?: 'hour' | 'day' | 'week' | 'month' | 'year' | 'all';
      limitPerSubreddit?: number;
    } = {}
  ): Promise<RedditPost[]> {
    await this.ensureAuthenticated();

    const { sort = 'hot', timeRange = 'week', limitPerSubreddit = 25 } = options;

    const posts = await this.snoowrapService.getMultipleSubredditPosts(subreddits, {
      sort,
      time: timeRange,
      limit: limitPerSubreddit,
    });

    return this.convertPosts(posts);
  }

  /**
   * Filter posts by keywords
   */
  filterPostsByKeywords(
    posts: RedditPost[],
    keywords: string[],
    excludeKeywords: string[] = []
  ): RedditPost[] {
    return this.snoowrapService.filterPostsByKeywords(posts, keywords, excludeKeywords);
  }

  /**
   * Filter posts by minimum engagement
   */
  filterByEngagement(
    posts: RedditPost[],
    minUpvotes = 10,
    minComments = 5
  ): RedditPost[] {
    return this.snoowrapService.filterByEngagement(posts, minUpvotes, minComments);
  }

  /**
   * Filter posts with pain point indicators
   */
  filterPainPoints(posts: RedditPost[]): RedditPost[] {
    const painKeywords = [
      'problem',
      'issue',
      'frustrated',
      'annoying',
      'difficult',
      'struggle',
      'hate',
      'worst',
      'terrible',
      'awful',
      'sucks',
      'wish',
      'need',
      'missing',
      'lacking',
      'pain',
      'nightmare',
      "doesn't work",
      'broken',
      'bug',
    ];

    return posts.filter((post) => {
      const text = `${post.title} ${post.selftext}`.toLowerCase();
      return painKeywords.some((keyword) => text.includes(keyword));
    });
  }

  /**
   * Convert Snoowrap posts to old format
   */
  private convertPosts(snoowrapPosts: SnoowrapPost[]): RedditPost[] {
    return snoowrapPosts.map(post => ({
      id: post.id,
      title: post.title,
      selftext: post.selftext,
      author: post.author,
      subreddit: post.subreddit,
      score: post.score,
      num_comments: post.num_comments,
      created_utc: post.created_utc,
      url: post.url,
      permalink: post.permalink,
      link_flair_text: post.link_flair_text,
      upvote_ratio: post.upvote_ratio,
    }));
  }
}

/**
 * Singleton instance
 */
let redditServiceInstance: RedditService | null = null;

export function getRedditService(): RedditService {
  if (!redditServiceInstance) {
    redditServiceInstance = new RedditService();
  }
  return redditServiceInstance;
}

/**
 * Default export for convenience
 */
export const redditService = new RedditService();

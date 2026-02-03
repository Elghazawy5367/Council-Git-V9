/**
 * Reddit Service - Snoowrap-based Official API Wrapper
 * 
 * Uses snoowrap (official Reddit API wrapper) with OAuth2 authentication.
 * Provides full Reddit API capabilities with rate limiting and error handling.
 * 
 * Features:
 * - OAuth2 authentication
 * - Hot/Top posts from subreddits
 * - Search functionality
 * - Comment threading
 * - Rate limiting
 * - Error handling
 */

import Snoowrap, { Submission, Comment, Listing, Subreddit } from 'snoowrap';

/**
 * Reddit OAuth2 Configuration
 */
export interface RedditAuthConfig {
  clientId: string;
  clientSecret: string;
  username: string;
  password: string;
  userAgent: string;
}

/**
 * Normalized Reddit Post Interface
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
  is_self: boolean;
  thumbnail?: string;
  domain?: string;
}

/**
 * Normalized Reddit Comment Interface
 */
export interface RedditComment {
  id: string;
  body: string;
  author: string;
  score: number;
  created_utc: number;
  permalink: string;
  parent_id: string;
  replies?: RedditComment[];
}

/**
 * Search Options
 */
export interface SearchOptions {
  sort?: 'relevance' | 'hot' | 'top' | 'new' | 'comments';
  time?: 'hour' | 'day' | 'week' | 'month' | 'year' | 'all';
  limit?: number;
  syntax?: 'cloudsearch' | 'lucene' | 'plain';
}

/**
 * Subreddit Post Options
 */
export interface SubredditPostOptions {
  sort?: 'hot' | 'new' | 'top' | 'rising' | 'controversial';
  time?: 'hour' | 'day' | 'week' | 'month' | 'year' | 'all';
  limit?: number;
}

/**
 * Rate Limiter Implementation
 */
class RateLimiter {
  private requests: number[] = [];
  private readonly maxRequests: number;
  private readonly timeWindow: number;

  constructor(maxRequests = 60, timeWindowMs = 60000) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindowMs;
  }

  async throttle(): Promise<void> {
    const now = Date.now();
    
    // Remove old requests outside the time window
    this.requests = this.requests.filter(time => now - time < this.timeWindow);
    
    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = this.requests[0];
      const waitTime = this.timeWindow - (now - oldestRequest);
      
      if (waitTime > 0) {
        await this.sleep(waitTime);
        return this.throttle();
      }
    }
    
    this.requests.push(now);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  reset(): void {
    this.requests = [];
  }
}

/**
 * Reddit Service using Snoowrap
 */
export class RedditSnoowrapService {
  private client: Snoowrap | null = null;
  private rateLimiter: RateLimiter;
  private readonly maxRetries = 3;
  private readonly baseRetryDelay = 1000;

  constructor() {
    // Reddit API allows 60 requests per minute
    this.rateLimiter = new RateLimiter(60, 60000);
  }

  /**
   * Initialize the Reddit client with OAuth2 credentials
   */
  async authenticate(config: RedditAuthConfig): Promise<void> {
    try {
      this.client = new Snoowrap({
        clientId: config.clientId,
        clientSecret: config.clientSecret,
        username: config.username,
        password: config.password,
        userAgent: config.userAgent,
      });

      // Configure rate limiting (Reddit recommends max 1 request per second)
      this.client.config({
        requestDelay: 1000,
        warnings: true,
        continueAfterRatelimitError: true,
        maxRetryAttempts: this.maxRetries,
      });

      // Test authentication
      await this.client.getMe();
      console.log('✓ Reddit authentication successful');
    } catch (error) {
      throw new Error(`Reddit authentication failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Initialize with user-less authentication (script app)
   */
  async authenticateUserless(clientId: string, clientSecret: string, userAgent: string): Promise<void> {
    try {
      this.client = new Snoowrap({
        clientId,
        clientSecret,
        userAgent,
        // For userless authentication, set a dummy refresh token
        refreshToken: '',
        accessToken: '',
      });

      this.client.config({
        requestDelay: 1000,
        warnings: true,
        continueAfterRatelimitError: true,
        maxRetryAttempts: this.maxRetries,
      });

      console.log('✓ Reddit userless authentication configured');
    } catch (error) {
      throw new Error(`Reddit userless auth failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Ensure client is authenticated
   */
  private ensureAuthenticated(): Snoowrap {
    if (!this.client) {
      throw new Error('Reddit client not authenticated. Call authenticate() or authenticateUserless() first.');
    }
    return this.client;
  }

  /**
   * Execute with rate limiting and retry logic
   */
  private async executeWithRetry<T>(operation: () => Promise<T>): Promise<T> {
    await this.rateLimiter.throttle();

    for (let attempt = 0; attempt < this.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        
        if (attempt === this.maxRetries - 1) {
          throw new Error(`Reddit API error after ${this.maxRetries} attempts: ${errorMessage}`);
        }

        // Exponential backoff
        const delay = this.baseRetryDelay * Math.pow(2, attempt);
        console.warn(`Reddit API error (attempt ${attempt + 1}/${this.maxRetries}), retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw new Error('Max retries exceeded');
  }

  /**
   * Get hot posts from a subreddit
   */
  async getHotPosts(subredditName: string, options: SubredditPostOptions = {}): Promise<RedditPost[]> {
    const client = this.ensureAuthenticated();
    const { limit = 25 } = options;

    return this.executeWithRetry(async () => {
      const subreddit = client.getSubreddit(subredditName);
      const posts = await subreddit.getHot({ limit });
      return this.normalizePosts(posts);
    });
  }

  /**
   * Get top posts from a subreddit
   */
  async getTopPosts(subredditName: string, options: SubredditPostOptions = {}): Promise<RedditPost[]> {
    const client = this.ensureAuthenticated();
    const { time = 'week', limit = 25 } = options;

    return this.executeWithRetry(async () => {
      const subreddit = client.getSubreddit(subredditName);
      const posts = await subreddit.getTop({ time, limit });
      return this.normalizePosts(posts);
    });
  }

  /**
   * Get new posts from a subreddit
   */
  async getNewPosts(subredditName: string, options: SubredditPostOptions = {}): Promise<RedditPost[]> {
    const client = this.ensureAuthenticated();
    const { limit = 25 } = options;

    return this.executeWithRetry(async () => {
      const subreddit = client.getSubreddit(subredditName);
      const posts = await subreddit.getNew({ limit });
      return this.normalizePosts(posts);
    });
  }

  /**
   * Get rising posts from a subreddit
   */
  async getRisingPosts(subredditName: string, options: SubredditPostOptions = {}): Promise<RedditPost[]> {
    const client = this.ensureAuthenticated();
    const { limit = 25 } = options;

    return this.executeWithRetry(async () => {
      const subreddit = client.getSubreddit(subredditName);
      const posts = await subreddit.getRising({ limit });
      return this.normalizePosts(posts);
    });
  }

  /**
   * Search posts across Reddit or within a subreddit
   */
  async searchPosts(query: string, subredditName?: string, options: SearchOptions = {}): Promise<RedditPost[]> {
    const client = this.ensureAuthenticated();
    const { sort = 'relevance', time = 'week', limit = 50 } = options;

    return this.executeWithRetry(async () => {
      let results: Listing<Submission>;
      
      if (subredditName) {
        const subreddit = client.getSubreddit(subredditName);
        results = await subreddit.search({
          query,
          sort,
          time,
          limit,
        });
      } else {
        results = await client.search({
          query,
          sort,
          time,
          limit,
        });
      }

      return this.normalizePosts(results);
    });
  }

  /**
   * Get comments for a post with full threading
   */
  async getPostComments(postId: string, subredditName?: string): Promise<RedditComment[]> {
    const client = this.ensureAuthenticated();

    return this.executeWithRetry(async () => {
      const submission = client.getSubmission(postId);
      
      // Expand all comments (this will fetch all replies)
      await submission.expandReplies({ limit: Infinity, depth: Infinity });
      
      const comments = await submission.comments;
      return this.normalizeComments(comments);
    });
  }

  /**
   * Get posts from multiple subreddits
   */
  async getMultipleSubredditPosts(
    subredditNames: string[],
    options: SubredditPostOptions = {}
  ): Promise<RedditPost[]> {
    const { sort = 'hot', limit = 25 } = options;

    const promises = subredditNames.map(async (name) => {
      try {
        switch (sort) {
          case 'hot':
            return await this.getHotPosts(name, { limit });
          case 'top':
            return await this.getTopPosts(name, options);
          case 'new':
            return await this.getNewPosts(name, { limit });
          case 'rising':
            return await this.getRisingPosts(name, { limit });
          default:
            return await this.getHotPosts(name, { limit });
        }
      } catch (error) {
        console.error(`Failed to fetch from r/${name}:`, error);
        return [];
      }
    });

    const results = await Promise.allSettled(promises);
    const allPosts: RedditPost[] = [];

    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        allPosts.push(...result.value);
      }
    });

    return allPosts.sort((a, b) => b.score - a.score);
  }

  /**
   * Get a single post by ID
   */
  async getPostById(postId: string): Promise<RedditPost | null> {
    const client = this.ensureAuthenticated();

    return this.executeWithRetry(async () => {
      const submission = await client.getSubmission(postId).fetch();
      return this.normalizePost(submission);
    });
  }

  /**
   * Filter posts by keywords
   */
  filterPostsByKeywords(
    posts: RedditPost[],
    keywords: string[],
    excludeKeywords: string[] = []
  ): RedditPost[] {
    if (keywords.length === 0 && excludeKeywords.length === 0) {
      return posts;
    }

    return posts.filter((post) => {
      const text = `${post.title} ${post.selftext}`.toLowerCase();

      const hasKeyword =
        keywords.length === 0 ||
        keywords.some((keyword) => text.includes(keyword.toLowerCase()));

      const hasExcludedKeyword =
        excludeKeywords.length > 0 &&
        excludeKeywords.some((keyword) => text.includes(keyword.toLowerCase()));

      return hasKeyword && !hasExcludedKeyword;
    });
  }

  /**
   * Filter posts by engagement
   */
  filterByEngagement(
    posts: RedditPost[],
    minUpvotes = 10,
    minComments = 5
  ): RedditPost[] {
    return posts.filter(
      (post) => post.score >= minUpvotes && post.num_comments >= minComments
    );
  }

  /**
   * Normalize Snoowrap Submission to RedditPost
   */
  private normalizePost(submission: Submission): RedditPost {
    return {
      id: submission.id,
      title: submission.title,
      selftext: submission.selftext || '',
      author: submission.author.name,
      subreddit: submission.subreddit.display_name,
      score: submission.score,
      num_comments: submission.num_comments,
      created_utc: submission.created_utc,
      url: submission.url,
      permalink: submission.permalink,
      link_flair_text: submission.link_flair_text || null,
      upvote_ratio: submission.upvote_ratio,
      is_self: submission.is_self,
      thumbnail: submission.thumbnail !== 'self' ? submission.thumbnail : undefined,
      domain: submission.domain,
    };
  }

  /**
   * Normalize multiple posts
   */
  private normalizePosts(submissions: Listing<Submission> | Submission[]): RedditPost[] {
    const posts = Array.isArray(submissions) ? submissions : Array.from(submissions);
    return posts.map(submission => this.normalizePost(submission));
  }

  /**
   * Normalize comments with threading
   */
  private normalizeComments(comments: Listing<Comment> | Comment[]): RedditComment[] {
    const commentArray = Array.isArray(comments) ? comments : Array.from(comments);
    
    return commentArray.map(comment => this.normalizeComment(comment));
  }

  /**
   * Normalize a single comment with replies
   */
  private normalizeComment(comment: Comment): RedditComment {
    const normalized: RedditComment = {
      id: comment.id,
      body: comment.body || '',
      author: comment.author ? comment.author.name : '[deleted]',
      score: comment.score,
      created_utc: comment.created_utc,
      permalink: comment.permalink,
      parent_id: comment.parent_id,
    };

    // Recursively normalize replies
    if (comment.replies && comment.replies.length > 0) {
      normalized.replies = this.normalizeComments(comment.replies);
    }

    return normalized;
  }

  /**
   * Reset rate limiter (useful for testing)
   */
  resetRateLimiter(): void {
    this.rateLimiter.reset();
  }

  /**
   * Get current client status
   */
  isAuthenticated(): boolean {
    return this.client !== null;
  }
}

/**
 * Singleton instance
 */
let redditSnoowrapServiceInstance: RedditSnoowrapService | null = null;

export function getRedditSnoowrapService(): RedditSnoowrapService {
  if (!redditSnoowrapServiceInstance) {
    redditSnoowrapServiceInstance = new RedditSnoowrapService();
  }
  return redditSnoowrapServiceInstance;
}

/**
 * Helper function to create authentication config from environment
 */
export function getRedditAuthConfigFromEnv(): RedditAuthConfig | null {
  const clientId = import.meta.env.VITE_REDDIT_CLIENT_ID || process.env.REDDIT_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_REDDIT_CLIENT_SECRET || process.env.REDDIT_CLIENT_SECRET;
  const username = import.meta.env.VITE_REDDIT_USERNAME || process.env.REDDIT_USERNAME;
  const password = import.meta.env.VITE_REDDIT_PASSWORD || process.env.REDDIT_PASSWORD;

  if (!clientId || !clientSecret) {
    return null;
  }

  return {
    clientId,
    clientSecret,
    username: username || '',
    password: password || '',
    userAgent: 'Council-Intelligence-Gatherer/2.0 (Snoowrap-based)',
  };
}

/**
 * Export default instance for convenience
 */
export default new RedditSnoowrapService();

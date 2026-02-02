/**
 * Reddit Service - Snoowrap-based API Wrapper
 * 
 * Handles all Reddit API interactions for the Scout system.
 * Uses Reddit JSON API (no auth required for public data).
 * 
 * Note: scout.ts currently doesn't use Reddit, but this service
 * is provided for future intelligence gathering expansion.
 */

interface RedditPost {
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

interface RedditComment {
  id: string;
  body: string;
  author: string;
  score: number;
  created_utc: number;
  permalink: string;
}

interface RedditListing {
  data: {
    children: Array<{
      data: RedditPost | RedditComment;
    }>;
    after: string | null;
    before: string | null;
  };
}

interface RedditSearchOptions {
  sort?: 'relevance' | 'hot' | 'top' | 'new' | 'comments';
  timeRange?: 'hour' | 'day' | 'week' | 'month' | 'year' | 'all';
  limit?: number;
  subreddit?: string;
}

/**
 * Reddit Service Class
 * Wraps Reddit JSON API with rate limiting and error handling
 */
export class RedditService {
  private baseURL = 'https://www.reddit.com';
  private userAgent = 'Council-Intelligence-Gatherer/1.0';

  /**
   * Make request to Reddit API with retry logic
   */
  private async fetchWithRetry(
    url: string,
    retries = 3
  ): Promise<Response> {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, {
          headers: {
            'User-Agent': this.userAgent,
          },
        });

        if (response.status === 429) {
          // Rate limited
          const retryAfter = response.headers.get('Retry-After');
          const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 2000 * Math.pow(2, i);
          if (i < retries - 1) {
            await this.sleep(waitTime);
            continue;
          }
        }

        if (!response.ok) {
          throw new Error(`Reddit API error: ${response.status} ${response.statusText}`);
        }

        return response;
      } catch (error) {
        if (i === retries - 1) throw error;
        await this.sleep(1000 * Math.pow(2, i)); // Exponential backoff
      }
    }

    throw new Error('Max retries exceeded');
  }

  /**
   * Get posts from a subreddit
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
    const {
      sort = 'hot',
      timeRange = 'week',
      limit = 25,
      after,
    } = options;

    const params = new URLSearchParams({
      limit: limit.toString(),
    });

    if (after) {
      params.set('after', after);
    }

    if (sort === 'top' && timeRange) {
      params.set('t', timeRange);
    }

    const url = `${this.baseURL}/r/${subreddit}/${sort}.json?${params}`;
    const response = await this.fetchWithRetry(url);
    const data: RedditListing = await response.json();

    const posts = data.data.children.map((child) => child.data as RedditPost);

    return {
      posts,
      after: data.data.after,
    };
  }

  /**
   * Search posts across Reddit or within a subreddit
   */
  async searchPosts(
    query: string,
    options: RedditSearchOptions = {}
  ): Promise<RedditPost[]> {
    const {
      sort = 'relevance',
      timeRange = 'week',
      limit = 50,
      subreddit,
    } = options;

    const params = new URLSearchParams({
      q: query,
      sort,
      limit: limit.toString(),
    });

    if (timeRange) {
      params.set('t', timeRange);
    }

    const searchPath = subreddit
      ? `/r/${subreddit}/search.json`
      : '/search.json';

    if (subreddit) {
      params.set('restrict_sr', 'true');
    }

    const url = `${this.baseURL}${searchPath}?${params}`;
    const response = await this.fetchWithRetry(url);
    const data: RedditListing = await response.json();

    return data.data.children.map((child) => child.data as RedditPost);
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
    const { limitPerSubreddit = 25 } = options;

    // Fetch from each subreddit
    const promises = subreddits.map((subreddit) =>
      this.getSubredditPosts(subreddit, {
        ...options,
        limit: limitPerSubreddit,
      })
    );

    const results = await Promise.allSettled(promises);

    // Combine all posts
    const allPosts: RedditPost[] = [];
    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        allPosts.push(...result.value.posts);
      }
    });

    // Sort by score
    return allPosts.sort((a, b) => b.score - a.score);
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

      // Check if includes any keyword
      const hasKeyword =
        keywords.length === 0 ||
        keywords.some((keyword) => text.includes(keyword.toLowerCase()));

      // Check if includes any excluded keyword
      const hasExcludedKeyword =
        excludeKeywords.length > 0 &&
        excludeKeywords.some((keyword) => text.includes(keyword.toLowerCase()));

      return hasKeyword && !hasExcludedKeyword;
    });
  }

  /**
   * Filter posts by minimum engagement
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
   * Sleep utility for rate limiting
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
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

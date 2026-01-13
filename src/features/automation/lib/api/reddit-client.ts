/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Reddit API Client for Features Automation
 * Uses Reddit JSON API (no auth required for public data)
 */

interface RedditPost {
  id: string;
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

export class RedditAPIClient {
  private baseURL = 'https://www.reddit.com';
  private userAgent = 'Council-Intelligence-Gatherer/1.0';

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
            await new Promise(resolve => setTimeout(resolve, waitTime));
            continue;
          }
        }

        if (!response.ok) {
          throw new Error(`Reddit API error: ${response.status} ${response.statusText}`);
        }

        return response;
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
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
  ): Promise<{ posts: RedditPost[]; after: string | null }> {
    const { sort = 'hot', timeRange = 'week', limit = 25, after } = options;

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

    const posts = data.data.children.map(child => child.data as RedditPost);

    return {
      posts,
      after: data.data.after,
    };
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
    const promises = subreddits.map(subreddit =>
      this.getSubredditPosts(subreddit, {
        ...options,
        limit: limitPerSubreddit,
      })
    );

    const results = await Promise.allSettled(promises);

    // Combine all posts
    const allPosts: RedditPost[] = [];

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        allPosts.push(...result.value.posts);
      } else {
        console.warn(`Failed to fetch from r/${subreddits[index]}:`, result.reason);
      }
    });

    // Sort by score
    return allPosts.sort((a, b) => b.score - a.score);
  }

  /**
   * Search posts across Reddit
   */
  async searchPosts(
    query: string,
    options: {
      subreddit?: string;
      sort?: 'relevance' | 'hot' | 'top' | 'new' | 'comments';
      timeRange?: 'hour' | 'day' | 'week' | 'month' | 'year' | 'all';
      limit?: number;
    } = {}
  ): Promise<RedditPost[]> {
    const { sort = 'relevance', timeRange = 'week', limit = 50 } = options;

    const params = new URLSearchParams({
      q: query,
      sort,
      limit: limit.toString(),
    });

    if (timeRange) {
      params.set('t', timeRange);
    }

    const searchPath = options.subreddit
      ? `/r/${options.subreddit}/search.json`
      : '/search.json';

    if (options.subreddit) {
      params.set('restrict_sr', 'true');
    }

    const url = `${this.baseURL}${searchPath}?${params}`;
    const response = await this.fetchWithRetry(url);
    const data: RedditListing = await response.json();

    return data.data.children.map(child => child.data as RedditPost);
  }

  /**
   * Get comments from a post
   */
  async getPostComments(
    subreddit: string,
    postId: string,
    options: {
      sort?: 'confidence' | 'top' | 'new' | 'controversial' | 'old';
      limit?: number;
    } = {}
  ): Promise<RedditComment[]> {
    const { sort = 'top', limit = 100 } = options;

    const params = new URLSearchParams({
      sort,
      limit: limit.toString(),
    });

    const url = `${this.baseURL}/r/${subreddit}/comments/${postId}.json?${params}`;
    const response = await this.fetchWithRetry(url);
    const data = await response.json();

    // Comments are in the second listing
    if (!data[1] || !data[1].data) return [];

    const comments: RedditComment[] = [];

    const extractComments = (listing: any): void => {
      if (!listing.data || !listing.data.children) return;

      listing.data.children.forEach((child: any) => {
        if (child.kind === 't1' && child.data) {
          comments.push(child.data as RedditComment);
          
          // Recursively get replies
          if (child.data.replies) {
            extractComments(child.data.replies);
          }
        }
      });
    };

    extractComments(data[1]);
    return comments;
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

    return posts.filter(post => {
      const text = `${post.title} ${post.selftext}`.toLowerCase();

      // Check if includes any keyword
      const hasKeyword = keywords.length === 0 || 
        keywords.some(keyword => text.includes(keyword.toLowerCase()));

      // Check if includes any excluded keyword
      const hasExcludedKeyword = excludeKeywords.length > 0 &&
        excludeKeywords.some(keyword => text.includes(keyword.toLowerCase()));

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
      post => post.score >= minUpvotes && post.num_comments >= minComments
    );
  }

  /**
   * Get posts with negative sentiment indicators
   */
  filterNegativeSentiment(posts: RedditPost[]): RedditPost[] {
    const negativeKeywords = [
      'problem', 'issue', 'frustrated', 'annoying', 'difficult',
      'struggle', 'hate', 'worst', 'terrible', 'awful', 'sucks',
      'wish', 'need', 'missing', 'lacking', 'pain', 'nightmare',
    ];

    return posts.filter(post => {
      const text = `${post.title} ${post.selftext}`.toLowerCase();
      return negativeKeywords.some(keyword => text.includes(keyword));
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

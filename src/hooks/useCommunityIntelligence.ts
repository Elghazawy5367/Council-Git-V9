/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Reddit & HackerNews Data Fetching Hooks
 * Mirrors: TanStack Query best practices
 * Provides caching, error handling for community intelligence
 * 
 * Usage:
 * const { data } = useRedditSearch('selfhosted', { sort: 'hot', limit: 25 });
 * const { data } = useHackerNewsSearch('alternative slack', { tags: ['ask_hn'] });
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { redditAPI, hackerNewsAPI } from '@/lib/api-client';
import { RedditPost, RedditListingSchema, HackerNewsSearchResponse, HackerNewsSearchResponseSchema, BuyingIntentSignal, validateData } from '@/lib/validation';

/**
 * Query keys
 */
export const redditKeys = {
  all: ['reddit'] as const,
  subreddit: (name: string, sort?: string) => [...redditKeys.all, 'subreddit', name, sort] as const,
  search: (query: string, filters?: Record<string, any>) => [...redditKeys.all, 'search', query, filters] as const,
  buyingIntent: (keywords: string[]) => [...redditKeys.all, 'buyingIntent', keywords] as const
};
export const hackerNewsKeys = {
  all: ['hackernews'] as const,
  search: (query: string, filters?: Record<string, any>) => [...hackerNewsKeys.all, 'search', query, filters] as const,
  askHN: (query?: string) => [...hackerNewsKeys.all, 'ask', query] as const,
  showHN: (query?: string) => [...hackerNewsKeys.all, 'show', query] as const,
  trending: () => [...hackerNewsKeys.all, 'trending'] as const
};

/**
 * Reddit Hooks
 */

export interface RedditSearchParams {
  subreddit?: string;
  query?: string;
  sort?: 'hot' | 'new' | 'top' | 'rising';
  time?: 'hour' | 'day' | 'week' | 'month' | 'year' | 'all';
  limit?: number;
  after?: string;
}
export function useRedditSearch(params: RedditSearchParams, options?: Omit<UseQueryOptions<RedditPost[]>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: redditKeys.search(JSON.stringify(params), params),
    queryFn: async () => {
      // Build endpoint
      const subreddit = params.subreddit || 'all';
      const sort = params.sort || 'hot';
      const endpoint = `/r/${subreddit}/${sort}.json`;

      // Build query params
      const queryParams: Record<string, string> = {
        limit: (params.limit || 25).toString()
      };
      if (params.time) queryParams.t = params.time;
      if (params.after) queryParams.after = params.after;
      if (params.query) queryParams.q = params.query;
      const data = await redditAPI.get<any>(endpoint, queryParams);
      const validated = validateData(RedditListingSchema, data, 'Reddit Listing');
      return validated.data.children.map((child) => child.data);
    },
    staleTime: 1000 * 60 * 5,
    // 5 minutes
    gcTime: 1000 * 60 * 15,
    // 15 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(2000 * 2 ** attemptIndex, 10000),
    ...options
  });
}

/**
 * Detect buying intent from Reddit
 */
export function useRedditBuyingIntent(targetKeywords: string[], subreddits: string[] = ['SaaS', 'Entrepreneur', 'startups', 'selfhosted'], options?: Omit<UseQueryOptions<BuyingIntentSignal[]>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: redditKeys.buyingIntent(targetKeywords),
    queryFn: async () => {
      const signals: BuyingIntentSignal[] = [];
      for (const subreddit of subreddits) {
        for (const keyword of targetKeywords) {
          try {
            const posts = await redditAPI.get<any>(`/r/${subreddit}/search.json`, {
              q: `alternative ${keyword}`,
              restrict_sr: 'true',
              sort: 'relevance',
              t: 'week',
              limit: 10
            });
            const validated = validateData(RedditListingSchema, posts);
            for (const child of validated.data.children) {
              const post = child.data;
              const signal = analyzeBuyingIntent(post, 'reddit');
              if (signal.score >= 5) {
                signals.push(signal);
              }
            }
          } catch (error) // eslint-disable-next-line no-empty
          {}}
      }
      return signals.sort((a, b) => b.score - a.score);
    },
    staleTime: 1000 * 60 * 30,
    // 30 minutes
    gcTime: 1000 * 60 * 60,
    // 1 hour
    retry: 1,
    ...options
  });
}

/**
 * HackerNews Hooks
 */

export interface HackerNewsSearchParams {
  query?: string;
  tags?: string[]; // 'ask_hn', 'show_hn', 'story', 'comment', 'poll', 'job'
  numericFilters?: string[]; // 'points>=50', 'num_comments>=10'
  page?: number;
  hitsPerPage?: number;
}
export function useHackerNewsSearch(params: HackerNewsSearchParams, options?: Omit<UseQueryOptions<HackerNewsSearchResponse>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: hackerNewsKeys.search(params.query || '', params),
    queryFn: async () => {
      const searchParams: Record<string, string> = {
        query: params.query || '',
        page: (params.page || 0).toString(),
        hitsPerPage: (params.hitsPerPage || 30).toString()
      };
      if (params.tags && params.tags.length > 0) {
        searchParams.tags = params.tags.join(',');
      }
      if (params.numericFilters && params.numericFilters.length > 0) {
        searchParams.numericFilters = params.numericFilters.join(',');
      }
      const data = await hackerNewsAPI.get<any>('/search', searchParams);
      return validateData(HackerNewsSearchResponseSchema, data, 'HackerNews Search');
    },
    staleTime: 1000 * 60 * 10,
    // 10 minutes
    gcTime: 1000 * 60 * 30,
    // 30 minutes
    retry: 3,
    ...options
  });
}

/**
 * Find Ask HN posts about alternatives
 */
export function useAskHNAlternatives(targetProducts: string[], options?: Omit<UseQueryOptions<BuyingIntentSignal[]>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: hackerNewsKeys.askHN(targetProducts.join(',')),
    queryFn: async () => {
      const signals: BuyingIntentSignal[] = [];
      const oneDayAgo = Math.floor(Date.now() / 1000) - 24 * 60 * 60;
      for (const product of targetProducts) {
        const queries = [`alternative ${product}`, `replace ${product}`, `better than ${product}`];
        for (const query of queries) {
          try {
            const data = await hackerNewsAPI.get<any>('/search', {
              query,
              tags: 'ask_hn',
              numericFilters: `points>=5,created_at_i>${oneDayAgo}`,
              hitsPerPage: 20
            });
            const validated = validateData(HackerNewsSearchResponseSchema, data);
            for (const hit of validated.hits) {
              const signal = analyzeBuyingIntent({
                id: hit.objectID,
                subreddit: 'hackernews',
                title: hit.title,
                selftext: hit.story_text || '',
                author: hit.author,
                score: hit.points,
                num_comments: hit.num_comments,
                created_utc: hit.created_at_i,
                permalink: `/item?id=${hit.objectID}`,
                url: `https://news.ycombinator.com/item?id=${hit.objectID}`
              }, 'hackernews');
              if (signal.score >= 5) {
                signals.push(signal);
              }
            }
          } catch (error) // eslint-disable-next-line no-empty
          {}}
      }
      return signals.sort((a, b) => b.engagement.velocity - a.engagement.velocity);
    },
    staleTime: 1000 * 60 * 15,
    // 15 minutes
    gcTime: 1000 * 60 * 60,
    // 1 hour
    retry: 2,
    ...options
  });
}

/**
 * Get trending Show HN posts
 */
export function useShowHNTrending(options?: Omit<UseQueryOptions<HackerNewsSearchResponse>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: hackerNewsKeys.showHN(),
    queryFn: async () => {
      const oneDayAgo = Math.floor(Date.now() / 1000) - 24 * 60 * 60;
      const data = await hackerNewsAPI.get<any>('/search', {
        tags: 'show_hn',
        numericFilters: `points>=50,created_at_i>${oneDayAgo}`,
        hitsPerPage: 50
      });
      return validateData(HackerNewsSearchResponseSchema, data);
    },
    staleTime: 1000 * 60 * 15,
    // 15 minutes
    gcTime: 1000 * 60 * 30,
    // 30 minutes
    retry: 2,
    ...options
  });
}

/**
 * Analyze post for buying intent signals
 */
function analyzeBuyingIntent(post: Partial<RedditPost>, source: 'reddit' | 'hackernews' | 'producthunt'): BuyingIntentSignal {
  const title = post.title || '';
  const body = post.selftext || '';
  const text = `${title} ${body}`.toLowerCase();

  // Detect pain keywords
  const painKeywords = ['slow', 'expensive', 'difficult', 'complex', 'broken', 'frustrated', 'hate', 'terrible', 'awful', 'sucks'].filter((keyword) => text.includes(keyword));

  // Detect urgency signals
  const urgencySignals = ['urgent', 'asap', 'immediately', 'now', 'today', 'need help', 'desperate', 'critical'].filter((signal) => text.includes(signal));

  // Detect price willingness
  const priceWillingnessMentioned = /\$\d+|pay|budget|willing to pay|price/i.test(text);

  // Detect alternative mentions
  const alternativeMentioned = /alternative|replace|instead of|better than/i.test(text);

  // Calculate frustration level (0-10)
  const frustrationLevel = Math.min(10, painKeywords.length * 2 + urgencySignals.length * 3 + (text.includes('!!!') ? 2 : 0));

  // Calculate engagement velocity
  const ageInHours = (Date.now() / 1000 - (post.created_utc || 0)) / 3600;
  const velocity = (post.num_comments || 0) / Math.max(ageInHours, 1);

  // Calculate buying intent score (0-10)
  let score = 0;
  if (alternativeMentioned) score += 3;
  if (painKeywords.length > 0) score += 2;
  if (priceWillingnessMentioned) score += 2;
  if (urgencySignals.length > 0) score += 2;
  if (post.num_comments && post.num_comments >= 10) score += 1;
  score = Math.min(10, score);
  return {
    postId: post.id || '',
    title: title,
    body: body,
    source,
    url: post.url || '',
    score,
    signals: {
      painKeywords,
      urgencySignals,
      priceWillingnessMentioned,
      alternativeMentioned,
      frustrationLevel
    },
    engagement: {
      upvotes: post.score || 0,
      comments: post.num_comments || 0,
      velocity: Math.round(velocity * 10) / 10,
      created: new Date((post.created_utc || 0) * 1000).toISOString()
    },
    analysis: generateAnalysis(score, {
      painKeywords,
      urgencySignals,
      priceWillingnessMentioned,
      alternativeMentioned,
      frustrationLevel
    })
  };
}
function generateAnalysis(score: number, signals: {
  painKeywords: string[];
  urgencySignals: string[];
  priceWillingnessMentioned: boolean;
  alternativeMentioned: boolean;
  frustrationLevel: number;
}): string {
  const parts: string[] = [];
  if (score >= 8) {
    parts.push('🔥 HIGH buying intent');
  } else if (score >= 5) {
    parts.push('⭐ MEDIUM buying intent');
  } else {
    parts.push('💡 LOW buying intent');
  }
  if (signals.alternativeMentioned) {
    parts.push('actively seeking alternatives');
  }
  if (signals.priceWillingnessMentioned) {
    parts.push('willing to pay');
  }
  if (signals.frustrationLevel >= 5) {
    parts.push(`high frustration (${signals.frustrationLevel}/10)`);
  }
  if (signals.painKeywords.length > 0) {
    parts.push(`pain points: ${signals.painKeywords.slice(0, 3).join(', ')}`);
  }
  return parts.join(' • ');
}
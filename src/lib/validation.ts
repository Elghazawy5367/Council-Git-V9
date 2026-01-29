/**
 * Global Type Definitions with Zod Validation
 * Mirrors: Zod + TypeScript best practices
 * Provides type safety and runtime validation
 * 
 * Usage:
 * import { GitHubRepoSchema, validateData } from '@/lib/validation';
 * const repo = validateData(GitHubRepoSchema, apiResponse);
 */

import { z } from 'zod';
import { ValidationError } from './error-handler';

/**
 * GitHub Repository Schema
 */
export const GitHubRepoSchema = z.object({
  id: z.number(),
  name: z.string(),
  full_name: z.string(),
  owner: z.object({
    login: z.string(),
    id: z.number(),
    avatar_url: z.string().url(),
    type: z.string()
  }),
  description: z.string().nullable(),
  html_url: z.string().url(),
  homepage: z.string().url().nullable().optional(),
  stargazers_count: z.number(),
  watchers_count: z.number(),
  forks_count: z.number(),
  open_issues_count: z.number(),
  language: z.string().nullable(),
  topics: z.array(z.string()).optional(),
  created_at: z.string(),
  updated_at: z.string(),
  pushed_at: z.string(),
  size: z.number(),
  default_branch: z.string(),
  archived: z.boolean().optional(),
  disabled: z.boolean().optional(),
  has_issues: z.boolean().optional(),
  has_wiki: z.boolean().optional(),
  license: z.object({
    key: z.string(),
    name: z.string(),
    spdx_id: z.string()
  }).nullable().optional()
});
export type GitHubRepo = z.infer<typeof GitHubRepoSchema>;

/**
 * GitHub Search Response Schema
 */
export const GitHubSearchResponseSchema = z.object({
  total_count: z.number(),
  incomplete_results: z.boolean(),
  items: z.array(GitHubRepoSchema)
});
export type GitHubSearchResponse = z.infer<typeof GitHubSearchResponseSchema>;

/**
 * Blue Ocean Opportunity Schema
 */
export const BlueOceanOpportunitySchema = z.object({
  repo: GitHubRepoSchema,
  score: z.number().min(0).max(100),
  signals: z.object({
    isAbandoned: z.boolean(),
    hasProvenDemand: z.boolean(),
    lowCompetition: z.boolean(),
    hasIssues: z.boolean(),
    lastUpdateDays: z.number(),
    starToForkRatio: z.number()
  }),
  reasoning: z.string(),
  actionableInsights: z.array(z.string())
});
export type BlueOceanOpportunity = z.infer<typeof BlueOceanOpportunitySchema>;

/**
 * Reddit Post Schema
 */
export const RedditPostSchema = z.object({
  id: z.string(),
  subreddit: z.string(),
  title: z.string(),
  selftext: z.string().optional(),
  author: z.string(),
  score: z.number(),
  num_comments: z.number(),
  created_utc: z.number(),
  permalink: z.string(),
  url: z.string().url(),
  upvote_ratio: z.number().optional(),
  link_flair_text: z.string().nullable().optional(),
  over_18: z.boolean().optional()
});
export type RedditPost = z.infer<typeof RedditPostSchema>;

/**
 * Reddit API Response Schema
 */
export const RedditListingSchema = z.object({
  kind: z.literal('Listing'),
  data: z.object({
    after: z.string().nullable(),
    before: z.string().nullable(),
    children: z.array(z.object({
      kind: z.string(),
      data: RedditPostSchema
    })),
    dist: z.number().optional(),
    modhash: z.string().optional()
  })
});
export type RedditListing = z.infer<typeof RedditListingSchema>;

/**
 * Buying Intent Signal Schema
 */
export const BuyingIntentSignalSchema = z.object({
  postId: z.string(),
  title: z.string(),
  body: z.string(),
  source: z.enum(['reddit', 'hackernews', 'producthunt']),
  url: z.string().url(),
  score: z.number().min(0).max(10),
  signals: z.object({
    painKeywords: z.array(z.string()),
    urgencySignals: z.array(z.string()),
    priceWillingnessMentioned: z.boolean(),
    alternativeMentioned: z.boolean(),
    frustrationLevel: z.number().min(0).max(10)
  }),
  engagement: z.object({
    upvotes: z.number(),
    comments: z.number(),
    velocity: z.number(),
    // comments per hour
    created: z.string()
  }),
  analysis: z.string()
});
export type BuyingIntentSignal = z.infer<typeof BuyingIntentSignalSchema>;

/**
 * GitHub User Schema (for Stargazer Analysis)
 */
export const GitHubUserSchema = z.object({
  login: z.string(),
  id: z.number(),
  avatar_url: z.string().url(),
  html_url: z.string().url(),
  type: z.enum(['User', 'Organization']),
  name: z.string().nullable().optional(),
  company: z.string().nullable().optional(),
  blog: z.string().optional(),
  location: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  public_repos: z.number().optional(),
  public_gists: z.number().optional(),
  followers: z.number().optional(),
  following: z.number().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional()
});
export type GitHubUser = z.infer<typeof GitHubUserSchema>;

/**
 * Stargazer Quality Analysis Schema
 */
export const StargazerQualitySchema = z.object({
  repoFullName: z.string(),
  totalStargazers: z.number(),
  analyzed: z.number(),
  qualityScore: z.number().min(0).max(100),
  verdict: z.enum(['INSTITUTIONAL_BACKING', 'COMMUNITY_VALIDATED', 'UNVALIDATED']),
  notableBackers: z.array(z.object({
    login: z.string(),
    type: z.enum(['influencer', 'organization', 'big_tech']),
    detail: z.string(),
    scoreContribution: z.number()
  })),
  companyBackers: z.array(z.string()),
  influencerCount: z.number(),
  organizationCount: z.number(),
  bigTechCount: z.number(),
  analysis: z.object({
    institutionalStrength: z.enum(['strong', 'moderate', 'weak']),
    communityTrust: z.enum(['high', 'medium', 'low']),
    recommendation: z.string()
  })
});
export type StargazerQuality = z.infer<typeof StargazerQualitySchema>;

/**
 * HackerNews Item Schema (Algolia API)
 */
export const HackerNewsItemSchema = z.object({
  objectID: z.string(),
  title: z.string(),
  url: z.string().url().nullable().optional(),
  author: z.string(),
  points: z.number(),
  story_text: z.string().nullable().optional(),
  comment_text: z.string().nullable().optional(),
  num_comments: z.number(),
  created_at: z.string(),
  created_at_i: z.number(),
  _tags: z.array(z.string())
});
export type HackerNewsItem = z.infer<typeof HackerNewsItemSchema>;

/**
 * HackerNews Search Response Schema
 */
export const HackerNewsSearchResponseSchema = z.object({
  hits: z.array(HackerNewsItemSchema),
  nbHits: z.number(),
  page: z.number(),
  nbPages: z.number(),
  hitsPerPage: z.number(),
  processingTimeMS: z.number(),
  query: z.string(),
  params: z.string()
});
export type HackerNewsSearchResponse = z.infer<typeof HackerNewsSearchResponseSchema>;

/**
 * ProductHunt Post Schema
 */
export const ProductHuntPostSchema = z.object({
  id: z.string(),
  name: z.string(),
  tagline: z.string(),
  description: z.string().optional(),
  votesCount: z.number(),
  commentsCount: z.number(),
  url: z.string().url(),
  website: z.string().url().optional(),
  createdAt: z.string(),
  featuredAt: z.string().optional(),
  topics: z.array(z.object({
    name: z.string()
  })).optional(),
  user: z.object({
    username: z.string(),
    headline: z.string().optional()
  }).optional()
});
export type ProductHuntPost = z.infer<typeof ProductHuntPostSchema>;

/**
 * Expert Configuration Schema (Council-specific)
 */
export const ExpertConfigSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  persona: z.string(),
  model: z.string(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().positive().optional(),
  hasWebSearch: z.boolean().optional(),
  modeBehavior: z.object({
    modeName: z.string(),
    description: z.string(),
    isEnabled: z.boolean(),
    separated: z.string().optional(),
    synthesis: z.string().optional(),
    debate: z.string().optional(),
    pipeline: z.string().optional()
  }).optional()
});
export type ExpertConfig = z.infer<typeof ExpertConfigSchema>;

/**
 * Synthesis Configuration Schema
 */
export const SynthesisConfigSchema = z.object({
  tier: z.enum(['quick', 'balanced', 'deep']),
  model: z.string().optional(),
  fallbackModel: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().positive().optional(),
  customInstructions: z.string().optional(),
  options: z.record(z.unknown()).optional()
});
export type SynthesisConfig = z.infer<typeof SynthesisConfigSchema>;

/**
 * Scout Analysis Result Schema
 */
export const ScoutAnalysisSchema = z.object({
  niche: z.string(),
  totalRepos: z.number(),
  opportunities: z.array(BlueOceanOpportunitySchema),
  summary: z.object({
    highPotential: z.number(),
    mediumPotential: z.number(),
    lowPotential: z.number(),
    avgScore: z.number()
  }),
  timestamp: z.string(),
  filters: z.object({
    minStars: z.number().optional(),
    maxForks: z.number().optional(),
    daysAbandoned: z.number().optional()
  }).optional()
});
export type ScoutAnalysis = z.infer<typeof ScoutAnalysisSchema>;

/**
 * Validation helper functions
 */

/**
 * Validate data against a Zod schema
 * Throws ValidationError if validation fails
 */
export const validateData = <T,>(schema: z.ZodSchema<T>, data: unknown, context?: string): T => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
      throw new ValidationError(`Validation failed${context ? ` for ${context}` : ''}: ${errorMessages}`, error.errors[0]?.path.join('.'), data);
    }
    throw error;
  }
};

/**
 * Safely validate data, return null on failure
 */
export const safeValidate = <T,>(schema: z.ZodSchema<T>, data: unknown): T | null => {
  const result = schema.safeParse(data);
  return result.success ? result.data : null;
};

/**
 * Validate array of data
 */
export const validateArray = <T,>(schema: z.ZodSchema<T>, data: unknown[], context?: string): T[] => {
  return data.map((item, index) => {
    try {
      return validateData(schema, item, context ? `${context}[${index}]` : `item[${index}]`);
    } catch (error) {
      return null;
    }
  }).filter((item): item is T => item !== null);
};

/**
 * Partial validation - allows missing fields
 * Note: Only works with z.ZodObject schemas
 */
export const validatePartial = <T extends z.ZodRawShape,>(schema: z.ZodObject<T>, data: unknown, context?: string): Partial<z.infer<z.ZodObject<T>>> => {
  const partialSchema = schema.partial();
  return validateData(partialSchema, data, context);
};

/**
 * Validate and transform data
 */
export const validateAndTransform = <T, R>(schema: z.ZodSchema<T>, data: unknown, transform: (validated: T) => R, context?: string): R => {
  const validated = validateData(schema, data, context);
  return transform(validated);
};
/**
 * Professional GitHub API Service with @octokit/rest
 * 
 * Features:
 * - Type-safe API with @octokit/rest
 * - Comprehensive error handling
 * - Rate limit monitoring and graceful handling
 * - Caching strategy with TTL
 * - Retry logic for transient failures
 * - Support for repositories, issues, PRs, commits
 * 
 * @example
 * ```typescript
 * const github = new GitHubAPIService(token);
 * const repos = await github.getTrendingRepositories('javascript');
 * const rateLimit = await github.getRateLimitStatus();
 * ```
 */

import { Octokit } from '@octokit/rest';
import type { RestEndpointMethodTypes } from '@octokit/rest';

// ============================================================================
// CUSTOM ERROR CLASSES
// ============================================================================

export class GitHubAPIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: unknown
  ) {
    super(message);
    this.name = 'GitHubAPIError';
  }
}

export class RateLimitError extends GitHubAPIError {
  constructor(
    message: string,
    public resetAt: Date,
    public limit: number,
    public remaining: number
  ) {
    super(message, 429);
    this.name = 'RateLimitError';
  }
}

export class AuthenticationError extends GitHubAPIError {
  constructor(message: string) {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

export class NotFoundError extends GitHubAPIError {
  constructor(message: string) {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

// ============================================================================
// TYPESCRIPT TYPES
// ============================================================================

export type Repository = RestEndpointMethodTypes['repos']['get']['response']['data'];
export type Issue = RestEndpointMethodTypes['issues']['get']['response']['data'];
export type PullRequest = RestEndpointMethodTypes['pulls']['get']['response']['data'];
export type Commit = RestEndpointMethodTypes['repos']['getCommit']['response']['data'];
export type SearchRepositoriesResponse = RestEndpointMethodTypes['search']['repos']['response']['data'];
export type SearchIssuesResponse = RestEndpointMethodTypes['search']['issuesAndPullRequests']['response']['data'];
export type RateLimit = RestEndpointMethodTypes['rateLimit']['get']['response']['data'];

export interface CachedData<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

export interface GitHubAPIConfig {
  token?: string;
  baseUrl?: string;
  cacheTTL?: number; // Default cache TTL in milliseconds
  maxRetries?: number;
  retryDelay?: number; // Initial retry delay in milliseconds
}

export interface RateLimitStatus {
  limit: number;
  remaining: number;
  reset: Date;
  percentageUsed: number;
  isNearLimit: boolean; // < 10% remaining
}

export interface SearchOptions {
  sort?: 'stars' | 'forks' | 'help-wanted-issues' | 'updated';
  order?: 'asc' | 'desc';
  perPage?: number;
  page?: number;
}

export interface IssueSearchOptions extends SearchOptions {
  state?: 'open' | 'closed' | 'all';
  labels?: string[];
  since?: Date;
}

// ============================================================================
// MAIN SERVICE CLASS
// ============================================================================

export class GitHubAPIService {
  private octokit: Octokit;
  private cache: Map<string, CachedData<unknown>> = new Map();
  private config: Required<GitHubAPIConfig>;

  constructor(config: GitHubAPIConfig = {}) {
    this.config = {
      token: config.token || process.env.GITHUB_TOKEN || '',
      baseUrl: config.baseUrl || 'https://api.github.com',
      cacheTTL: config.cacheTTL || 5 * 60 * 1000, // 5 minutes default
      maxRetries: config.maxRetries || 3,
      retryDelay: config.retryDelay || 1000,
    };

    this.octokit = new Octokit({
      auth: this.config.token,
      baseUrl: this.config.baseUrl,
      log: {
        debug: () => {},
        info: () => {},
        warn: console.warn,
        error: console.error,
      },
    });
  }

  // ==========================================================================
  // RATE LIMIT MONITORING
  // ==========================================================================

  /**
   * Get current rate limit status
   */
  async getRateLimitStatus(): Promise<RateLimitStatus> {
    try {
      const { data } = await this.octokit.rateLimit.get();
      const core = data.resources.core;

      const percentageUsed = ((core.limit - core.remaining) / core.limit) * 100;
      const reset = new Date(core.reset * 1000);

      return {
        limit: core.limit,
        remaining: core.remaining,
        reset,
        percentageUsed,
        isNearLimit: percentageUsed > 90,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Check rate limit and wait if necessary
   */
  private async checkRateLimit(): Promise<void> {
    const status = await this.getRateLimitStatus();

    if (status.remaining === 0) {
      const waitTime = status.reset.getTime() - Date.now();
      throw new RateLimitError(
        `Rate limit exceeded. Reset at ${status.reset.toISOString()}`,
        status.reset,
        status.limit,
        status.remaining
      );
    }

    if (status.isNearLimit) {
      console.warn(
        `GitHub API rate limit is low: ${status.remaining}/${status.limit} remaining`
      );
    }
  }

  // ==========================================================================
  // CACHING LAYER
  // ==========================================================================

  /**
   * Get data from cache or fetch if expired
   */
  private async getCached<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number = this.config.cacheTTL
  ): Promise<T> {
    const cached = this.cache.get(key) as CachedData<T> | undefined;

    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }

    const data = await fetcher();
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });

    return data;
  }

  /**
   * Clear cache for a specific key or all cache
   */
  clearCache(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }

  // ==========================================================================
  // ERROR HANDLING
  // ==========================================================================

  /**
   * Handle and transform Octokit errors
   */
  private handleError(error: unknown): Error {
    if (error instanceof Error) {
      const octokitError = error as any;

      // Rate limit error
      if (octokitError.status === 403 && octokitError.response?.headers?.['x-ratelimit-remaining'] === '0') {
        const resetTimestamp = octokitError.response?.headers?.['x-ratelimit-reset'];
        const resetDate = resetTimestamp ? new Date(parseInt(resetTimestamp) * 1000) : new Date();
        
        return new RateLimitError(
          'GitHub API rate limit exceeded',
          resetDate,
          parseInt(octokitError.response?.headers?.['x-ratelimit-limit'] || '0'),
          0
        );
      }

      // Authentication error
      if (octokitError.status === 401) {
        return new AuthenticationError('GitHub authentication failed. Check your token.');
      }

      // Not found error
      if (octokitError.status === 404) {
        return new NotFoundError(octokitError.message || 'Resource not found');
      }

      // Generic API error
      return new GitHubAPIError(
        octokitError.message || 'GitHub API request failed',
        octokitError.status,
        octokitError.response
      );
    }

    return new GitHubAPIError('Unknown error occurred');
  }

  /**
   * Retry wrapper for API calls
   */
  private async retry<T>(
    operation: () => Promise<T>,
    retries: number = this.config.maxRetries
  ): Promise<T> {
    let lastError: Error | undefined;

    for (let i = 0; i < retries; i++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        // Don't retry on authentication or not found errors
        if (lastError instanceof AuthenticationError || lastError instanceof NotFoundError) {
          throw lastError;
        }

        // Don't retry on rate limit errors (let caller handle)
        if (lastError instanceof RateLimitError) {
          throw lastError;
        }

        // Wait before retrying with exponential backoff
        if (i < retries - 1) {
          const delay = this.config.retryDelay * Math.pow(2, i);
          await this.sleep(delay);
        }
      }
    }

    throw lastError;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ==========================================================================
  // REPOSITORY METHODS
  // ==========================================================================

  /**
   * Search repositories
   */
  async searchRepositories(
    query: string,
    options: SearchOptions = {}
  ): Promise<SearchRepositoriesResponse> {
    await this.checkRateLimit();

    const cacheKey = `search:repos:${query}:${JSON.stringify(options)}`;

    return this.getCached(cacheKey, async () => {
      try {
        const { data } = await this.retry(() =>
          this.octokit.search.repos({
            q: query,
            sort: options.sort,
            order: options.order,
            per_page: options.perPage || 30,
            page: options.page || 1,
          })
        );

        return data;
      } catch (error) {
        throw this.handleError(error);
      }
    });
  }

  /**
   * Get a repository by owner and name
   */
  async getRepository(owner: string, repo: string): Promise<Repository> {
    await this.checkRateLimit();

    const cacheKey = `repo:${owner}/${repo}`;

    return this.getCached(cacheKey, async () => {
      try {
        const { data } = await this.retry(() =>
          this.octokit.repos.get({ owner, repo })
        );

        return data;
      } catch (error) {
        throw this.handleError(error);
      }
    });
  }

  /**
   * Get trending repositories (using search with recent activity)
   */
  async getTrendingRepositories(
    language?: string,
    since: 'day' | 'week' | 'month' = 'week'
  ): Promise<Repository[]> {
    const dateMap = {
      day: 1,
      week: 7,
      month: 30,
    };

    const date = new Date();
    date.setDate(date.getDate() - dateMap[since]);
    const dateString = date.toISOString().split('T')[0];

    const languageQuery = language ? ` language:${language}` : '';
    const query = `created:>${dateString}${languageQuery} stars:>10`;

    const result = await this.searchRepositories(query, {
      sort: 'stars',
      order: 'desc',
      perPage: 30,
    });

    return result.items;
  }

  // ==========================================================================
  // ISSUE METHODS
  // ==========================================================================

  /**
   * Get repository issues
   */
  async getRepositoryIssues(
    owner: string,
    repo: string,
    options: IssueSearchOptions = {}
  ): Promise<Issue[]> {
    await this.checkRateLimit();

    const cacheKey = `issues:${owner}/${repo}:${JSON.stringify(options)}`;

    return this.getCached(cacheKey, async () => {
      try {
        const { data } = await this.retry(() =>
          this.octokit.issues.listForRepo({
            owner,
            repo,
            state: options.state || 'open',
            sort: options.sort as any,
            direction: options.order === 'asc' ? 'asc' : 'desc',
            per_page: options.perPage || 30,
            page: options.page || 1,
            since: options.since?.toISOString(),
            labels: options.labels?.join(','),
          })
        );

        return data as Issue[];
      } catch (error) {
        throw this.handleError(error);
      }
    });
  }

  /**
   * Get a specific issue
   */
  async getIssue(owner: string, repo: string, issueNumber: number): Promise<Issue> {
    await this.checkRateLimit();

    const cacheKey = `issue:${owner}/${repo}:${issueNumber}`;

    return this.getCached(cacheKey, async () => {
      try {
        const { data } = await this.retry(() =>
          this.octokit.issues.get({ owner, repo, issue_number: issueNumber })
        );

        return data;
      } catch (error) {
        throw this.handleError(error);
      }
    });
  }

  /**
   * Search issues across GitHub
   */
  async searchIssues(
    query: string,
    options: SearchOptions = {}
  ): Promise<SearchIssuesResponse> {
    await this.checkRateLimit();

    const cacheKey = `search:issues:${query}:${JSON.stringify(options)}`;

    return this.getCached(cacheKey, async () => {
      try {
        const { data } = await this.retry(() =>
          this.octokit.search.issuesAndPullRequests({
            q: query,
            sort: options.sort as any,
            order: options.order,
            per_page: options.perPage || 30,
            page: options.page || 1,
          })
        );

        return data;
      } catch (error) {
        throw this.handleError(error);
      }
    });
  }

  // ==========================================================================
  // PULL REQUEST METHODS
  // ==========================================================================

  /**
   * Get repository pull requests
   */
  async getRepositoryPullRequests(
    owner: string,
    repo: string,
    options: IssueSearchOptions = {}
  ): Promise<PullRequest[]> {
    await this.checkRateLimit();

    const cacheKey = `prs:${owner}/${repo}:${JSON.stringify(options)}`;

    return this.getCached(cacheKey, async () => {
      try {
        const { data } = await this.retry(() =>
          this.octokit.pulls.list({
            owner,
            repo,
            state: options.state || 'open',
            sort: options.sort as any,
            direction: options.order === 'asc' ? 'asc' : 'desc',
            per_page: options.perPage || 30,
            page: options.page || 1,
          })
        );

        return data as PullRequest[];
      } catch (error) {
        throw this.handleError(error);
      }
    });
  }

  /**
   * Get a specific pull request
   */
  async getPullRequest(
    owner: string,
    repo: string,
    pullNumber: number
  ): Promise<PullRequest> {
    await this.checkRateLimit();

    const cacheKey = `pr:${owner}/${repo}:${pullNumber}`;

    return this.getCached(cacheKey, async () => {
      try {
        const { data } = await this.retry(() =>
          this.octokit.pulls.get({ owner, repo, pull_number: pullNumber })
        );

        return data;
      } catch (error) {
        throw this.handleError(error);
      }
    });
  }

  /**
   * Get recent pull requests across repositories
   */
  async getRecentPullRequests(
    query: string = 'is:pr is:open',
    days: number = 7
  ): Promise<PullRequest[]> {
    const date = new Date();
    date.setDate(date.getDate() - days);
    const dateString = date.toISOString().split('T')[0];

    const fullQuery = `${query} created:>${dateString}`;
    const result = await this.searchIssues(fullQuery, {
      sort: 'updated',
      order: 'desc',
      perPage: 30,
    });

    return result.items as unknown as PullRequest[];
  }

  // ==========================================================================
  // COMMIT METHODS
  // ==========================================================================

  /**
   * Get repository commits
   */
  async getRepositoryCommits(
    owner: string,
    repo: string,
    options: {
      sha?: string;
      path?: string;
      author?: string;
      since?: Date;
      until?: Date;
      perPage?: number;
      page?: number;
    } = {}
  ): Promise<Commit[]> {
    await this.checkRateLimit();

    const cacheKey = `commits:${owner}/${repo}:${JSON.stringify(options)}`;

    return this.getCached(cacheKey, async () => {
      try {
        const { data } = await this.retry(() =>
          this.octokit.repos.listCommits({
            owner,
            repo,
            sha: options.sha,
            path: options.path,
            author: options.author,
            since: options.since?.toISOString(),
            until: options.until?.toISOString(),
            per_page: options.perPage || 30,
            page: options.page || 1,
          })
        );

        return data as Commit[];
      } catch (error) {
        throw this.handleError(error);
      }
    });
  }

  /**
   * Get a specific commit
   */
  async getCommit(owner: string, repo: string, ref: string): Promise<Commit> {
    await this.checkRateLimit();

    const cacheKey = `commit:${owner}/${repo}:${ref}`;

    return this.getCached(cacheKey, async () => {
      try {
        const { data } = await this.retry(() =>
          this.octokit.repos.getCommit({ owner, repo, ref })
        );

        return data;
      } catch (error) {
        throw this.handleError(error);
      }
    });
  }

  // ==========================================================================
  // UTILITY METHODS
  // ==========================================================================

  /**
   * Get file content from repository
   */
  async getFileContent(
    owner: string,
    repo: string,
    path: string,
    ref: string = 'main'
  ): Promise<string> {
    await this.checkRateLimit();

    const cacheKey = `file:${owner}/${repo}:${ref}:${path}`;

    return this.getCached(cacheKey, async () => {
      try {
        const { data } = await this.retry(() =>
          this.octokit.repos.getContent({
            owner,
            repo,
            path,
            ref,
          })
        );

        if (!('content' in data) || Array.isArray(data)) {
          throw new GitHubAPIError('Path is not a file');
        }

        // Decode base64 content
        return Buffer.from(data.content, 'base64').toString('utf-8');
      } catch (error) {
        throw this.handleError(error);
      }
    });
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

let githubAPIInstance: GitHubAPIService | null = null;

export function getGitHubAPI(config?: GitHubAPIConfig): GitHubAPIService {
  if (!githubAPIInstance || config) {
    githubAPIInstance = new GitHubAPIService(config);
  }
  return githubAPIInstance;
}

/**
 * Default export for convenience
 */
export default GitHubAPIService;

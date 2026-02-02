/**
 * GitHub Service - Octokit-based API Wrapper
 * 
 * Handles all GitHub API interactions for the Scout system.
 * Extracted from scout.ts to separate concerns:
 * - API calls and rate limiting (this file)
 * - Analysis algorithms (scout.ts)
 */

import type { GitHubRawRepo, ScoutIssue } from '@/lib/types';

interface GitHubSearchOptions {
  sort?: 'stars' | 'forks' | 'updated';
  order?: 'asc' | 'desc';
  perPage?: number;
  page?: number;
}

interface GitHubIssueOptions {
  state?: 'open' | 'closed' | 'all';
  sort?: 'created' | 'updated' | 'comments';
  direction?: 'asc' | 'desc';
  perPage?: number;
  page?: number;
}

/**
 * GitHub Service Class
 * Wraps GitHub API v3 (REST API) with rate limiting and error handling
 */
export class GitHubService {
  private baseURL = 'https://api.github.com';
  private token?: string;

  constructor(token?: string) {
    this.token = token || process.env.GITHUB_TOKEN;
  }

  /**
   * Make authenticated request to GitHub API with retry logic
   */
  private async fetchWithRetry(
    url: string,
    options: RequestInit = {},
    retries = 3
  ): Promise<Response> {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, { ...options, headers });

        // Handle rate limiting
        if (response.status === 403 && response.headers.get('X-RateLimit-Remaining') === '0') {
          const resetTime = response.headers.get('X-RateLimit-Reset');
          if (resetTime && i < retries - 1) {
            const waitTime = parseInt(resetTime) * 1000 - Date.now();
            if (waitTime > 0 && waitTime < 300000) { // Wait max 5 minutes
              await this.sleep(waitTime);
              continue;
            }
          }
        }

        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
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
   * Search repositories by query
   */
  async searchRepositories(
    query: string,
    options: GitHubSearchOptions = {}
  ): Promise<{ items: GitHubRawRepo[]; total_count: number }> {
    const params = new URLSearchParams({
      q: query,
      sort: options.sort || 'stars',
      order: options.order || 'desc',
      per_page: (options.perPage || 30).toString(),
      page: (options.page || 1).toString(),
    });

    const response = await this.fetchWithRetry(
      `${this.baseURL}/search/repositories?${params}`
    );

    const data = await response.json();
    return {
      items: data.items || [],
      total_count: data.total_count || 0,
    };
  }

  /**
   * Get repository issues
   */
  async getRepositoryIssues(
    fullName: string,
    options: GitHubIssueOptions = {}
  ): Promise<ScoutIssue[]> {
    const params = new URLSearchParams({
      state: options.state || 'all',
      sort: options.sort || 'comments',
      direction: options.direction || 'desc',
      per_page: (options.perPage || 20).toString(),
      page: (options.page || 1).toString(),
    });

    const response = await this.fetchWithRetry(
      `${this.baseURL}/repos/${fullName}/issues?${params}`
    );

    return response.json();
  }

  /**
   * Get repository by full name
   */
  async getRepository(fullName: string): Promise<GitHubRawRepo> {
    const response = await this.fetchWithRetry(
      `${this.baseURL}/repos/${fullName}`
    );

    return response.json();
  }

  /**
   * Get rate limit information
   */
  async getRateLimit(): Promise<{
    limit: number;
    remaining: number;
    reset: Date;
  }> {
    const response = await this.fetchWithRetry(`${this.baseURL}/rate_limit`);
    const data = await response.json();

    return {
      limit: data.rate.limit,
      remaining: data.rate.remaining,
      reset: new Date(data.rate.reset * 1000),
    };
  }

  /**
   * Get file content from repository
   */
  async getFileContent(
    owner: string,
    repo: string,
    path: string,
    branch = 'main'
  ): Promise<string> {
    const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`File not found: ${path}`);
      }
      return await response.text();
    } catch (error) {
      console.error('File retrieval failed:', error);
      throw error;
    }
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
let githubServiceInstance: GitHubService | null = null;

export function getGitHubService(token?: string): GitHubService {
  if (!githubServiceInstance || (token && githubServiceInstance['token'] !== token)) {
    githubServiceInstance = new GitHubService(token);
  }
  return githubServiceInstance;
}

/**
 * Default export for convenience
 */
export const githubService = new GitHubService();

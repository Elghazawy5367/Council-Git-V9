/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * GitHub API Client for Features Automation
 * Handles API calls to GitHub for trending repos, issues, etc.
 */

import { GITHUB_OWNER, GITHUB_REPO } from '@/lib/config';

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  watchers_count: number;
  language: string | null;
  topics: string[];
  created_at: string;
  updated_at: string;
  pushed_at: string;
  homepage: string | null;
  html_url: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

interface SearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubRepo[];
}

export class GitHubAPIClient {
  private baseURL = 'https://api.github.com';
  private apiKey?: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey;
  }

  private async fetchWithRetry(
    url: string,
    options: RequestInit = {},
    retries = 3
  ): Promise<Response> {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, { ...options, headers });
        
        if (response.status === 403 && response.headers.get('X-RateLimit-Remaining') === '0') {
          const resetTime = response.headers.get('X-RateLimit-Reset');
          if (resetTime && i < retries - 1) {
            const waitTime = parseInt(resetTime) * 1000 - Date.now();
            if (waitTime > 0 && waitTime < 60000) { // Wait max 1 minute
              await new Promise(resolve => setTimeout(resolve, waitTime));
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
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
      }
    }

    throw new Error('Max retries exceeded');
  }

  /**
   * Search repositories by query
   */
  async searchRepositories(
    query: string,
    options: {
      sort?: 'stars' | 'forks' | 'updated';
      order?: 'asc' | 'desc';
      perPage?: number;
      page?: number;
    } = {}
  ): Promise<SearchResponse> {
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

    return response.json();
  }

  /**
   * Get trending repositories
   */
  async getTrendingRepositories(options: {
    language?: string;
    since?: 'daily' | 'weekly' | 'monthly';
    topics?: string[];
    minStars?: number;
    maxResults?: number;
  } = {}): Promise<GitHubRepo[]> {
    const { topics = [], minStars = 100, maxResults = 50 } = options;

    // Build search query
    const queryParts: string[] = [];
    
    if (minStars) {
      queryParts.push(`stars:>${minStars}`);
    }

    if (options.language) {
      queryParts.push(`language:${options.language}`);
    }

    topics.forEach(topic => {
      queryParts.push(`topic:${topic}`);
    });

    // Date range based on "since"
    const since = options.since || 'weekly';
    const daysAgo = since === 'daily' ? 1 : since === 'weekly' ? 7 : 30;
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    queryParts.push(`created:>${date.toISOString().split('T')[0]}`);

    const query = queryParts.join(' ');

    const response = await this.searchRepositories(query, {
      sort: 'stars',
      order: 'desc',
      perPage: Math.min(maxResults, 100),
    });

    return response.items;
  }

  /**
   * Get repository by full name (owner/repo)
   */
  async getRepository(fullName: string): Promise<GitHubRepo> {
    const response = await this.fetchWithRetry(
      `${this.baseURL}/repos/${fullName}`
    );

    return response.json();
  }

  /**
   * Search repositories by topics
   */
  async searchByTopics(
    topics: string[],
    options: {
      languages?: string[];
      minStars?: number;
      maxResults?: number;
    } = {}
  ): Promise<GitHubRepo[]> {
    const queryParts: string[] = topics.map(topic => `topic:${topic}`);

    if (options.languages && options.languages.length > 0) {
      queryParts.push(`language:${options.languages.join(' OR language:')}`);
    }

    if (options.minStars) {
      queryParts.push(`stars:>=${options.minStars}`);
    }

    // Sort by recently updated
    queryParts.push('sort:updated');

    const query = queryParts.join(' ');

    const response = await this.searchRepositories(query, {
      sort: 'stars',
      order: 'desc',
      perPage: options.maxResults || 50,
    });

    return response.items;
  }

  /**
   * Get repository issues
   */
  async getRepositoryIssues(
    fullName: string,
    options: {
      state?: 'open' | 'closed' | 'all';
      labels?: string[];
      perPage?: number;
    } = {}
  ): Promise<any[]> {
    const params = new URLSearchParams({
      state: options.state || 'open',
      per_page: (options.perPage || 30).toString(),
    });

    if (options.labels && options.labels.length > 0) {
      params.set('labels', options.labels.join(','));
    }

    const response = await this.fetchWithRetry(
      `${this.baseURL}/repos/${fullName}/issues?${params}`
    );

    return response.json();
  }

  /**
   * Search issues across GitHub
   */
  async searchIssues(query: string, perPage = 30): Promise<any[]> {
    const params = new URLSearchParams({
      q: query,
      per_page: perPage.toString(),
    });

    const response = await this.fetchWithRetry(
      `${this.baseURL}/search/issues?${params}`
    );

    const data = await response.json();
    return data.items;
  }

  /**
   * Get trending topics
   */
  async getTrendingTopics(limit = 20): Promise<string[]> {
    // Get popular repos and extract their topics
    const repos = await this.getTrendingRepositories({
      minStars: 500,
      maxResults: 100,
    });

    const topicCounts = new Map<string, number>();

    repos.forEach(repo => {
      repo.topics.forEach(topic => {
        topicCounts.set(topic, (topicCounts.get(topic) || 0) + 1);
      });
    });

    return Array.from(topicCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([topic]) => topic);
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
}

// Singleton instance
let githubClientInstance: GitHubAPIClient | null = null;

export const REPO_OWNER = GITHUB_OWNER;
export const REPO_NAME = GITHUB_REPO;

export function getGitHubClient(apiKey?: string): GitHubAPIClient {
  if (!githubClientInstance || (apiKey && githubClientInstance['apiKey'] !== apiKey)) {
    githubClientInstance = new GitHubAPIClient(apiKey);
  }
  return githubClientInstance;
}

// Export default instance for convenience
export const githubClient = new GitHubAPIClient();

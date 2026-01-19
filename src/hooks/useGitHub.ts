/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * GitHub Scanner Hook
 * Mirrors: TanStack Query best practices
 * Provides caching, automatic refetching, error handling for GitHub API
 * 
 * Usage:
 * const { data, isLoading, error, refetch } = useGitHubScanner('react', { minStars: 500 });
 */

import { useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { githubAPI } from '@/lib/api-client';
import { GITHUB_OWNER, GITHUB_REPO } from '@/lib/config';
import {
  GitHubSearchResponse,
  GitHubRepo,
  GitHubSearchResponseSchema,
  BlueOceanOpportunity,
  GitHubUserSchema,
  StargazerQuality,
  validateData
} from '@/lib/validation';

const OWNER = GITHUB_OWNER;
const REPO = GITHUB_REPO;

/**
 * Query keys for GitHub data
 * Centralized for cache invalidation
 */
export const githubKeys = {
  all: ['github'] as const,
  search: (query: string) => [...githubKeys.all, 'search', query] as const,
  repo: (owner: string, name: string) => [...githubKeys.all, 'repo', owner, name] as const,
  blueOcean: (niche: string, filters?: Record<string, any>) => 
    [...githubKeys.all, 'blueOcean', niche, filters] as const,
  trending: (language?: string, since?: string) => 
    [...githubKeys.all, 'trending', language, since] as const,
  stargazers: (repoFullName: string) => [...githubKeys.all, 'stargazers', repoFullName] as const
};

/**
 * Search GitHub repositories
 */
export interface GitHubSearchParams {
  query: string;
  sort?: 'stars' | 'forks' | 'updated' | 'help-wanted-issues';
  order?: 'asc' | 'desc';
  perPage?: number;
  page?: number;
}

export function useGitHubSearch(
  params: GitHubSearchParams,
  options?: Omit<UseQueryOptions<GitHubSearchResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: githubKeys.search(JSON.stringify(params)),
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      searchParams.set('q', params.query);
      
      if (params.sort) searchParams.set('sort', params.sort);
      if (params.order) searchParams.set('order', params.order);
      if (params.perPage) searchParams.set('per_page', params.perPage.toString());
      if (params.page) searchParams.set('page', params.page.toString());

      const data = await githubAPI.get<any>('/search/repositories', searchParams);
      
      // Validate response
      return validateData(GitHubSearchResponseSchema, data, 'GitHub Search Response');
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...options
  });
}

/**
 * Get specific repository
 */
export function useGitHubRepo(
  owner: string,
  name: string,
  options?: Omit<UseQueryOptions<GitHubRepo>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: githubKeys.repo(owner, name),
    queryFn: async () => {
      const data = await githubAPI.get<any>(`/repos/${owner}/${name}`);
      return validateData(GitHubSearchResponseSchema.shape.items.element, data, 'GitHub Repository');
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
    retry: 2,
    ...options
  });
}

/**
 * Blue Ocean Scanner - Find abandoned goldmines
 */
export interface BlueOceanFilters {
  minStars?: number;
  maxForks?: number;
  daysAbandoned?: number;
  minIssues?: number;
  language?: string;
}

export function useBlueOceanScanner(
  niche: string,
  filters?: BlueOceanFilters,
  options?: Omit<UseQueryOptions<BlueOceanOpportunity[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: githubKeys.blueOcean(niche, filters),
    queryFn: async () => {
      // Build search query
      const queryParts: string[] = [niche];
      
      if (filters?.minStars) queryParts.push(`stars:>=${filters.minStars}`);
      if (filters?.language) queryParts.push(`language:${filters.language}`);
      if (filters?.minIssues) queryParts.push(`good-first-issues:>=${filters.minIssues}`);
      
      const query = queryParts.join(' ');
      
      // Search repositories
      const searchData = await githubAPI.get<any>('/search/repositories', {
        q: query,
        sort: 'stars',
        order: 'desc',
        per_page: 50
      });
      
      const validated = validateData(GitHubSearchResponseSchema, searchData);
      
      // Calculate Blue Ocean scores
      const opportunities: BlueOceanOpportunity[] = validated.items
        .map(repo => analyzeBlueOceanOpportunity(repo, filters))
        .filter(opp => opp.score >= 50) // Only high-potential opportunities
        .sort((a, b) => b.score - a.score);
      
      return opportunities;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60 * 2, // 2 hours
    retry: 2,
    ...options
  });
}

/**
 * Analyze repository for Blue Ocean potential
 */
function analyzeBlueOceanOpportunity(
  repo: GitHubRepo,
  filters?: BlueOceanFilters
): BlueOceanOpportunity {
  const now = Date.now();
  const lastUpdate = new Date(repo.updated_at).getTime();
  const lastUpdateDays = Math.floor((now - lastUpdate) / (1000 * 60 * 60 * 24));
  
  const starToForkRatio = repo.forks_count > 0 
    ? repo.stargazers_count / repo.forks_count 
    : repo.stargazers_count;
  
  // Calculate signals
  const daysThreshold = filters?.daysAbandoned || 365;
  const isAbandoned = lastUpdateDays > daysThreshold;
  const hasProvenDemand = repo.stargazers_count >= (filters?.minStars || 500);
  const lowCompetition = repo.forks_count < (filters?.maxForks || 200);
  const hasIssues = repo.open_issues_count > 0;
  
  // Calculate score (0-100)
  let score = 0;
  
  // Proven demand (30 points)
  score += Math.min(30, (repo.stargazers_count / 1000) * 30);
  
  // Abandonment + demand = goldmine (30 points)
  if (isAbandoned && hasProvenDemand) {
    score += 30;
  }
  
  // Low competition (20 points)
  const competitionScore = Math.max(0, 20 * (1 - (repo.forks_count / 500)));
  score += competitionScore;
  
  // Active issues = ongoing demand (20 points)
  score += Math.min(20, (repo.open_issues_count / 50) * 20);
  
  score = Math.min(100, Math.round(score));
  
  // Generate insights
  const insights: string[] = [];
  
  if (isAbandoned) {
    insights.push(`🕰️ Abandoned for ${lastUpdateDays} days - maintainer likely moved on`);
  }
  
  if (hasProvenDemand) {
    insights.push(`⭐ ${repo.stargazers_count.toLocaleString()} stars = proven market demand`);
  }
  
  if (lowCompetition) {
    insights.push(`🎯 Only ${repo.forks_count} forks = low competition`);
  }
  
  if (hasIssues) {
    insights.push(`📝 ${repo.open_issues_count} open issues = clear improvement opportunities`);
  }
  
  if (starToForkRatio > 10) {
    insights.push(`💎 High star-to-fork ratio (${starToForkRatio.toFixed(1)}) = users want it but few build it`);
  }
  
  return {
    repo,
    score,
    signals: {
      isAbandoned,
      hasProvenDemand,
      lowCompetition,
      hasIssues,
      lastUpdateDays,
      starToForkRatio: Math.round(starToForkRatio * 10) / 10
    },
    reasoning: generateReasoning(score, { isAbandoned, hasProvenDemand, lowCompetition, hasIssues }),
    actionableInsights: insights
  };
}

function generateReasoning(
  score: number,
  _signals: { isAbandoned: boolean; hasProvenDemand: boolean; lowCompetition: boolean; hasIssues: boolean }
): string {
  if (score >= 80) {
    return '🏆 GOLDMINE: High demand, abandoned by maintainer, low competition. Perfect Blue Ocean opportunity.';
  } else if (score >= 60) {
    return '⭐ STRONG POTENTIAL: Good market signals with opportunity for differentiation.';
  } else if (score >= 50) {
    return '💡 MODERATE POTENTIAL: Shows promise but requires careful market validation.';
  }
  return '⚠️ LOW POTENTIAL: Market signals unclear, proceed with caution.';
}

/**
 * Invalidate GitHub cache
 */
export function useInvalidateGitHub() {
  const queryClient = useQueryClient();
  
  return {
    invalidateAll: () => queryClient.invalidateQueries({ queryKey: githubKeys.all }),
    invalidateSearch: (query: string) => 
      queryClient.invalidateQueries({ queryKey: githubKeys.search(query) }),
    invalidateRepo: (owner: string, name: string) =>
      queryClient.invalidateQueries({ queryKey: githubKeys.repo(owner, name) }),
    invalidateBlueOcean: (niche: string) =>
      queryClient.invalidateQueries({ queryKey: githubKeys.blueOcean(niche) })
  };
}

/**
 * Prefetch GitHub data
 */
export function usePrefetchGitHub() {
  const queryClient = useQueryClient();
  
  return {
    prefetchSearch: async (params: GitHubSearchParams) => {
      await queryClient.prefetchQuery({
        queryKey: githubKeys.search(JSON.stringify(params)),
        queryFn: async () => {
          const searchParams = new URLSearchParams();
          searchParams.set('q', params.query);
          if (params.sort) searchParams.set('sort', params.sort);
          if (params.order) searchParams.set('order', params.order);
          
          const data = await githubAPI.get<any>('/search/repositories', searchParams);
          return validateData(GitHubSearchResponseSchema, data);
        }
      });
    },
    
    prefetchRepo: async (owner: string, name: string) => {
      await queryClient.prefetchQuery({
        queryKey: githubKeys.repo(owner, name),
        queryFn: async () => {
          const data = await githubAPI.get<any>(`/repos/${owner}/${name}`);
          return validateData(GitHubSearchResponseSchema.shape.items.element, data);
        }
      });
    }
  };
}

/**
 * Stargazer Quality Analysis Hook
 * Analyzes WHO starred a repository to determine institutional backing
 * 
 * Usage:
 * const { data } = useStargazerQuality('facebook/react', { maxAnalyze: 100 });
 */
export interface StargazerAnalysisOptions {
  maxAnalyze?: number;
  minFollowers?: number;
  checkCompanies?: boolean;
  targetCompanies?: string[];
}

export function useStargazerQuality(
  repoFullName: string,
  options?: StargazerAnalysisOptions & Omit<UseQueryOptions<StargazerQuality>, 'queryKey' | 'queryFn'>
) {
  const config = useFeatureConfigStore((state) => state.stargazerAnalysis);
  
  const {
    maxAnalyze = config.maxStargazers,
    minFollowers = config.minFollowers,
    checkCompanies = config.checkCompanies,
    targetCompanies = config.targetCompanies,
    ...queryOptions
  } = options || {};

  return useQuery({
    queryKey: githubKeys.stargazers(repoFullName),
    queryFn: async (): Promise<StargazerQuality> => {
      console.log(`🔍 Analyzing stargazer quality for ${repoFullName}...`);
      
      // Fetch stargazers list
      const stargazersData = await githubAPI.get<any[]>(
        `/repos/${repoFullName}/stargazers`,
        { per_page: maxAnalyze.toString() }
      );
      
      const totalStargazers = stargazersData.length;
      let qualityScore = 0;
      
      const notableBackers: Array<{
        login: string;
        type: 'influencer' | 'organization' | 'big_tech';
        detail: string;
        scoreContribution: number;
      }> = [];
      
      const companyBackers: string[] = [];
      let influencerCount = 0;
      let organizationCount = 0;
      let bigTechCount = 0;
      
      // Analyze each stargazer
      for (const stargazer of stargazersData.slice(0, maxAnalyze)) {
        try {
          // Fetch detailed user info
          const userData = await githubAPI.get<any>(`/users/${stargazer.login}`);
          const user = validateData(GitHubUserSchema, userData, `User ${stargazer.login}`);
          
          // Check for influencer (high followers)
          if (user.followers && user.followers >= minFollowers) {
            const contribution = 10;
            qualityScore += contribution;
            influencerCount++;
            notableBackers.push({
              login: user.login,
              type: 'influencer',
              detail: `${user.followers.toLocaleString()} followers`,
              scoreContribution: contribution
            });
          }
          
          // Check for organization
          if (user.type === 'Organization') {
            const contribution = 15;
            qualityScore += contribution;
            organizationCount++;
            notableBackers.push({
              login: user.login,
              type: 'organization',
              detail: 'Organization account',
              scoreContribution: contribution
            });
          }
          
          // Check for big tech company
          if (checkCompanies && user.company) {
            const company = user.company.toLowerCase();
            const matchedCompany = targetCompanies.find(tc => 
              company.includes(tc.toLowerCase())
            );
            
            if (matchedCompany) {
              const contribution = 20;
              qualityScore += contribution;
              bigTechCount++;
              companyBackers.push(matchedCompany);
              notableBackers.push({
                login: user.login,
                type: 'big_tech',
                detail: `Works at ${matchedCompany}`,
                scoreContribution: contribution
              });
            }
          }
          
          // Rate limiting - small delay between requests
          await new Promise(resolve => setTimeout(resolve, 100));
          
        } catch (error) {
          console.warn(`Failed to analyze stargazer ${stargazer.login}:`, error);
          // Continue with other stargazers
        }
      }
      
      // Cap quality score at 100
      const finalScore = Math.min(100, qualityScore);
      
      // Determine verdict
      let verdict: 'INSTITUTIONAL_BACKING' | 'COMMUNITY_VALIDATED' | 'UNVALIDATED';
      if (finalScore >= 80 || bigTechCount >= 5) {
        verdict = 'INSTITUTIONAL_BACKING';
      } else if (finalScore >= 50 || influencerCount >= 10) {
        verdict = 'COMMUNITY_VALIDATED';
      } else {
        verdict = 'UNVALIDATED';
      }
      
      // Generate analysis
      const institutionalStrength = bigTechCount >= 5 ? 'strong' : 
                                   bigTechCount >= 2 ? 'moderate' : 'weak';
      const communityTrust = influencerCount >= 15 ? 'high' :
                            influencerCount >= 5 ? 'medium' : 'low';
      
      let recommendation = '';
      if (verdict === 'INSTITUTIONAL_BACKING') {
        recommendation = `✅ Strong opportunity - ${bigTechCount} big tech companies watching. This validates both technical quality and market demand.`;
      } else if (verdict === 'COMMUNITY_VALIDATED') {
        recommendation = `⚠️ Community-backed - ${influencerCount} influencers interested. Good signal but verify product-market fit independently.`;
      } else {
        recommendation = `❌ Unvalidated - Low quality stargazers. Consider alternatives with stronger institutional backing.`;
      }
      
      const result: StargazerQuality = {
        repoFullName,
        totalStargazers,
        analyzed: Math.min(maxAnalyze, totalStargazers),
        qualityScore: finalScore,
        verdict,
        notableBackers: notableBackers.sort((a, b) => b.scoreContribution - a.scoreContribution),
        companyBackers: Array.from(new Set(companyBackers)),
        influencerCount,
        organizationCount,
        bigTechCount,
        analysis: {
          institutionalStrength: institutionalStrength as 'strong' | 'moderate' | 'weak',
          communityTrust: communityTrust as 'high' | 'medium' | 'low',
          recommendation
        }
      };
      
      console.log(`✅ Stargazer analysis complete:`, result);
      
      return result;
    },
    enabled: config.enabled && !!repoFullName,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours (stargazers don't change quickly)
    gcTime: 1000 * 60 * 60 * 48, // 48 hours
    retry: 1,
    retryDelay: 5000,
    ...queryOptions
  });
}

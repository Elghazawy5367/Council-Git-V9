import { githubAPI } from './api-client';

export interface Influencer {
  login: string;
  followers: number;
  public_repos: number;
  avatar_url: string;
  type: string;
}

export interface Company {
  name: string;
  count: number;
}

export interface NotableBacker {
  login: string;
  type: 'big_tech' | 'organization' | 'influencer';
  detail: string;
}

export interface StargazerAnalysis {
  totalStargazers: number;
  analyzed: number;
  influencers: Influencer[];
  influencerCount: number;
  companyBackers: string[];
  bigTechCount: number;
  organizationCount: number;
  qualityScore: number;
  verdict: 'INSTITUTIONAL_BACKING' | 'COMMUNITY_VALIDATED' | 'UNVALIDATED';
  repoFullName: string;
  notableBackers: NotableBacker[];
  analysis: {
    institutionalStrength: 'strong' | 'moderate' | 'weak';
    communityTrust: 'high' | 'medium' | 'low';
    recommendation: string;
  };
}

interface GitHubUserFromStargazers {
  login: string;
  type: 'User' | 'Organization';
  company?: string | null;
}

interface GitHubUserFromDetails {
  login: string;
  followers: number;
  public_repos: number;
  avatar_url: string;
  type: string;
}

interface GitHubRepo {
  stargazers_count: number;
}

const BIG_TECH_COMPANIES = ['google', 'meta', 'stripe', 'vercel', 'shopify', 'amazon', 'microsoft', 'netflix'];

export async function getInfluencerDetails(username: string): Promise<Influencer> {
  const data = await githubAPI.get<GitHubUserFromDetails>(`/users/${username}`);
  return {
    login: data.login,
    followers: data.followers,
    public_repos: data.public_repos,
    avatar_url: data.avatar_url,
    type: data.type,
  };
}

export function calculateStargazerQuality(stargazers: GitHubUserFromStargazers[], totalCount: number, repoName: string): StargazerAnalysis {
  const influencers: Influencer[] = [];
  const companyMap = new Map<string, number>();
  const notableBackers: NotableBacker[] = [];
  
  let bigTechCount = 0;
  let orgCount = 0;

  stargazers.forEach((user: GitHubUserFromStargazers) => {
    // Basic heuristics since we might not have full profiles for all
    if (user.type === 'Organization') {
      orgCount++;
      notableBackers.push({
        login: user.login,
        type: 'organization',
        detail: 'Official Organization',
      });
    }

    // Check company if available
    if (user.company) {
      const company = user.company.replace('@', '').toLowerCase().trim();
      companyMap.set(company, (companyMap.get(company) || 0) + 1);
      
      if (BIG_TECH_COMPANIES.some(tech => company.includes(tech))) {
        bigTechCount++;
        notableBackers.push({
          login: user.login,
          type: 'big_tech',
          detail: `Engineer at ${user.company}`,
        });
      }
    }
  });

  const qualityScore = Math.min(100, (bigTechCount * 15) + (orgCount * 5) + (influencers.length * 10));
  
  let verdict: StargazerAnalysis['verdict'] = 'UNVALIDATED';
  if (qualityScore > 70 || bigTechCount > 2) verdict = 'INSTITUTIONAL_BACKING';
  else if (qualityScore > 30) verdict = 'COMMUNITY_VALIDATED';

  return {
    totalStargazers: totalCount,
    analyzed: stargazers.length,
    influencers,
    influencerCount: influencers.length,
    companyBackers: Array.from(companyMap.keys()).slice(0, 10),
    bigTechCount,
    organizationCount: orgCount,
    qualityScore,
    verdict,
    repoFullName: repoName,
    notableBackers: notableBackers.sort((a, b) => {
      const priority = { big_tech: 0, organization: 1, influencer: 2 };
      return priority[a.type] - priority[b.type];
    }),
    analysis: {
      institutionalStrength: qualityScore > 60 ? 'strong' : qualityScore > 30 ? 'moderate' : 'weak',
      communityTrust: qualityScore > 50 ? 'high' : qualityScore > 20 ? 'medium' : 'low',
      recommendation: qualityScore > 60 
        ? "Highly credible project with significant institutional backing. Low risk for production use."
        : "Community-driven project with moderate validation. Suitable for non-critical systems.",
    }
  };
}

export async function analyzeStargazers(owner: string, repo: string): Promise<StargazerAnalysis> {
  const repoData = await githubAPI.get<GitHubRepo>(`/repos/${owner}/${repo}`);
  const stargazers = await githubAPI.get<GitHubUserFromStargazers[]>(`/repos/${owner}/${repo}/stargazers`, {
    per_page: 100,
  });

  return calculateStargazerQuality(stargazers, repoData.stargazers_count, `${owner}/${repo}`);
}

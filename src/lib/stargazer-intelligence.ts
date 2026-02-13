/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Stargazer Analysis - Quality Signals & Institutional Backing Detection
 * Detects institutional backing, influencer endorsement, and business opportunities
 */

import * as yaml from 'js-yaml';
import * as fs from 'fs';
import { Octokit } from '@octokit/rest';

// ============================================================================
// Types & Interfaces
// ============================================================================

interface NicheConfig {
  id: string;
  name: string;
  monitoring?: {
    keywords: string[];
    github_topics: string[];
    github_search_queries: string[];
    subreddits?: string[];
  };
  keywords?: string[];
  github_topics?: string[];
  github_search_queries?: string[];
  enabled?: boolean;
}

interface YamlConfig {
  niches: NicheConfig[];
}

interface StargazerAnalysis {
  totalStars: number;
  starVelocity30d: number;
  starVelocity90d: number;
  institutionalBackers: string[];
  influencers: string[];
  qualityScore: number;
}

interface AnalyzedRepo {
  repo: any;
  analysis: StargazerAnalysis;
}

// ============================================================================
// Configuration Loader
// ============================================================================

function loadNicheConfig(): NicheConfig[] {
  const configPath = 'config/target-niches.yaml';
  
  if (!fs.existsSync(configPath)) {
    throw new Error(`Config file not found: ${configPath}`);
  }
  
  const fileContent = fs.readFileSync(configPath, 'utf8');
  const config = yaml.load(fileContent) as YamlConfig;
  
  if (!config || !config.niches) {
    throw new Error('Invalid config format: missing niches array');
  }
  
  // Filter only enabled niches
  return config.niches.filter((n) => n.enabled !== false);
}

// ============================================================================
// GitHub Repository Search
// ============================================================================

async function searchRepositoriesByTopic(
  octokit: Octokit,
  niche: NicheConfig
): Promise<any[]> {
  const repos: any[] = [];
  
  // Handle both direct and nested monitoring structure
  const topics = niche.monitoring?.github_topics || niche.github_topics || [];
  const keywords = niche.monitoring?.keywords || niche.keywords || [];
  
  for (const topic of topics) {
    try {
      const { data } = await octokit.search.repos({
        q: `topic:${topic} stars:>100`,
        sort: 'stars',
        order: 'desc',
        per_page: 30
      });
      
      repos.push(...data.items);
      
      // Rate limit protection
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error: any) {
      console.error(`  ⚠️ Error searching topic ${topic}:`, error.message);
    }
  }
  
  // Deduplicate by repo ID
  const uniqueRepos = Array.from(
    new Map(repos.map(r => [r.id, r])).values()
  );
  
  return uniqueRepos;
}

// ============================================================================
// Stargazer Analysis
// ============================================================================

async function analyzeStargazers(
  octokit: Octokit,
  repo: any
): Promise<StargazerAnalysis> {
  const analysis: StargazerAnalysis = {
    totalStars: repo.stargazers_count,
    starVelocity30d: 0,
    starVelocity90d: 0,
    institutionalBackers: [],
    influencers: [],
    qualityScore: 0
  };
  
  // Calculate star velocity
  try {
    const created = new Date(repo.created_at);
    const now = new Date();
    const ageInDays = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
    
    if (ageInDays > 0) {
      const starsPerDay = repo.stargazers_count / ageInDays;
      analysis.starVelocity30d = Math.round(starsPerDay * 30);
      analysis.starVelocity90d = Math.round(starsPerDay * 90);
    }
  } catch (error: any) {
    // Silent fail - velocity not critical
    console.error(`    ⚠️ Error calculating velocity:`, error.message);
  }
  
  // Get sample of stargazers (first 100)
  try {
    const { data: stargazers } = await octokit.activity.listStargazersForRepo({
      owner: repo.owner.login,
      repo: repo.name,
      per_page: 100
    });
    
    // Institutions list
    const institutions = [
      'google', 'microsoft', 'meta', 'amazon', 'apple',
      'netflix', 'uber', 'airbnb', 'stripe', 'vercel',
      'sequoia', 'a16z', 'yc', 'techstars', '500 startups',
      'facebook', 'twitter', 'github', 'gitlab', 'netlify'
    ];
    
    // Check for institutional backers and influencers
    for (const stargazer of stargazers) {
      if (!stargazer || typeof stargazer !== 'object') continue;
      
      // Handle different response formats
      const user = 'user' in stargazer ? stargazer.user : stargazer;
      if (!user || !user.login) continue;
      
      // Fetch full user details to get company and followers
      try {
        const { data: userDetails } = await octokit.users.getByUsername({
          username: user.login
        });
        
        // Check if institutional (has company affiliation)
        if (userDetails.company) {
          const company = userDetails.company.toLowerCase().replace(/[@\s]/g, '');
          
          if (institutions.some(inst => company.includes(inst))) {
            analysis.institutionalBackers.push(user.login);
          }
        }
        
        // Check if influencer (high followers)
        if (userDetails.followers && userDetails.followers > 10000) {
          analysis.influencers.push(user.login);
        }
        
        // Rate limit protection - minimal delay
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error: any) {
        // Skip user on error
        continue;
      }
    }
  } catch (error: any) {
    console.error('    ⚠️ Error analyzing stargazers:', error.message);
  }
  
  // Calculate quality score (0-100)
  let score = 0;
  
  // Base score from stars (max 30 points)
  score += Math.min(repo.stargazers_count / 1000 * 30, 30);
  
  // Star velocity (max 20 points)
  score += Math.min(analysis.starVelocity30d / 50 * 20, 20);
  
  // Institutional backing (10 points per backer, max 20)
  score += Math.min(analysis.institutionalBackers.length * 10, 20);
  
  // Influencers (5 points per influencer, max 15)
  score += Math.min(analysis.influencers.length * 5, 15);
  
  // Recent activity (max 15 points)
  const daysSinceUpdate = (Date.now() - new Date(repo.updated_at).getTime()) / (1000 * 60 * 60 * 24);
  if (daysSinceUpdate < 7) score += 15;
  else if (daysSinceUpdate < 30) score += 10;
  else if (daysSinceUpdate < 90) score += 5;
  
  analysis.qualityScore = Math.round(Math.min(score, 100));
  
  return analysis;
}

// ============================================================================
// Business Opportunity Analyzer
// ============================================================================

function analyzeBusinessOpportunity(
  repo: any,
  analysis: StargazerAnalysis
): string {
  const opportunities: string[] = [];
  
  const lastUpdate = new Date(repo.updated_at);
  const now = new Date();
  const daysSinceUpdate = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24);
  
  // High quality, active = validated market
  if (analysis.qualityScore >= 70 && daysSinceUpdate < 30) {
    opportunities.push('✅ VALIDATED MARKET: High quality, actively maintained, strong institutional backing');
  }
  
  // High stars, abandoned = opportunity
  if (repo.stargazers_count > 1000 && daysSinceUpdate > 180) {
    opportunities.push('💰 ABANDONED GOLDMINE: Popular repo abandoned - opportunity to build modern alternative');
  }
  
  // High velocity = emerging trend
  if (analysis.starVelocity30d > 100) {
    opportunities.push('🚀 EMERGING TREND: Rapid star growth indicates rising demand');
  }
  
  // Institutional backing = enterprise interest
  if (analysis.institutionalBackers.length > 0) {
    opportunities.push(`🏢 ENTERPRISE VALIDATED: ${analysis.institutionalBackers.length} companies/VCs backing this`);
  }
  
  // Influencer endorsement = thought leader validation
  if (analysis.influencers.length > 0) {
    opportunities.push(`⭐ INFLUENCER ENDORSED: ${analysis.influencers.length} industry leaders using this`);
  }
  
  // High forks = developers extending it
  if (repo.forks_count > repo.stargazers_count * 0.3) {
    opportunities.push('🍴 HIGH FORK RATIO: Developers actively building on/modifying this - indicates gaps');
  }
  
  return opportunities.length > 0 
    ? opportunities.join('\n')
    : 'Standard repository - monitor for changes';
}

// ============================================================================
// Report Generator
// ============================================================================

function generateReport(
  nicheId: string,
  nicheName: string,
  repositories: AnalyzedRepo[]
): string {
  const date = new Date().toISOString().split('T')[0];
  
  let markdown = `# Stargazer Analysis Report: ${nicheName}\n\n`;
  markdown += `**Date:** ${date}\n`;
  markdown += `**Niche:** ${nicheId}\n`;
  markdown += `**Repositories Analyzed:** ${repositories.length}\n\n`;
  markdown += `---\n\n`;
  
  // Sort by quality score
  const sorted = repositories.sort((a, b) => b.analysis.qualityScore - a.analysis.qualityScore);
  
  // Top 20 repositories
  sorted.slice(0, 20).forEach((item, index) => {
    const { repo, analysis } = item;
    
    markdown += `## ${index + 1}. ${repo.full_name}\n\n`;
    markdown += `**Description:** ${repo.description || 'No description'}\n\n`;
    markdown += `**Quality Score:** ${analysis.qualityScore}/100 `;
    if (analysis.qualityScore >= 80) markdown += '🔥';
    else if (analysis.qualityScore >= 60) markdown += '⭐';
    markdown += '\n\n';
    
    markdown += `**Metrics:**\n`;
    markdown += `- Stars: ${analysis.totalStars.toLocaleString()}\n`;
    markdown += `- Star Velocity (30d): +${analysis.starVelocity30d}/month\n`;
    markdown += `- Forks: ${repo.forks_count.toLocaleString()}\n`;
    markdown += `- Last Updated: ${new Date(repo.updated_at).toLocaleDateString()}\n\n`;
    
    if (analysis.institutionalBackers.length > 0) {
      markdown += `**🏢 Institutional Backers:** ${analysis.institutionalBackers.slice(0, 5).join(', ')}\n\n`;
    }
    
    if (analysis.influencers.length > 0) {
      markdown += `**⭐ Influencer Endorsements:** ${analysis.influencers.slice(0, 5).join(', ')}\n\n`;
    }
    
    markdown += `**Business Opportunity:**\n`;
    markdown += analyzeBusinessOpportunity(repo, analysis);
    markdown += '\n\n';
    
    markdown += `**Link:** ${repo.html_url}\n\n`;
    markdown += `---\n\n`;
  });
  
  return markdown;
}

// ============================================================================
// Main Function
// ============================================================================

export async function runStargazerAnalysis(): Promise<void> {
  console.log('⭐ Stargazer Analysis - Starting...');
  
  // Check for GitHub token
  if (!process.env.GITHUB_TOKEN) {
    throw new Error('GITHUB_TOKEN environment variable is required');
  }
  
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
  });
  
  // Load niche configuration
  const niches = loadNicheConfig();
  console.log(`📂 Found ${niches.length} enabled niches\n`);
  
  const results: Array<{ niche: string; repositories: number; file: string }> = [];
  
  for (const niche of niches) {
    console.log(`⭐ Analyzing: ${niche.id}`);
    
    // Get topics for display
    const topics = niche.monitoring?.github_topics || niche.github_topics || [];
    
    // Search repositories by topics
    console.log(`  → Searching GitHub topics: ${topics.join(', ')}`);
    const repos = await searchRepositoriesByTopic(octokit, niche);
    
    console.log(`  → Found ${repos.length} repositories`);
    
    // Analyze stargazers for each repo (limit to top 30 to avoid rate limits)
    const analyzed: AnalyzedRepo[] = [];
    const reposToAnalyze = repos.slice(0, 30);
    
    for (let i = 0; i < reposToAnalyze.length; i++) {
      const repo = reposToAnalyze[i];
      try {
        console.log(`  → Analyzing ${i + 1}/${reposToAnalyze.length}: ${repo.full_name}`);
        const analysis = await analyzeStargazers(octokit, repo);
        analyzed.push({ repo, analysis });
        
        // Rate limit protection (1 second between repos)
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error: any) {
        console.error(`  ⚠️ Error analyzing ${repo.full_name}:`, error.message);
      }
    }
    
    console.log(`  → Successfully analyzed ${analyzed.length} repositories`);
    
    // Generate report
    const report = generateReport(niche.id, niche.name, analyzed);
    
    // Save report
    const date = new Date().toISOString().split('T')[0];
    const filename = `data/reports/stargazer-${niche.id}-${date}.md`;
    
    // Ensure directory exists
    fs.mkdirSync('data/reports', { recursive: true });
    fs.writeFileSync(filename, report);
    
    console.log(`  → Report saved: ${filename}\n`);
    
    results.push({ 
      niche: niche.id, 
      repositories: analyzed.length, 
      file: filename 
    });
  }
  
  console.log('✅ Complete!');
  console.log(`Generated ${results.length} reports\n`);
  
  // Summary
  console.log('Summary:');
  results.forEach(r => {
    console.log(`  - ${r.niche}: ${r.repositories} repos analyzed → ${r.file}`);
  });
}

// Export legacy functions for backward compatibility
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

export interface LegacyStargazerAnalysis {
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

// Keep old API for backward compatibility
export async function getInfluencerDetails(username: string): Promise<Influencer> {
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
  });
  
  const { data } = await octokit.users.getByUsername({ username });
  
  return {
    login: data.login,
    followers: data.followers,
    public_repos: data.public_repos,
    avatar_url: data.avatar_url,
    type: data.type,
  };
}

export async function analyzeStargazersLegacy(owner: string, repo: string): Promise<LegacyStargazerAnalysis> {
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
  });
  
  const repoData = await octokit.repos.get({ owner, repo });
  const stargazers = await octokit.activity.listStargazersForRepo({
    owner,
    repo,
    per_page: 100
  });
  
  const BIG_TECH_COMPANIES = ['google', 'meta', 'stripe', 'vercel', 'shopify', 'amazon', 'microsoft', 'netflix'];
  
  const influencers: Influencer[] = [];
  const companyMap = new Map<string, number>();
  const notableBackers: NotableBacker[] = [];
  
  let bigTechCount = 0;
  let orgCount = 0;

  for (const stargazer of stargazers.data) {
    const user = 'user' in stargazer ? stargazer.user : stargazer;
    if (!user) continue;
    
    // Basic heuristics
    if (user.type === 'Organization') {
      orgCount++;
      notableBackers.push({
        login: user.login,
        type: 'organization',
        detail: 'Official Organization',
      });
    }

    // Check company if available
    try {
      const userDetails = await octokit.users.getByUsername({ username: user.login });
      
      if (userDetails.data.company) {
        const company = userDetails.data.company.replace('@', '').toLowerCase().trim();
        companyMap.set(company, (companyMap.get(company) || 0) + 1);
        
        if (BIG_TECH_COMPANIES.some(tech => company.includes(tech))) {
          bigTechCount++;
          notableBackers.push({
            login: user.login,
            type: 'big_tech',
            detail: `Engineer at ${userDetails.data.company}`,
          });
        }
      }
    } catch (error) {
      // Skip on error
    }
  }

  const qualityScore = Math.min(100, (bigTechCount * 15) + (orgCount * 5) + (influencers.length * 10));
  
  let verdict: LegacyStargazerAnalysis['verdict'] = 'UNVALIDATED';
  if (qualityScore > 70 || bigTechCount > 2) verdict = 'INSTITUTIONAL_BACKING';
  else if (qualityScore > 30) verdict = 'COMMUNITY_VALIDATED';

  return {
    totalStargazers: repoData.data.stargazers_count,
    analyzed: stargazers.data.length,
    influencers,
    influencerCount: influencers.length,
    companyBackers: Array.from(companyMap.keys()).slice(0, 10),
    bigTechCount,
    organizationCount: orgCount,
    qualityScore,
    verdict,
    repoFullName: `${owner}/${repo}`,
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

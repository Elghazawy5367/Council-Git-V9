/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * The Mining Drill - Pain Point Extraction Engine
 * Extracts marketing intelligence from GitHub issues using multi-niche configuration
 */

import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';
import { Octokit } from '@octokit/rest';

export interface NicheConfig {
  id: string;
  name: string;
  keywords: string[];
  github_search_queries: string[];
  github_topics: string[];
  enabled: boolean;
}

export interface PainPoint {
  title: string;
  repo: string;
  comments: number;
  url: string;
  created: string;
  score: number;  // 1-10
  opportunity: string;
  
  // Metadata
  labels: string[];
  author: string;
  state: string;
  reactions: number;
}

const FRUSTRATION_KEYWORDS = [
  'frustrated', 'impossible', 'broken', "doesn't work",
  'terrible', 'awful', 'painful', 'annoying', 'hate',
  'nightmare', 'struggling', 'waste of time', 'crashes',
  'useless', 'not working', 'horrible'
];

interface YamlConfig {
  niches: NicheConfig[];
}

/**
 * Load niche configuration from YAML
 */
function loadNicheConfig(): NicheConfig[] {
  try {
    const configPath = path.join(process.cwd(), 'config', 'target-niches.yaml');
    const fileContent = fs.readFileSync(configPath, 'utf8');
    const config = yaml.load(fileContent) as YamlConfig;
    return config.niches.filter((n: NicheConfig) => n.enabled !== false);
  } catch (error) {
    console.error('Failed to load niche config:', error);
    throw error;
  }
}

/**
 * Search GitHub issues using Octokit
 */
async function searchGitHubIssues(query: string, githubToken?: string): Promise<any[]> {
  try {
    const octokit = new Octokit({
      auth: githubToken || process.env.GITHUB_TOKEN,
    });

    console.log(`    Searching: ${query.substring(0, 60)}...`);
    
    const response = await octokit.rest.search.issuesAndPullRequests({
      q: query,
      sort: 'comments',
      order: 'desc',
      per_page: 50,
    });

    // Filter out pull requests
    const issues = response.data.items.filter((item: any) => !item.pull_request);
    
    console.log(`    Found: ${issues.length} issues`);
    
    // Rate limiting: wait 1 second between API calls
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return issues;
  } catch (error: any) {
    console.error(`    Error searching: ${error.message}`);
    
    // Handle rate limiting
    if (error.status === 403) {
      console.log('    Rate limited. Waiting 60 seconds...');
      await new Promise(resolve => setTimeout(resolve, 60000));
      return [];
    }
    
    return [];
  }
}

/**
 * Score pain point from 1-10 based on multiple factors
 */
function scorePainPoint(issue: any): number {
  // Start at 5 (neutral) - indicates a legitimate pain point worth investigating
  // Scores below 5 indicate low engagement, above 5 indicate high value opportunities
  let score = 5;
  
  // More comments = higher pain
  if (issue.comments > 20) score += 3;
  else if (issue.comments > 10) score += 2;
  else if (issue.comments > 5) score += 1;
  
  // Reactions indicate engagement
  const totalReactions = issue.reactions?.total_count || 0;
  if (totalReactions > 10) score += 2;
  else if (totalReactions > 5) score += 1;
  
  // Check for frustration keywords in title/body
  const text = (issue.title + ' ' + (issue.body || '')).toLowerCase();
  const hasKeywords = FRUSTRATION_KEYWORDS.some(k => text.includes(k));
  if (hasKeywords) score += 2;
  
  // Recent issues are more relevant
  const daysOld = calculateDaysSince(issue.created_at);
  if (daysOld < 30) score += 1;  // Very recent
  
  return Math.min(10, Math.max(1, score)); // cap between 1-10
}

/**
 * Calculate days since a date
 */
function calculateDaysSince(dateString: string): number {
  const then = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - then.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Generate business opportunity description from issue
 */
function generateOpportunity(issue: any, niche: string): string {
  const text = (issue.title + ' ' + (issue.body || '')).toLowerCase();
  
  // Create context-aware opportunity description
  let opportunity = '';
  
  if (text.includes('tool') || text.includes('solution')) {
    opportunity = `Develop a simple tool to address this pain point. `;
  } else if (text.includes('how to') || text.includes('guide')) {
    opportunity = `Create a comprehensive guide or template. `;
  } else if (text.includes('automate') || text.includes('manual')) {
    opportunity = `Build an automation solution. `;
  } else {
    opportunity = `Address this common pain point with a targeted solution. `;
  }
  
  // Add pricing suggestion based on complexity
  if (issue.comments > 20) {
    opportunity += `High engagement suggests strong demand. Could charge $29-97 for a quality solution.`;
  } else if (issue.comments > 10) {
    opportunity += `Moderate demand. Pricing could range $15-49.`;
  } else {
    opportunity += `Growing pain point. Start with $9-29 to validate demand.`;
  }
  
  return opportunity;
}

/**
 * Generate markdown report for a niche
 */
function generateReport(
  nicheId: string,
  nicheName: string,
  painPoints: PainPoint[]
): string {
  const date = new Date().toISOString().split('T')[0];
  
  let markdown = `# Mining Drill Report: ${nicheName}\n\n`;
  markdown += `**Date:** ${date}\n`;
  markdown += `**Niche:** ${nicheId}\n`;
  markdown += `**Pain Points Found:** ${painPoints.length}\n\n`;
  markdown += `---\n\n`;
  
  if (painPoints.length === 0) {
    markdown += `No high-value pain points found in this niche.\n`;
    return markdown;
  }
  
  painPoints.forEach((point, index) => {
    markdown += `## ${index + 1}. ${point.title}\n\n`;
    markdown += `**Repository:** ${point.repo}\n`;
    markdown += `**Pain Score:** ${point.score}/10\n`;
    markdown += `**Comments:** ${point.comments}\n`;
    markdown += `**Reactions:** ${point.reactions}\n`;
    markdown += `**Link:** ${point.url}\n\n`;
    markdown += `**Business Opportunity:**\n`;
    markdown += `${point.opportunity}\n\n`;
    markdown += `---\n\n`;
  });
  
  return markdown;
}

/**
 * Main function to run Mining Drill across all niches
 */
export async function runMiningDrill(): Promise<void> {
  console.log('🔨 Mining Drill - Starting...');
  
  try {
    const niches = loadNicheConfig();
    console.log(`📂 Found ${niches.length} enabled niches`);
    
    const results = [];
    const githubToken = process.env.GITHUB_TOKEN;
    
    if (!githubToken) {
      console.warn('⚠️  Warning: No GITHUB_TOKEN found. Rate limits will be lower.');
    }
    
    for (const niche of niches) {
      console.log(`\n⛏️  Processing: ${niche.id}`);
      
      const allIssues: any[] = [];
      
      // Search using each query for this niche
      for (const query of niche.github_search_queries) {
        try {
          const issues = await searchGitHubIssues(query, githubToken);
          allIssues.push(...issues);
        } catch (error: any) {
          console.error(`    Error with query: ${error.message}`);
        }
      }
      
      // Remove duplicates by URL
      const uniqueIssues = Array.from(
        new Map(allIssues.map(issue => [issue.html_url, issue])).values()
      );
      
      // Score and sort
      const painPoints: PainPoint[] = uniqueIssues
        .map(issue => {
          const score = scorePainPoint(issue);
          return {
            title: issue.title,
            repo: issue.repository_url.split('/').slice(-2).join('/'),
            comments: issue.comments,
            url: issue.html_url,
            created: issue.created_at,
            score,
            opportunity: generateOpportunity(issue, niche.name),
            labels: issue.labels.map((l: any) => l.name || l),
            author: issue.user?.login || 'unknown',
            state: issue.state,
            reactions: issue.reactions?.total_count || 0,
          };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 30); // top 30
      
      console.log(`  → Found ${painPoints.length} pain points`);
      
      // Generate report
      const report = generateReport(niche.id, niche.name, painPoints);
      
      // Save report
      const date = new Date().toISOString().split('T')[0];
      const reportsDir = path.join(process.cwd(), 'data', 'reports');
      fs.mkdirSync(reportsDir, { recursive: true });
      
      const filename = path.join(reportsDir, `mining-drill-${niche.id}-${date}.md`);
      fs.writeFileSync(filename, report);
      
      console.log(`  ✅ Report saved: data/reports/mining-drill-${niche.id}-${date}.md`);
      
      results.push({ 
        niche: niche.id, 
        painPoints: painPoints.length, 
        file: `data/reports/mining-drill-${niche.id}-${date}.md`
      });
    }
    
    console.log('\n✅ Complete!');
    console.log(`Generated ${results.length} reports:`);
    results.forEach(r => {
      console.log(`  - ${r.niche}: ${r.painPoints} pain points`);
    });
  } catch (error) {
    console.error('❌ Mining Drill failed:', error);
    throw error;
  }
}

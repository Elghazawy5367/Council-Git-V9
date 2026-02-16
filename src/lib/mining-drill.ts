/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * The Mining Drill - Pain Point Extraction Engine
 * Extracts marketing intelligence from GitHub issues using multi-niche configuration
 * 
 * This file contains both:
 * 1. Browser-safe functions for UI components (minePainPoints, analyzePainPoints, generateMarketingCopy)
 * 2. Node.js CLI functions for intelligence workflows (runMiningDrill)
 */

import { Octokit } from '@octokit/rest';

// ============================================================================
// SHARED TYPES - Used by both browser and Node.js code
// ============================================================================

export interface NicheConfig {
  id: string;
  name: string;
  keywords?: string[];
  github_search_queries?: string[];
  github_topics?: string[];
  subreddits?: string[];
  enabled: boolean;
  monitoring?: {
    keywords?: string[];
    github_search_queries?: string[];
    github_topics?: string[];
    subreddits?: string[];
  };
}

/**
 * Browser-compatible PainPoint interface (used by UI components)
 */
export interface PainPoint {
  title: string;
  repo: string;
  comments: number;
  url: string;
  created: string;
  score: number;  // 1-10 (for CLI reports)
  opportunity: string;
  
  // Metadata
  labels: string[];
  author: string;
  state: string;
  reactions: number;
  
  // Browser UI fields
  body?: string;
  buyingIntent: number;  // 1-10
  urgencyScore: number;   // 0-100
  painKeywords: string[];
}

/**
 * Mining options for browser functions
 */
export interface MiningOptions {
  minBuyingIntent?: number;
  minUrgency?: number;
  maxResults?: number;
  githubToken?: string;
}

/**
 * Analysis result for UI display
 */
export interface PainPointAnalysis {
  totalPainPoints: number;
  highIntentCount: number;
  averageUrgency: number;
  topPainKeywords: Array<{ keyword: string; count: number }>;
}

// ============================================================================
// SHARED CONSTANTS
// ============================================================================

const FRUSTRATION_KEYWORDS = [
  'frustrated', 'impossible', 'broken', "doesn't work",
  'terrible', 'awful', 'painful', 'annoying', 'hate',
  'nightmare', 'struggling', 'waste of time', 'crashes',
  'useless', 'not working', 'horrible'
];

const BUYING_INTENT_KEYWORDS = [
  'looking for', 'need', 'want', 'recommend', 'alternative',
  'better than', 'replacement', 'migrate', 'switch to',
  'how to', 'best way', 'what should i use'
];

const URGENCY_KEYWORDS = [
  'asap', 'urgent', 'immediately', 'critical', 'blocker',
  'production', 'deadline', 'help', 'stuck', 'please'
];

// ============================================================================
// BROWSER-SAFE FUNCTIONS (for UI components)
// ============================================================================

/**
 * Mine pain points from a single GitHub repository (browser-safe)
 * Used by MiningDrillPanel component
 */
export async function minePainPoints(
  owner: string,
  repo: string,
  options: MiningOptions = {}
): Promise<PainPoint[]> {
  const {
    minBuyingIntent = 0,
    minUrgency = 0,
    maxResults = 20,
    githubToken,
  } = options;

  try {
    const octokit = new Octokit({
      auth: githubToken,
    });

    // Search for issues with high engagement
    const response = await octokit.rest.issues.listForRepo({
      owner,
      repo,
      state: 'all',
      sort: 'comments',
      direction: 'desc',
      per_page: 100,
    });

    const painPoints: PainPoint[] = response.data
      .filter((issue: any) => !issue.pull_request) // Exclude PRs
      .map((issue: any) => {
        const text = (issue.title + ' ' + (issue.body || '')).toLowerCase();
        
        // Calculate buying intent (1-10)
        const buyingIntent = calculateBuyingIntent(text);
        
        // Calculate urgency score (0-100)
        const urgencyScore = calculateUrgencyScore(issue, text);
        
        // Extract pain keywords
        const painKeywords = extractPainKeywords(text);
        
        // Calculate overall score (1-10) for compatibility
        const score = scorePainPoint(issue);
        
        return {
          title: issue.title,
          repo: `${owner}/${repo}`,
          comments: issue.comments,
          url: issue.html_url,
          created: issue.created_at,
          score,
          opportunity: generateOpportunity(issue, repo),
          labels: issue.labels.map((l: any) => l.name || l),
          author: issue.user?.login || 'unknown',
          state: issue.state,
          reactions: issue.reactions?.total_count || 0,
          body: issue.body || '',
          buyingIntent,
          urgencyScore,
          painKeywords,
        };
      })
      .filter(point => 
        point.buyingIntent >= minBuyingIntent &&
        point.urgencyScore >= minUrgency
      )
      .slice(0, maxResults);

    return painPoints;
  } catch (error: any) {
    console.error('Mining error:', error);
    throw new Error(`Failed to mine pain points: ${error.message}`);
  }
}

/**
 * Analyze pain points to extract insights (browser-safe)
 */
export function analyzePainPoints(painPoints: PainPoint[]): PainPointAnalysis {
  if (painPoints.length === 0) {
    return {
      totalPainPoints: 0,
      highIntentCount: 0,
      averageUrgency: 0,
      topPainKeywords: [],
    };
  }

  // Count high-intent pain points (5+)
  const highIntentCount = painPoints.filter(p => p.buyingIntent >= 5).length;

  // Calculate average urgency
  const averageUrgency = painPoints.reduce((sum, p) => sum + p.urgencyScore, 0) / painPoints.length;

  // Aggregate pain keywords
  const keywordCounts = new Map<string, number>();
  painPoints.forEach(point => {
    point.painKeywords.forEach(keyword => {
      keywordCounts.set(keyword, (keywordCounts.get(keyword) || 0) + 1);
    });
  });

  // Sort by count
  const topPainKeywords = Array.from(keywordCounts.entries())
    .map(([keyword, count]) => ({ keyword, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    totalPainPoints: painPoints.length,
    highIntentCount,
    averageUrgency,
    topPainKeywords,
  };
}

/**
 * Generate marketing copy from pain points (browser-safe)
 */
export function generateMarketingCopy(painPoints: PainPoint[]): string {
  if (painPoints.length === 0) {
    return 'No pain points found to generate marketing copy.';
  }

  const analysis = analyzePainPoints(painPoints);
  
  let copy = '# Marketing Intelligence Report\n\n';
  copy += `**Total Pain Points:** ${analysis.totalPainPoints}\n`;
  copy += `**High Intent:** ${analysis.highIntentCount}\n`;
  copy += `**Average Urgency:** ${analysis.averageUrgency.toFixed(0)}/100\n\n`;
  
  copy += '## Top Pain Keywords\n\n';
  analysis.topPainKeywords.forEach(kw => {
    copy += `- ${kw.keyword} (${kw.count} mentions)\n`;
  });
  
  copy += '\n## High-Priority Pain Points\n\n';
  
  const topPoints = painPoints
    .sort((a, b) => (b.buyingIntent + b.urgencyScore/100) - (a.buyingIntent + a.urgencyScore/100))
    .slice(0, 5);
  
  topPoints.forEach((point, index) => {
    copy += `### ${index + 1}. ${point.title}\n\n`;
    copy += `- **Buying Intent:** ${point.buyingIntent}/10\n`;
    copy += `- **Urgency:** ${point.urgencyScore}/100\n`;
    copy += `- **Engagement:** ${point.comments} comments, ${point.reactions} reactions\n`;
    copy += `- **Link:** ${point.url}\n\n`;
  });
  
  copy += '\n---\n\n';
  copy += '*Generated by Mining Drill - Pain Point Extraction Engine*\n';
  
  return copy;
}

/**
 * Calculate buying intent score from text (1-10)
 */
function calculateBuyingIntent(text: string): number {
  let score = 1;
  
  // Check for buying intent keywords
  BUYING_INTENT_KEYWORDS.forEach(keyword => {
    if (text.includes(keyword)) {
      score += 2;
    }
  });
  
  // Check for questions (indicates seeking solution)
  if (text.includes('?') || text.includes('how')) {
    score += 1;
  }
  
  return Math.min(10, score);
}

/**
 * Calculate urgency score (0-100)
 */
function calculateUrgencyScore(issue: any, text: string): number {
  let score = 0;
  
  // Base score from comments (indicates active problem)
  score += Math.min(30, issue.comments * 2);
  
  // Reactions indicate community concern
  const reactions = issue.reactions?.total_count || 0;
  score += Math.min(20, reactions * 2);
  
  // Check for urgency keywords
  let urgencyKeywordCount = 0;
  URGENCY_KEYWORDS.forEach(keyword => {
    if (text.includes(keyword)) {
      urgencyKeywordCount++;
    }
  });
  score += Math.min(30, urgencyKeywordCount * 10);
  
  // Recent issues are more urgent
  const daysOld = calculateDaysSince(issue.created_at);
  if (daysOld < 7) score += 20;
  else if (daysOld < 30) score += 10;
  
  return Math.min(100, score);
}

/**
 * Extract pain-related keywords from text
 */
function extractPainKeywords(text: string): string[] {
  const keywords: string[] = [];
  
  // Check frustration keywords
  FRUSTRATION_KEYWORDS.forEach(keyword => {
    if (text.includes(keyword)) {
      keywords.push(keyword);
    }
  });
  
  // Check urgency keywords
  URGENCY_KEYWORDS.forEach(keyword => {
    if (text.includes(keyword)) {
      keywords.push(keyword);
    }
  });
  
  // Check buying intent keywords
  BUYING_INTENT_KEYWORDS.forEach(keyword => {
    if (text.includes(keyword)) {
      keywords.push(keyword);
    }
  });
  
  // Remove duplicates
  return Array.from(new Set(keywords));
}

// ============================================================================
// NODE.JS CLI FUNCTIONS (for intelligence workflows)
// ============================================================================

// These imports are only used in Node.js environment
// They will be tree-shaken out in browser builds
let yaml: any;
let fs: any;
let path: any;

// Dynamic imports for Node.js-only modules
async function loadNodeModules(): Promise<void> {
  if (typeof window === 'undefined') {
    yaml = await import('js-yaml');
    fs = await import('fs');
    path = await import('path');
  }
}

interface YamlConfig {
  niches: NicheConfig[];
}

/**
 * Load niche configuration from YAML (Node.js only)
 */
async function loadNicheConfig(): Promise<NicheConfig[]> {
  await loadNodeModules();
  
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
 * Generate markdown report for a niche (Node.js only)
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
 * Main function to run Mining Drill across all niches (Node.js only)
 */
export async function runMiningDrill(): Promise<void> {
  await loadNodeModules();
  
  console.log('🔨 Mining Drill - Starting...');
  
  try {
    const niches = await loadNicheConfig();
    console.log(`📂 Found ${niches.length} enabled niches`);
    
    const results = [];
    const githubToken = process.env.GITHUB_TOKEN;
    
    if (!githubToken) {
      console.warn('⚠️  Warning: No GITHUB_TOKEN found. Rate limits will be lower.');
    }
    
    for (const niche of niches) {
      console.log(`\n⛏️  Processing: ${niche.id}`);
      
      // Guard all config arrays with defaults
      // Support both nested monitoring structure and flat structure
      const keywords = niche.monitoring?.keywords || niche.keywords || [];
      const githubTopics = niche.monitoring?.github_topics || niche.github_topics || [];
      const githubSearchQueries = niche.monitoring?.github_search_queries || niche.github_search_queries || [];
      const subreddits = niche.monitoring?.subreddits || niche.subreddits || [];
      
      // Validate they're arrays
      if (!Array.isArray(keywords)) {
        console.log(`  ⚠️  keywords is not an array for ${niche.id}, using empty array`);
      }
      
      if (!Array.isArray(githubSearchQueries)) {
        console.log(`  ⚠️  github_search_queries is not an array for ${niche.id}, using empty array`);
      }
      
      if (!Array.isArray(githubTopics)) {
        console.log(`  ⚠️  github_topics is not an array for ${niche.id}, using empty array`);
      }
      
      if (!Array.isArray(subreddits)) {
        console.log(`  ⚠️  subreddits is not an array for ${niche.id}, using empty array`);
      }
      
      // Ensure githubSearchQueries is a valid array for iteration
      const validGithubSearchQueries = Array.isArray(githubSearchQueries) ? githubSearchQueries : [];
      
      // Check if we have any search queries to process
      if (validGithubSearchQueries.length === 0) {
        console.log(`  ⚠️  No github_search_queries found for ${niche.id}, skipping`);
        continue;
      }
      
      const allIssues: any[] = [];
      
      // Search using each query for this niche
      for (const query of validGithubSearchQueries) {
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
          const text = (issue.title + ' ' + (issue.body || '')).toLowerCase();
          
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
            buyingIntent: calculateBuyingIntent(text),
            urgencyScore: calculateUrgencyScore(issue, text),
            painKeywords: extractPainKeywords(text),
            body: issue.body || '',
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

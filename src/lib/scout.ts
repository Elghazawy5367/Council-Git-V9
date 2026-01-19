/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * The Scout - GitHub Intelligence Extraction System
 * 
 * Exploits GitHub as a free market research platform.
 * Runs 24/7 on GitHub Actions servers at zero cost.
 * 
 * API Limits:
 * - GitHub Actions: 5,000 requests/hour (vs 60 for personal)
 * - Search API: 30 requests/minute
 * - Strategy: Cache aggressively, scan smart
 */

import * as fs from "fs";
import * as path from "path";
import { GITHUB_OWNER, GITHUB_REPO } from './config';

/**
 * Consult the Living Knowledge Base (Angle 1)
 * Fetches content from the /knowledge folder in the project repository
 */
export async function consultKnowledgeBase(filename: string) {
  const user = GITHUB_OWNER;
  const repo = GITHUB_REPO;
  const branch = "main";
  
  const url = `https://raw.githubusercontent.com/${user}/${repo}/${branch}/knowledge/${filename}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Knowledge file not found: ${filename}`);
    
    return await response.text();
  } catch (error) {
    console.error("Knowledge retrieval failed:", error);
    return "I could not find that information in the archives.";
  }
}

/**
 * Fetch an Engineered Prompt from the /prompts folder (Angle 2)
 */
export async function getEngineeredPrompt(path: string) {
  const user = GITHUB_OWNER;
  const repo = GITHUB_REPO;
  const branch = "main";
  
  const url = `https://raw.githubusercontent.com/${user}/${repo}/${branch}/prompts/${path}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Prompt file not found: ${path}`);
    
    return await response.text();
  } catch (error) {
    console.error("Prompt retrieval failed:", error);
    return null;
  }
}

interface ScoutConfig {
  targetNiche: string;
  scanDepth: "shallow" | "normal" | "deep";
  maxRepos: number;
  maxIssues: number;
  cacheExpiry: number; // hours
}

interface Opportunity {
  name: string;
  owner: string;
  description: string;
  stars: number;
  forks: number;
  openIssues: number;
  lastUpdate: string;
  url: string;
  
  // Calculated fields
  isAbandoned: boolean;  // No update in 365+ days
  hasProvenDemand: boolean;  // Stars > 500
  lowCompetition: boolean;  // Forks < 200
  blueOceanScore: number;  // 0-100
  
  // Metrics for goldmine detection
  daysSinceUpdate: number;
  forkRatio: number;  // forks / stars
}

interface PainPoint {
  id: string;
  source: "issue" | "discussion" | "pr" | "readme";
  repository: string;
  title: string;
  description: string;
  indicators: string[];
  severity: "critical" | "high" | "medium" | "low";
  frequency: number;
  firstSeen: string;
  lastSeen: string;
  urls: string[];
}

interface ProductOpportunity {
  id: string;
  category: string;
  painPoint: string;
  solution: string;
  confidence: number;
  marketSize: number; // estimated users affected
  competition: "none" | "weak" | "moderate" | "strong";
  effort: "low" | "medium" | "high";
  impact: "low" | "medium" | "high";
  evidence: string[];
  keywords: string[];
}

interface ScoutReport {
  timestamp: string;
  niche: string;
  scanDepth: string;
  repositoriesScanned: number;
  issuesAnalyzed: number;
  painPointsFound: number;
  opportunitiesIdentified: number;
  topPainPoints: PainPoint[];
  topOpportunities: ProductOpportunity[];
  trendsDetected: string[];
  nextActions: string[];
}

/**
 * Get date X days ago in GitHub format (YYYY-MM-DD)
 */
function getDateXDaysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
}

/**
 * Scan for Blue Ocean opportunities (abandoned goldmines)
 */
export async function scanBlueOcean(topic: string): Promise<Opportunity[]> {
  console.log(`🌊 Scanning Blue Ocean for: ${topic}\n`);
  
  const token = process.env.GITHUB_TOKEN;
  const opportunities: Opportunity[] = [];
  
  if (!token) {
    console.warn("⚠️  No GitHub token - returning mock opportunities");
    return generateMockOpportunities(topic);
  }
  
  try {
    // Search for repositories with proven demand
    // Strategy: Find popular projects that haven't been updated recently
    const queries = [
      `topic:${topic} stars:>1000 pushed:<${getDateXDaysAgo(365)}`,
      `topic:${topic} stars:500..5000 pushed:<${getDateXDaysAgo(365)}`,
      `${topic} in:name,description stars:>1000 archived:false`,
    ];
    
    for (const query of queries) {
      console.log(`  🔍 Query: ${query}`);
      
      const response = await fetch(
        `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&per_page=30`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );
      
      if (!response.ok) {
        console.warn(`  ⚠️  API error: ${response.status}`);
        continue;
      }
      
      const data = await response.json();
      
      for (const repo of data.items || []) {
        const opp = transformToOpportunity(repo);
        
        // Filter for high Blue Ocean scores
        if (opp.blueOceanScore >= 50) {
          opportunities.push(opp);
        }
      }
      
      // Rate limit protection
      await sleep(2000);
    }
  } catch (error) {
    console.error("Blue Ocean scan failed:", error);
    return generateMockOpportunities(topic);
  }
  
  // Remove duplicates and sort by score
  const unique = Array.from(
    new Map(opportunities.map(o => [o.url, o])).values()
  ).sort((a, b) => b.blueOceanScore - a.blueOceanScore);
  
  console.log(`✓ Found ${unique.length} Blue Ocean opportunities\n`);
  
  // Save to file
  await saveBlueOceanReport(unique, topic);
  
  return unique;
}

/**
 * Transform GitHub repo to Opportunity
 */
function transformToOpportunity(repo: any): Opportunity {
  const now = new Date();
  const lastUpdate = new Date(repo.updated_at);
  const daysSinceUpdate = Math.floor((now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24));
  const forkRatio = repo.forks_count / Math.max(1, repo.stargazers_count);
  
  const isAbandoned = daysSinceUpdate > 365;
  const hasProvenDemand = repo.stargazers_count > 500;
  const lowCompetition = repo.forks_count < 200;
  
  const blueOceanScore = calculateBlueOceanScore({
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    openIssues: repo.open_issues_count,
    daysSinceUpdate,
  });
  
  return {
    name: repo.name,
    owner: repo.owner.login,
    description: repo.description || "No description",
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    openIssues: repo.open_issues_count,
    lastUpdate: repo.updated_at,
    url: repo.html_url,
    isAbandoned,
    hasProvenDemand,
    lowCompetition,
    blueOceanScore,
    daysSinceUpdate,
    forkRatio: Math.round(forkRatio * 1000) / 1000,
  };
}

/**
 * Calculate Blue Ocean Score (0-100)
 */
function calculateBlueOceanScore(repo: {
  stars: number;
  forks: number;
  openIssues: number;
  daysSinceUpdate: number;
}): number {
  let score = 0;
  
  // High stars = proven demand (max 30 points)
  score += Math.min(30, (repo.stars / 1000) * 30);
  
  // Old but popular = abandoned goldmine (30 points)
  if (repo.daysSinceUpdate > 365 && repo.stars > 500) {
    score += 30;
  } else if (repo.daysSinceUpdate > 180 && repo.stars > 1000) {
    score += 20; // Still good if very popular
  }
  
  // Low forks = low competition (max 20 points)
  const forkRatio = repo.forks / Math.max(1, repo.stars);
  score += Math.max(0, 20 * (1 - forkRatio));
  
  // Active issues = ongoing demand (max 20 points)
  score += Math.min(20, (repo.openIssues / 50) * 20);
  
  return Math.round(score);
}

/**
 * Save Blue Ocean report
 */
async function saveBlueOceanReport(opportunities: Opportunity[], topic: string): Promise<void> {
  const today = new Date().toISOString().split("T")[0];
  const filename = `opportunities-${topic.replace(/\s+/g, "-")}-${today}.json`;
  const filepath = path.join(process.cwd(), "data", filename);
  
  fs.writeFileSync(filepath, JSON.stringify(opportunities, null, 2));
  console.log(`💾 Blue Ocean report saved to: ${filename}`);
  
  // Also save markdown summary
  const mdPath = path.join(process.cwd(), "data", "intelligence", `blue-ocean-${today}.md`);
  fs.writeFileSync(mdPath, generateBlueOceanMarkdown(opportunities, topic));
}

/**
 * Generate Blue Ocean markdown report
 */
function generateBlueOceanMarkdown(opportunities: Opportunity[], topic: string): string {
  let md = `# Blue Ocean Opportunities: ${topic}\n\n`;
  md += `**Generated:** ${new Date().toLocaleString()}\n`;
  md += `**Total Found:** ${opportunities.length}\n\n`;
  
  md += `## 🏆 Top 10 Goldmines\n\n`;
  
  opportunities.slice(0, 10).forEach((opp, idx) => {
    md += `### ${idx + 1}. ${opp.owner}/${opp.name} (Score: ${opp.blueOceanScore})\n\n`;
    md += `**${opp.description}**\n\n`;
    md += `- ⭐ Stars: ${opp.stars.toLocaleString()}\n`;
    md += `- 🍴 Forks: ${opp.forks.toLocaleString()} (${(opp.forkRatio * 100).toFixed(1)}% ratio)\n`;
    md += `- 🐛 Open Issues: ${opp.openIssues}\n`;
    md += `- 📅 Last Update: ${new Date(opp.lastUpdate).toLocaleDateString()} (${opp.daysSinceUpdate} days ago)\n`;
    md += `- 🌊 Blue Ocean Score: **${opp.blueOceanScore}/100**\n`;
    md += `- 🔗 [View on GitHub](${opp.url})\n\n`;
    
    md += `**Why it's a goldmine:**\n`;
    if (opp.isAbandoned) md += `- ⚠️ Abandoned (${opp.daysSinceUpdate} days since update)\n`;
    if (opp.hasProvenDemand) md += `- ✅ Proven demand (${opp.stars}+ stars)\n`;
    if (opp.lowCompetition) md += `- ✅ Low competition (${opp.forks} forks)\n`;
    md += `\n**Opportunity:** Build a modern alternative or fork with active maintenance.\n\n`;
    md += `---\n\n`;
  });
  
  // Abandoned goldmines section
  const abandonedGoldmines = opportunities.filter(o => o.isAbandoned && o.hasProvenDemand);
  if (abandonedGoldmines.length > 0) {
    md += `## 💎 Abandoned Goldmines (${abandonedGoldmines.length})\n\n`;
    md += `Projects with proven demand but no recent maintenance:\n\n`;
    abandonedGoldmines.slice(0, 5).forEach(opp => {
      md += `- **${opp.name}** (${opp.stars} stars, ${opp.daysSinceUpdate} days idle)\n`;
    });
    md += `\n`;
  }
  
  return md;
}

/**
 * Generate mock opportunities for testing
 */
function generateMockOpportunities(topic: string): Opportunity[] {
  return [
    {
      name: "awesome-tool",
      owner: "user1",
      description: `Popular ${topic} tool that hasn't been updated`,
      stars: 2500,
      forks: 150,
      openIssues: 45,
      lastUpdate: new Date(Date.now() - 500 * 24 * 60 * 60 * 1000).toISOString(),
      url: "https://github.com/user1/awesome-tool",
      isAbandoned: true,
      hasProvenDemand: true,
      lowCompetition: true,
      blueOceanScore: 85,
      daysSinceUpdate: 500,
      forkRatio: 0.06,
    },
    {
      name: "legacy-framework",
      owner: "user2",
      description: `${topic} framework with large user base`,
      stars: 5000,
      forks: 400,
      openIssues: 120,
      lastUpdate: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString(),
      url: "https://github.com/user2/legacy-framework",
      isAbandoned: true,
      hasProvenDemand: true,
      lowCompetition: false,
      blueOceanScore: 72,
      daysSinceUpdate: 400,
      forkRatio: 0.08,
    },
  ];
}

/**
 * Main Scout execution
 */
export async function runScout(): Promise<ScoutReport> {
  console.log("🔍 Council Scout Mission Starting...\n");
  console.log("=" .repeat(80));
  
  const config = getConfig();
  console.log(`Target Niche: ${config.targetNiche}`);
  console.log(`Scan Depth: ${config.scanDepth}`);
  console.log(`Max Repos: ${config.maxRepos}`);
  console.log(`Max Issues: ${config.maxIssues}\n`);
  
  // Step 1: Find trending repositories in niche
  console.log("📡 Step 1: Scanning GitHub for trending repositories...");
  const repos = await findTrendingRepos(config);
  console.log(`✓ Found ${repos.length} repositories\n`);
  
  // Step 2: Extract pain points from issues/discussions
  console.log("🔬 Step 2: Extracting pain points...");
  const painPoints = await extractPainPoints(repos, config);
  console.log(`✓ Extracted ${painPoints.length} pain points\n`);
  
  // Step 3: Cluster and prioritize pain points
  console.log("🎯 Step 3: Clustering and prioritizing...");
  const clusteredPainPoints = await clusterPainPoints(painPoints);
  console.log(`✓ Clustered into ${clusteredPainPoints.length} distinct problems\n`);
  
  // Step 4: Identify product opportunities
  console.log("💡 Step 4: Identifying product opportunities...");
  const opportunities = await identifyOpportunities(clusteredPainPoints);
  console.log(`✓ Found ${opportunities.length} opportunities\n`);
  
  // Step 5: Detect emerging trends
  console.log("📈 Step 5: Detecting trends...");
  const trends = await detectTrends(painPoints);
  console.log(`✓ Detected ${trends.length} trends\n`);
  
  // Step 6: Blue Ocean scan
  console.log("🌊 Step 6: Scanning for Blue Ocean opportunities...");
  const blueOceanOpps = await scanBlueOcean(config.targetNiche);
  console.log(`✓ Found ${blueOceanOpps.length} Blue Ocean opportunities\n`);
  
  // Generate report
  const report: ScoutReport = {
    timestamp: new Date().toISOString(),
    niche: config.targetNiche,
    scanDepth: config.scanDepth,
    repositoriesScanned: repos.length,
    issuesAnalyzed: painPoints.length,
    painPointsFound: clusteredPainPoints.length,
    opportunitiesIdentified: opportunities.length,
    topPainPoints: clusteredPainPoints.slice(0, 10),
    topOpportunities: opportunities.slice(0, 10),
    trendsDetected: trends,
    nextActions: generateNextActions(opportunities, trends),
  };
  
  // Save results
  await saveIntelligence(report);
  
  // Print summary
  printSummary(report);
  
  return report;
}

/**
 * Get configuration from environment
 */
function getConfig(): ScoutConfig {
  const depth = (process.env.SCAN_DEPTH || "normal") as ScoutConfig["scanDepth"];
  
  const depthSettings = {
    shallow: { maxRepos: 10, maxIssues: 50 },
    normal: { maxRepos: 25, maxIssues: 100 },
    deep: { maxRepos: 50, maxIssues: 200 },
  };
  
  const settings = depthSettings[depth];
  
  return {
    targetNiche: process.env.TARGET_NICHE || "developer tools",
    scanDepth: depth,
    maxRepos: settings.maxRepos,
    maxIssues: settings.maxIssues,
    cacheExpiry: 24, // hours
  };
}

/**
 * Find trending repositories in target niche
 */
async function findTrendingRepos(config: ScoutConfig): Promise<any[]> {
  const cacheFile = path.join(process.cwd(), "data", "cache", "repos.json");
  
  // Check cache
  if (await isCacheValid(cacheFile, config.cacheExpiry)) {
    console.log("  📦 Using cached repository data");
    return JSON.parse(fs.readFileSync(cacheFile, "utf-8"));
  }
  
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.warn("  ⚠️  No GitHub token - using mock data");
    return generateMockRepos(config);
  }
  
  // Search GitHub
  const query = buildSearchQuery(config.targetNiche);
  const repos: any[] = [];
  
  try {
    const response = await fetch(
      `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=${config.maxRepos}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    const data = await response.json();
    repos.push(...(data.items || []));
    
    // Cache results
    fs.mkdirSync(path.dirname(cacheFile), { recursive: true });
    fs.writeFileSync(cacheFile, JSON.stringify(repos, null, 2));
  } catch (error) {
    console.warn("  ⚠️  GitHub API failed, using mock data:", error);
    return generateMockRepos(config);
  }
  
  return repos;
}

/**
 * Extract pain points from repositories
 */
async function extractPainPoints(repos: any[], config: ScoutConfig): Promise<PainPoint[]> {
  const painPoints: PainPoint[] = [];
  const token = process.env.GITHUB_TOKEN;
  
  // Pain point indicators (keywords that suggest problems)
  const indicators = [
    "doesn't work",
    "not working",
    "broken",
    "bug",
    "issue",
    "problem",
    "error",
    "fail",
    "can't",
    "unable to",
    "missing",
    "need",
    "wish",
    "would be nice",
    "feature request",
    "frustrated",
    "annoying",
    "confusing",
    "difficult",
    "hard to",
  ];
  
  for (const repo of repos.slice(0, Math.min(repos.length, config.maxRepos))) {
    console.log(`  📖 Scanning ${repo.full_name}...`);
    
    try {
      // Fetch issues (pain points are often in issues)
      const issuesUrl = `https://api.github.com/repos/${repo.full_name}/issues?state=all&per_page=20&sort=comments&direction=desc`;
      
      if (token) {
        const response = await fetch(issuesUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github.v3+json",
          },
        });
        
        if (response.ok) {
          const issues = await response.json();
          
          for (const issue of issues) {
            const text = `${issue.title} ${issue.body || ""}`.toLowerCase();
            const matchedIndicators = indicators.filter(ind => text.includes(ind));
            
            if (matchedIndicators.length > 0) {
              painPoints.push({
                id: `${repo.full_name}-${issue.number}`,
                source: "issue",
                repository: repo.full_name,
                title: issue.title,
                description: (issue.body || "").slice(0, 500),
                indicators: matchedIndicators,
                severity: calculateSeverity(issue, matchedIndicators),
                frequency: issue.comments,
                firstSeen: issue.created_at,
                lastSeen: issue.updated_at,
                urls: [issue.html_url],
              });
            }
          }
        }
      }
      
      // Rate limit protection
      await sleep(1000); // 1 second between repos
    } catch (error) {
      console.warn(`  ⚠️  Failed to scan ${repo.full_name}:`, error);
    }
    
    if (painPoints.length >= config.maxIssues) break;
  }
  
  // Add mock data if no real data
  if (painPoints.length === 0) {
    painPoints.push(...generateMockPainPoints());
  }
  
  return painPoints;
}

/**
 * Cluster similar pain points
 */
async function clusterPainPoints(painPoints: PainPoint[]): Promise<PainPoint[]> {
  // Simple keyword-based clustering
  const clusters = new Map<string, PainPoint[]>();
  
  for (const point of painPoints) {
    const keywords = extractKeywords(point.title + " " + point.description);
    const clusterKey = keywords.slice(0, 3).join("-");
    
    if (!clusters.has(clusterKey)) {
      clusters.set(clusterKey, []);
    }
    clusters.get(clusterKey)!.push(point);
  }
  
  // Merge clusters and pick representative
  const clustered: PainPoint[] = [];
  
  for (const [, points] of clusters) {
    if (points.length === 0) continue;
    
    // Pick the one with most engagement
    const representative = points.sort((a, b) => b.frequency - a.frequency)[0];
    
    // Merge data
    representative.frequency = points.reduce((sum, p) => sum + p.frequency, 0);
    representative.urls = points.flatMap(p => p.urls).slice(0, 5);
    
    clustered.push(representative);
  }
  
  return clustered.sort((a, b) => b.frequency - a.frequency);
}

/**
 * Identify product opportunities from pain points
 */
async function identifyOpportunities(painPoints: PainPoint[]): Promise<ProductOpportunity[]> {
  const opportunities: ProductOpportunity[] = [];
  
  for (const point of painPoints) {
    // Generate solution ideas
    const solutions = generateSolutions(point);
    
    for (const solution of solutions) {
      opportunities.push({
        id: `opp-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        category: categorizeOpportunity(),
        painPoint: point.title,
        solution: solution,
        confidence: calculateConfidence(point),
        marketSize: estimateMarketSize(point),
        competition: assessCompetition(),
        effort: estimateEffort(solution),
        impact: estimateImpact(point),
        evidence: [point.repository, ...point.urls.slice(0, 3)],
        keywords: extractKeywords(point.title + " " + solution),
      });
    }
  }
  
  // Sort by impact/effort ratio
  return opportunities
    .sort((a, b) => {
      const scoreA = (impactScore(a.impact) / effortScore(a.effort)) * a.confidence;
      const scoreB = (impactScore(b.impact) / effortScore(b.effort)) * b.confidence;
      return scoreB - scoreA;
    })
    .slice(0, 20);
}

/**
 * Detect emerging trends
 */
async function detectTrends(painPoints: PainPoint[]): Promise<string[]> {
  const trends: string[] = [];
  
  // Analyze keywords frequency
  const keywordCounts = new Map<string, number>();
  
  for (const point of painPoints) {
    const keywords = extractKeywords(point.title + " " + point.description);
    for (const keyword of keywords) {
      keywordCounts.set(keyword, (keywordCounts.get(keyword) || 0) + 1);
    }
  }
  
  // Find trending keywords (appear in >10% of pain points)
  const threshold = painPoints.length * 0.1;
  for (const [keyword, count] of keywordCounts) {
    if (count >= threshold && keyword.length > 3) {
      trends.push(`${keyword} (${count} mentions)`);
    }
  }
  
  return trends.slice(0, 10);
}

/**
 * Generate next actions
 */
function generateNextActions(opportunities: ProductOpportunity[], trends: string[]): string[] {
  const actions: string[] = [];
  
  if (opportunities.length > 0) {
    const top = opportunities[0];
    actions.push(`Build: ${top.solution} (${top.impact} impact, ${top.effort} effort)`);
  }
  
  if (trends.length > 0) {
    actions.push(`Research trend: ${trends[0]}`);
  }
  
  actions.push("Review data/opportunities/ for detailed analysis");
  actions.push("Run deep scan on Sunday for more insights");
  
  return actions;
}

/**
 * Save intelligence to files
 */
async function saveIntelligence(report: ScoutReport): Promise<void> {
  const dataDir = path.join(process.cwd(), "data");
  
  // Save full report
  const reportPath = path.join(dataDir, "reports", `scout-${Date.now()}.json`);
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  // Save opportunities
  const oppPath = path.join(dataDir, "opportunities", "latest.json");
  fs.mkdirSync(path.dirname(oppPath), { recursive: true });
  fs.writeFileSync(oppPath, JSON.stringify(report.topOpportunities, null, 2));
  
  // Save markdown summary
  const summaryPath = path.join(dataDir, "intelligence", "latest.md");
  fs.mkdirSync(path.dirname(summaryPath), { recursive: true });
  fs.writeFileSync(summaryPath, generateMarkdownSummary(report));
  
  console.log(`💾 Intelligence saved to ${dataDir}`);
}

/**
 * Generate markdown summary
 */
function generateMarkdownSummary(report: ScoutReport): string {
  let md = `# Council Intelligence Report\n\n`;
  md += `**Generated:** ${new Date(report.timestamp).toLocaleString()}\n`;
  md += `**Niche:** ${report.niche}\n`;
  md += `**Scan Depth:** ${report.scanDepth}\n\n`;
  
  md += `## Summary\n\n`;
  md += `- Repositories Scanned: ${report.repositoriesScanned}\n`;
  md += `- Pain Points Found: ${report.painPointsFound}\n`;
  md += `- Opportunities Identified: ${report.opportunitiesIdentified}\n\n`;
  
  md += `## Top Pain Points\n\n`;
  report.topPainPoints.slice(0, 5).forEach((point, idx) => {
    md += `### ${idx + 1}. ${point.title}\n\n`;
    md += `- **Severity:** ${point.severity}\n`;
    md += `- **Frequency:** ${point.frequency} engagements\n`;
    md += `- **Source:** ${point.repository}\n`;
    md += `- **URL:** ${point.urls[0]}\n\n`;
  });
  
  md += `## Top Opportunities\n\n`;
  report.topOpportunities.slice(0, 5).forEach((opp, idx) => {
    md += `### ${idx + 1}. ${opp.solution}\n\n`;
    md += `- **Pain Point:** ${opp.painPoint}\n`;
    md += `- **Impact:** ${opp.impact} | **Effort:** ${opp.effort}\n`;
    md += `- **Confidence:** ${Math.round(opp.confidence * 100)}%\n`;
    md += `- **Competition:** ${opp.competition}\n\n`;
  });
  
  md += `## Emerging Trends\n\n`;
  report.trendsDetected.forEach(trend => {
    md += `- ${trend}\n`;
  });
  
  md += `\n## Next Actions\n\n`;
  report.nextActions.forEach((action, idx) => {
    md += `${idx + 1}. ${action}\n`;
  });
  
  return md;
}

/**
 * Print summary to console
 */
function printSummary(report: ScoutReport): void {
  console.log("=" .repeat(80));
  console.log("📊 SCOUT MISSION COMPLETE");
  console.log("=" .repeat(80));
  console.log(`\n🎯 Scanned: ${report.repositoriesScanned} repositories`);
  console.log(`🔍 Found: ${report.painPointsFound} pain points`);
  console.log(`💡 Identified: ${report.opportunitiesIdentified} opportunities\n`);
  
  console.log("🔥 TOP 3 OPPORTUNITIES:");
  report.topOpportunities.slice(0, 3).forEach((opp, idx) => {
    console.log(`${idx + 1}. ${opp.solution}`);
    console.log(`   Impact: ${opp.impact} | Effort: ${opp.effort} | Confidence: ${Math.round(opp.confidence * 100)}%\n`);
  });
  
  console.log("📈 TRENDING:");
  report.trendsDetected.slice(0, 3).forEach(trend => console.log(`  • ${trend}`));
  
  console.log("\n✅ Mission Complete!");
}

// Helper functions

function buildSearchQuery(niche: string): string {
  return `${niche} stars:>100 pushed:>2024-01-01`;
}

async function isCacheValid(file: string, expiryHours: number): Promise<boolean> {
  if (!fs.existsSync(file)) return false;
  const stats = fs.statSync(file);
  const age = Date.now() - stats.mtimeMs;
  return age < expiryHours * 60 * 60 * 1000;
}

function calculateSeverity(issue: any, indicators: string[]): PainPoint["severity"] {
  const score = indicators.length + (issue.comments / 10);
  if (score > 5) return "critical";
  if (score > 3) return "high";
  if (score > 1) return "medium";
  return "low";
}

function extractKeywords(text: string): string[] {
  const words = text.toLowerCase().match(/\b\w{4,}\b/g) || [];
  const stopWords = ["this", "that", "with", "from", "have", "will", "would", "should", "could"];
  return [...new Set(words.filter(w => !stopWords.includes(w)))];
}

function generateSolutions(point: PainPoint): string[] {
  const solutions: string[] = [];
  const text = point.title.toLowerCase();
  
  if (text.includes("slow") || text.includes("performance")) {
    solutions.push("Build optimized alternative with better performance");
  }
  if (text.includes("complex") || text.includes("confusing")) {
    solutions.push("Create simplified UI/UX for this workflow");
  }
  if (text.includes("missing") || text.includes("need")) {
    solutions.push("Add missing feature as standalone tool");
  }
  if (text.includes("integration") || text.includes("connect")) {
    solutions.push("Build integration layer/connector");
  }
  
  if (solutions.length === 0) {
    solutions.push(`Tool to solve: ${point.title}`);
  }
  
  return solutions;
}

function categorizeOpportunity(): string {
  const categories = ["Developer Tools", "UI/UX", "Integration", "Performance", "Automation"];
  return categories[Math.floor(Math.random() * categories.length)];
}

function calculateConfidence(point: PainPoint): number {
  let score = 0.5;
  score += point.frequency * 0.01;
  score += point.indicators.length * 0.05;
  if (point.severity === "critical") score += 0.2;
  return Math.min(score, 1);
}

function estimateMarketSize(point: PainPoint): number {
  return point.frequency * 100; // Rough estimate
}

function assessCompetition(): ProductOpportunity["competition"] {
  return ["none", "weak", "moderate", "strong"][Math.floor(Math.random() * 4)] as any;
}

function estimateEffort(solution: string): ProductOpportunity["effort"] {
  if (solution.includes("simple") || solution.includes("tool")) return "low";
  if (solution.includes("integration") || solution.includes("build")) return "medium";
  return "high";
}

function estimateImpact(point: PainPoint): ProductOpportunity["impact"] {
  if (point.severity === "critical") return "high";
  if (point.frequency > 10) return "high";
  if (point.frequency > 5) return "medium";
  return "low";
}

function impactScore(impact: string): number {
  return { low: 1, medium: 2, high: 3 }[impact] || 1;
}

function effortScore(effort: string): number {
  return { low: 1, medium: 2, high: 3 }[effort] || 1;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Mock data generators

function generateMockRepos(config: ScoutConfig): any[] {
  const mockRepos = [];
  for (let i = 0; i < config.maxRepos; i++) {
    mockRepos.push({
      full_name: `user/project-${i}`,
      name: `project-${i}`,
      stargazers_count: 1000 - i * 10,
      description: `Mock ${config.targetNiche} project`,
    });
  }
  return mockRepos;
}

function generateMockPainPoints(): PainPoint[] {
  return [
    {
      id: "mock-1",
      source: "issue",
      repository: "user/project-1",
      title: "Performance issues with large datasets",
      description: "The tool becomes slow when processing more than 10k items",
      indicators: ["slow", "performance", "issue"],
      severity: "high",
      frequency: 25,
      firstSeen: new Date().toISOString(),
      lastSeen: new Date().toISOString(),
      urls: ["https://github.com/user/project-1/issues/1"],
    },
    {
      id: "mock-2",
      source: "issue",
      repository: "user/project-2",
      title: "Missing TypeScript support",
      description: "Would be great to have TypeScript definitions",
      indicators: ["missing", "need", "would be nice"],
      severity: "medium",
      frequency: 15,
      firstSeen: new Date().toISOString(),
      lastSeen: new Date().toISOString(),
      urls: ["https://github.com/user/project-2/issues/5"],
    },
  ];
}

// Main execution
runScout()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Scout mission failed:", error);
    process.exit(1);
  });

/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Market Gap Identifier - META-FEATURE
 * 
 * Cross-platform analysis to find underserved markets by analyzing reports
 * from all other features (Mining Drill, Reddit Sniper, Pain Points, etc.)
 * 
 * This is NOT a direct platform scanner. It SYNTHESIZES existing reports to find GAPS.
 */

import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

// ============================================================================
// INTERFACES
// ============================================================================

interface NicheConfig {
  id: string;
  name: string;
  enabled: boolean;
}

interface ReportData {
  feature: string;
  niche: string;
  date: string;
  content: string;
}

interface DemandSignals {
  miningDrillPainPoints: number;
  redditSniperHighIntent: number;
  redditPainPatterns: number;
  hackerNewsBuyingSignals: number;
  totalDemandScore: number;
  evidenceLinks: string[];
}

interface SupplySignals {
  goldmineActiveTools: number;
  forkEvolutionActiveForks: number;
  stargazerQualityRepos: number;
  trendingNewTools: number;
  totalSupplyScore: number;
  existingTools: string[];
}

interface MarketGap {
  niche: string;
  nicheName: string;
  demandScore: number;
  supplyScore: number;
  gapScore: number;
  opportunityScore: number;
  category: 'Blue Ocean' | 'Underserved' | 'Growing' | 'Saturated' | 'No Opportunity';
  demandSignals: DemandSignals;
  supplySignals: SupplySignals;
  recommendedAction: string;
}

// ============================================================================
// CONFIG LOADER
// ============================================================================

function loadNicheConfig(): NicheConfig[] {
  const configPath = path.join(process.cwd(), 'config', 'target-niches.yaml');
  const fileContent = fs.readFileSync(configPath, 'utf8');
  const config = yaml.load(fileContent) as any;
  return config.niches.filter((n: any) => n.enabled !== false);
}

// ============================================================================
// REPORT LOADER
// ============================================================================

async function loadRecentReports(nicheId: string, daysBack: number = 7): Promise<ReportData[]> {
  const reports: ReportData[] = [];
  const reportsDir = path.join(process.cwd(), 'data', 'reports');
  const threshold = new Date();
  threshold.setDate(threshold.getDate() - daysBack);
  
  const features = [
    'mining-drill', 
    'reddit-sniper', 
    'reddit-pain-points', 
    'hackernews', 
    'goldmine', 
    'fork-evolution', 
    'stargazer', 
    'viral-radar',
    'github-trending'
  ];
  
  for (const feature of features) {
    const pattern = path.join(reportsDir, `${feature}-${nicheId}-*.md`);
    const files = await glob(pattern);
    
    for (const file of files) {
      const match = file.match(/(\d{4}-\d{2}-\d{2})/);
      if (!match) continue;
      
      const fileDate = new Date(match[1]);
      if (fileDate < threshold) continue;
      
      const content = fs.readFileSync(file, 'utf8');
      reports.push({
        feature,
        niche: nicheId,
        date: match[1],
        content
      });
    }
  }
  
  return reports;
}

// ============================================================================
// DEMAND SIGNAL EXTRACTION
// ============================================================================

function extractDemandSignals(reports: ReportData[]): DemandSignals {
  const signals: DemandSignals = {
    miningDrillPainPoints: 0,
    redditSniperHighIntent: 0,
    redditPainPatterns: 0,
    hackerNewsBuyingSignals: 0,
    totalDemandScore: 0,
    evidenceLinks: []
  };
  
  for (const report of reports) {
    const content = report.content;
    
    // Mining Drill: Count pain points (## 1., ## 2., etc.)
    if (report.feature === 'mining-drill') {
      const painMatches = content.match(/##\s+\d+\./g);
      if (painMatches) {
        signals.miningDrillPainPoints += painMatches.length;
        signals.evidenceLinks.push(`Mining Drill (${report.date}): ${painMatches.length} pain points`);
      }
    }
    
    // Reddit Sniper: Count high-intent posts (Intent Score: 80+)
    if (report.feature === 'reddit-sniper') {
      const intentMatches = content.match(/Intent Score:\*\*\s*(\d+)\/100/g);
      if (intentMatches) {
        const highIntent = intentMatches.filter(m => {
          const score = parseInt(m.match(/\d+/)?.[0] || '0');
          return score >= 80;
        }).length;
        if (highIntent > 0) {
          signals.redditSniperHighIntent += highIntent;
          signals.evidenceLinks.push(`Reddit Sniper (${report.date}): ${highIntent} high-intent buyers`);
        }
      }
    }
    
    // Reddit Pain Points: Count major patterns (Pain Score: 80+)
    if (report.feature === 'reddit-pain-points') {
      const patternMatches = content.match(/Pain Score:\*\*\s*(\d+)\/100/g);
      if (patternMatches) {
        const highPain = patternMatches.filter(m => {
          const score = parseInt(m.match(/\d+/)?.[0] || '0');
          return score >= 80;
        }).length;
        if (highPain > 0) {
          signals.redditPainPatterns += highPain;
          signals.evidenceLinks.push(`Reddit Pain Points (${report.date}): ${highPain} major patterns`);
        }
      }
    }
    
    // HackerNews: Count buying signals
    if (report.feature === 'hackernews') {
      const buyingMatches = content.match(/💰 Buying Signals:/g);
      if (buyingMatches) {
        signals.hackerNewsBuyingSignals += buyingMatches.length;
        signals.evidenceLinks.push(`HackerNews (${report.date}): ${buyingMatches.length} buying signals`);
      }
    }
  }
  
  // Calculate total demand score (0-100)
  signals.totalDemandScore = Math.min(
    (signals.miningDrillPainPoints * 0.5) +      // Max 40 points (80 pain points * 0.5)
    (signals.redditSniperHighIntent * 2) +       // Max 20 points (10 high-intent * 2)
    (signals.redditPainPatterns * 2) +           // Max 20 points (10 patterns * 2)
    (signals.hackerNewsBuyingSignals * 1),       // Max 20 points (20 signals * 1)
    100
  );
  
  return signals;
}

// ============================================================================
// SUPPLY SIGNAL EXTRACTION
// ============================================================================

function extractSupplySignals(reports: ReportData[]): SupplySignals {
  const signals: SupplySignals = {
    goldmineActiveTools: 0,
    forkEvolutionActiveForks: 0,
    stargazerQualityRepos: 0,
    trendingNewTools: 0,
    totalSupplyScore: 0,
    existingTools: []
  };
  
  for (const report of reports) {
    const content = report.content;
    
    // Goldmine: Count abandoned tools (fewer = less supply = better gap)
    // Logic: If Goldmine finds abandoned tools, market has SOME activity
    if (report.feature === 'goldmine') {
      const goldmineMatches = content.match(/##\s+\d+\./g);
      if (goldmineMatches) {
        // More abandoned tools = more market activity = higher supply
        signals.goldmineActiveTools += goldmineMatches.length;
      }
    }
    
    // Fork Evolution: Count active forks
    if (report.feature === 'fork-evolution') {
      const forkMatches = content.match(/Active Forks.*?:\s*(\d+)/g);
      if (forkMatches) {
        const totalForks = forkMatches.reduce((sum, m) => {
          const num = parseInt(m.match(/\d+/)?.[0] || '0');
          return sum + num;
        }, 0);
        signals.forkEvolutionActiveForks += totalForks;
      }
    }
    
    // Stargazer: Count quality repos (Quality Score: 70+)
    if (report.feature === 'stargazer') {
      const qualityMatches = content.match(/Quality Score:\*\*\s*(\d+)\/100/g);
      if (qualityMatches) {
        const quality = qualityMatches.filter(m => {
          const score = parseInt(m.match(/\d+/)?.[0] || '0');
          return score >= 70;
        }).length;
        signals.stargazerQualityRepos += quality;
        
        // Extract repo names as existing tools
        const repoMatches = content.match(/##\s+\d+\.\s+([\w-]+\/[\w-]+)/g);
        if (repoMatches) {
          const repos = repoMatches.map(m => m.replace(/##\s+\d+\.\s+/, ''));
          signals.existingTools.push(...repos);
        }
      }
    }
    
    // GitHub Trending: Count trending tools (Trend Score: 60+)
    if (report.feature === 'github-trending') {
      const trendMatches = content.match(/Trend Score:\*\*\s*(\d+)\/100/g);
      if (trendMatches) {
        const trending = trendMatches.filter(m => {
          const score = parseInt(m.match(/\d+/)?.[0] || '0');
          return score >= 60;
        }).length;
        signals.trendingNewTools += trending;
      }
    }
  }
  
  // Calculate total supply score (0-100)
  signals.totalSupplyScore = Math.min(
    (signals.goldmineActiveTools * 10) +         // Max 40 points (4 tools * 10)
    (signals.forkEvolutionActiveForks * 2) +     // Max 30 points (15 forks * 2)
    (signals.stargazerQualityRepos * 5) +        // Max 20 points (4 repos * 5)
    (signals.trendingNewTools * 5),              // Max 10 points (2 trending * 5)
    100
  );
  
  return signals;
}

// ============================================================================
// GAP ANALYSIS
// ============================================================================

function analyzeMarketGap(
  niche: NicheConfig,
  demandSignals: DemandSignals,
  supplySignals: SupplySignals
): MarketGap {
  const demandScore = demandSignals.totalDemandScore;
  const supplyScore = supplySignals.totalSupplyScore;
  
  // Gap Score: Demand - Supply (can be negative if oversaturated)
  const gapScore = Math.max(0, demandScore - supplyScore);
  
  // Opportunity Score: Weighted combination
  // - Gap matters more (60%)
  // - Raw demand also matters (40%)
  const opportunityScore = Math.round((gapScore * 0.6) + (demandScore * 0.4));
  
  // Categorize market gap
  let category: MarketGap['category'];
  let recommendedAction: string;
  
  if (demandScore >= 80 && supplyScore <= 20) {
    category = 'Blue Ocean';
    recommendedAction = '🚀 BUILD IMMEDIATELY - Massive demand, almost zero competition!';
  } else if (demandScore >= 60 && supplyScore <= 40) {
    category = 'Underserved';
    recommendedAction = '✅ STRONG OPPORTUNITY - High demand, low competition. Build with differentiation.';
  } else if (demandScore >= 40 && supplyScore <= 40) {
    category = 'Growing';
    recommendedAction = '📈 MONITOR CLOSELY - Emerging opportunity. Wait for demand signals to strengthen.';
  } else if (demandScore >= 60 && supplyScore >= 60) {
    category = 'Saturated';
    recommendedAction = '⚠️ CROWDED MARKET - High competition. Only enter with unique angle or superior execution.';
  } else {
    category = 'No Opportunity';
    recommendedAction = '❌ SKIP - Insufficient demand signals. Focus on other niches.';
  }
  
  return {
    niche: niche.id,
    nicheName: niche.name,
    demandScore,
    supplyScore,
    gapScore,
    opportunityScore,
    category,
    demandSignals,
    supplySignals,
    recommendedAction
  };
}

// ============================================================================
// REPORT GENERATION
// ============================================================================

function generateReport(gaps: MarketGap[]): string {
  const date = new Date().toISOString().split('T')[0];
  
  let report = `# Market Gap Analysis Report\n\n`;
  report += `**Date:** ${date}\n`;
  report += `**Niches Analyzed:** ${gaps.length}\n\n`;
  report += `---\n\n`;
  
  report += `## 📊 What is Market Gap Analysis?\n\n`;
  report += `Market Gap Identifier is a META-FEATURE that synthesizes intelligence from ALL other features:\n`;
  report += `- **Demand Signals:** Mining Drill, Reddit Sniper, Pain Points, HackerNews\n`;
  report += `- **Supply Signals:** Goldmine, Fork Evolution, Stargazer, GitHub Trending\n\n`;
  report += `It identifies opportunities where demand EXCEEDS supply = underserved markets.\n\n`;
  
  report += `**Gap Categories:**\n`;
  report += `- 🌊 **Blue Ocean:** Demand 80+, Supply 0-20 (BEST!)\n`;
  report += `- ✅ **Underserved:** Demand 60+, Supply 20-40\n`;
  report += `- 📈 **Growing:** Demand 40+, Supply 0-40\n`;
  report += `- ⚠️ **Saturated:** Demand 60+, Supply 60+\n`;
  report += `- ❌ **No Opportunity:** Demand <40\n\n`;
  
  report += `---\n\n`;
  
  // Sort by opportunity score descending
  const sortedGaps = [...gaps].sort((a, b) => b.opportunityScore - a.opportunityScore);
  
  report += `## 🎯 Top Opportunities\n\n`;
  const topGaps = sortedGaps.slice(0, 3);
  topGaps.forEach((gap, index) => {
    const emoji = gap.category === 'Blue Ocean' ? '🌊' : 
                  gap.category === 'Underserved' ? '✅' :
                  gap.category === 'Growing' ? '📈' : 
                  gap.category === 'Saturated' ? '⚠️' : '❌';
    
    report += `### ${index + 1}. ${emoji} ${gap.nicheName}\n\n`;
    report += `**Category:** ${gap.category}\n`;
    report += `**Opportunity Score:** ${gap.opportunityScore}/100\n\n`;
    report += `| Metric | Score |\n`;
    report += `|--------|-------|\n`;
    report += `| Demand | ${gap.demandScore}/100 |\n`;
    report += `| Supply | ${gap.supplyScore}/100 |\n`;
    report += `| Gap | ${gap.gapScore}/100 |\n\n`;
    report += `**Action:** ${gap.recommendedAction}\n\n`;
  });
  
  report += `---\n\n`;
  
  // Full analysis for all niches
  report += `## 📋 Complete Analysis\n\n`;
  sortedGaps.forEach((gap, index) => {
    const emoji = gap.category === 'Blue Ocean' ? '🌊' : 
                  gap.category === 'Underserved' ? '✅' :
                  gap.category === 'Growing' ? '📈' : 
                  gap.category === 'Saturated' ? '⚠️' : '❌';
    
    report += `### ${index + 1}. ${emoji} ${gap.nicheName}\n\n`;
    report += `**Niche ID:** ${gap.niche}\n`;
    report += `**Category:** ${gap.category}\n`;
    report += `**Opportunity Score:** ${gap.opportunityScore}/100\n\n`;
    
    report += `#### Scores\n\n`;
    report += `| Metric | Score |\n`;
    report += `|--------|-------|\n`;
    report += `| Demand | ${gap.demandScore}/100 |\n`;
    report += `| Supply | ${gap.supplyScore}/100 |\n`;
    report += `| Gap | ${gap.gapScore}/100 |\n\n`;
    
    report += `#### Demand Signals\n\n`;
    report += `- Mining Drill Pain Points: ${gap.demandSignals.miningDrillPainPoints}\n`;
    report += `- Reddit Sniper High Intent: ${gap.demandSignals.redditSniperHighIntent}\n`;
    report += `- Reddit Pain Patterns: ${gap.demandSignals.redditPainPatterns}\n`;
    report += `- HackerNews Buying Signals: ${gap.demandSignals.hackerNewsBuyingSignals}\n\n`;
    
    if (gap.demandSignals.evidenceLinks.length > 0) {
      report += `**Evidence:**\n`;
      gap.demandSignals.evidenceLinks.forEach(link => {
        report += `- ${link}\n`;
      });
      report += `\n`;
    }
    
    report += `#### Supply Signals\n\n`;
    report += `- Goldmine Active Tools: ${gap.supplySignals.goldmineActiveTools}\n`;
    report += `- Fork Evolution Active Forks: ${gap.supplySignals.forkEvolutionActiveForks}\n`;
    report += `- Stargazer Quality Repos: ${gap.supplySignals.stargazerQualityRepos}\n`;
    report += `- GitHub Trending New Tools: ${gap.supplySignals.trendingNewTools}\n\n`;
    
    if (gap.supplySignals.existingTools.length > 0) {
      report += `**Existing Tools:**\n`;
      gap.supplySignals.existingTools.slice(0, 5).forEach(tool => {
        report += `- ${tool}\n`;
      });
      if (gap.supplySignals.existingTools.length > 5) {
        report += `- ... and ${gap.supplySignals.existingTools.length - 5} more\n`;
      }
      report += `\n`;
    }
    
    report += `**Recommended Action:** ${gap.recommendedAction}\n\n`;
    report += `---\n\n`;
  });
  
  report += `## 💡 How to Use This Report\n\n`;
  report += `1. **Focus on Blue Ocean & Underserved** - These are validated opportunities\n`;
  report += `2. **Check Evidence Links** - Review source reports for context\n`;
  report += `3. **Cross-Reference Supply** - Understand competitive landscape\n`;
  report += `4. **Act on Top 3** - Build MVPs or validate with target audience\n\n`;
  
  report += `---\n\n`;
  report += `*Report generated by Market Gap Identifier META-FEATURE*\n`;
  report += `*Data sources: ${gaps[0]?.demandSignals.evidenceLinks.length || 0}+ intelligence reports analyzed*\n`;
  
  return report;
}

// ============================================================================
// MAIN FUNCTION
// ============================================================================

export async function analyzeMarketGaps(): Promise<void> {
  console.log('🔍 Market Gap Identifier - Starting Analysis...\n');
  
  // Load niche configuration
  const niches = loadNicheConfig();
  console.log(`📋 Found ${niches.length} enabled niches\n`);
  
  const gaps: MarketGap[] = [];
  
  // Analyze each niche
  for (const niche of niches) {
    console.log(`🎯 Analyzing: ${niche.name}`);
    console.log(`   Niche ID: ${niche.id}`);
    
    // Load recent reports (last 7 days)
    const reports = await loadRecentReports(niche.id, 7);
    console.log(`   📄 Loaded ${reports.length} reports from last 7 days`);
    
    // Extract signals
    const demandSignals = extractDemandSignals(reports);
    const supplySignals = extractSupplySignals(reports);
    
    console.log(`   📈 Demand Score: ${demandSignals.totalDemandScore}/100`);
    console.log(`   📊 Supply Score: ${supplySignals.totalSupplyScore}/100`);
    
    // Analyze gap
    const gap = analyzeMarketGap(niche, demandSignals, supplySignals);
    gaps.push(gap);
    
    console.log(`   ${gap.category === 'Blue Ocean' ? '🌊' : 
                    gap.category === 'Underserved' ? '✅' :
                    gap.category === 'Growing' ? '📈' : 
                    gap.category === 'Saturated' ? '⚠️' : '❌'} Category: ${gap.category}`);
    console.log(`   💯 Opportunity Score: ${gap.opportunityScore}/100\n`);
  }
  
  // Generate report
  console.log('📝 Generating market gap report...');
  const report = generateReport(gaps);
  
  // Save report
  const date = new Date().toISOString().split('T')[0];
  const outputDir = path.join(process.cwd(), 'data', 'intelligence');
  
  // Ensure directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const outputPath = path.join(outputDir, `market-gaps-${date}.md`);
  fs.writeFileSync(outputPath, report, 'utf8');
  
  console.log(`✅ Report saved to: ${outputPath}`);
  console.log(`\n🎯 Top Opportunity: ${gaps.sort((a, b) => b.opportunityScore - a.opportunityScore)[0]?.nicheName || 'None'}`);
}

/**
 * Abandoned Goldmine Detector
 * Filters high-ROI opportunities from Blue Ocean scans
 */

export interface Opportunity {
  owner: string;
  name: string;
  stars: number;
  forks: number;
  openIssues: number;
  lastUpdate: string;
  daysSinceUpdate: number;
  url: string;
  description: string;
  language: string;
  blueOceanScore?: number;
  forkRatio?: number;
}

export interface GoldmineMetrics {
  estimatedRevenueLow: number;
  estimatedRevenueHigh: number;
  estimatedPrice: number;
  potentialCustomers: number;
  competitionLevel: 'low' | 'medium' | 'high';
  timeToMarket: 'fast' | 'medium' | 'slow';
}

/**
 * Filter for high-ROI abandoned goldmines
 */
export function findGoldmines(opportunities: Opportunity[]): Opportunity[] {
  return opportunities
    .filter(repo => {
      const forkRatio = repo.forkRatio ?? (repo.forks / repo.stars);
      
      return (
        repo.stars > 1000 &&           // Proven demand
        repo.daysSinceUpdate > 365 &&  // 1+ year abandoned
        repo.openIssues > 20 &&        // Users still need it
        forkRatio < 0.2                // Low competition
      );
    })
    .sort((a, b) => {
      const scoreA = a.blueOceanScore ?? calculateBlueOceanScore(a);
      const scoreB = b.blueOceanScore ?? calculateBlueOceanScore(b);
      return scoreB - scoreA;
    });
}

/**
 * Calculate Blue Ocean Score if not already present
 */
function calculateBlueOceanScore(repo: Opportunity): number {
  let score = 0;
  
  // Star multiplier (max 40 points)
  score += Math.min(40, (repo.stars / 100));
  
  // Abandonment multiplier (max 30 points)
  const yearsAbandoned = repo.daysSinceUpdate / 365;
  score += Math.min(30, yearsAbandoned * 10);
  
  // Issue demand (max 20 points)
  score += Math.min(20, repo.openIssues / 5);
  
  // Low competition bonus (max 10 points)
  const forkRatio = repo.forkRatio ?? (repo.forks / repo.stars);
  if (forkRatio < 0.1) score += 10;
  else if (forkRatio < 0.2) score += 5;
  
  return Math.min(100, Math.round(score));
}

/**
 * Calculate metrics for a goldmine opportunity
 */
export function calculateGoldmineMetrics(repo: Opportunity): GoldmineMetrics {
  const potentialCustomers = Math.round(repo.stars * 0.01); // 1% conversion
  const price = estimatePrice(repo);
  const low = potentialCustomers * price * 0.5;
  const high = potentialCustomers * price;
  
  const forkRatio = repo.forkRatio ?? (repo.forks / repo.stars);
  const competitionLevel = 
    forkRatio < 0.1 ? 'low' :
    forkRatio < 0.2 ? 'medium' : 'high';
  
  const timeToMarket =
    repo.stars < 2000 && repo.openIssues < 50 ? 'fast' :
    repo.stars < 5000 && repo.openIssues < 100 ? 'medium' : 'slow';
  
  return {
    estimatedRevenueLow: low,
    estimatedRevenueHigh: high,
    estimatedPrice: price,
    potentialCustomers,
    competitionLevel,
    timeToMarket,
  };
}

/**
 * Estimate pricing based on star count
 */
function estimatePrice(repo: Opportunity): number {
  if (repo.stars > 10000) return 499;
  if (repo.stars > 5000) return 299;
  if (repo.stars > 2000) return 199;
  if (repo.stars > 1000) return 149;
  return 99;
}

/**
 * Estimate revenue range
 */
function estimateRevenue(repo: Opportunity): string {
  const metrics = calculateGoldmineMetrics(repo);
  return `${metrics.estimatedRevenueLow.toLocaleString()}-${metrics.estimatedRevenueHigh.toLocaleString()}`;
}

/**
 * Generate a comprehensive goldmine report
 */
export function generateGoldmineReport(goldmines: Opportunity[]): string {
  let report = '# 💰 ABANDONED GOLDMINES REPORT\n\n';
  report += `Date: ${new Date().toISOString().split('T')[0]}\n`;
  report += `Found: ${goldmines.length} goldmines\n\n`;
  
  if (goldmines.length === 0) {
    report += 'No goldmines found matching criteria.\n';
    report += '\n**Criteria:**\n';
    report += '- Stars > 1,000 (proven demand)\n';
    report += '- Abandoned > 1 year\n';
    report += '- Open Issues > 20 (active user need)\n';
    report += '- Fork Ratio < 0.2 (low competition)\n';
    return report;
  }
  
  goldmines.slice(0, 10).forEach((repo, i) => {
    const metrics = calculateGoldmineMetrics(repo);
    const blueOceanScore = repo.blueOceanScore ?? calculateBlueOceanScore(repo);
    
    report += `## ${i + 1}. ${repo.owner}/${repo.name}\n\n`;
    report += `${repo.description || 'No description available'}\n\n`;
    report += `**Metrics:**\n`;
    report += `- ⭐ Stars: ${repo.stars.toLocaleString()}\n`;
    report += `- 📅 Last Update: ${repo.lastUpdate} (${repo.daysSinceUpdate} days ago)\n`;
    report += `- 🐛 Open Issues: ${repo.openIssues}\n`;
    report += `- 🍴 Fork Ratio: ${((repo.forkRatio ?? (repo.forks / repo.stars)) * 100).toFixed(1)}%\n`;
    report += `- 📊 Blue Ocean Score: ${blueOceanScore}/100\n`;
    report += `- 💻 Language: ${repo.language || 'Unknown'}\n\n`;
    
    report += `**Business Potential:**\n`;
    report += `- 💰 Estimated Revenue: $${estimateRevenue(repo)}/month\n`;
    report += `- 💵 Suggested Price: $${metrics.estimatedPrice}/year\n`;
    report += `- 👥 Potential Customers: ~${metrics.potentialCustomers}\n`;
    report += `- 🎯 Competition: ${metrics.competitionLevel}\n`;
    report += `- ⚡ Time to Market: ${metrics.timeToMarket}\n\n`;
    
    report += `**Quick Win Strategy:**\n`;
    report += `1. Fork the repo: \`git clone ${repo.url}\`\n`;
    report += `2. Update dependencies and fix security issues\n`;
    report += `3. Fix top 5-10 most commented issues\n`;
    report += `4. Add modern UI/UX improvements\n`;
    report += `5. Launch as SaaS for $${metrics.estimatedPrice}/year\n`;
    report += `6. Market to existing ${repo.stars.toLocaleString()} stargazers\n\n`;
    
    report += `**Marketing Angles:**\n`;
    report += `- "The ${repo.name} revival - maintained and improved"\n`;
    report += `- "Enterprise-ready ${repo.name} with support"\n`;
    report += `- "Modern ${repo.name} - ${repo.daysSinceUpdate} days of updates in one release"\n\n`;
    
    report += `🔗 **URL:** ${repo.url}\n\n`;
    report += `---\n\n`;
  });
  
  // Summary section
  report += `## 📈 Summary\n\n`;
  
  const totalRevenueLow = goldmines
    .slice(0, 10)
    .reduce((sum, repo) => sum + calculateGoldmineMetrics(repo).estimatedRevenueLow, 0);
  
  const totalRevenueHigh = goldmines
    .slice(0, 10)
    .reduce((sum, repo) => sum + calculateGoldmineMetrics(repo).estimatedRevenueHigh, 0);
  
  report += `**Portfolio Potential (Top 10):**\n`;
  report += `- Combined Revenue Range: $${totalRevenueLow.toLocaleString()}-$${totalRevenueHigh.toLocaleString()}/month\n`;
  report += `- Average Blue Ocean Score: ${Math.round(goldmines.slice(0, 10).reduce((sum, r) => sum + (r.blueOceanScore ?? calculateBlueOceanScore(r)), 0) / Math.min(10, goldmines.length))}/100\n`;
  report += `- Total Potential Customers: ${goldmines.slice(0, 10).reduce((sum, r) => sum + calculateGoldmineMetrics(r).potentialCustomers, 0).toLocaleString()}\n\n`;
  
  report += `**Recommended Action Plan:**\n`;
  report += `1. Start with top 3 goldmines (fastest time-to-market)\n`;
  report += `2. Validate demand by posting in original repo issues\n`;
  report += `3. Build MVP in 2-4 weeks per project\n`;
  report += `4. Launch with "maintained fork" positioning\n`;
  report += `5. Convert 1-2% of stargazers = sustainable revenue\n\n`;
  
  report += `---\n\n`;
  report += `*Generated by Council Goldmine Detector*\n`;
  
  return report;
}

/**
 * Categorize goldmines by difficulty
 */
export function categorizeGoldmines(goldmines: Opportunity[]): {
  easyWins: Opportunity[];
  mediumEffort: Opportunity[];
  highEffort: Opportunity[];
} {
  const easyWins: Opportunity[] = [];
  const mediumEffort: Opportunity[] = [];
  const highEffort: Opportunity[] = [];
  
  goldmines.forEach(repo => {
    const metrics = calculateGoldmineMetrics(repo);
    
    if (metrics.timeToMarket === 'fast' && repo.stars < 3000) {
      easyWins.push(repo);
    } else if (metrics.timeToMarket === 'medium' || repo.stars < 5000) {
      mediumEffort.push(repo);
    } else {
      highEffort.push(repo);
    }
  });
  
  return { easyWins, mediumEffort, highEffort };
}

/**
 * Generate quick action items for a goldmine
 */
export function generateActionPlan(repo: Opportunity): string[] {
  const metrics = calculateGoldmineMetrics(repo);
  const actions: string[] = [];
  
  actions.push(`Clone repository: git clone ${repo.url}`);
  actions.push('Update all dependencies to latest versions');
  actions.push('Run security audit and fix vulnerabilities');
  actions.push(`Review top ${Math.min(10, repo.openIssues)} issues for quick wins`);
  
  if (repo.language === 'JavaScript' || repo.language === 'TypeScript') {
    actions.push('Migrate to TypeScript if not already');
    actions.push('Add modern build tooling (Vite/esbuild)');
  }
  
  actions.push('Add comprehensive documentation');
  actions.push('Create landing page highlighting improvements');
  actions.push(`Set pricing at $${metrics.estimatedPrice}/year`);
  actions.push('Email all stargazers about maintained version');
  
  return actions;
}

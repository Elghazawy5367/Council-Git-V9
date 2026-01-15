/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * The Mining Drill - Pain Point Extraction Engine
 * Extracts marketing intelligence from GitHub issues
 */

export interface PainPoint {
  title: string;
  comments: number;
  url: string;
  created: string;
  
  // Extracted intelligence
  painKeywords: string[];
  urgencyScore: number;  // 0-100
  buyingIntent: number;  // 0-10
  
  // Metadata
  labels: string[];
  author: string;
  state: string;
}

export interface MiningDrillConfig {
  minBuyingIntent?: number;
  minUrgency?: number;
  maxResults?: number;
  githubToken?: string;
}

const PAIN_KEYWORDS = [
  'hate', 'sucks', 'nightmare', 'struggling', 'annoying',
  'waste of time', 'broken', 'too expensive', 'crashes',
  'alternative to', 'looking for', 'how do i', 'need help',
  'willing to pay', 'hire', 'urgent', 'recommendation',
  'frustrated', 'terrible', 'awful', 'horrible', 'useless',
  'doesnt work', 'not working', 'bug', 'error', 'issue',
  'problem', 'please fix', 'please add', 'feature request'
];

const HIGH_INTENT_PHRASES = [
  'willing to pay',
  'hire',
  'urgent',
  'need this asap',
  'alternative to',
  'recommendation',
  'best tool for',
  'looking for solution',
  'need help with',
  'how much',
  'pricing',
  'subscription',
  'enterprise',
  'commercial',
  'business use'
];

/**
 * Calculate urgency score based on multiple factors
 */
function calculateUrgency(issue: any): number {
  let score = 0;
  
  // High engagement = high urgency
  score += Math.min(30, issue.comments * 3);
  
  // Old issue = persistent pain
  const daysOld = calculateDaysSince(issue.created_at);
  if (daysOld > 180) score += 20;  // 6+ months
  if (daysOld > 365) score += 10;  // 1+ year (extra pain)
  
  // Labels indicate severity
  if (hasLabel(issue, 'bug')) score += 30;
  if (hasLabel(issue, 'help wanted')) score += 20;
  if (hasLabel(issue, 'critical')) score += 25;
  if (hasLabel(issue, 'high priority')) score += 15;
  if (hasLabel(issue, 'feature request')) score += 10;
  
  // Reactions indicate community agreement
  const reactions = issue.reactions?.total_count || 0;
  score += Math.min(20, reactions * 2);
  
  return Math.min(100, score);
}

/**
 * Detect buying intent from issue text
 */
function detectBuyingIntent(issue: any): number {
  const text = (issue.title + ' ' + (issue.body || '')).toLowerCase();
  
  let intentScore = 0;
  
  // Check for high intent phrases
  HIGH_INTENT_PHRASES.forEach(phrase => {
    if (text.includes(phrase)) {
      intentScore += 1;
    }
  });
  
  // Boost if multiple pain keywords present
  const painCount = PAIN_KEYWORDS.filter(keyword => 
    text.includes(keyword)
  ).length;
  
  if (painCount >= 3) intentScore += 1;
  if (painCount >= 5) intentScore += 1;
  
  // Commercial context indicators
  if (text.match(/\$\d+/)) intentScore += 1;  // Money mentioned
  if (text.includes('budget')) intentScore += 1;
  if (text.includes('team')) intentScore += 1;
  if (text.includes('company')) intentScore += 1;
  
  return Math.min(10, intentScore);
}

/**
 * Extract pain keywords from issue text
 */
function extractPainKeywords(issue: any): string[] {
  const text = (issue.title + ' ' + (issue.body || '')).toLowerCase();
  
  return PAIN_KEYWORDS.filter(keyword => 
    text.includes(keyword)
  );
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
 * Check if issue has a specific label
 */
function hasLabel(issue: any, labelName: string): boolean {
  if (!issue.labels || !Array.isArray(issue.labels)) return false;
  
  return issue.labels.some((label: any) => 
    typeof label === 'string' 
      ? label.toLowerCase().includes(labelName.toLowerCase())
      : label.name?.toLowerCase().includes(labelName.toLowerCase())
  );
}

/**
 * Mine pain points from a GitHub repository
 */
export async function minePainPoints(
  owner: string,
  repo: string,
  config: MiningDrillConfig = {}
): Promise<PainPoint[]> {
  const {
    minBuyingIntent = 3,
    minUrgency = 0,
    maxResults = 20,
    githubToken
  } = config;

  try {
    // Fetch issues sorted by comments (most engaged first)
    const url = `https://api.github.com/repos/${owner}/${repo}/issues?state=all&sort=comments&direction=desc&per_page=100`;
    
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
    };
    
    if (githubToken) {
      headers['Authorization'] = `Bearer ${githubToken}`;
    }

    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const issues = await response.json();

    // Process each issue
    const painPoints: PainPoint[] = issues
      .filter((issue: any) => !issue.pull_request) // Exclude PRs
      .map((issue: any) => {
        const urgencyScore = calculateUrgency(issue);
        const buyingIntent = detectBuyingIntent(issue);
        const painKeywords = extractPainKeywords(issue);

        return {
          title: issue.title,
          body: issue.body || '',
          comments: issue.comments,
          url: issue.html_url,
          created: issue.created_at,
          painKeywords,
          urgencyScore,
          buyingIntent,
          labels: issue.labels.map((l: any) => l.name || l),
          author: issue.user?.login || 'unknown',
          state: issue.state,
        };
      })
      .filter((point: PainPoint) => 
        point.buyingIntent >= minBuyingIntent && 
        point.urgencyScore >= minUrgency
      )
      .sort((a: PainPoint, b: PainPoint) => {
        // Sort by buying intent first, then urgency
        if (b.buyingIntent !== a.buyingIntent) {
          return b.buyingIntent - a.buyingIntent;
        }
        return b.urgencyScore - a.urgencyScore;
      })
      .slice(0, maxResults);

    return painPoints;
  } catch (error) {
    console.error('Mining drill error:', error);
    throw error;
  }
}

/**
 * Analyze pain points for market insights
 */
export interface MarketInsight {
  topPainKeywords: Array<{ keyword: string; count: number }>;
  averageUrgency: number;
  averageBuyingIntent: number;
  totalPainPoints: number;
  highIntentCount: number;
  commonLabels: Array<{ label: string; count: number }>;
}

export function analyzePainPoints(painPoints: PainPoint[]): MarketInsight {
  if (painPoints.length === 0) {
    return {
      topPainKeywords: [],
      averageUrgency: 0,
      averageBuyingIntent: 0,
      totalPainPoints: 0,
      highIntentCount: 0,
      commonLabels: [],
    };
  }

  // Count pain keywords
  const keywordCounts = new Map<string, number>();
  painPoints.forEach(point => {
    point.painKeywords.forEach(keyword => {
      keywordCounts.set(keyword, (keywordCounts.get(keyword) || 0) + 1);
    });
  });

  const topPainKeywords = Array.from(keywordCounts.entries())
    .map(([keyword, count]) => ({ keyword, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Count labels
  const labelCounts = new Map<string, number>();
  painPoints.forEach(point => {
    point.labels.forEach(label => {
      labelCounts.set(label, (labelCounts.get(label) || 0) + 1);
    });
  });

  const commonLabels = Array.from(labelCounts.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Calculate averages
  const totalUrgency = painPoints.reduce((sum, p) => sum + p.urgencyScore, 0);
  const totalIntent = painPoints.reduce((sum, p) => sum + p.buyingIntent, 0);
  const highIntentCount = painPoints.filter(p => p.buyingIntent >= 5).length;

  return {
    topPainKeywords,
    averageUrgency: totalUrgency / painPoints.length,
    averageBuyingIntent: totalIntent / painPoints.length,
    totalPainPoints: painPoints.length,
    highIntentCount,
    commonLabels,
  };
}

/**
 * Generate marketing copy from pain points
 */
export function generateMarketingCopy(painPoints: PainPoint[]): string {
  if (painPoints.length === 0) {
    return 'No pain points found.';
  }

  const topPain = painPoints[0];
  const insight = analyzePainPoints(painPoints);

  let copy = `## Marketing Intelligence\n\n`;
  copy += `Found ${painPoints.length} high-intent pain points.\n\n`;
  copy += `### Top Pain Point (Buying Intent: ${topPain.buyingIntent}/10)\n`;
  copy += `**"${topPain.title}"**\n`;
  copy += `- Urgency: ${topPain.urgencyScore}/100\n`;
  copy += `- Comments: ${topPain.comments}\n`;
  copy += `- Pain Keywords: ${topPain.painKeywords.slice(0, 5).join(', ')}\n`;
  copy += `- URL: ${topPain.url}\n\n`;

  copy += `### Market Insights\n`;
  copy += `- Average Urgency: ${insight.averageUrgency.toFixed(1)}/100\n`;
  copy += `- High Intent Opportunities: ${insight.highIntentCount}\n`;
  copy += `- Top Pain Keywords: ${insight.topPainKeywords.slice(0, 5).map(k => k.keyword).join(', ')}\n\n`;

  copy += `### Recommended Actions\n`;
  if (insight.averageBuyingIntent >= 5) {
    copy += `✅ HIGH PRIORITY: Strong buying intent detected. Consider immediate solution development.\n`;
  }
  if (insight.highIntentCount >= 5) {
    copy += `✅ MARKET READY: Multiple high-intent pain points. Market validation confirmed.\n`;
  }
  if (insight.averageUrgency >= 50) {
    copy += `⚡ URGENT: Pain level is high. Fast movers will capture this market.\n`;
  }

  return copy;
}

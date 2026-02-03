/**
 * The Sniper - Reddit Lead Generation
 * 
 * Uses Reddit API to find "Buying Intent" leads.
 * Analyzes posts with unique algorithms to identify high-intent leads ready to pay.
 * 
 * Refactored to use RedditService for API calls while preserving analysis algorithms.
 * 
 * Priority: 9/10
 * Effort: Medium
 */

import * as fs from 'fs';
import * as path from 'path';
import { getRedditService } from '@/services/reddit.service';

export interface RedditPost {
  id: string;
  title: string;
  body: string;
  author: string;
  subreddit: string;
  url: string;
  score: number;
  numComments: number;
  created: Date;

  // Sniper-specific fields
  buyingIntentScore: number; // 0-10
  urgencyScore: number; // 0-100
  keywords: string[];
  category: string;
}
export interface SniperConfig {
  subreddits?: string[];
  minBuyingIntent?: number;
  minScore?: number;
  maxAge?: number; // days
  keywords?: string[];
}

// High buying intent phrases
const BUYING_INTENT_KEYWORDS = ['looking for', 'need help with', 'recommendation', 'alternative to', 'best tool for', 'willing to pay', 'hire', 'budget', 'price', 'cost', 'worth it', 'should i buy', 'shopping for', 'comparison', 'vs', 'better than', 'upgrade from', 'switch from', 'migrate from', 'replace', 'subscription', 'free trial', 'demo'];
const URGENCY_KEYWORDS = ['urgent', 'asap', 'immediately', 'emergency', 'critical', 'deadline', 'today', 'right now', 'quickly', 'fast', 'need this now', 'running out of time', 'time sensitive'];
const PROBLEM_KEYWORDS = ['problem', 'issue', 'broken', 'not working', 'error', 'bug', 'crash', 'struggling', 'frustrated', 'hate', 'sucks', 'terrible', 'awful', 'waste of time', 'nightmare'];

/**
 * Calculate buying intent score
 */
function calculateBuyingIntent(text: string): {
  score: number;
  keywords: string[];
} {
  const lowerText = text.toLowerCase();
  const foundKeywords: string[] = [];
  let score = 0;
  for (const keyword of BUYING_INTENT_KEYWORDS) {
    if (lowerText.includes(keyword)) {
      foundKeywords.push(keyword);

      // Weight keywords differently
      if (['willing to pay', 'hire', 'budget', 'subscription'].includes(keyword)) {
        score += 3; // High intent
      } else if (['looking for', 'need help', 'recommendation'].includes(keyword)) {
        score += 2; // Medium intent
      } else {
        score += 1; // Low intent
      }
    }
  }

  // Cap at 10
  return {
    score: Math.min(score, 10),
    keywords: foundKeywords
  };
}

/**
 * Calculate urgency score
 */
function calculateUrgency(text: string): number {
  const lowerText = text.toLowerCase();
  let score = 0;
  for (const keyword of URGENCY_KEYWORDS) {
    if (lowerText.includes(keyword)) {
      if (['urgent', 'asap', 'emergency', 'critical'].includes(keyword)) {
        score += 30;
      } else if (['deadline', 'today', 'immediately'].includes(keyword)) {
        score += 20;
      } else {
        score += 10;
      }
    }
  }

  // Bonus for problem keywords (indicates pain)
  for (const keyword of PROBLEM_KEYWORDS) {
    if (lowerText.includes(keyword)) {
      score += 5;
    }
  }
  return Math.min(score, 100);
}

/**
 * Categorize lead
 */
function categorizePost(post: RedditPost): string {
  const text = `${post.title} ${post.body}`.toLowerCase();
  if (text.includes('alternative') || text.includes('replace') || text.includes('switch')) {
    return 'Alternative Seeking';
  }
  if (text.includes('recommendation') || text.includes('best tool') || text.includes('looking for')) {
    return 'Research Phase';
  }
  if (text.includes('hire') || text.includes('willing to pay') || text.includes('budget')) {
    return 'Ready to Buy';
  }
  if (text.includes('problem') || text.includes('broken') || text.includes('not working')) {
    return 'Pain Point';
  }
  if (text.includes('help') || text.includes('how do i') || text.includes('need')) {
    return 'Help Seeking';
  }
  return 'General Interest';
}

/**
 * Fetch posts from Reddit using RedditService
 */
async function fetchRedditPosts(subreddit: string, limit: number = 100): Promise<RedditPost[]> {
  const redditService = getRedditService();
  
  try {
    const { posts } = await redditService.getSubredditPosts(subreddit, {
      sort: 'new',
      limit: Math.min(limit, 100), // Reddit API max is 100
    });

    const analyzedPosts: RedditPost[] = [];
    
    for (const post of posts) {
      const combinedText = `${post.title} ${post.selftext || ''}`;
      const { score: buyingIntent, keywords } = calculateBuyingIntent(combinedText);
      const urgency = calculateUrgency(combinedText);

      const redditPost: RedditPost = {
        id: post.id,
        title: post.title,
        body: post.selftext || '',
        author: post.author,
        subreddit: post.subreddit,
        url: `https://reddit.com${post.permalink}`,
        score: post.score,
        numComments: post.num_comments,
        created: new Date(post.created_utc * 1000),
        buyingIntentScore: buyingIntent,
        urgencyScore: urgency,
        keywords,
        category: '', // Will be set later
      };

      redditPost.category = categorizePost(redditPost);
      analyzedPosts.push(redditPost);
    }

    return analyzedPosts;
  } catch (error) {
    console.error(`Failed to fetch from r/${subreddit}:`, error);
    return [];
  }
}

/**
 * Run The Sniper - Main function
 */
export async function runSniper(config: SniperConfig = {}): Promise<RedditPost[]> {
  const {
    subreddits = ['SaaS', 'Entrepreneur', 'startups', 'buildinpublic', 'indiehackers'],
    minBuyingIntent = 3,
    minScore = 2,
    maxAge = 7
  } = config;
  const allPosts: RedditPost[] = [];
  for (const subreddit of subreddits) {
    const posts = await fetchRedditPosts(subreddit);

    // Filter by criteria
    const filteredPosts = posts.filter(post => {
      const ageInDays = (Date.now() - post.created.getTime()) / (1000 * 60 * 60 * 24);
      return post.buyingIntentScore >= minBuyingIntent && post.score >= minScore && ageInDays <= maxAge;
    });
    allPosts.push(...filteredPosts);
  }

  // Sort by buying intent + urgency
  allPosts.sort((a, b) => {
    const scoreA = a.buyingIntentScore * 10 + a.urgencyScore;
    const scoreB = b.buyingIntentScore * 10 + b.urgencyScore;
    return scoreB - scoreA;
  });
  // Save results
  const outputPath = path.join(process.cwd(), 'data', 'sniper-leads.json');
  fs.mkdirSync(path.dirname(outputPath), {
    recursive: true
  });
  fs.writeFileSync(outputPath, JSON.stringify(allPosts, null, 2));
  // Generate report
  generateSniperReport(allPosts);
  return allPosts;
}

/**
 * Generate human-readable report
 */
function generateSniperReport(posts: RedditPost[]): void {
  let report = `# 🎯 The Sniper - Reddit Lead Report\n\n`;
  report += `**Generated:** ${new Date().toISOString()}\n`;
  report += `**Total Leads:** ${posts.length}\n\n`;

  // Category breakdown
  report += `## Lead Categories\n\n`;
  const categories = [...new Set(posts.map(p => p.category))];
  for (const category of categories) {
    const count = posts.filter(p => p.category === category).length;
    report += `- **${category}**: ${count}\n`;
  }

  // Top 10 highest intent leads
  report += `\n## 🔥 Top 10 Hot Leads\n\n`;
  const topLeads = posts.slice(0, 10);
  for (let i = 0; i < topLeads.length; i++) {
    const post = topLeads[i];
    report += `### ${i + 1}. ${post.title}\n\n`;
    report += `- **Subreddit:** r/${post.subreddit}\n`;
    report += `- **Category:** ${post.category}\n`;
    report += `- **Buying Intent:** ${post.buyingIntentScore}/10\n`;
    report += `- **Urgency:** ${post.urgencyScore}/100\n`;
    report += `- **Score:** ${post.score} upvotes | ${post.numComments} comments\n`;
    report += `- **Keywords:** ${post.keywords.join(', ')}\n`;
    report += `- **URL:** ${post.url}\n\n`;
    if (post.body) {
      const preview = post.body.substring(0, 200).replace(/\n/g, ' ');
      report += `> ${preview}${post.body.length > 200 ? '...' : ''}\n\n`;
    }
  }

  // Save report
  const reportPath = path.join(process.cwd(), 'data', 'reports', 'sniper-report.md');
  fs.mkdirSync(path.dirname(reportPath), {
    recursive: true
  });
  fs.writeFileSync(reportPath, report);
}

/**
 * CLI interface
 */
export async function runRedditSniper(): Promise<void> {
  const args = process.argv.slice(2);
  if (args.includes('--help') || args.includes('-h')) {
    return;
  }
  const subredditsIndex = args.indexOf('--subreddits');
  const intentIndex = args.indexOf('--intent');
  const scoreIndex = args.indexOf('--score');
  const daysIndex = args.indexOf('--days');
  const config: SniperConfig = {
    subreddits: subredditsIndex !== -1 ? args[subredditsIndex + 1].split(',') : undefined,
    minBuyingIntent: intentIndex !== -1 ? parseInt(args[intentIndex + 1]) : undefined,
    minScore: scoreIndex !== -1 ? parseInt(args[scoreIndex + 1]) : undefined,
    maxAge: daysIndex !== -1 ? parseInt(args[daysIndex + 1]) : undefined
  };
  await runSniper(config);
}

// Run if called directly
if (require.main === module) {
  runRedditSniper().catch(console.error);
}
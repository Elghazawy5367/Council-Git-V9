/**
 * Viral Radar - Social Media Trend Scanner
 * 
 * Scans X (Twitter) and Instagram for viral content via Google Search.
 * No API keys required - uses Google Search as a backdoor.
 * 
 * Priority: NEW
 * Effort: High
 */

import * as fs from 'fs';
import * as path from 'path';
export interface ViralPost {
  platform: 'twitter' | 'instagram' | 'google-trends';
  title: string;
  url: string;
  source?: string;
  traffic?: string;
  snippet?: string;
  trend?: string;
  category?: string;
}
export interface ViralRadarConfig {
  niche: string;
  platforms?: Array<'twitter' | 'instagram' | 'trends'>;
  maxResults?: number;
}
export interface ViralRadarReport {
  niche: string;
  timestamp: Date;
  posts: ViralPost[];
  topTrends: string[];
  opportunities: string[];
}

/**
 * Search Google for viral Twitter threads
 */
async function scanTwitter(niche: string, maxResults: number = 10): Promise<ViralPost[]> {
  // Strategy: Use Google to find Twitter threads (no Twitter API needed)
  const query = `site:twitter.com OR site:x.com "${niche}" "thread"`;
  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&tbs=qdr:w&num=${maxResults}`;
  try {
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    if (!response.ok) {
      return [];
    }
    const html = await response.text();
    const posts: ViralPost[] = [];

    // Parse search results (basic extraction)
    // Note: Google's HTML structure changes frequently
    const titleRegex = /<h3[^>]*>([^<]+)<\/h3>/g;
    const linkRegex = /https?:\/\/(twitter\.com|x\.com)\/[^\s"'>]+/g;
    const titles = Array.from(html.matchAll(titleRegex)).map(m => m[1]);
    const links = Array.from(html.matchAll(linkRegex)).map(m => m[0]);
    for (let i = 0; i < Math.min(titles.length, links.length); i++) {
      posts.push({
        platform: 'twitter',
        title: titles[i].replace(/&[^;]+;/g, ''),
        url: links[i],
        source: 'Twitter Viral Thread'
      });
    }
    return posts;
  } catch (error) {
    console.error('Failed to scan Twitter:', error);
    return [];
  }
}

/**
 * Search Google for viral Instagram reels
 */
async function scanInstagram(niche: string, maxResults: number = 10): Promise<ViralPost[]> {
  const query = `site:instagram.com/reel "${niche}"`;
  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&tbs=qdr:m&num=${maxResults}`;
  try {
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    if (!response.ok) {
      return [];
    }
    const html = await response.text();
    const posts: ViralPost[] = [];
    const titleRegex = /<h3[^>]*>([^<]+)<\/h3>/g;
    const linkRegex = /https?:\/\/www\.instagram\.com\/reel\/[^\s"'>]+/g;
    const titles = Array.from(html.matchAll(titleRegex)).map(m => m[1]);
    const links = Array.from(html.matchAll(linkRegex)).map(m => m[0]);
    for (let i = 0; i < Math.min(titles.length, links.length); i++) {
      posts.push({
        platform: 'instagram',
        title: titles[i].replace(/&[^;]+;/g, ''),
        url: links[i],
        source: 'Instagram Trending Reel'
      });
    }
    return posts;
  } catch (error) {
    console.error('Failed to scan Instagram:', error);
    return [];
  }
}

/**
 * Fetch Google Trends (RSS feed - free and open)
 */
async function scanGoogleTrends(niche?: string): Promise<ViralPost[]> {
  try {
    const rssUrl = 'https://trends.google.com/trends/trendingsearches/daily/rss?geo=US';
    const response = await fetch(rssUrl);
    if (!response.ok) {
      return [];
    }
    const xml = await response.text();
    const posts: ViralPost[] = [];

    // Parse RSS XML (basic parsing)
    const itemRegex = /<item>[\s\S]*?<title>([^<]+)<\/title>[\s\S]*?<ht:approx_traffic>([^<]+)<\/ht:approx_traffic>[\s\S]*?<link>([^<]+)<\/link>[\s\S]*?<\/item>/g;
    const matches = Array.from(xml.matchAll(itemRegex));
    for (const match of matches) {
      const title = match[1].trim();
      const traffic = match[2].trim();
      const url = match[3].trim();

      // Filter by niche if provided
      if (!niche || title.toLowerCase().includes(niche.toLowerCase())) {
        posts.push({
          platform: 'google-trends',
          title,
          url,
          traffic,
          source: 'Google Daily Trend',
          trend: 'Rising'
        });
      }
    }
    return posts;
  } catch (error) {
    console.error('Failed to scan Google Trends:', error);
    return [];
  }
}

/* Reserved for future implementation
async function _scanGoogleTrendsWeb(geo: string = 'US'): Promise<ViralPost[]> {
  ...`);
  
  try {
    const url = `https://trends.google.com/trends/trendingsearches/daily?geo=${geo}`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (!response.ok) {
      return scanGoogleTrends(); // Fallback to RSS
    }
    
    const html = await response.text();
    const posts: ViralPost[] = [];
    
    // Extract trending searches from HTML
    const trendRegex = /"title":"([^"]+)"/g;
    const trafficRegex = /"formattedTraffic":"([^"]+)"/g;
    
    const titles = Array.from(html.matchAll(trendRegex)).map(m => m[1]);
    const traffic = Array.from(html.matchAll(trafficRegex)).map(m => m[1]);
    
    for (let i = 0; i < Math.min(titles.length, 20); i++) {
      posts.push({
        platform: 'google-trends',
        title: titles[i],
        url: `https://trends.google.com/trends/explore?q=${encodeURIComponent(titles[i])}`,
        traffic: traffic[i] || 'N/A',
        source: 'Google Trending Search',
        trend: 'Rising'
      });
    }
    
    
    return posts;
  } catch (error) {
    console.error('Failed to scan Google Trends web:', error);
    return scanGoogleTrends(); // Fallback to RSS
  }
}
*/

/**
 * Detect opportunities from viral content
 */
function detectOpportunities(posts: ViralPost[], niche: string): string[] {
  const opportunities: string[] = [];

  // Count platform distribution
  const platforms = posts.reduce((acc, post) => {
    acc[post.platform] = (acc[post.platform] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  if (platforms.twitter && platforms.twitter > 5) {
    opportunities.push(`High Twitter activity for "${niche}" - consider Twitter marketing`);
  }
  if (platforms.instagram && platforms.instagram > 3) {
    opportunities.push(`Instagram reels trending - create visual content`);
  }

  // Analyze trends
  const trendsCount = posts.filter(p => p.platform === 'google-trends').length;
  if (trendsCount > 0) {
    opportunities.push(`${trendsCount} Google trends detected - rising interest`);
  }

  // High traffic signals
  const highTraffic = posts.filter(p => p.traffic && (p.traffic.includes('K+') || p.traffic.includes('M+')));
  if (highTraffic.length > 0) {
    opportunities.push(`${highTraffic.length} high-traffic trends - massive audience`);
  }
  return opportunities;
}

/**
 * Extract top trends
 */
function extractTopTrends(posts: ViralPost[]): string[] {
  // Extract keywords from titles
  const words = new Map<string, number>();
  for (const post of posts) {
    const title = post.title.toLowerCase();
    const tokens = title.split(/\s+/).filter(t => t.length > 3);
    for (const token of tokens) {
      words.set(token, (words.get(token) || 0) + 1);
    }
  }

  // Sort by frequency
  return Array.from(words.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([word, count]) => `${word} (${count}x)`);
}

/**
 * Run Viral Radar
 */
export async function runViralRadar(config: ViralRadarConfig): Promise<ViralRadarReport> {
  const {
    niche,
    platforms = ['twitter', 'instagram', 'trends'],
    maxResults = 10
  } = config;
  const allPosts: ViralPost[] = [];

  // Scan each platform
  if (platforms.includes('twitter')) {
    const twitterPosts = await scanTwitter(niche, maxResults);
    allPosts.push(...twitterPosts);
  }
  if (platforms.includes('instagram')) {
    const instaPosts = await scanInstagram(niche, maxResults);
    allPosts.push(...instaPosts);
  }
  if (platforms.includes('trends')) {
    const trendPosts = await scanGoogleTrends(niche);
    allPosts.push(...trendPosts.slice(0, 10));
  }

  // Analyze results
  const topTrends = extractTopTrends(allPosts);
  const opportunities = detectOpportunities(allPosts, niche);
  const report: ViralRadarReport = {
    niche,
    timestamp: new Date(),
    posts: allPosts,
    topTrends,
    opportunities
  };

  // Save results
  const outputPath = path.join(process.cwd(), 'data', 'viral-radar.json');
  fs.mkdirSync(path.dirname(outputPath), {
    recursive: true
  });
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
  // Generate report
  generateViralReport(report);
  return report;
}

/**
 * Generate human-readable report
 */
function generateViralReport(report: ViralRadarReport): void {
  let markdown = `# 📡 Viral Radar Report\n\n`;
  markdown += `**Niche:** ${report.niche}\n`;
  markdown += `**Scanned:** ${new Date().toISOString()}\n`;
  markdown += `**Total Posts:** ${report.posts.length}\n\n`;

  // Platform breakdown
  markdown += `## 📊 Platform Distribution\n\n`;
  const platforms = report.posts.reduce((acc, post) => {
    acc[post.platform] = (acc[post.platform] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  for (const [platform, count] of Object.entries(platforms)) {
    markdown += `- **${platform}**: ${count} posts\n`;
  }

  // Top trends
  markdown += `\n## 🔥 Top Trending Keywords\n\n`;
  for (const trend of report.topTrends) {
    markdown += `- ${trend}\n`;
  }

  // Opportunities
  markdown += `\n## 💡 Opportunities\n\n`;
  for (const opportunity of report.opportunities) {
    markdown += `- ${opportunity}\n`;
  }

  // Twitter threads
  const twitterPosts = report.posts.filter(p => p.platform === 'twitter');
  if (twitterPosts.length > 0) {
    markdown += `\n## 🐦 Viral Twitter Threads\n\n`;
    for (let i = 0; i < Math.min(twitterPosts.length, 10); i++) {
      const post = twitterPosts[i];
      markdown += `### ${i + 1}. ${post.title}\n\n`;
      markdown += `**URL:** ${post.url}\n\n`;
    }
  }

  // Instagram reels
  const instaPosts = report.posts.filter(p => p.platform === 'instagram');
  if (instaPosts.length > 0) {
    markdown += `\n## 📸 Viral Instagram Reels\n\n`;
    for (let i = 0; i < Math.min(instaPosts.length, 10); i++) {
      const post = instaPosts[i];
      markdown += `### ${i + 1}. ${post.title}\n\n`;
      markdown += `**URL:** ${post.url}\n\n`;
    }
  }

  // Google trends
  const trendPosts = report.posts.filter(p => p.platform === 'google-trends');
  if (trendPosts.length > 0) {
    markdown += `\n## 🌍 Google Trending Searches\n\n`;
    for (let i = 0; i < Math.min(trendPosts.length, 10); i++) {
      const post = trendPosts[i];
      markdown += `### ${i + 1}. ${post.title}\n\n`;
      markdown += `**Traffic:** ${post.traffic || 'N/A'}\n`;
      markdown += `**URL:** ${post.url}\n\n`;
    }
  }
  const reportPath = path.join(process.cwd(), 'data', 'reports', 'viral-radar.md');
  fs.mkdirSync(path.dirname(reportPath), {
    recursive: true
  });
  fs.writeFileSync(reportPath, markdown);
}

/**
 * CLI interface
 */
export async function runViralRadarCLI(): Promise<void> {
  const args = process.argv.slice(2);
  if (args.includes('--help') || args.includes('-h')) {
    return;
  }
  const niche = args[0];
  if (!niche) {
    console.error('❌ Error: Provide a niche to scan');
    return;
  }
  const platformsIndex = args.indexOf('--platforms');
  const maxIndex = args.indexOf('--max');
  const config: ViralRadarConfig = {
    niche,
    platforms: platformsIndex !== -1 ? args[platformsIndex + 1].split(',') as Array<'twitter' | 'instagram' | 'trends'> : undefined,
    maxResults: maxIndex !== -1 ? parseInt(args[maxIndex + 1]) : undefined
  };
  await runViralRadar(config);
}

// Run if called directly
if (require.main === module) {
  runViralRadarCLI().catch(console.error);
}
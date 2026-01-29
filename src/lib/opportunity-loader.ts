/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Opportunity Loader
 * Load and transform opportunity data from Scout/Blue Ocean scans
 */

import { Opportunity } from './goldmine-detector';

/**
 * Load opportunities from local JSON files
 * Used by Goldmine Detector to analyze Blue Ocean scan results
 */
export async function loadOpportunities(): Promise<Opportunity[]> {
  try {
    // Try to load from latest.json (Scout output)
    const response = await fetch('/data/opportunities/latest.json');
    if (!response.ok) {
      return [];
    }
    const data = await response.json();

    // Transform Scout data format to Opportunity format
    // Scout data has: { category, painPoint, evidence: [repo, url], marketSize, etc }
    // We need: { owner, name, stars, forks, etc }

    const opportunities: Opportunity[] = [];
    const seenRepos = new Set<string>();
    for (const item of data) {
      if (item.evidence && Array.isArray(item.evidence) && item.evidence[0]) {
        const repo = item.evidence[0]; // e.g., "apollographql/apollo-client"
        const [owner, name] = repo.split('/');
        if (owner && name && !seenRepos.has(repo)) {
          seenRepos.add(repo);

          // These will be enriched when we fetch from GitHub API
          opportunities.push({
            owner,
            name,
            description: item.painPoint || '',
            stars: item.marketSize || 0,
            // Approximate from market size
            forks: 0,
            // Will be fetched
            openIssues: 0,
            // Will be fetched
            lastUpdate: new Date().toISOString(),
            // Will be fetched
            daysSinceUpdate: 0,
            // Will be fetched
            language: '',
            url: `https://github.com/${owner}/${name}`,
            blueOceanScore: calculateBlueOceanScore(item)
          });
        }
      }
    }
    return opportunities;
  } catch (error) {
    console.error('Failed to load opportunities:', error);
    return [];
  }
}

/**
 * Fetch repository details from GitHub API
 * Enriches opportunity data with real-time stats
 */
export async function enrichOpportunitiesFromGitHub(opportunities: Opportunity[], githubToken?: string): Promise<Opportunity[]> {
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json'
  };
  if (githubToken) {
    headers['Authorization'] = `Bearer ${githubToken}`;
  }
  const enriched: Opportunity[] = [];
  for (const opp of opportunities) {
    try {
      const response = await fetch(`https://api.github.com/repos/${opp.owner}/${opp.name}`, {
        headers
      });
      if (!response.ok) {
        enriched.push(opp);
        continue;
      }
      const data = await response.json();
      const lastUpdate = new Date(data.updated_at || data.pushed_at);
      const daysSinceUpdate = Math.floor((Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24));
      enriched.push({
        ...opp,
        description: data.description || opp.description,
        stars: data.stargazers_count || opp.stars,
        forks: data.forks_count || 0,
        openIssues: data.open_issues_count || 0,
        lastUpdate: data.updated_at || data.pushed_at || new Date().toISOString(),
        daysSinceUpdate,
        language: data.language || '',
        url: data.html_url || opp.url
      });

      // Rate limit: Wait 100ms between requests (10 req/sec)
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`Error enriching ${opp.owner}/${opp.name}:`, error);
      enriched.push(opp);
    }
  }
  return enriched;
}

/**
 * Load Blue Ocean scan results from markdown reports
 * Alternative data source when JSON isn't available
 */
export async function loadBlueOceanFromMarkdown(): Promise<Opportunity[]> {
  try {
    const response = await fetch('/data/intelligence/blue-ocean-2026-01-07.md');
    if (!response.ok) {
      return [];
    }
    const markdown = await response.text();

    // Parse markdown to extract repositories
    // Format: "**owner/name** (stars⭐)"
    const repoRegex = /\*\*([^/]+)\/([^*]+)\*\*\s*\((\d+)⭐\)/g;
    const opportunities: Opportunity[] = [];
    let match;
    while ((match = repoRegex.exec(markdown)) !== null) {
      const [, owner, name, stars] = match;
      opportunities.push({
        owner,
        name: name.trim(),
        description: '',
        stars: parseInt(stars, 10),
        forks: 0,
        openIssues: 0,
        lastUpdate: new Date().toISOString(),
        daysSinceUpdate: 0,
        language: '',
        url: `https://github.com/${owner}/${name}`,
        blueOceanScore: 0
      });
    }
    return opportunities;
  } catch (error) {
    console.error('Failed to load Blue Ocean markdown:', error);
    return [];
  }
}

/**
 * Calculate Blue Ocean score from Scout opportunity data
 */
function calculateBlueOceanScore(item: any): number {
  let score = 0;

  // High market size = higher score
  if (item.marketSize > 10000) score += 30;else if (item.marketSize > 5000) score += 20;else if (item.marketSize > 1000) score += 10;

  // Low/none competition = higher score
  if (item.competition === 'none') score += 40;else if (item.competition === 'weak') score += 30;else if (item.competition === 'medium') score += 20;else if (item.competition === 'strong') score += 10;

  // High impact + low effort = higher score
  if (item.impact === 'high' && item.effort === 'low') score += 30;else if (item.impact === 'high') score += 20;else if (item.effort === 'low') score += 15;
  return Math.min(score, 100);
}

/**
 * Master loader - tries all data sources
 */
export async function loadAllOpportunities(githubToken?: string): Promise<Opportunity[]> {
  // Try JSON first (Scout output)
  let opportunities = await loadOpportunities();

  // If empty, try Blue Ocean markdown
  if (opportunities.length === 0) {
    opportunities = await loadBlueOceanFromMarkdown();
  }

  // Enrich with real-time GitHub data
  if (opportunities.length > 0 && githubToken) {
    opportunities = await enrichOpportunitiesFromGitHub(opportunities, githubToken);
  }
  return opportunities;
}
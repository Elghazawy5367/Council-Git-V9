/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Fork Evolution - Feature Discovery System
 * 
 * Scans forks of a repository to find user-added features.
 * Reveals what features users desperately want but maintainer ignores.
 * 
 * Priority: 10/10
 * Effort: High
 */

import * as fs from 'fs';
import * as path from 'path';
export interface ForkFeature {
  forkOwner: string;
  forkName: string;
  forkUrl: string;
  stars: number;
  description: string;

  // Evolution analysis
  newFiles: string[];
  modifiedFiles: string[];
  newFeatures: string[];
  linesAdded: number;
  linesRemoved: number;

  // Popularity signals
  hasDocs: boolean;
  hasTests: boolean;
  hasCI: boolean;
  commitCount: number;
  lastUpdate: Date;
}
export interface ForkEvolutionReport {
  originalRepo: string;
  totalForks: number;
  analyzedForks: number;
  timestamp: Date;
  topFeatures: string[];
  topForks: ForkFeature[];
  patterns: string[];
  opportunities: string[];
}
export interface ForkAnalysisConfig {
  owner: string;
  repo: string;
  minStars?: number;
  maxForks?: number;
  githubToken?: string;
}

/**
 * Fetch forks from GitHub API
 */
async function fetchForks(owner: string, repo: string, githubToken?: string): Promise<any[]> {
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'Council-Fork-Evolution'
  };
  if (githubToken) {
    headers['Authorization'] = `token ${githubToken}`;
  }
  const forks: any[] = [];
  let page = 1;
  const perPage = 100;
  while (true) {
    const url = `https://api.github.com/repos/${owner}/${repo}/forks?sort=stargazers&per_page=${perPage}&page=${page}`;
    try {
      const response = await fetch(url, {
        headers
      });
      if (!response.ok) {
        if (response.status === 403) // eslint-disable-next-line no-empty
          {}break;
      }
      const data = await response.json();
      if (data.length === 0) break;
      forks.push(...data);
      page++;

      // Add delay to respect rate limits
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Failed to fetch forks:', error);
      break;
    }
  }
  return forks;
}

/**
 * Compare fork with original to detect new features
 */
async function analyzeFork(originalOwner: string, originalRepo: string, forkData: any, githubToken?: string): Promise<ForkFeature | null> {
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'Council-Fork-Evolution'
  };
  if (githubToken) {
    headers['Authorization'] = `token ${githubToken}`;
  }
  try {
    // Get comparison between fork and original
    const compareUrl = `https://api.github.com/repos/${originalOwner}/${originalRepo}/compare/${originalOwner}:${forkData.default_branch}...${forkData.owner.login}:${forkData.default_branch}`;
    const response = await fetch(compareUrl, {
      headers
    });
    if (!response.ok) {
      return null;
    }
    const comparison = await response.json();

    // Extract file changes
    const newFiles: string[] = [];
    const modifiedFiles: string[] = [];
    for (const file of comparison.files || []) {
      if (file.status === 'added') {
        newFiles.push(file.filename);
      } else if (file.status === 'modified') {
        modifiedFiles.push(file.filename);
      }
    }

    // Detect features from commit messages and files
    const newFeatures = detectFeatures(comparison.commits || [], newFiles, modifiedFiles);

    // Check for documentation
    const hasDocs = newFiles.some((f) => f.toLowerCase().includes('readme') || f.toLowerCase().includes('doc') || f.startsWith('docs/'));
    const hasTests = newFiles.some((f) => f.includes('test') || f.includes('spec') || f.startsWith('tests/') || f.startsWith('__tests__/'));
    const hasCI = newFiles.some((f) => f.startsWith('.github/workflows/') || f === '.gitlab-ci.yml' || f === '.travis.yml');
    const feature: ForkFeature = {
      forkOwner: forkData.owner.login,
      forkName: forkData.name,
      forkUrl: forkData.html_url,
      stars: forkData.stargazers_count,
      description: forkData.description || '',
      newFiles,
      modifiedFiles,
      newFeatures,
      linesAdded: comparison.ahead_by || 0,
      linesRemoved: comparison.behind_by || 0,
      hasDocs,
      hasTests,
      hasCI,
      commitCount: comparison.commits?.length || 0,
      lastUpdate: new Date(forkData.updated_at)
    };
    return feature;
  } catch (error) {
    return null;
  }
}

/**
 * Detect features from commits and file changes
 */
function detectFeatures(commits: any[], newFiles: string[], _modifiedFiles: string[]): string[] {
  const features = new Set<string>();

  // Analyze commit messages
  for (const commit of commits) {
    const message = commit.commit.message.toLowerCase();

    // Feature keywords
    if (message.includes('add') || message.includes('new')) {
      const words = message.split(/\s+/);
      const addIndex = words.findIndex((w: string) => w === 'add' || w === 'adds' || w === 'added');
      if (addIndex !== -1 && addIndex < words.length - 1) {
        features.add(words.slice(addIndex + 1, addIndex + 4).join(' '));
      }
    }
    if (message.includes('feature:') || message.includes('feat:')) {
      const feature = message.split(/feature:|feat:/)[1]?.trim().split('\n')[0];
      if (feature) features.add(feature);
    }
    if (message.includes('implement')) {
      const feature = message.split('implement')[1]?.trim().split('\n')[0];
      if (feature) features.add(feature);
    }
  }

  // Analyze new files (component/feature names)
  for (const file of newFiles) {
    const basename = path.basename(file, path.extname(file));

    // Skip test files
    if (basename.includes('test') || basename.includes('spec')) continue;

    // Extract meaningful names
    if (basename.length > 3 && basename.length < 50) {
      const readable = basename.replace(/([A-Z])/g, ' $1').replace(/[-_]/g, ' ').trim().toLowerCase();
      if (!readable.includes('index') && !readable.includes('util')) {
        features.add(readable);
      }
    }
  }
  return Array.from(features).slice(0, 10); // Top 10
}

/**
 * Run Fork Evolution Analysis
 */
export async function analyzeForkEvolution(config: ForkAnalysisConfig): Promise<ForkEvolutionReport> {
  const {
    owner,
    repo,
    minStars = 5,
    maxForks = 50,
    githubToken
  } = config;

  // Fetch forks

  const allForks = await fetchForks(owner, repo, githubToken);
  // Filter by stars
  const popularForks = allForks.filter((f) => f.stargazers_count >= minStars).slice(0, maxForks);

  // Analyze each fork

  const analyzedForks: ForkFeature[] = [];
  for (let i = 0; i < popularForks.length; i++) {
    const fork = popularForks[i];
    const feature = await analyzeFork(owner, repo, fork, githubToken);
    if (feature && feature.newFeatures.length > 0) {
      analyzedForks.push(feature);
    }

    // Rate limit protection
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  // Extract patterns
  const allFeatures: string[] = [];
  for (const fork of analyzedForks) {
    allFeatures.push(...fork.newFeatures);
  }

  // Count feature frequency
  const featureCounts = new Map<string, number>();
  for (const feature of allFeatures) {
    featureCounts.set(feature, (featureCounts.get(feature) || 0) + 1);
  }
  const topFeatures = Array.from(featureCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([feature, count]) => `${feature} (${count} forks)`);

  // Detect patterns
  const patterns: string[] = [];
  const fileTypes = new Map<string, number>();
  for (const fork of analyzedForks) {
    for (const file of fork.newFiles) {
      const ext = path.extname(file);
      if (ext) {
        fileTypes.set(ext, (fileTypes.get(ext) || 0) + 1);
      }
    }
    if (fork.hasDocs && fork.hasTests && fork.hasCI) {
      patterns.push('Professional fork with docs + tests + CI');
    }
  }

  // Generate opportunities
  const opportunities: string[] = [];
  if (topFeatures.length > 0) {
    opportunities.push(`Most requested: ${topFeatures[0].split('(')[0].trim()}`);
  }
  const avgStars = analyzedForks.reduce((sum, f) => sum + f.stars, 0) / analyzedForks.length;
  if (avgStars > 20) {
    opportunities.push('High community interest - consider merging popular features');
  }
  if (patterns.length > 3) {
    opportunities.push('Multiple professional implementations exist - study their approaches');
  }
  const report: ForkEvolutionReport = {
    originalRepo: `${owner}/${repo}`,
    totalForks: allForks.length,
    analyzedForks: analyzedForks.length,
    timestamp: new Date(),
    topFeatures,
    topForks: analyzedForks.sort((a, b) => b.stars - a.stars).slice(0, 10),
    patterns: Array.from(new Set(patterns)),
    opportunities
  };

  // Save results
  const outputPath = path.join(process.cwd(), 'data', 'fork-evolution.json');
  fs.mkdirSync(path.dirname(outputPath), {
    recursive: true
  });
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
  // Generate report
  generateForkReport(report);
  return report;
}

/**
 * Generate human-readable report
 */
function generateForkReport(report: ForkEvolutionReport): void {
  let markdown = `# 🍴 Fork Evolution Report\n\n`;
  markdown += `**Repository:** ${report.originalRepo}\n`;
  markdown += `**Analyzed:** ${new Date().toISOString()}\n`;
  markdown += `**Total Forks:** ${report.totalForks}\n`;
  markdown += `**With New Features:** ${report.analyzedForks}\n\n`;
  markdown += `## 🔥 Top Requested Features\n\n`;
  for (const feature of report.topFeatures) {
    markdown += `- ${feature}\n`;
  }
  markdown += `\n## ⭐ Top 10 Popular Forks\n\n`;
  for (let i = 0; i < report.topForks.length; i++) {
    const fork = report.topForks[i];
    markdown += `### ${i + 1}. ${fork.forkOwner}/${fork.forkName} (${fork.stars}⭐)\n\n`;
    markdown += `**URL:** ${fork.forkUrl}\n\n`;
    if (fork.description) {
      markdown += `**Description:** ${fork.description}\n\n`;
    }
    markdown += `**Stats:**\n`;
    markdown += `- Commits: ${fork.commitCount}\n`;
    markdown += `- New Files: ${fork.newFiles.length}\n`;
    markdown += `- Modified Files: ${fork.modifiedFiles.length}\n`;
    markdown += `- Last Update: ${fork.lastUpdate.toLocaleDateString()}\n\n`;
    markdown += `**New Features:**\n`;
    for (const feature of fork.newFeatures) {
      markdown += `- ${feature}\n`;
    }
    markdown += '\n';
    if (fork.hasDocs || fork.hasTests || fork.hasCI) {
      markdown += `**Quality Signals:**\n`;
      if (fork.hasDocs) markdown += `- ✅ Documentation\n`;
      if (fork.hasTests) markdown += `- ✅ Tests\n`;
      if (fork.hasCI) markdown += `- ✅ CI/CD\n`;
      markdown += '\n';
    }
  }
  if (report.patterns.length > 0) {
    markdown += `## 📊 Patterns Detected\n\n`;
    for (const pattern of report.patterns) {
      markdown += `- ${pattern}\n`;
    }
    markdown += '\n';
  }
  if (report.opportunities.length > 0) {
    markdown += `## 💡 Opportunities\n\n`;
    for (const opportunity of report.opportunities) {
      markdown += `- ${opportunity}\n`;
    }
  }
  const reportPath = path.join(process.cwd(), 'data', 'reports', 'fork-evolution.md');
  fs.mkdirSync(path.dirname(reportPath), {
    recursive: true
  });
  fs.writeFileSync(reportPath, markdown);
}

/**
 * CLI interface
 */
export async function runForkEvolution(): Promise<void> {
  const args = process.argv.slice(2);
  if (args.includes('--help') || args.includes('-h')) {
    return;
  }
  const repoArg = args[0];
  if (!repoArg || !repoArg.includes('/')) {
    console.error('❌ Error: Provide repository as owner/repo');
    return;
  }
  const [owner, repo] = repoArg.split('/');
  const starsIndex = args.indexOf('--stars');
  const maxIndex = args.indexOf('--max');
  const tokenIndex = args.indexOf('--token');
  const config: ForkAnalysisConfig = {
    owner,
    repo,
    minStars: starsIndex !== -1 ? parseInt(args[starsIndex + 1]) : undefined,
    maxForks: maxIndex !== -1 ? parseInt(args[maxIndex + 1]) : undefined,
    githubToken: tokenIndex !== -1 ? args[tokenIndex + 1] : process.env.GITHUB_TOKEN
  };
  await analyzeForkEvolution(config);
}

// Run if called directly
if (require.main === module) {
  runForkEvolution().catch(console.error);
}
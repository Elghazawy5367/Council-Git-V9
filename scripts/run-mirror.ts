#!/usr/bin/env tsx
/**
 * Code Mirror Runner
 * 
 * Scans the codebase and generates a comprehensive quality report
 * comparing against elite repository standards.
 */
import * as fs from "fs";
import * as path from "path";
import { analyzeBatch } from "../src/lib/code-mirror";
import type { AnalysisResult } from "../src/lib/code-mirror";

// Color codes for terminal output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m"
};
interface ScanOptions {
  targetDir: string;
  includeTests: boolean;
  maxFiles: number;
  outputFile?: string;
}

/**
 * Recursively finds TypeScript files in directory
 */
function findTypeScriptFiles(dir: string, options: ScanOptions): string[] {
  const files: string[] = [];
  try {
    const entries = fs.readdirSync(dir, {
      withFileTypes: true
    });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      // Skip excluded directories
      if (entry.isDirectory()) {
        if (shouldSkipDirectory(entry.name)) continue;
        files.push(...findTypeScriptFiles(fullPath, options));
      } else if (entry.isFile()) {
        if (shouldIncludeFile(entry.name, options)) {
          files.push(fullPath);
        }
      }
      if (files.length >= options.maxFiles) break;
    }
  } catch (error) {
    console.error(`Error scanning ${dir}:`, error);
  }
  return files;
}
function shouldSkipDirectory(name: string): boolean {
  const skipDirs = ["node_modules", ".git", "dist", "build", "coverage", ".vscode", ".devcontainer", "old-structure", "new-structure"];
  return skipDirs.includes(name);
}
function shouldIncludeFile(name: string, options: ScanOptions): boolean {
  if (!name.endsWith(".ts") && !name.endsWith(".tsx")) return false;
  if (!options.includeTests && (name.endsWith(".test.ts") || name.endsWith(".spec.ts"))) {
    return false;
  }
  if (name.endsWith(".d.ts")) return false;
  return true;
}

/**
 * Formats the quality score with color coding
 */
function formatScore(score: number): string {
  let color = colors.red;
  let label = "CRITICAL";
  if (score >= 90) {
    color = colors.green;
    label = "EXCELLENT";
  } else if (score >= 75) {
    color = colors.cyan;
    label = "GOOD";
  } else if (score >= 60) {
    color = colors.yellow;
    label = "ACCEPTABLE";
  } else if (score >= 40) {
    color = colors.yellow;
    label = "NEEDS WORK";
  }
  return `${color}${score}${colors.reset} (${label})`;
}

/**
 * Formats severity with color
 */
function formatSeverity(severity: string): string {
  const colorMap: Record<string, string> = {
    critical: colors.red,
    high: colors.yellow,
    medium: colors.cyan,
    low: colors.gray
  };
  return `${colorMap[severity] || ""}${severity.toUpperCase()}${colors.reset}`;
}

/**
 * Prints detailed analysis report
 */
function printReport(results: AnalysisResult[]): void {
  // Overall summary
  const totalFiles = results.length;
  const avgScore = Math.round(results.reduce((sum, r) => sum + r.score.overall, 0) / totalFiles);
  const allGaps = results.flatMap(r => r.gaps);
  const criticalCount = allGaps.filter(g => g.severity === "critical").length;
  const highCount = allGaps.filter(g => g.severity === "high").length;

  // Category breakdown

  const avgErrorHandling = Math.round(results.reduce((sum, r) => sum + r.score.errorHandling, 0) / totalFiles);
  const avgTypeSafety = Math.round(results.reduce((sum, r) => sum + r.score.typeSafety, 0) / totalFiles);
  const avgPerformance = Math.round(results.reduce((sum, r) => sum + r.score.performance, 0) / totalFiles);
  const avgArchitecture = Math.round(results.reduce((sum, r) => sum + r.score.architecture, 0) / totalFiles);

  // Top issues

  const issueFrequency = new Map<string, number>();
  allGaps.forEach(gap => {
    issueFrequency.set(gap.description, (issueFrequency.get(gap.description) || 0) + 1);
  });
  Array.from(issueFrequency.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10).forEach(([issue, count], idx) => {});
  // Files needing attention (score < 60)
  const problemFiles = results.filter(r => r.score.overall < 60).sort((a, b) => a.score.overall - b.score.overall);
  if (problemFiles.length > 0) {
    problemFiles.slice(0, 10).forEach(result => {
      const criticalGaps = result.gaps.filter(g => g.severity === "critical" || g.severity === "high");
      if (criticalGaps.length > 0) {
        criticalGaps.slice(0, 3).forEach(gap => {});
      }
    });
  }

  // Best performing files
  const topFiles = results.filter(r => r.score.overall >= 80).sort((a, b) => b.score.overall - a.score.overall).slice(0, 5);
  if (topFiles.length > 0) {
    topFiles.forEach((result, idx) => {});
  }

  // Role model recommendations
  const allRoleModels = new Set(results.flatMap(r => r.roleModelRepos));
  if (allRoleModels.size > 0) {
    Array.from(allRoleModels).forEach(repo => {});
  }

  // Action items

  const actions: string[] = [];
  if (criticalCount > 0) {
    actions.push(`${colors.red}1. Fix ${criticalCount} critical issue(s) immediately${colors.reset}`);
  }
  if (highCount > 0) {
    actions.push(`${colors.yellow}2. Address ${highCount} high-priority issue(s) this sprint${colors.reset}`);
  }
  const errorGaps = allGaps.filter(g => g.category === "error-handling");
  if (errorGaps.length > 5) {
    actions.push(`3. Improve error handling across ${errorGaps.length} locations`);
  }
  const typeGaps = allGaps.filter(g => g.category === "type-safety");
  if (typeGaps.length > 5) {
    actions.push(`4. Strengthen type safety (${typeGaps.length} issues found)`);
  }
  if (avgScore < 70) {
    actions.push(`5. Review role model repositories for best practices`);
  }
  if (actions.length === 0) {
    actions.push(`${colors.green}✓ Code quality is excellent! Keep up the good work.${colors.reset}`);
  }
  actions.forEach(action => undefined);
}

/**
 * Generates markdown report file
 */
function generateMarkdownReport(results: AnalysisResult[], outputPath: string): void {
  const totalFiles = results.length;
  const avgScore = Math.round(results.reduce((sum, r) => sum + r.score.overall, 0) / totalFiles);
  const allGaps = results.flatMap(r => r.gaps);
  let markdown = `# Code Mirror Analysis Report\n\n`;
  markdown += `**Generated:** ${new Date().toLocaleString()}\n`;
  markdown += `**Files Analyzed:** ${totalFiles}\n`;
  markdown += `**Overall Quality Score:** ${avgScore}/100\n\n`;
  markdown += `## Summary\n\n`;
  markdown += `- Total Issues: ${allGaps.length}\n`;
  markdown += `- Critical: ${allGaps.filter(g => g.severity === "critical").length}\n`;
  markdown += `- High: ${allGaps.filter(g => g.severity === "high").length}\n`;
  markdown += `- Medium: ${allGaps.filter(g => g.severity === "medium").length}\n`;
  markdown += `- Low: ${allGaps.filter(g => g.severity === "low").length}\n\n`;

  // Detailed file results
  markdown += `## File Analysis\n\n`;
  results.sort((a, b) => a.score.overall - b.score.overall).forEach(result => {
    markdown += `### ${result.filePath}\n\n`;
    markdown += `**Score:** ${result.score.overall}/100\n\n`;
    if (result.gaps.length > 0) {
      markdown += `**Issues:**\n\n`;
      result.gaps.forEach(gap => {
        markdown += `- **[${gap.severity.toUpperCase()}]** ${gap.description}\n`;
        markdown += `  - ${gap.suggestion}\n`;
        if (gap.roleModelExample) {
          markdown += `  - Example: \`\`\`\n${gap.roleModelExample}\n\`\`\`\n`;
        }
      });
      markdown += `\n`;
    }
  });
  fs.writeFileSync(outputPath, markdown);
}

/**
 * Main execution
 */
async function main(): Promise<void> {
  const options: ScanOptions = {
    targetDir: path.join(process.cwd(), "src"),
    includeTests: false,
    maxFiles: 50,
    outputFile: path.join(process.cwd(), "logs", "mirror-report.md")
  };
  // Find files
  const files = findTypeScriptFiles(options.targetDir, options);
  if (files.length === 0) {
    console.error(`${colors.red}No files found to analyze${colors.reset}`);
    process.exit(1);
  }

  // Analyze

  const {
    results,
    summary
  } = await analyzeBatch(files);

  // Print report
  printReport(results);

  // Save detailed markdown report
  if (options.outputFile) {
    fs.mkdirSync(path.dirname(options.outputFile), {
      recursive: true
    });
    generateMarkdownReport(results, options.outputFile);
  }

  // Exit code based on quality
  if (summary.criticalGaps > 0) {
    process.exit(1);
  } else if (summary.averageScore < 60) {
    process.exit(1);
  }
}

// Run
main().catch(error => {
  console.error(`${colors.red}Fatal error:${colors.reset}`, error);
  process.exit(1);
});
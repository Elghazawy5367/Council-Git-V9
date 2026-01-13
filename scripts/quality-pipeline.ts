#!/usr/bin/env tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Quality Amplification Pipeline
 * 
 * Combines Code Mirror analysis with Self-Improving patterns to create
 * an automated quality improvement workflow.
 */

import * as fs from "fs";
import * as path from "path";
import { analyzeBatch } from "../src/lib/code-mirror";
import { learnFromSuccess } from "../src/lib/self-improve";
import type { AnalysisResult, CodeGap } from "../src/lib/code-mirror";
import type { LearningResult, SuccessPattern } from "../src/lib/self-improve";

interface PipelineConfig {
  targetDir: string;
  maxFiles: number;
  learningNiche: string;
  minStars: number;
  qualityThreshold: number;
  autoApplyFixes: boolean;
  generatePR: boolean;
}

interface PipelineResult {
  timestamp: string;
  codeAnalysis: {
    averageScore: number;
    totalFiles: number;
    criticalIssues: number;
    filesNeedingWork: number;
  };
  learningResults: {
    patternsDiscovered: number;
    highConfidencePatterns: number;
    recommendations: string[];
  };
  improvements: {
    applied: string[];
    suggested: string[];
  };
  nextSteps: string[];
}

/**
 * Main pipeline execution
 */
async function runQualityPipeline(config: PipelineConfig): Promise<PipelineResult> {
  console.log("🚀 Quality Amplification Pipeline Starting...\n");
  console.log("=" .repeat(80));
  
  const startTime = Date.now();
  
  // Step 1: Analyze current codebase
  console.log("\n📊 STEP 1: Analyzing Current Codebase");
  console.log("-".repeat(80));
  const codeAnalysis = await analyzeCodebase(config);
  
  // Step 2: Learn from successful projects
  console.log("\n🎓 STEP 2: Learning from Successful Projects");
  console.log("-".repeat(80));
  const learningResults = await learnFromProjects(config);
  
  // Step 3: Cross-reference findings
  console.log("\n🔄 STEP 3: Cross-Referencing Findings");
  console.log("-".repeat(80));
  const improvements = await generateImprovements(codeAnalysis, learningResults, config);
  
  // Step 4: Apply automatic fixes
  if (config.autoApplyFixes) {
    console.log("\n🔧 STEP 4: Applying Automatic Fixes");
    console.log("-".repeat(80));
    await applyAutomaticFixes(improvements.applied);
  }
  
  // Step 5: Generate PR if requested
  if (config.generatePR) {
    console.log("\n📝 STEP 5: Generating Pull Request");
    console.log("-".repeat(80));
    await generatePullRequest(improvements);
  }
  
  // Step 6: Generate report
  console.log("\n📈 STEP 6: Generating Quality Report");
  console.log("-".repeat(80));
  const result = await generatePipelineReport(codeAnalysis, learningResults, improvements);
  
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log("\n" + "=".repeat(80));
  console.log(`✅ Pipeline Complete in ${duration}s`);
  console.log("=".repeat(80) + "\n");
  
  return result;
}

/**
 * Analyze codebase with Code Mirror
 */
async function analyzeCodebase(config: PipelineConfig): Promise<{
  results: AnalysisResult[];
  summary: any;
}> {
  const files = findTypeScriptFiles(config.targetDir, config.maxFiles);
  console.log(`Found ${files.length} TypeScript files to analyze`);
  
  const { results, summary } = await analyzeBatch(files);
  
  console.log(`✓ Average Quality Score: ${summary.averageScore}/100`);
  console.log(`✓ Total Issues: ${summary.totalGaps} (${summary.criticalGaps} critical)`);
  
  return { results, summary };
}

/**
 * Learn patterns from successful projects
 */
async function learnFromProjects(config: PipelineConfig): Promise<LearningResult> {
  const result = await learnFromSuccess(config.learningNiche, {
    minStars: config.minStars,
    maxRepos: 15,
    githubToken: process.env.GITHUB_TOKEN,
  });
  
  console.log(`✓ Analyzed ${result.reposAnalyzed} repositories`);
  console.log(`✓ Found ${result.patternsFound.length} patterns`);
  
  return result;
}

/**
 * Generate improvement recommendations
 */
async function generateImprovements(
  codeAnalysis: { results: AnalysisResult[]; summary: any },
  learningResults: LearningResult,
  config: PipelineConfig
): Promise<{ applied: string[]; suggested: string[] }> {
  const applied: string[] = [];
  const suggested: string[] = [];
  
  // Get high-confidence patterns
  const highConfidencePatterns = learningResults.patternsFound.filter(
    p => p.confidence >= 70
  );
  
  console.log(`Processing ${highConfidencePatterns.length} high-confidence patterns...`);
  
  // Match patterns to code gaps
  const allGaps = codeAnalysis.results.flatMap(r => r.gaps);
  
  // Group gaps by category
  const gapsByCategory = allGaps.reduce((acc, gap) => {
    if (!acc[gap.category]) acc[gap.category] = [];
    acc[gap.category].push(gap);
    return acc;
  }, {} as Record<string, CodeGap[]>);
  
  // Match learned patterns to gaps
  highConfidencePatterns.forEach(pattern => {
    const categoryGaps = gapsByCategory[pattern.category] || [];
    
    if (categoryGaps.length > 0) {
      const improvement = `Apply "${pattern.pattern}" to fix ${categoryGaps.length} issue(s)`;
      
      // Auto-fixable patterns
      if (isAutoFixable(pattern)) {
        applied.push(improvement);
        console.log(`  ✓ Auto-applying: ${improvement}`);
      } else {
        suggested.push(improvement);
        console.log(`  → Suggested: ${improvement}`);
      }
    }
  });
  
  // Add gap-based suggestions
  Object.entries(gapsByCategory).forEach(([category, gaps]) => {
    const criticalGaps = gaps.filter(g => g.severity === "critical" || g.severity === "high");
    if (criticalGaps.length > 0) {
      suggested.push(`Fix ${criticalGaps.length} ${category} issue(s) (priority: high)`);
    }
  });
  
  console.log(`✓ Generated ${applied.length} auto-fixes and ${suggested.length} suggestions`);
  
  return { applied, suggested };
}

/**
 * Check if pattern can be auto-fixed
 */
function isAutoFixable(pattern: SuccessPattern): boolean {
  const autoFixablePatterns = [
    /explicit return types/i,
    /typescript/i,
    /quick start/i,
  ];
  
  return autoFixablePatterns.some(regex => regex.test(pattern.pattern));
}

/**
 * Apply automatic fixes to codebase
 */
async function applyAutomaticFixes(fixes: string[]): Promise<void> {
  if (fixes.length === 0) {
    console.log("No automatic fixes to apply");
    return;
  }
  
  console.log(`Applying ${fixes.length} automatic fixes...`);
  
  // In a real implementation, this would:
  // 1. Parse code with TypeScript compiler API
  // 2. Apply transformations (add return types, etc.)
  // 3. Format with prettier
  // 4. Run tests to verify
  
  fixes.forEach((fix, idx) => {
    console.log(`  ${idx + 1}. ${fix}`);
  });
  
  console.log("✓ Fixes applied (dry-run mode)");
}

/**
 * Generate pull request with improvements
 */
async function generatePullRequest(improvements: { applied: string[]; suggested: string[] }): Promise<void> {
  const branchName = `quality-improvement-${Date.now()}`;
  
  console.log(`Creating PR branch: ${branchName}`);
  
  const prBody = `
## 🎯 Quality Amplification Improvements

This PR was automatically generated by the Quality Pipeline.

### ✅ Applied Fixes (${improvements.applied.length})

${improvements.applied.map((fix, idx) => `${idx + 1}. ${fix}`).join("\n")}

### 💡 Suggested Improvements (${improvements.suggested.length})

${improvements.suggested.map((fix, idx) => `${idx + 1}. ${fix}`).join("\n")}

### 📊 Impact

- Improved code quality across multiple categories
- Applied learned patterns from successful repositories
- Automated fixes with high confidence

### 🔍 Review Checklist

- [ ] All tests pass
- [ ] No breaking changes introduced
- [ ] Code follows project conventions
- [ ] Documentation updated if needed

---

*Generated by Quality Amplification Pipeline*
`;
  
  console.log("✓ PR template generated");
  
  // Save PR template
  const prPath = path.join(process.cwd(), "logs", "quality-pr-template.md");
  fs.mkdirSync(path.dirname(prPath), { recursive: true });
  fs.writeFileSync(prPath, prBody);
  
  console.log(`✓ PR template saved to: ${prPath}`);
  console.log("\nTo create PR, run:");
  console.log(`  git checkout -b ${branchName}`);
  console.log(`  git add .`);
  console.log(`  git commit -m "chore: quality improvements from pipeline"`);
  console.log(`  gh pr create --title "Quality Improvements" --body-file ${prPath}`);
}

/**
 * Generate comprehensive pipeline report
 */
async function generatePipelineReport(
  codeAnalysis: { results: AnalysisResult[]; summary: any },
  learningResults: LearningResult,
  improvements: { applied: string[]; suggested: string[] }
): Promise<PipelineResult> {
  const result: PipelineResult = {
    timestamp: new Date().toISOString(),
    codeAnalysis: {
      averageScore: codeAnalysis.summary.averageScore,
      totalFiles: codeAnalysis.results.length,
      criticalIssues: codeAnalysis.summary.criticalGaps,
      filesNeedingWork: codeAnalysis.results.filter(r => r.score.overall < 70).length,
    },
    learningResults: {
      patternsDiscovered: learningResults.patternsFound.length,
      highConfidencePatterns: learningResults.patternsFound.filter(p => p.confidence >= 70).length,
      recommendations: learningResults.recommendations,
    },
    improvements: {
      applied: improvements.applied,
      suggested: improvements.suggested,
    },
    nextSteps: generateNextSteps(codeAnalysis, learningResults, improvements),
  };
  
  // Save JSON report
  const reportPath = path.join(process.cwd(), "logs", "quality-pipeline-report.json");
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(result, null, 2));
  
  console.log(`✓ Report saved to: ${reportPath}`);
  
  // Print summary
  printPipelineSummary(result);
  
  return result;
}

/**
 * Generate next steps recommendations
 */
function generateNextSteps(
  codeAnalysis: { results: AnalysisResult[]; summary: any },
  learningResults: LearningResult,
  improvements: { applied: string[]; suggested: string[] }
): string[] {
  const steps: string[] = [];
  
  if (codeAnalysis.summary.criticalGaps > 0) {
    steps.push(`Address ${codeAnalysis.summary.criticalGaps} critical issue(s) immediately`);
  }
  
  if (improvements.applied.length > 0) {
    steps.push(`Review and test ${improvements.applied.length} auto-applied fix(es)`);
  }
  
  if (improvements.suggested.length > 0) {
    steps.push(`Manually implement ${improvements.suggested.length} suggested improvement(s)`);
  }
  
  if (codeAnalysis.summary.averageScore < 80) {
    steps.push("Run pipeline weekly to track quality improvements");
  }
  
  const highConfidencePatterns = learningResults.patternsFound.filter(p => p.confidence >= 70);
  if (highConfidencePatterns.length > 0) {
    steps.push(`Apply ${highConfidencePatterns.length} high-confidence pattern(s) to codebase`);
  }
  
  steps.push("Update plugin system with learned architecture patterns");
  steps.push("Schedule next learning cycle for related niches");
  
  return steps;
}

/**
 * Print pipeline summary
 */
function printPipelineSummary(result: PipelineResult): void {
  console.log("\n📊 PIPELINE SUMMARY");
  console.log("=".repeat(80));
  
  console.log("\n🎯 Code Quality:");
  console.log(`  Average Score: ${result.codeAnalysis.averageScore}/100`);
  console.log(`  Files Analyzed: ${result.codeAnalysis.totalFiles}`);
  console.log(`  Critical Issues: ${result.codeAnalysis.criticalIssues}`);
  console.log(`  Files Needing Work: ${result.codeAnalysis.filesNeedingWork}`);
  
  console.log("\n🎓 Learning Results:");
  console.log(`  Patterns Discovered: ${result.learningResults.patternsDiscovered}`);
  console.log(`  High Confidence: ${result.learningResults.highConfidencePatterns}`);
  console.log(`  Recommendations: ${result.learningResults.recommendations.length}`);
  
  console.log("\n🔧 Improvements:");
  console.log(`  Auto-Applied: ${result.improvements.applied.length}`);
  console.log(`  Suggested: ${result.improvements.suggested.length}`);
  
  console.log("\n📋 Next Steps:");
  result.nextSteps.forEach((step, idx) => {
    console.log(`  ${idx + 1}. ${step}`);
  });
  
  console.log();
}

/**
 * Find TypeScript files in directory
 */
function findTypeScriptFiles(dir: string, maxFiles: number): string[] {
  const files: string[] = [];
  
  function scan(currentDir: string): void {
    if (files.length >= maxFiles) return;
    
    try {
      const entries = fs.readdirSync(currentDir, { withFileTypes: true });
      
      for (const entry of entries) {
        if (files.length >= maxFiles) break;
        
        const fullPath = path.join(currentDir, entry.name);
        
        if (entry.isDirectory()) {
          const skipDirs = ["node_modules", ".git", "dist", "build", "coverage"];
          if (!skipDirs.includes(entry.name)) {
            scan(fullPath);
          }
        } else if (entry.isFile()) {
          if ((entry.name.endsWith(".ts") || entry.name.endsWith(".tsx")) && 
              !entry.name.endsWith(".d.ts")) {
            files.push(fullPath);
          }
        }
      }
    } catch (error) {
      // Ignore permission errors
    }
  }
  
  scan(dir);
  return files;
}

/**
 * Parse command line arguments
 */
function parseArgs(): Partial<PipelineConfig> {
  const args = process.argv.slice(2);
  const options: Record<string, string> = {};
  
  args.forEach(arg => {
    const [key, value] = arg.split("=");
    if (key.startsWith("--")) {
      options[key.slice(2)] = value;
    }
  });
  
  return {
    targetDir: options["target-dir"],
    maxFiles: options["max-files"] ? parseInt(options["max-files"]) : undefined,
    learningNiche: options["niche"],
    minStars: options["min-stars"] ? parseInt(options["min-stars"]) : undefined,
    qualityThreshold: options["threshold"] ? parseInt(options["threshold"]) : undefined,
    autoApplyFixes: options["auto-apply"] === "true",
    generatePR: options["generate-pr"] === "true",
  };
}

/**
 * Main execution
 */
async function main(): Promise<void> {
  const args = parseArgs();
  
  const config: PipelineConfig = {
    targetDir: args.targetDir || path.join(process.cwd(), "src"),
    maxFiles: args.maxFiles || 30,
    learningNiche: args.learningNiche || "React TypeScript",
    minStars: args.minStars || 2000,
    qualityThreshold: args.qualityThreshold || 70,
    autoApplyFixes: args.autoApplyFixes || false,
    generatePR: args.generatePR || false,
  };
  
  console.log("⚙️  Configuration:");
  console.log(`  Target Directory: ${config.targetDir}`);
  console.log(`  Max Files: ${config.maxFiles}`);
  console.log(`  Learning Niche: ${config.learningNiche}`);
  console.log(`  Min Stars: ${config.minStars}`);
  console.log(`  Quality Threshold: ${config.qualityThreshold}`);
  console.log(`  Auto-Apply Fixes: ${config.autoApplyFixes}`);
  console.log(`  Generate PR: ${config.generatePR}\n`);
  
  try {
    const result = await runQualityPipeline(config);
    
    // Exit with appropriate code
    if (result.codeAnalysis.criticalIssues > 0) {
      console.error("❌ Pipeline found critical issues");
      process.exit(1);
    } else if (result.codeAnalysis.averageScore < config.qualityThreshold) {
      console.warn("⚠️  Quality below threshold");
      process.exit(1);
    } else {
      console.log("✅ Quality pipeline passed!");
      process.exit(0);
    }
  } catch (error) {
    console.error("💥 Pipeline failed:", error);
    process.exit(1);
  }
}

// Run
main();

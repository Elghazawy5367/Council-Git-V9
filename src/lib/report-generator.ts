/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Intelligence Report Generator
 * 
 * Transforms raw scout data into actionable reports
 */

import * as fs from "fs";
import * as path from "path";
interface Report {
  timestamp: string;
  summary: {
    totalOpportunities: number;
    highImpact: number;
    readyToBuild: number;
  };
  recommendations: string[];
  detailedAnalysis: string;
}
async function generateReport(): Promise<void> {
  const dataDir = path.join(process.cwd(), "data");
  const reportsDir = path.join(dataDir, "reports");

  // Find latest scout report
  if (!fs.existsSync(reportsDir)) {
    return;
  }
  const files = fs.readdirSync(reportsDir).filter(f => f.startsWith("scout-") && f.endsWith(".json")).sort().reverse();
  if (files.length === 0) {
    return;
  }
  const latestFile = path.join(reportsDir, files[0]);
  const scoutData = JSON.parse(fs.readFileSync(latestFile, "utf-8"));

  // Generate analysis
  const report: Report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalOpportunities: scoutData.opportunitiesIdentified || 0,
      highImpact: scoutData.topOpportunities?.filter((o: any) => o.impact === "high").length || 0,
      readyToBuild: scoutData.topOpportunities?.filter((o: any) => o.effort === "low" && o.impact === "high").length || 0
    },
    recommendations: generateRecommendations(scoutData),
    detailedAnalysis: generateAnalysis(scoutData)
  };

  // Save report
  const reportPath = path.join(dataDir, "intelligence", "report-latest.md");
  fs.mkdirSync(path.dirname(reportPath), {
    recursive: true
  });
  fs.writeFileSync(reportPath, formatReport(report));
}
function generateRecommendations(data: any): string[] {
  const recs: string[] = [];
  if (data.topOpportunities?.length > 0) {
    const top = data.topOpportunities[0];
    recs.push(`Priority 1: ${top.solution}`);
  }
  if (data.trendsDetected?.length > 0) {
    recs.push(`Watch trend: ${data.trendsDetected[0]}`);
  }
  recs.push("Review opportunities in data/opportunities/latest.json");
  recs.push("Set up alerts for new pain points");
  return recs;
}
function generateAnalysis(data: any): string {
  let analysis = `## Market Analysis\n\n`;
  analysis += `Based on scanning ${data.repositoriesScanned} repositories, `;
  analysis += `we identified ${data.painPointsFound} distinct pain points.\n\n`;
  analysis += `### Key Findings\n\n`;
  analysis += `- **High-impact opportunities**: ${data.topOpportunities?.filter((o: any) => o.impact === "high").length || 0}\n`;
  analysis += `- **Low-effort builds**: ${data.topOpportunities?.filter((o: any) => o.effort === "low").length || 0}\n`;
  analysis += `- **Emerging trends**: ${data.trendsDetected?.length || 0}\n`;
  return analysis;
}
function formatReport(report: Report): string {
  let md = `# Council Intelligence Report\n\n`;
  md += `Generated: ${new Date(report.timestamp).toLocaleString()}\n\n`;
  md += `## Executive Summary\n\n`;
  md += `- Total Opportunities: ${report.summary.totalOpportunities}\n`;
  md += `- High Impact: ${report.summary.highImpact}\n`;
  md += `- Ready to Build: ${report.summary.readyToBuild}\n\n`;
  md += `## Recommendations\n\n`;
  report.recommendations.forEach((rec, idx) => {
    md += `${idx + 1}. ${rec}\n`;
  });
  md += `\n${report.detailedAnalysis}`;
  return md;
}

// Execute
generateReport().then(() => process.exit(0)).catch(error => {
  console.error("Report generation failed:", error);
  process.exit(1);
});
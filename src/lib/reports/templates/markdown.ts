/**
 * Markdown Report Template
 * 
 * Generates well-formatted Markdown reports
 */

import { Report } from '../types';

export function renderMarkdownReport(report: Report): string {
  let md = `# Council Intelligence Report\n\n`;
  
  // Timestamp
  md += `Generated: ${new Date(report.timestamp).toLocaleString()}\n\n`;

  // Metadata
  if (report.metadata) {
    if (report.metadata.version) {
      md += `Version: ${report.metadata.version}\n`;
    }
    if (report.metadata.dataSource) {
      md += `Data Source: ${report.metadata.dataSource}\n`;
    }
    md += `\n`;
  }

  // Executive Summary
  md += `## Executive Summary\n\n`;
  md += `- Total Opportunities: ${report.summary.totalOpportunities}\n`;
  md += `- High Impact: ${report.summary.highImpact}\n`;
  md += `- Ready to Build: ${report.summary.readyToBuild}\n\n`;

  // Recommendations
  md += `## Recommendations\n\n`;
  report.recommendations.forEach((rec, idx) => {
    md += `${idx + 1}. ${rec}\n`;
  });
  md += `\n`;

  // Detailed Analysis
  md += report.detailedAnalysis;

  return md;
}

export function renderMarkdownReportCompact(report: Report): string {
  let md = `# Intelligence Report - ${new Date(report.timestamp).toLocaleDateString()}\n\n`;
  
  md += `**Summary:** ${report.summary.totalOpportunities} opportunities `;
  md += `(${report.summary.highImpact} high-impact, ${report.summary.readyToBuild} ready)\n\n`;

  md += `**Top Actions:**\n`;
  report.recommendations.slice(0, 3).forEach((rec) => {
    md += `- ${rec}\n`;
  });

  return md;
}

/**
 * Report Analysis Logic
 * 
 * Preserves the unique intelligence analysis algorithms.
 * This module contains the core business logic for analyzing scout data.
 */

import { ScoutData, AnalysisResult } from './types';

/**
 * Generate actionable recommendations from scout data
 * 
 * This is the unique insight generation logic that identifies
 * priority actions based on the data patterns.
 */
export function generateRecommendations(data: ScoutData): string[] {
  const recs: string[] = [];

  // Priority recommendation based on top opportunity
  if (data.topOpportunities && data.topOpportunities.length > 0) {
    const top = data.topOpportunities[0];
    recs.push(`Priority 1: ${top.solution}`);

    // Add context if available
    if (top.painPoint) {
      recs.push(`  - Addresses pain point: ${top.painPoint}`);
    }
  }

  // Trend-based recommendations
  if (data.trendsDetected && data.trendsDetected.length > 0) {
    recs.push(`Watch trend: ${data.trendsDetected[0]}`);
    
    if (data.trendsDetected.length > 1) {
      recs.push(`Secondary trends: ${data.trendsDetected.slice(1, 3).join(', ')}`);
    }
  }

  // Quick wins - high impact, low effort
  const quickWins = data.topOpportunities?.filter(
    (o) => o.effort === 'low' && o.impact === 'high'
  );
  if (quickWins && quickWins.length > 0) {
    recs.push(`Quick wins available: ${quickWins.length} high-impact, low-effort opportunities`);
  }

  // Standard recommendations
  recs.push('Review opportunities in data/opportunities/latest.json');
  recs.push('Set up alerts for new pain points');

  return recs;
}

/**
 * Generate detailed market analysis
 * 
 * This function creates the narrative analysis that provides
 * context and insights about the market landscape.
 */
export function generateAnalysis(data: ScoutData): string {
  let analysis = `## Market Analysis\n\n`;

  // Context setting
  analysis += `Based on scanning ${data.repositoriesScanned || 0} repositories, `;
  analysis += `we identified ${data.painPointsFound || 0} distinct pain points.\n\n`;

  // Key findings section
  analysis += `### Key Findings\n\n`;

  const highImpact = data.topOpportunities?.filter((o) => o.impact === 'high').length || 0;
  const lowEffort = data.topOpportunities?.filter((o) => o.effort === 'low').length || 0;
  const trendsCount = data.trendsDetected?.length || 0;

  analysis += `- **High-impact opportunities**: ${highImpact}\n`;
  analysis += `- **Low-effort builds**: ${lowEffort}\n`;
  analysis += `- **Emerging trends**: ${trendsCount}\n\n`;

  // Opportunity breakdown
  if (data.topOpportunities && data.topOpportunities.length > 0) {
    analysis += `### Top Opportunities\n\n`;
    
    data.topOpportunities.slice(0, 3).forEach((opp, idx) => {
      analysis += `${idx + 1}. **${opp.solution}**\n`;
      analysis += `   - Impact: ${opp.impact.toUpperCase()}\n`;
      analysis += `   - Effort: ${opp.effort.toUpperCase()}\n`;
      if (opp.description) {
        analysis += `   - ${opp.description}\n`;
      }
      analysis += `\n`;
    });
  }

  // Trend analysis
  if (data.trendsDetected && data.trendsDetected.length > 0) {
    analysis += `### Emerging Trends\n\n`;
    data.trendsDetected.forEach((trend) => {
      analysis += `- ${trend}\n`;
    });
    analysis += `\n`;
  }

  return analysis;
}

/**
 * Perform complete analysis on scout data
 * 
 * This is the main analysis function that orchestrates all
 * the intelligence generation logic.
 */
export function analyzeScoutData(data: ScoutData): AnalysisResult {
  const recommendations = generateRecommendations(data);
  const detailedAnalysis = generateAnalysis(data);

  // Generate additional insights
  const insights: string[] = [];

  // Market maturity insight
  const avgImpact = calculateAverageImpact(data);
  if (avgImpact > 2.5) {
    insights.push('Market shows high-value opportunities');
  }

  // Competition analysis
  const repoRatio = (data.painPointsFound || 0) / (data.repositoriesScanned || 1);
  if (repoRatio > 0.1) {
    insights.push('High concentration of pain points - underserved market');
  }

  return {
    recommendations,
    detailedAnalysis,
    insights,
  };
}

/**
 * Helper: Calculate average impact score
 */
function calculateAverageImpact(data: ScoutData): number {
  if (!data.topOpportunities || data.topOpportunities.length === 0) {
    return 0;
  }

  const impactScores = { high: 3, medium: 2, low: 1 };
  const total = data.topOpportunities.reduce(
    (sum, opp) => sum + (impactScores[opp.impact] || 0),
    0
  );

  return total / data.topOpportunities.length;
}

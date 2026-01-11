// Synthesis Output Formatter - Convert structured synthesis to markdown
import type { SynthesisOutput } from '@/lib/types';

/**
 * Formats structured synthesis output into readable markdown
 */
export function formatStructuredSynthesis(structured: SynthesisOutput): string {
  let markdown = '';
  
  // Consensus section
  markdown += `## 🎯 Consensus\n\n${structured.consensus}\n\n`;
  
  // Confidence badge
  const confidenceBadge = {
    low: '🔴 Low',
    medium: '🟡 Medium',
    high: '🟢 High'
  }[structured.confidence];
  markdown += `**Confidence**: ${confidenceBadge}\n\n`;
  
  // Key Insights section
  if (structured.keyInsights && structured.keyInsights.length > 0) {
    markdown += `## 💡 Key Insights\n\n`;
    
    // Group insights by category
    const insightsByCategory = structured.keyInsights.reduce((acc, insight) => {
      if (!acc[insight.category]) acc[insight.category] = [];
      acc[insight.category].push(insight);
      return acc;
    }, {} as Record<string, typeof structured.keyInsights>);
    
    for (const [category, insights] of Object.entries(insightsByCategory)) {
      const categoryIcon = getCategoryIcon(category);
      markdown += `### ${categoryIcon} ${capitalizeFirst(category)}\n\n`;
      
      insights.forEach(insight => {
        const confidenceIcon = {
          low: '🔴',
          medium: '🟡',
          high: '🟢'
        }[insight.confidence];
        
        markdown += `- ${confidenceIcon} ${insight.content}`;
        if (insight.supportingExperts && insight.supportingExperts.length > 0) {
          markdown += ` *(Supported by: ${insight.supportingExperts.join(', ')})*`;
        }
        markdown += '\n';
      });
      markdown += '\n';
    }
  }
  
  // Conflicts section
  if (structured.conflicts && structured.conflicts.length > 0) {
    markdown += `## ⚠️ Conflicts & Disagreements\n\n`;
    
    structured.conflicts.forEach(conflict => {
      const severityIcon = {
        minor: '🟦',
        moderate: '🟧',
        critical: '🟥'
      }[conflict.severity];
      
      markdown += `### ${severityIcon} ${conflict.topic}\n\n`;
      markdown += `**Severity**: ${capitalizeFirst(conflict.severity)}\n\n`;
      
      if (conflict.positions.length > 0) {
        markdown += `**Positions**:\n`;
        conflict.positions.forEach((position, i) => {
          markdown += `${i + 1}. ${position}\n`;
        });
      }
      markdown += '\n';
    });
  }
  
  // Reasoning section
  if (structured.reasoning) {
    markdown += `## 🧠 Reasoning\n\n${structured.reasoning}\n\n`;
  }
  
  // Action Items section
  if (structured.actionItems && structured.actionItems.length > 0) {
    markdown += `## 🎬 Action Items\n\n`;
    structured.actionItems.forEach((item, i) => {
      markdown += `${i + 1}. ${item}\n`;
    });
    markdown += '\n';
  }
  
  // Expert Weights section
  if (structured.expertWeights && structured.expertWeights.length > 0) {
    markdown += `## ⚖️ Expert Weights\n\n`;
    
    const sorted = [...structured.expertWeights].sort((a, b) => b.weight - a.weight);
    sorted.forEach(w => {
      const stars = '★'.repeat(Math.ceil(w.weight * 5));
      const percentage = (w.normalizedWeight * 100).toFixed(1);
      markdown += `- **${w.expertName}**: ${(w.weight * 100).toFixed(0)}% quality`;
      markdown += ` (${percentage}% influence) ${stars}\n`;
    });
    markdown += '\n';
  }
  
  return markdown;
}

/**
 * Extract plain text summary from structured output
 */
export function extractSummary(structured: SynthesisOutput): string {
  let summary = structured.consensus;
  
  if (structured.keyInsights && structured.keyInsights.length > 0) {
    const topInsights = structured.keyInsights
      .filter(i => i.confidence === 'high')
      .slice(0, 3);
    
    if (topInsights.length > 0) {
      summary += '\n\nTop Insights:\n';
      topInsights.forEach(i => {
        summary += `• ${i.content}\n`;
      });
    }
  }
  
  return summary;
}

/**
 * Validate if a synthesis output meets quality thresholds
 */
export function validateSynthesisQuality(structured: SynthesisOutput): {
  isValid: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  
  // Check consensus length
  if (structured.consensus.length < 50) {
    issues.push('Consensus is too brief (< 50 chars)');
  }
  
  // Check for insights
  if (!structured.keyInsights || structured.keyInsights.length === 0) {
    issues.push('No key insights extracted');
  }
  
  // Check for low confidence without reasoning
  if (structured.confidence === 'low' && !structured.reasoning) {
    issues.push('Low confidence without reasoning explanation');
  }
  
  // Check critical conflicts
  const criticalConflicts = structured.conflicts?.filter(c => c.severity === 'critical') || [];
  if (criticalConflicts.length > 0 && !structured.reasoning) {
    issues.push('Critical conflicts without resolution reasoning');
  }
  
  return {
    isValid: issues.length === 0,
    issues,
  };
}

// Helper functions
function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    opportunity: '🚀',
    risk: '⚠️',
    pattern: '📊',
    recommendation: '💡',
    general: '📝',
  };
  return icons[category.toLowerCase()] || '📝';
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

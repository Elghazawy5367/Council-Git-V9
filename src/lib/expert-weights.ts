// Expert Weighting System - Calculate weights for expert outputs
import { MAGNIFICENT_7_FLEET } from './config';

export interface ExpertWeight {
  expertId: string;
  expertName: string;
  weight: number;
  factors: {
    modelQuality: number;      // 0-1 based on model tier
    outputQuality: number;     // 0-1 based on output characteristics
    confidence: number;        // 0-1 extracted from output
    domainMatch: number;       // 0-1 based on task relevance
  };
  reasoning: string;
}

export interface WeightedOutput {
  expertId: string;
  expertName: string;
  output: string;
  weight: number;
  normalizedWeight: number;  // Weight as percentage of total
}

// Model tier ratings (based on capabilities and cost)
const MODEL_TIER_SCORES: Record<string, number> = {
  // Tier 1: Elite models (0.9-1.0)
  'openai/gpt-4': 1.0,
  'openai/gpt-4-turbo': 0.95,
  'anthropic/claude-3-opus': 0.95,
  'anthropic/claude-3-sonnet': 0.90,
  
  // Tier 2: High-quality models (0.7-0.89)
  'google/gemini-2.0-flash-001': 0.85,
  'deepseek/deepseek-chat': 0.82,
  'openai/gpt-4o-mini': 0.80,
  'qwen/qwen-2.5-72b-instruct': 0.78,
  'anthropic/claude-3-haiku': 0.75,
  'mistralai/mixtral-8x7b-instruct': 0.72,
  
  // Tier 3: Capable models (0.5-0.69)
  'google/gemini-flash-1.5': 0.65,
  'cohere/command-r7b-12-2024': 0.60,
  'meta-llama/llama-3.1-8b-instruct': 0.55,
  
  // Tier 4: Fast/basic models (0.3-0.49)
  'meta-llama/llama-3.1-8b': 0.40,
};

// Default score for unknown models
const DEFAULT_MODEL_SCORE = 0.50;

/**
 * Calculate model quality score (0-1)
 */
function calculateModelQuality(modelId: string): number {
  // Check exact match
  if (MODEL_TIER_SCORES[modelId]) {
    return MODEL_TIER_SCORES[modelId];
  }
  
  // Check partial match (e.g., "openai/gpt-4-0125" matches "openai/gpt-4")
  for (const [knownModel, score] of Object.entries(MODEL_TIER_SCORES)) {
    if (modelId.startsWith(knownModel)) {
      return score;
    }
  }
  
  return DEFAULT_MODEL_SCORE;
}

// Cache for regex compilation to improve performance
const REGEX_CACHE = {
  structure: /[-•*]\s/,
  headers: /#{1,3}\s/,
  specifics: /\d+%|\$\d+|\d+x|example:|specifically:|data shows/i,
  highConfidence: /\b(definitely|certainly|clearly|strongly recommend|confident that|proven|evidence shows)\b/i,
  mediumConfidence: /\b(likely|probably|should|recommend|suggests|indicates|appears)\b/i,
  lowConfidence: /\b(maybe|perhaps|possibly|might|could|uncertain|unclear|depends)\b/i,
};

/**
 * Calculate output quality score (0-1) based on characteristics
 */
function calculateOutputQuality(output: string): number {
  let score = 0.5; // Base score
  
  // Length factor (optimal: 500-2000 chars)
  const length = output.length;
  if (length < 100) {
    score -= 0.2; // Too brief
  } else if (length >= 500 && length <= 2000) {
    score += 0.2; // Optimal length
  } else if (length > 3000) {
    score -= 0.1; // Too verbose
  }
  
  // Structure factor (has sections/bullets)
  const hasStructure = REGEX_CACHE.structure.test(output) || REGEX_CACHE.headers.test(output);
  if (hasStructure) {
    score += 0.15;
  }
  
  // Specificity factor (has numbers, data, examples)
  const hasSpecifics = REGEX_CACHE.specifics.test(output);
  if (hasSpecifics) {
    score += 0.15;
  }
  
  // Clamp to 0-1
  return Math.max(0, Math.min(1, score));
}

/**
 * Extract confidence level from output text (0-1)
 * Note: All regex patterns are case-insensitive (/i flag), so no toLowerCase() needed
 */
function extractConfidence(output: string): number {
  // High confidence signals
  if (REGEX_CACHE.highConfidence.test(output)) {
    return 0.9;
  }
  
  // Medium confidence signals
  if (REGEX_CACHE.mediumConfidence.test(output)) {
    return 0.7;
  }
  
  // Low confidence signals
  if (REGEX_CACHE.lowConfidence.test(output)) {
    return 0.4;
  }
  
  // Default medium confidence
  return 0.6;
}

/**
 * Calculate domain match score (0-1) based on task keywords
 */
function calculateDomainMatch(
  expertName: string,
  expertModel: string,
  task: string
): number {
  const taskLower = task.toLowerCase();
  const expertLower = expertName.toLowerCase();
  
  // Get model specialty
  const modelInfo = MAGNIFICENT_7_FLEET.find(m => m.id === expertModel);
  const specialty = modelInfo?.specialty.toLowerCase() || '';
  
  let score = 0.5; // Base score
  
  // Domain keyword matching
  const domainKeywords: Record<string, string[]> = {
    technical: ['code', 'architecture', 'system', 'technical', 'implementation', 'api', 'database'],
    strategic: ['strategy', 'market', 'business', 'opportunity', 'competitive', 'positioning'],
    analytical: ['analyze', 'data', 'metrics', 'performance', 'evaluate', 'assess'],
    creative: ['design', 'user experience', 'ux', 'ui', 'creative', 'branding'],
    financial: ['cost', 'pricing', 'revenue', 'budget', 'financial', 'monetization'],
  };
  
  // Check if task matches expert specialty
  for (const [domain, keywords] of Object.entries(domainKeywords)) {
    if (specialty.includes(domain) || expertLower.includes(domain)) {
      const matches = keywords.filter(kw => taskLower.includes(kw)).length;
      if (matches > 0) {
        score += 0.1 * Math.min(matches, 3); // Max +0.3
      }
    }
  }
  
  // Clamp to 0-1
  return Math.max(0, Math.min(1, score));
}

/**
 * Calculate comprehensive weight for an expert's output
 */
export function calculateExpertWeight(
  expertId: string,
  expertName: string,
  expertModel: string,
  output: string,
  task: string
): ExpertWeight {
  const factors = {
    modelQuality: calculateModelQuality(expertModel),
    outputQuality: calculateOutputQuality(output),
    confidence: extractConfidence(output),
    domainMatch: calculateDomainMatch(expertName, expertModel, task),
  };
  
  // Weighted combination (model quality is most important)
  const weight = 
    factors.modelQuality * 0.40 +     // 40% model quality
    factors.outputQuality * 0.25 +    // 25% output quality
    factors.confidence * 0.20 +       // 20% confidence
    factors.domainMatch * 0.15;       // 15% domain match
  
  const reasoning = `Model: ${(factors.modelQuality * 100).toFixed(0)}%, ` +
    `Output: ${(factors.outputQuality * 100).toFixed(0)}%, ` +
    `Confidence: ${(factors.confidence * 100).toFixed(0)}%, ` +
    `Domain: ${(factors.domainMatch * 100).toFixed(0)}%`;
  
  return {
    expertId,
    expertName,
    weight,
    factors,
    reasoning,
  };
}

/**
 * Calculate weights for all expert outputs
 */
export function calculateWeights(
  expertOutputs: Record<string, { expertName: string; output: string; model?: string }>,
  task: string
): ExpertWeight[] {
  const weights: ExpertWeight[] = [];
  
  for (const [expertId, data] of Object.entries(expertOutputs)) {
    const model = data.model || 'unknown';
    const weight = calculateExpertWeight(
      expertId,
      data.expertName,
      model,
      data.output,
      task
    );
    weights.push(weight);
  }
  
  return weights;
}

/**
 * Create weighted outputs with normalized weights
 */
export function createWeightedOutputs(
  expertOutputs: Record<string, { expertName: string; output: string; model?: string }>,
  task: string
): WeightedOutput[] {
  const weights = calculateWeights(expertOutputs, task);
  const totalWeight = weights.reduce((sum, w) => sum + w.weight, 0);
  
  return weights.map(w => ({
    expertId: w.expertId,
    expertName: w.expertName,
    output: expertOutputs[w.expertId].output,
    weight: w.weight,
    normalizedWeight: totalWeight > 0 ? (w.weight / totalWeight) : (1 / weights.length),
  }));
}

/**
 * Sort experts by weight (descending)
 */
export function sortByWeight(weights: ExpertWeight[]): ExpertWeight[] {
  return [...weights].sort((a, b) => b.weight - a.weight);
}

/**
 * Detect if low-weight experts dominate output count
 */
export function detectWeightImbalance(weights: ExpertWeight[]): {
  hasImbalance: boolean;
  warning?: string;
  topExperts: string[];
  lowWeightCount: number;
} {
  if (weights.length === 0) {
    return { hasImbalance: false, topExperts: [], lowWeightCount: 0 };
  }
  
  const sorted = sortByWeight(weights);
  const avgWeight = weights.reduce((sum, w) => sum + w.weight, 0) / weights.length;
  const lowWeightExperts = weights.filter(w => w.weight < avgWeight * 0.7);
  const topExperts = sorted.slice(0, 3).map(w => w.expertName);
  
  const hasImbalance = lowWeightExperts.length > weights.length / 2;
  const warning = hasImbalance
    ? `⚠️ ${lowWeightExperts.length}/${weights.length} experts have below-average weights. Consider prioritizing ${topExperts[0]}'s analysis.`
    : undefined;
  
  return {
    hasImbalance,
    warning,
    topExperts,
    lowWeightCount: lowWeightExperts.length,
  };
}

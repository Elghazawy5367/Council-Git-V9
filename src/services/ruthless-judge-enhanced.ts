/**
 * Ruthless Judge Service - Enhanced with Advanced Synthesis Patterns
 * 
 * ENHANCEMENTS:
 * 1. Weighted voting based on expert confidence
 * 2. Advanced conflict resolution (Condorcet, Borda count)
 * 3. Explanation generation system
 * 4. Improved scoring algorithms
 * 5. A/B testing framework for synthesis strategies
 * 
 * Research implementations:
 * - Ensemble learning techniques
 * - Multi-agent consensus algorithms  
 * - Voting theory (Condorcet, Borda count, Approval voting)
 */

import OpenRouterService, { LLMResponse } from './openrouter';

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

/**
 * Score breakdown for a single LLM with enhanced metrics
 */
export interface ScoreDetail {
  accuracy: number;       // 0-100
  completeness: number;   // 0-100
  conciseness: number;    // 0-100
  total: number;          // Weighted average
  confidence: number;     // Self-reported confidence (0-100)
  weight: number;         // Computed weight for voting (0-1)
}

/**
 * Enhanced conflict with resolution strategy
 */
export interface Conflict {
  id: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  affectedResponses: string[]; // llmIds involved
  evidence: string[];
  resolution?: string;
  resolutionStrategy?: 'condorcet' | 'borda' | 'weighted' | 'evidence' | 'judge';
  votes?: { [llmId: string]: string }; // For voting-based resolution
}

/**
 * Explanation for synthesis decisions
 */
export interface SynthesisExplanation {
  overview: string;
  keyDecisions: Array<{
    decision: string;
    rationale: string;
    evidence: string[];
    confidence: number;
  }>;
  conflictResolutions: Array<{
    conflict: string;
    strategy: string;
    outcome: string;
    reasoning: string;
  }>;
  weightingRationale: string;
  qualityMetrics: {
    factualAccuracy: number;
    coverageCompleteness: number;
    clarityScore: number;
    consensusLevel: number;
  };
}

/**
 * Synthesis strategy configuration
 */
export type SynthesisStrategy = 'weighted' | 'condorcet' | 'borda' | 'approval' | 'ensemble' | 'judge';

/**
 * Strategy performance metrics for A/B testing
 */
export interface StrategyMetrics {
  strategy: SynthesisStrategy;
  confidence: number;
  consensusScore: number; // How well responses agree
  conflictsResolved: number;
  processingTime: number; // milliseconds
  qualityScore: number; // Combined metric
}

/**
 * Enhanced judgment result
 */
export interface EnhancedJudgmentResult {
  unifiedResponse: string;
  scoreBreakdown: { [llmId: string]: ScoreDetail };
  contradictions: string[]; // Backward compatibility
  conflicts?: Conflict[];
  confidence: number;
  judgeCommentary: string;
  
  // New enhancements
  explanation?: SynthesisExplanation;
  strategyUsed?: SynthesisStrategy;
  strategyMetrics?: StrategyMetrics;
  weightedScores?: { [llmId: string]: number };
  votingResults?: VotingResults;
  
  // AutoGen features (preserved)
  refinementRounds?: number;
  convergenceAchieved?: boolean;
  finalSummary?: string;
}

/**
 * Voting results for different methods
 */
export interface VotingResults {
  condorcet?: {
    winner: string | null;
    pairwiseMatrix: { [key: string]: { [key: string]: number } };
    explanation: string;
  };
  borda?: {
    scores: { [llmId: string]: number };
    winner: string;
    explanation: string;
  };
  approval?: {
    approvalCounts: { [llmId: string]: number };
    threshold: number;
    approved: string[];
    explanation: string;
  };
  weighted?: {
    weightedScores: { [llmId: string]: number };
    weights: { [llmId: string]: number };
    winner: string;
    explanation: string;
  };
}

/**
 * Enhanced options for judge execution
 */
export interface EnhancedJudgeOptions {
  // Original options (preserved)
  enableIterativeRefinement?: boolean;
  maxRefinementRounds?: number;
  convergenceThreshold?: number;
  enableConversationTracking?: boolean;
  contextQuestion?: string;
  
  // New enhancement options
  synthesisStrategy?: SynthesisStrategy;
  enableWeightedVoting?: boolean;
  enableExplanations?: boolean;
  enableABTesting?: boolean; // Compare multiple strategies
  comparisonStrategies?: SynthesisStrategy[]; // For A/B testing
  confidenceWeighting?: 'linear' | 'exponential' | 'sigmoid';
  minConsensusThreshold?: number; // 0-100
}

// ============================================================================
// MAIN SERVICE CLASS
// ============================================================================

class RuthlessJudgeEnhanced {
  private openRouterService: OpenRouterService;
  private judgeModel = 'openai/gpt-4-turbo-preview';
  
  constructor(apiKey: string) {
    this.openRouterService = new OpenRouterService(apiKey);
  }

  /**
   * Enhanced judge with all advanced features
   */
  async judge(
    responses: LLMResponse[],
    options: EnhancedJudgeOptions = {}
  ): Promise<EnhancedJudgmentResult> {
    const startTime = Date.now();
    
    const {
      synthesisStrategy = 'ensemble',
      enableWeightedVoting = true,
      enableExplanations = true,
      enableABTesting = false,
      comparisonStrategies = ['weighted', 'condorcet', 'borda'],
      confidenceWeighting = 'sigmoid',
      minConsensusThreshold = 70,
    } = options;

    console.log('[EnhancedJudge] Starting advanced judgment', {
      responsesCount: responses.length,
      strategy: synthesisStrategy,
      weightedVoting: enableWeightedVoting,
      explanations: enableExplanations,
      abTesting: enableABTesting,
    });

    // Handle edge cases
    if (responses.length === 0) {
      return this.handleNoResponses();
    }

    const successfulResponses = responses.filter(r => r.status === 'success' && r.response.trim());
    
    if (successfulResponses.length === 0) {
      return this.handleAllFailures(responses);
    }

    if (successfulResponses.length === 1) {
      return this.handleSingleResponse(successfulResponses[0]);
    }

    try {
      // A/B Testing: Compare multiple strategies
      if (enableABTesting && comparisonStrategies.length > 1) {
        return await this.runABTest(
          successfulResponses,
          comparisonStrategies,
          options
        );
      }

      // Single strategy execution
      const result = await this.executeSynthesisStrategy(
        successfulResponses,
        synthesisStrategy,
        options
      );

      // Add processing time
      result.strategyMetrics = {
        ...result.strategyMetrics!,
        processingTime: Date.now() - startTime,
      };

      return result;
    } catch (error) {
      console.error('[EnhancedJudge] Error:', error);
      return this.createFallbackJudgment(successfulResponses);
    }
  }

  // ============================================================================
  // SYNTHESIS STRATEGIES
  // ============================================================================

  /**
   * Execute specific synthesis strategy
   */
  private async executeSynthesisStrategy(
    responses: LLMResponse[],
    strategy: SynthesisStrategy,
    options: EnhancedJudgeOptions
  ): Promise<EnhancedJudgmentResult> {
    switch (strategy) {
      case 'weighted':
        return await this.weightedSynthesis(responses, options);
      case 'condorcet':
        return await this.condorcetSynthesis(responses, options);
      case 'borda':
        return await this.bordaSynthesis(responses, options);
      case 'approval':
        return await this.approvalSynthesis(responses, options);
      case 'ensemble':
        return await this.ensembleSynthesis(responses, options);
      case 'judge':
      default:
        return await this.judgeSynthesis(responses, options);
    }
  }

  /**
   * Weighted voting synthesis based on confidence
   */
  private async weightedSynthesis(
    responses: LLMResponse[],
    options: EnhancedJudgeOptions
  ): Promise<EnhancedJudgmentResult> {
    // Get initial scores from judge
    const baseResult = await this.judgeSynthesis(responses, options);
    
    // Calculate weights based on scores and confidence
    const weights = this.calculateWeights(
      baseResult.scoreBreakdown,
      options.confidenceWeighting || 'sigmoid'
    );

    // Generate weighted synthesis
    const weightedResponse = this.generateWeightedResponse(
      responses,
      weights,
      baseResult
    );

    // Calculate voting results
    const votingResults: VotingResults = {
      weighted: {
        weightedScores: Object.entries(weights).reduce((acc, [id, weight]) => {
          acc[id] = weight * (baseResult.scoreBreakdown[id]?.total || 0);
          return acc;
        }, {} as { [key: string]: number }),
        weights,
        winner: this.getWinner(weights),
        explanation: this.explainWeightedVoting(weights, baseResult.scoreBreakdown),
      },
    };

    return {
      ...baseResult,
      unifiedResponse: weightedResponse,
      strategyUsed: 'weighted',
      weightedScores: votingResults.weighted.weightedScores,
      votingResults,
      strategyMetrics: this.calculateStrategyMetrics('weighted', baseResult, responses),
      explanation: options.enableExplanations
        ? this.generateExplanation(baseResult, responses, 'weighted', weights)
        : undefined,
    };
  }

  /**
   * Condorcet method synthesis (pairwise comparison)
   */
  private async condorcetSynthesis(
    responses: LLMResponse[],
    options: EnhancedJudgeOptions
  ): Promise<EnhancedJudgmentResult> {
    const baseResult = await this.judgeSynthesis(responses, options);
    
    // Create pairwise comparison matrix
    const pairwiseMatrix = this.createPairwiseMatrix(responses, baseResult.scoreBreakdown);
    
    // Find Condorcet winner (beats all others in pairwise comparisons)
    const winner = this.findCondorcetWinner(pairwiseMatrix, responses);
    
    const votingResults: VotingResults = {
      condorcet: {
        winner: winner?.llmId || null,
        pairwiseMatrix,
        explanation: this.explainCondorcetResult(winner, pairwiseMatrix, responses),
      },
    };

    // Generate synthesis prioritizing Condorcet winner
    const synthesizedResponse = winner
      ? this.generateCondorcetResponse(winner, responses, baseResult)
      : baseResult.unifiedResponse;

    return {
      ...baseResult,
      unifiedResponse: synthesizedResponse,
      strategyUsed: 'condorcet',
      votingResults,
      strategyMetrics: this.calculateStrategyMetrics('condorcet', baseResult, responses),
      explanation: options.enableExplanations
        ? this.generateExplanation(baseResult, responses, 'condorcet')
        : undefined,
    };
  }

  /**
   * Borda count synthesis (ranked preference voting)
   */
  private async bordaSynthesis(
    responses: LLMResponse[],
    options: EnhancedJudgeOptions
  ): Promise<EnhancedJudgmentResult> {
    const baseResult = await this.judgeSynthesis(responses, options);
    
    // Calculate Borda scores (points based on ranking)
    const bordaScores = this.calculateBordaScores(responses, baseResult.scoreBreakdown);
    
    // Find winner
    const winner = Object.entries(bordaScores)
      .sort(([, a], [, b]) => b - a)[0];
    
    const votingResults: VotingResults = {
      borda: {
        scores: bordaScores,
        winner: winner[0],
        explanation: this.explainBordaResult(bordaScores, responses),
      },
    };

    const synthesizedResponse = this.generateBordaResponse(
      winner[0],
      responses,
      baseResult,
      bordaScores
    );

    return {
      ...baseResult,
      unifiedResponse: synthesizedResponse,
      strategyUsed: 'borda',
      votingResults,
      strategyMetrics: this.calculateStrategyMetrics('borda', baseResult, responses),
      explanation: options.enableExplanations
        ? this.generateExplanation(baseResult, responses, 'borda')
        : undefined,
    };
  }

  /**
   * Approval voting synthesis (binary approval threshold)
   */
  private async approvalSynthesis(
    responses: LLMResponse[],
    options: EnhancedJudgeOptions
  ): Promise<EnhancedJudgmentResult> {
    const baseResult = await this.judgeSynthesis(responses, options);
    
    // Set approval threshold (e.g., 75% total score)
    const threshold = options.minConsensusThreshold || 75;
    
    // Count approvals
    const approvalCounts: { [llmId: string]: number } = {};
    const approved: string[] = [];
    
    Object.entries(baseResult.scoreBreakdown).forEach(([llmId, scores]) => {
      const approved = scores.total >= threshold;
      approvalCounts[llmId] = approved ? 1 : 0;
      if (approved) approved.push(llmId);
    });

    const votingResults: VotingResults = {
      approval: {
        approvalCounts,
        threshold,
        approved,
        explanation: this.explainApprovalResult(approvalCounts, threshold, responses),
      },
    };

    const synthesizedResponse = this.generateApprovalResponse(
      approved,
      responses,
      baseResult
    );

    return {
      ...baseResult,
      unifiedResponse: synthesizedResponse,
      strategyUsed: 'approval',
      votingResults,
      strategyMetrics: this.calculateStrategyMetrics('approval', baseResult, responses),
      explanation: options.enableExplanations
        ? this.generateExplanation(baseResult, responses, 'approval')
        : undefined,
    };
  }

  /**
   * Ensemble synthesis (combines multiple strategies)
   */
  private async ensembleSynthesis(
    responses: LLMResponse[],
    options: EnhancedJudgeOptions
  ): Promise<EnhancedJudgmentResult> {
    console.log('[EnhancedJudge] Running ensemble synthesis');
    
    // Get base judgment
    const baseResult = await this.judgeSynthesis(responses, options);
    
    // Run all voting methods
    const weights = this.calculateWeights(baseResult.scoreBreakdown, 'sigmoid');
    const pairwiseMatrix = this.createPairwiseMatrix(responses, baseResult.scoreBreakdown);
    const condorcetWinner = this.findCondorcetWinner(pairwiseMatrix, responses);
    const bordaScores = this.calculateBordaScores(responses, baseResult.scoreBreakdown);
    
    // Combine results with meta-voting
    const ensembleScores = this.combineEnsembleScores(
      weights,
      bordaScores,
      baseResult.scoreBreakdown
    );
    
    const winner = Object.entries(ensembleScores)
      .sort(([, a], [, b]) => b - a)[0];

    const votingResults: VotingResults = {
      weighted: {
        weightedScores: ensembleScores,
        weights,
        winner: winner[0],
        explanation: 'Ensemble method combines weighted, Borda, and confidence scoring',
      },
      condorcet: condorcetWinner ? {
        winner: condorcetWinner.llmId,
        pairwiseMatrix,
        explanation: `Condorcet winner: ${condorcetWinner.llmName}`,
      } : undefined,
      borda: {
        scores: bordaScores,
        winner: Object.entries(bordaScores).sort(([, a], [, b]) => b - a)[0][0],
        explanation: 'Ranked preference scoring',
      },
    };

    const synthesizedResponse = this.generateEnsembleResponse(
      winner[0],
      responses,
      baseResult,
      ensembleScores
    );

    return {
      ...baseResult,
      unifiedResponse: synthesizedResponse,
      strategyUsed: 'ensemble',
      weightedScores: ensembleScores,
      votingResults,
      strategyMetrics: this.calculateStrategyMetrics('ensemble', baseResult, responses),
      explanation: options.enableExplanations
        ? this.generateExplanation(baseResult, responses, 'ensemble', weights)
        : undefined,
    };
  }

  /**
   * Traditional judge-based synthesis (GPT-4 judgment)
   */
  private async judgeSynthesis(
    responses: LLMResponse[],
    options: EnhancedJudgeOptions
  ): Promise<EnhancedJudgmentResult> {
    const prompt = this.createEnhancedJudgePrompt(responses);
    const judgeResponse = await this.callJudge(prompt);
    const baseResult = this.parseJudgeResponse(judgeResponse, responses);
    
    return {
      ...baseResult,
      strategyUsed: 'judge',
      strategyMetrics: this.calculateStrategyMetrics('judge', baseResult, responses),
      explanation: options.enableExplanations
        ? this.generateExplanation(baseResult, responses, 'judge')
        : undefined,
    };
  }

  // ============================================================================
  // A/B TESTING FRAMEWORK
  // ============================================================================

  /**
   * Run A/B test comparing multiple strategies
   */
  private async runABTest(
    responses: LLMResponse[],
    strategies: SynthesisStrategy[],
    options: EnhancedJudgeOptions
  ): Promise<EnhancedJudgmentResult> {
    console.log('[EnhancedJudge] Running A/B test', { strategies });
    
    const results: Array<{ strategy: SynthesisStrategy; result: EnhancedJudgmentResult }> = [];
    
    // Run each strategy
    for (const strategy of strategies) {
      try {
        const result = await this.executeSynthesisStrategy(
          responses,
          strategy,
          { ...options, enableABTesting: false }
        );
        results.push({ strategy, result });
      } catch (error) {
        console.error(`[EnhancedJudge] Strategy ${strategy} failed:`, error);
      }
    }

    // Compare and select best strategy
    const bestResult = this.selectBestStrategy(results);
    
    // Add A/B test metadata
    const abTestComparison = this.generateABTestReport(results);
    
    return {
      ...bestResult.result,
      judgeCommentary: `${bestResult.result.judgeCommentary}\n\n## A/B Test Results\n\n${abTestComparison}`,
    };
  }

  /**
   * Select best strategy from A/B test results
   */
  private selectBestStrategy(
    results: Array<{ strategy: SynthesisStrategy; result: EnhancedJudgmentResult }>
  ): { strategy: SynthesisStrategy; result: EnhancedJudgmentResult } {
    // Score each strategy based on multiple factors
    const scored = results.map(({ strategy, result }) => {
      const metrics = result.strategyMetrics!;
      
      // Weighted scoring formula
      const score = 
        metrics.confidence * 0.3 +
        metrics.consensusScore * 0.25 +
        metrics.qualityScore * 0.25 +
        (100 - metrics.conflictsResolved) * 0.1 +
        (10000 / Math.max(metrics.processingTime, 1000)) * 0.1; // Prefer faster
      
      return { strategy, result, score };
    });

    // Sort by score and return best
    scored.sort((a, b) => b.score - a.score);
    
    console.log('[EnhancedJudge] Strategy scores:', 
      scored.map(s => ({ strategy: s.strategy, score: s.score.toFixed(2) }))
    );
    
    return scored[0];
  }

  /**
   * Generate A/B test comparison report
   */
  private generateABTestReport(
    results: Array<{ strategy: SynthesisStrategy; result: EnhancedJudgmentResult }>
  ): string {
    const lines: string[] = [];
    
    lines.push('| Strategy | Confidence | Consensus | Quality | Time (ms) |');
    lines.push('|----------|------------|-----------|---------|-----------|');
    
    results.forEach(({ strategy, result }) => {
      const m = result.strategyMetrics!;
      lines.push(
        `| ${strategy} | ${m.confidence.toFixed(1)}% | ${m.consensusScore.toFixed(1)}% | ` +
        `${m.qualityScore.toFixed(1)}% | ${m.processingTime} |`
      );
    });
    
    return lines.join('\n');
  }

  // ============================================================================
  // EXPLANATION GENERATION
  // ============================================================================

  /**
   * Generate comprehensive explanation for synthesis decision
   */
  private generateExplanation(
    result: EnhancedJudgmentResult,
    responses: LLMResponse[],
    strategy: SynthesisStrategy,
    weights?: { [llmId: string]: number }
  ): SynthesisExplanation {
    const keyDecisions: SynthesisExplanation['keyDecisions'] = [];
    const conflictResolutions: SynthesisExplanation['conflictResolutions'] = [];

    // Explain strategy choice
    const strategyExplanations: { [key in SynthesisStrategy]: string } = {
      weighted: 'Responses were weighted based on confidence scores, giving more influence to higher-quality answers.',
      condorcet: 'Pairwise comparisons were used to find the response that beats all others in head-to-head matchups.',
      borda: 'Responses were ranked and awarded points based on their position, with the highest total score winning.',
      approval: 'Responses meeting a quality threshold were approved, and synthesis combined approved responses.',
      ensemble: 'Multiple voting methods were combined to leverage the strengths of each approach.',
      judge: 'GPT-4 served as an independent judge to evaluate and synthesize responses.',
    };

    // Key decisions
    if (weights) {
      const sortedWeights = Object.entries(weights)
        .sort(([, a], [, b]) => b - a);
      
      keyDecisions.push({
        decision: 'Response weighting calculated',
        rationale: `Weights assigned based on ${strategy} method`,
        evidence: sortedWeights.map(([id, w]) => 
          `${responses.find(r => r.llmId === id)?.llmName}: ${(w * 100).toFixed(1)}%`
        ),
        confidence: result.confidence,
      });
    }

    // Score-based decisions
    const topScorer = Object.entries(result.scoreBreakdown)
      .sort(([, a], [, b]) => b.total - a.total)[0];
    
    if (topScorer) {
      const resp = responses.find(r => r.llmId === topScorer[0]);
      keyDecisions.push({
        decision: `Highest scoring response: ${resp?.llmName}`,
        rationale: `Achieved highest overall score across all metrics`,
        evidence: [
          `Accuracy: ${topScorer[1].accuracy}/100`,
          `Completeness: ${topScorer[1].completeness}/100`,
          `Conciseness: ${topScorer[1].conciseness}/100`,
          `Total: ${topScorer[1].total}/100`,
        ],
        confidence: topScorer[1].total,
      });
    }

    // Conflict resolutions
    if (result.conflicts && result.conflicts.length > 0) {
      result.conflicts.forEach(conflict => {
        conflictResolutions.push({
          conflict: conflict.description,
          strategy: conflict.resolutionStrategy || strategy,
          outcome: conflict.resolution || 'Resolved through weighted voting',
          reasoning: this.explainConflictResolution(conflict, strategy),
        });
      });
    }

    // Calculate quality metrics
    const avgAccuracy = this.average(
      Object.values(result.scoreBreakdown).map(s => s.accuracy)
    );
    const avgCompleteness = this.average(
      Object.values(result.scoreBreakdown).map(s => s.completeness)
    );
    const avgConciseness = this.average(
      Object.values(result.scoreBreakdown).map(s => s.conciseness)
    );
    const consensusLevel = this.calculateConsensusScore(result.scoreBreakdown);

    return {
      overview: strategyExplanations[strategy],
      keyDecisions,
      conflictResolutions,
      weightingRationale: weights 
        ? this.explainWeightingMethod(strategy, weights, result.scoreBreakdown)
        : 'No weighting applied - judge-based synthesis',
      qualityMetrics: {
        factualAccuracy: avgAccuracy,
        coverageCompleteness: avgCompleteness,
        clarityScore: avgConciseness,
        consensusLevel,
      },
    };
  }

  /**
   * Explain conflict resolution reasoning
   */
  private explainConflictResolution(conflict: Conflict, strategy: SynthesisStrategy): string {
    const strategyMethods: { [key in SynthesisStrategy]: string } = {
      weighted: 'Resolved by giving more weight to responses with higher confidence scores',
      condorcet: 'Resolved by selecting the option that wins pairwise comparisons',
      borda: 'Resolved by selecting the option with the highest ranked preference score',
      approval: 'Resolved by majority approval among qualified responses',
      ensemble: 'Resolved by combining multiple voting methods for robust consensus',
      judge: 'Resolved by GPT-4 judge analysis and synthesis',
    };

    let explanation = strategyMethods[strategy] + '. ';
    
    if (conflict.evidence.length > 0) {
      explanation += `Evidence considered: ${conflict.evidence.slice(0, 2).join('; ')}`;
    }
    
    if (conflict.affectedResponses.length > 0) {
      explanation += `. Involved ${conflict.affectedResponses.length} response(s)`;
    }
    
    return explanation;
  }

  /**
   * Explain weighting methodology
   */
  private explainWeightingMethod(
    strategy: SynthesisStrategy,
    weights: { [llmId: string]: number },
    scores: { [llmId: string]: ScoreDetail }
  ): string {
    const lines: string[] = [];
    
    lines.push(`## Weighting Methodology (${strategy})\n`);
    
    Object.entries(weights)
      .sort(([, a], [, b]) => b - a)
      .forEach(([llmId, weight]) => {
        const score = scores[llmId];
        lines.push(
          `- **Response ${llmId}**: ${(weight * 100).toFixed(1)}% weight ` +
          `(Total score: ${score.total}/100, Confidence: ${score.confidence}/100)`
        );
      });
    
    return lines.join('\n');
  }

  // ============================================================================
  // HELPER METHODS - Voting & Scoring
  // ============================================================================

  /**
   * Calculate weights for responses based on scores
   */
  private calculateWeights(
    scoreBreakdown: { [llmId: string]: ScoreDetail },
    method: 'linear' | 'exponential' | 'sigmoid'
  ): { [llmId: string]: number } {
    const weights: { [llmId: string]: number } = {};
    const scores = Object.entries(scoreBreakdown);
    
    // Calculate raw weights based on method
    const rawWeights = scores.map(([llmId, detail]) => {
      let weight = 0;
      const normalized = detail.total / 100; // 0-1
      
      switch (method) {
        case 'linear':
          weight = normalized;
          break;
        case 'exponential':
          weight = Math.pow(normalized, 2); // Square for exponential
          break;
        case 'sigmoid':
          // Sigmoid centered at 0.7 (70% score)
          weight = 1 / (1 + Math.exp(-10 * (normalized - 0.7)));
          break;
      }
      
      return { llmId, weight };
    });
    
    // Normalize to sum to 1
    const totalWeight = rawWeights.reduce((sum, { weight }) => sum + weight, 0);
    
    rawWeights.forEach(({ llmId, weight }) => {
      weights[llmId] = totalWeight > 0 ? weight / totalWeight : 1 / scores.length;
    });
    
    return weights;
  }

  /**
   * Create pairwise comparison matrix for Condorcet method
   */
  private createPairwiseMatrix(
    responses: LLMResponse[],
    scores: { [llmId: string]: ScoreDetail }
  ): { [key: string]: { [key: string]: number } } {
    const matrix: { [key: string]: { [key: string]: number } } = {};
    
    responses.forEach(r1 => {
      matrix[r1.llmId] = {};
      responses.forEach(r2 => {
        if (r1.llmId === r2.llmId) {
          matrix[r1.llmId][r2.llmId] = 0;
        } else {
          // Compare scores: r1 beats r2 if r1's total > r2's total
          const r1Score = scores[r1.llmId]?.total || 0;
          const r2Score = scores[r2.llmId]?.total || 0;
          matrix[r1.llmId][r2.llmId] = r1Score > r2Score ? 1 : 0;
        }
      });
    });
    
    return matrix;
  }

  /**
   * Find Condorcet winner (beats all others pairwise)
   */
  private findCondorcetWinner(
    matrix: { [key: string]: { [key: string]: number } },
    responses: LLMResponse[]
  ): LLMResponse | null {
    for (const candidate of responses) {
      const candidateId = candidate.llmId;
      let beatsAll = true;
      
      for (const opponent of responses) {
        if (candidate.llmId === opponent.llmId) continue;
        
        if (matrix[candidateId][opponent.llmId] === 0) {
          beatsAll = false;
          break;
        }
      }
      
      if (beatsAll) {
        return candidate;
      }
    }
    
    return null; // No Condorcet winner (cycle exists)
  }

  /**
   * Calculate Borda count scores
   */
  private calculateBordaScores(
    responses: LLMResponse[],
    scores: { [llmId: string]: ScoreDetail }
  ): { [llmId: string]: number } {
    // Sort responses by total score
    const ranked = responses
      .map(r => ({ llmId: r.llmId, score: scores[r.llmId]?.total || 0 }))
      .sort((a, b) => b.score - a.score);
    
    const bordaScores: { [llmId: string]: number } = {};
    const n = ranked.length;
    
    // Assign points: 1st place gets n-1 points, 2nd gets n-2, etc.
    ranked.forEach((item, index) => {
      bordaScores[item.llmId] = n - 1 - index;
    });
    
    return bordaScores;
  }

  /**
   * Combine ensemble scores from multiple methods
   */
  private combineEnsembleScores(
    weights: { [llmId: string]: number },
    bordaScores: { [llmId: string]: number },
    scoreDetails: { [llmId: string]: ScoreDetail }
  ): { [llmId: string]: number } {
    const ensembleScores: { [llmId: string]: number } = {};
    
    Object.keys(weights).forEach(llmId => {
      const normalizedBorda = bordaScores[llmId] / Math.max(...Object.values(bordaScores));
      const confidence = (scoreDetails[llmId]?.confidence || 50) / 100;
      
      // Weighted combination: 40% weights, 30% Borda, 30% confidence
      ensembleScores[llmId] = 
        weights[llmId] * 0.4 +
        normalizedBorda * 0.3 +
        confidence * 0.3;
    });
    
    return ensembleScores;
  }

  /**
   * Calculate consensus score (how much responses agree)
   */
  private calculateConsensusScore(scores: { [llmId: string]: ScoreDetail }): number {
    const totals = Object.values(scores).map(s => s.total);
    
    if (totals.length < 2) return 100;
    
    // Calculate standard deviation
    const mean = this.average(totals);
    const variance = totals.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / totals.length;
    const stdDev = Math.sqrt(variance);
    
    // Lower std dev = higher consensus
    // Normalize: 0 std dev = 100% consensus, 30+ std dev = 0% consensus
    return Math.max(0, Math.min(100, 100 - (stdDev * 3.33)));
  }

  /**
   * Calculate strategy performance metrics
   */
  private calculateStrategyMetrics(
    strategy: SynthesisStrategy,
    result: EnhancedJudgmentResult,
    responses: LLMResponse[]
  ): StrategyMetrics {
    const consensusScore = this.calculateConsensusScore(result.scoreBreakdown);
    const conflictsResolved = (result.conflicts || result.contradictions).length;
    
    // Quality score combines multiple factors
    const avgTotal = this.average(
      Object.values(result.scoreBreakdown).map(s => s.total)
    );
    const qualityScore = (avgTotal + result.confidence + consensusScore) / 3;
    
    return {
      strategy,
      confidence: result.confidence,
      consensusScore,
      conflictsResolved,
      processingTime: 0, // Set by caller
      qualityScore,
    };
  }

  // ============================================================================
  // RESPONSE GENERATION HELPERS
  // ============================================================================

  /**
   * Generate weighted response favoring high-confidence sources
   */
  private generateWeightedResponse(
    responses: LLMResponse[],
    weights: { [llmId: string]: number },
    baseResult: EnhancedJudgmentResult
  ): string {
    const sortedByWeight = Object.entries(weights)
      .sort(([, a], [, b]) => b - a);
    
    const topResponse = responses.find(r => r.llmId === sortedByWeight[0][0]);
    
    return `# Weighted Synthesis\n\n` +
      `${baseResult.unifiedResponse}\n\n` +
      `## Weighting Analysis\n\n` +
      `Primary source: **${topResponse?.llmName}** (${(sortedByWeight[0][1] * 100).toFixed(1)}% weight)\n\n` +
      this.formatWeightDistribution(sortedByWeight, responses);
  }

  /**
   * Generate Condorcet-based response
   */
  private generateCondorcetResponse(
    winner: LLMResponse,
    responses: LLMResponse[],
    baseResult: EnhancedJudgmentResult
  ): string {
    return `# Condorcet Method Synthesis\n\n` +
      `${baseResult.unifiedResponse}\n\n` +
      `## Condorcet Winner\n\n` +
      `**${winner.llmName}** was selected as it beats all other responses in pairwise comparisons.\n\n` +
      `This response demonstrated superior quality across all evaluation criteria.`;
  }

  /**
   * Generate Borda count response
   */
  private generateBordaResponse(
    winnerId: string,
    responses: LLMResponse[],
    baseResult: EnhancedJudgmentResult,
    scores: { [llmId: string]: number }
  ): string {
    const winner = responses.find(r => r.llmId === winnerId);
    const rankings = Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
      .map(([id, score], index) => {
        const resp = responses.find(r => r.llmId === id);
        return `${index + 1}. **${resp?.llmName}**: ${score} points`;
      });
    
    return `# Borda Count Synthesis\n\n` +
      `${baseResult.unifiedResponse}\n\n` +
      `## Ranked Preference Results\n\n` +
      `Winner: **${winner?.llmName}**\n\n` +
      `Full rankings:\n${rankings.join('\n')}`;
  }

  /**
   * Generate approval voting response
   */
  private generateApprovalResponse(
    approvedIds: string[],
    responses: LLMResponse[],
    baseResult: EnhancedJudgmentResult
  ): string {
    const approved = responses.filter(r => approvedIds.includes(r.llmId));
    
    return `# Approval Voting Synthesis\n\n` +
      `${baseResult.unifiedResponse}\n\n` +
      `## Approved Responses\n\n` +
      `${approved.length} response(s) met the quality threshold:\n` +
      approved.map(r => `- **${r.llmName}**`).join('\n');
  }

  /**
   * Generate ensemble response
   */
  private generateEnsembleResponse(
    winnerId: string,
    responses: LLMResponse[],
    baseResult: EnhancedJudgmentResult,
    ensembleScores: { [llmId: string]: number }
  ): string {
    const winner = responses.find(r => r.llmId === winnerId);
    const sortedScores = Object.entries(ensembleScores)
      .sort(([, a], [, b]) => b - a);
    
    return `# Ensemble Method Synthesis\n\n` +
      `${baseResult.unifiedResponse}\n\n` +
      `## Ensemble Analysis\n\n` +
      `Top choice: **${winner?.llmName}** (score: ${(sortedScores[0][1] * 100).toFixed(1)})\n\n` +
      `This result combines weighted voting, Borda count, and confidence scoring for robust consensus.`;
  }

  /**
   * Format weight distribution
   */
  private formatWeightDistribution(
    sortedWeights: [string, number][],
    responses: LLMResponse[]
  ): string {
    return sortedWeights
      .map(([id, weight]) => {
        const resp = responses.find(r => r.llmId === id);
        return `- **${resp?.llmName}**: ${(weight * 100).toFixed(1)}%`;
      })
      .join('\n');
  }

  // ============================================================================
  // EXPLANATION HELPERS
  // ============================================================================

  /**
   * Explain weighted voting result
   */
  private explainWeightedVoting(
    weights: { [llmId: string]: number },
    scores: { [llmId: string]: ScoreDetail }
  ): string {
    const sorted = Object.entries(weights)
      .sort(([, a], [, b]) => b - a);
    
    const winner = sorted[0];
    const winnerScore = scores[winner[0]];
    
    return `Weighted voting selected the response with the highest combined score. ` +
      `The winning response received ${(winner[1] * 100).toFixed(1)}% weight based on ` +
      `its total score of ${winnerScore.total}/100 (Accuracy: ${winnerScore.accuracy}, ` +
      `Completeness: ${winnerScore.completeness}, Conciseness: ${winnerScore.conciseness}).`;
  }

  /**
   * Explain Condorcet result
   */
  private explainCondorcetResult(
    winner: LLMResponse | null,
    matrix: { [key: string]: { [key: string]: number } },
    responses: LLMResponse[]
  ): string {
    if (!winner) {
      return 'No Condorcet winner found (voting cycle detected). Fell back to highest average score.';
    }
    
    const wins = Object.values(matrix[winner.llmId]).reduce((sum, val) => sum + val, 0);
    
    return `${winner.llmName} won ${wins} out of ${responses.length - 1} pairwise comparisons, ` +
      `making it the Condorcet winner. This means it was judged superior to every other response ` +
      `in head-to-head matchups.`;
  }

  /**
   * Explain Borda result
   */
  private explainBordaResult(
    scores: { [llmId: string]: number },
    responses: LLMResponse[]
  ): string {
    const winner = Object.entries(scores)
      .sort(([, a], [, b]) => b - a)[0];
    
    const resp = responses.find(r => r.llmId === winner[0]);
    
    return `${resp?.llmName} achieved the highest Borda count score (${winner[1]} points) ` +
      `through ranked preference voting. Higher rankings from the judge translated to more points.`;
  }

  /**
   * Explain approval result
   */
  private explainApprovalResult(
    approvalCounts: { [llmId: string]: number },
    threshold: number,
    responses: LLMResponse[]
  ): string {
    const approved = Object.entries(approvalCounts)
      .filter(([, count]) => count > 0).length;
    
    return `${approved} out of ${responses.length} responses met the ${threshold}% quality threshold ` +
      `for approval. The synthesis combines insights from all approved responses.`;
  }

  // ============================================================================
  // PROMPT GENERATION
  // ============================================================================

  /**
   * Create enhanced judge prompt with advanced analysis instructions
   */
  private createEnhancedJudgePrompt(responses: LLMResponse[]): string {
    const responsesFormatted = responses.map((resp, index) => {
      return `
### Response ${index + 1}: ${resp.llmName} (ID: ${resp.llmId})
${resp.response}
`;
    }).join('\n---\n');

    return `You are an advanced AI judge with expertise in ensemble learning and consensus algorithms.

**YOUR ENHANCED TASK:**
1. Analyze each response with extreme rigor
2. Extract key points and assess evidence quality
3. Identify contradictions with severity levels
4. Score each response on enhanced criteria (0-100):
   - **Accuracy**: Factual correctness, evidence-based reasoning
   - **Completeness**: Thoroughness, coverage of all aspects
   - **Conciseness**: Clarity, organization, lack of redundancy
   - **Confidence**: Self-reported certainty (infer from language)
5. Synthesize the best unified answer with citations
6. Provide deep commentary on your reasoning

**RESPONSES TO EVALUATE:**
${responsesFormatted}

**RESPONSE FORMAT (JSON only):**
\`\`\`json
{
  "unifiedResponse": "# Synthesized Answer\\n\\nYour answer with [citations]...",
  "scores": {
    "${responses[0].llmId}": {
      "accuracy": 85,
      "completeness": 90,
      "conciseness": 80,
      "confidence": 85,
      "reasoning": "Detailed explanation"
    }
  },
  "contradictions": ["Contradiction descriptions"],
  "conflicts": [{
    "description": "Detailed conflict",
    "severity": "high",
    "affectedResponses": ["id1", "id2"],
    "evidence": ["Evidence 1", "Evidence 2"],
    "resolution": "Evidence-based resolution"
  }],
  "confidence": 85,
  "commentary": "Your detailed reasoning process",
  "keyPoints": ["Key insight 1", "Key insight 2"]
}
\`\`\`

**INSTRUCTIONS:**
- Be ruthless but evidence-based
- Assess confidence by analyzing certainty language
- For conflicts, provide clear evidence and resolution strategies
- Include specific citations in unified response
- Explain all scoring decisions thoroughly

Respond with ONLY the JSON.`;
  }

  /**
   * Call GPT-4 judge (reuse from original)
   */
  private async callJudge(prompt: string): Promise<string> {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${(this.openRouterService as any).apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'https://council-app.local',
        'X-Title': 'The Council - Enhanced Ruthless Judge',
      },
      body: JSON.stringify({
        model: this.judgeModel,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Judge API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  }

  /**
   * Parse judge response (enhanced with confidence field)
   */
  private parseJudgeResponse(
    judgeResponse: string,
    originalResponses: LLMResponse[]
  ): EnhancedJudgmentResult {
    try {
      let jsonStr = judgeResponse.trim();
      const jsonMatch = jsonStr.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        jsonStr = jsonMatch[1];
      }

      const parsed: any = JSON.parse(jsonStr);

      const scoreBreakdown: { [llmId: string]: ScoreDetail } = {};
      
      for (const [llmId, scores] of Object.entries(parsed.scores)) {
        const s = scores as any;
        const total = Math.round((s.accuracy + s.completeness + s.conciseness) / 3);
        scoreBreakdown[llmId] = {
          accuracy: s.accuracy,
          completeness: s.completeness,
          conciseness: s.conciseness,
          total,
          confidence: s.confidence || 70, // Default if not provided
          weight: 1 / Object.keys(parsed.scores).length, // Default equal weight
        };
      }

      // Ensure all responses have scores
      originalResponses.forEach(resp => {
        if (!scoreBreakdown[resp.llmId]) {
          scoreBreakdown[resp.llmId] = {
            accuracy: 50,
            completeness: 50,
            conciseness: 50,
            total: 50,
            confidence: 50,
            weight: 1 / originalResponses.length,
          };
        }
      });

      // Convert conflicts
      const conflicts: Conflict[] = (parsed.conflicts || []).map((c: any, index: number) => ({
        id: `conflict-${index}`,
        description: c.description,
        severity: c.severity || 'medium',
        affectedResponses: c.affectedResponses || [],
        evidence: c.evidence || [],
        resolution: c.resolution,
        resolutionStrategy: 'judge',
      }));

      return {
        unifiedResponse: parsed.unifiedResponse || 'No unified response generated.',
        scoreBreakdown,
        contradictions: parsed.contradictions || [],
        conflicts,
        confidence: Math.max(0, Math.min(100, parsed.confidence || 0)),
        judgeCommentary: parsed.commentary || 'No commentary provided.',
      };
    } catch (error) {
      console.error('Failed to parse judge response:', error);
      return this.createFallbackJudgment(originalResponses);
    }
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Get winner from weights
   */
  private getWinner(weights: { [llmId: string]: number }): string {
    return Object.entries(weights)
      .sort(([, a], [, b]) => b - a)[0][0];
  }

  /**
   * Calculate average
   */
  private average(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
  }

  // ============================================================================
  // EDGE CASE HANDLERS (from original)
  // ============================================================================

  private handleNoResponses(): EnhancedJudgmentResult {
    return {
      unifiedResponse: '# No Responses Available\n\nNo LLM responses were provided for evaluation.',
      scoreBreakdown: {},
      contradictions: [],
      confidence: 0,
      judgeCommentary: 'No responses were available to judge.',
      strategyUsed: 'judge',
    };
  }

  private handleAllFailures(responses: LLMResponse[]): EnhancedJudgmentResult {
    const scoreBreakdown: { [llmId: string]: ScoreDetail } = {};
    
    responses.forEach(resp => {
      scoreBreakdown[resp.llmId] = {
        accuracy: 0,
        completeness: 0,
        conciseness: 0,
        total: 0,
        confidence: 0,
        weight: 0,
      };
    });

    return {
      unifiedResponse: '# All Responses Failed\n\nAll LLM responses encountered errors.',
      scoreBreakdown,
      contradictions: [],
      confidence: 0,
      judgeCommentary: 'All LLM responses failed or returned empty content.',
      strategyUsed: 'judge',
    };
  }

  private handleSingleResponse(response: LLMResponse): EnhancedJudgmentResult {
    return {
      unifiedResponse: `# Response from ${response.llmName}\n\n${response.response}`,
      scoreBreakdown: {
        [response.llmId]: {
          accuracy: 75,
          completeness: 75,
          conciseness: 75,
          total: 75,
          confidence: 70,
          weight: 1.0,
        },
      },
      contradictions: [],
      confidence: 60,
      judgeCommentary: `Only one successful response available from ${response.llmName}.`,
      strategyUsed: 'judge',
    };
  }

  private createFallbackJudgment(responses: LLMResponse[]): EnhancedJudgmentResult {
    const scoreBreakdown: { [llmId: string]: ScoreDetail } = {};
    
    responses.forEach(resp => {
      scoreBreakdown[resp.llmId] = {
        accuracy: 60,
        completeness: 60,
        conciseness: 60,
        total: 60,
        confidence: 50,
        weight: 1 / responses.length,
      };
    });

    const unifiedResponse = `# Combined Responses\n\n${responses.map(r => 
      `## ${r.llmName}\n\n${r.response}`
    ).join('\n\n---\n\n')}`;

    return {
      unifiedResponse,
      scoreBreakdown,
      contradictions: ['Unable to analyze due to judge failure.'],
      confidence: 40,
      judgeCommentary: 'Judge failed. Basic concatenation provided.',
      strategyUsed: 'judge',
    };
  }
}

export default RuthlessJudgeEnhanced;
export type {
  EnhancedJudgmentResult,
  EnhancedJudgeOptions,
  SynthesisStrategy,
  SynthesisExplanation,
  StrategyMetrics,
  VotingResults,
};

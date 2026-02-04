/**
 * Advanced Ruthless Judge Examples
 * 
 * Demonstrates all new features:
 * 1. Weighted voting
 * 2. Different synthesis strategies
 * 3. Explanation generation
 * 4. A/B testing
 * 5. Custom configurations
 */

import RuthlessJudgeEnhanced from '../src/services/ruthless-judge-enhanced';
import type { LLMResponse } from '../src/services/openrouter';

// ============================================================================
// SAMPLE DATA
// ============================================================================

const sampleResponses: LLMResponse[] = [
  {
    llmId: 'gpt-4',
    llmName: 'GPT-4',
    response: `# Understanding Neural Networks

Neural networks are computational models inspired by biological neural networks in the human brain. They consist of interconnected nodes (neurons) organized in layers:

**Key Components:**
- **Input Layer**: Receives raw data
- **Hidden Layers**: Process and transform data through weighted connections
- **Output Layer**: Produces final predictions

**Training Process:**
Neural networks learn through backpropagation, adjusting weights to minimize error between predictions and actual outputs. This iterative process uses gradient descent optimization.

**Applications:**
- Image recognition and computer vision
- Natural language processing
- Speech recognition
- Autonomous vehicles

The universal approximation theorem proves that neural networks can approximate any continuous function, making them incredibly powerful for complex pattern recognition tasks.`,
    status: 'success',
  },
  {
    llmId: 'claude-3-opus',
    llmName: 'Claude 3 Opus',
    response: `# Neural Networks Explained

Neural networks are machine learning models that mimic the structure and function of biological brains.

**Architecture:**
A neural network consists of:
1. Layers of artificial neurons
2. Weighted connections between neurons
3. Activation functions that introduce non-linearity

**How They Learn:**
Training involves two main phases:
- **Forward propagation**: Data flows through the network to produce output
- **Backpropagation**: Errors are calculated and used to adjust weights

The learning rate controls how quickly the network adapts. Too high can cause instability; too low makes training slow.

**Strengths:**
- Handle complex, non-linear relationships
- Learn hierarchical features automatically
- Scale well with more data

**Limitations:**
- Require large datasets
- Can be computationally expensive
- Often act as "black boxes" with limited interpretability

Modern variants like CNNs (Convolutional Neural Networks) and RNNs (Recurrent Neural Networks) have specialized architectures for specific tasks.`,
    status: 'success',
  },
  {
    llmId: 'gemini-pro',
    llmName: 'Gemini Pro',
    response: `# What Are Neural Networks?

Neural networks are a subset of machine learning that uses interconnected nodes to process information.

**Basic Structure:**
- Multiple layers (input, hidden, output)
- Neurons in each layer
- Weights connecting neurons
- Activation functions (ReLU, sigmoid, tanh)

**Training:**
Networks learn by adjusting weights through an optimization algorithm called gradient descent. The process minimizes a loss function that measures prediction error.

**Real-World Uses:**
Neural networks power many modern AI applications including ChatGPT, image generators, and recommendation systems. They excel at pattern recognition and can learn complex representations from raw data.

**Challenges:**
Training deep networks requires careful consideration of:
- Overfitting (use dropout, regularization)
- Vanishing gradients (use batch normalization)
- Computational resources (GPUs often necessary)`,
    status: 'success',
  },
  {
    llmId: 'mistral-large',
    llmName: 'Mistral Large',
    response: `# Neural Networks Overview

Neural networks are computational graphs that transform inputs to outputs through learned parameters.

**Mathematical Foundation:**
At each layer: output = activation(W × input + bias)
Where W represents learned weights and activation adds non-linearity.

**Training Algorithm:**
1. Initialize weights randomly
2. Forward pass: compute predictions
3. Calculate loss (e.g., cross-entropy for classification)
4. Backward pass: compute gradients via chain rule
5. Update weights: w = w - learning_rate × gradient
6. Repeat until convergence

**Types:**
- **Feedforward**: Standard architecture, data flows one direction
- **Convolutional (CNN)**: Specialized for image/spatial data
- **Recurrent (RNN)**: Handles sequential data with memory
- **Transformer**: Attention-based, state-of-the-art for NLP

**Deep Learning:**
"Deep" refers to networks with many hidden layers. Deeper networks can learn more abstract representations but are harder to train.

**Best Practices:**
- Use proper initialization (Xavier, He)
- Apply batch normalization
- Implement learning rate schedules
- Use appropriate regularization`,
    status: 'success',
  },
];

// ============================================================================
// EXAMPLE 1: Basic Weighted Synthesis
// ============================================================================

export async function example1_weightedSynthesis() {
  console.log('\n=== Example 1: Weighted Synthesis ===\n');
  
  const judge = new RuthlessJudgeEnhanced(process.env.OPENROUTER_API_KEY!);
  
  const result = await judge.judge(sampleResponses, {
    synthesisStrategy: 'weighted',
    confidenceWeighting: 'sigmoid',
    enableExplanations: true,
  });
  
  console.log('Strategy Used:', result.strategyUsed);
  console.log('Confidence:', result.confidence);
  console.log('\nWeighted Scores:');
  Object.entries(result.weightedScores || {}).forEach(([llmId, score]) => {
    console.log(`  ${llmId}: ${score.toFixed(3)}`);
  });
  
  console.log('\nWeight Distribution:');
  const weights = result.votingResults?.weighted?.weights;
  if (weights) {
    Object.entries(weights)
      .sort(([, a], [, b]) => b - a)
      .forEach(([llmId, weight]) => {
        console.log(`  ${llmId}: ${(weight * 100).toFixed(1)}%`);
      });
  }
  
  console.log('\n--- Unified Response ---');
  console.log(result.unifiedResponse.substring(0, 500) + '...');
  
  if (result.explanation) {
    console.log('\n--- Explanation ---');
    console.log('Overview:', result.explanation.overview);
    console.log('\nQuality Metrics:');
    console.log('  Accuracy:', result.explanation.qualityMetrics.factualAccuracy);
    console.log('  Completeness:', result.explanation.qualityMetrics.coverageCompleteness);
    console.log('  Clarity:', result.explanation.qualityMetrics.clarityScore);
    console.log('  Consensus:', result.explanation.qualityMetrics.consensusLevel);
  }
  
  return result;
}

// ============================================================================
// EXAMPLE 2: Condorcet Method
// ============================================================================

export async function example2_condorcetMethod() {
  console.log('\n=== Example 2: Condorcet Method ===\n');
  
  const judge = new RuthlessJudgeEnhanced(process.env.OPENROUTER_API_KEY!);
  
  const result = await judge.judge(sampleResponses, {
    synthesisStrategy: 'condorcet',
    enableExplanations: true,
  });
  
  console.log('Strategy Used:', result.strategyUsed);
  
  const condorcet = result.votingResults?.condorcet;
  if (condorcet) {
    console.log('\nCondorcet Winner:', condorcet.winner || 'No winner (cycle)');
    console.log('Explanation:', condorcet.explanation);
    
    console.log('\nPairwise Comparison Matrix:');
    if (condorcet.pairwiseMatrix) {
      const llmIds = Object.keys(condorcet.pairwiseMatrix);
      console.log('        ', llmIds.join('  '));
      llmIds.forEach(id1 => {
        const row = llmIds.map(id2 => condorcet.pairwiseMatrix[id1][id2]).join('  ');
        console.log(`${id1}: ${row}`);
      });
    }
  }
  
  console.log('\n--- Synthesized Response ---');
  console.log(result.unifiedResponse.substring(0, 500) + '...');
  
  return result;
}

// ============================================================================
// EXAMPLE 3: Borda Count
// ============================================================================

export async function example3_bordaCount() {
  console.log('\n=== Example 3: Borda Count ===\n');
  
  const judge = new RuthlessJudgeEnhanced(process.env.OPENROUTER_API_KEY!);
  
  const result = await judge.judge(sampleResponses, {
    synthesisStrategy: 'borda',
    enableExplanations: true,
  });
  
  console.log('Strategy Used:', result.strategyUsed);
  
  const borda = result.votingResults?.borda;
  if (borda) {
    console.log('\nBorda Count Winner:', borda.winner);
    console.log('Explanation:', borda.explanation);
    
    console.log('\nBorda Scores (points):');
    Object.entries(borda.scores)
      .sort(([, a], [, b]) => b - a)
      .forEach(([llmId, score]) => {
        console.log(`  ${llmId}: ${score} points`);
      });
  }
  
  console.log('\n--- Synthesized Response ---');
  console.log(result.unifiedResponse.substring(0, 500) + '...');
  
  return result;
}

// ============================================================================
// EXAMPLE 4: Approval Voting
// ============================================================================

export async function example4_approvalVoting() {
  console.log('\n=== Example 4: Approval Voting ===\n');
  
  const judge = new RuthlessJudgeEnhanced(process.env.OPENROUTER_API_KEY!);
  
  const result = await judge.judge(sampleResponses, {
    synthesisStrategy: 'approval',
    minConsensusThreshold: 75, // Only approve responses with 75%+ score
    enableExplanations: true,
  });
  
  console.log('Strategy Used:', result.strategyUsed);
  console.log('Quality Threshold: 75%');
  
  const approval = result.votingResults?.approval;
  if (approval) {
    console.log('\nApproval Results:');
    console.log('  Threshold:', approval.threshold);
    console.log('  Approved Count:', approval.approved.length);
    console.log('  Approved LLMs:', approval.approved.join(', '));
    console.log('  Explanation:', approval.explanation);
  }
  
  console.log('\n--- Synthesized Response ---');
  console.log(result.unifiedResponse.substring(0, 500) + '...');
  
  return result;
}

// ============================================================================
// EXAMPLE 5: Ensemble Method (Recommended)
// ============================================================================

export async function example5_ensembleMethod() {
  console.log('\n=== Example 5: Ensemble Method ===\n');
  
  const judge = new RuthlessJudgeEnhanced(process.env.OPENROUTER_API_KEY!);
  
  const result = await judge.judge(sampleResponses, {
    synthesisStrategy: 'ensemble',
    enableExplanations: true,
  });
  
  console.log('Strategy Used:', result.strategyUsed);
  console.log('Confidence:', result.confidence);
  
  console.log('\n--- All Voting Results ---');
  
  // Weighted
  if (result.votingResults?.weighted) {
    console.log('\nWeighted Voting:');
    console.log('  Winner:', result.votingResults.weighted.winner);
    Object.entries(result.votingResults.weighted.weightedScores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .forEach(([llmId, score]) => {
        console.log(`    ${llmId}: ${score.toFixed(2)}`);
      });
  }
  
  // Condorcet
  if (result.votingResults?.condorcet) {
    console.log('\nCondorcet:');
    console.log('  Winner:', result.votingResults.condorcet.winner || 'No winner');
  }
  
  // Borda
  if (result.votingResults?.borda) {
    console.log('\nBorda Count:');
    console.log('  Winner:', result.votingResults.borda.winner);
    const topBorda = Object.entries(result.votingResults.borda.scores)
      .sort(([, a], [, b]) => b - a)[0];
    console.log(`    Score: ${topBorda[1]} points`);
  }
  
  console.log('\n--- Synthesized Response ---');
  console.log(result.unifiedResponse.substring(0, 500) + '...');
  
  if (result.explanation) {
    console.log('\n--- Explanation Summary ---');
    console.log(`Key Decisions: ${result.explanation.keyDecisions.length}`);
    console.log(`Conflicts Resolved: ${result.explanation.conflictResolutions.length}`);
    console.log('Quality Metrics:', result.explanation.qualityMetrics);
  }
  
  return result;
}

// ============================================================================
// EXAMPLE 6: A/B Testing
// ============================================================================

export async function example6_abTesting() {
  console.log('\n=== Example 6: A/B Testing ===\n');
  
  const judge = new RuthlessJudgeEnhanced(process.env.OPENROUTER_API_KEY!);
  
  console.log('Testing strategies: weighted, condorcet, borda, ensemble');
  console.log('This will take ~30-60 seconds...\n');
  
  const result = await judge.judge(sampleResponses, {
    enableABTesting: true,
    comparisonStrategies: ['weighted', 'condorcet', 'borda', 'ensemble'],
    enableExplanations: true,
  });
  
  console.log('Best Strategy Selected:', result.strategyUsed);
  
  if (result.strategyMetrics) {
    console.log('\nBest Strategy Metrics:');
    console.log('  Confidence:', result.strategyMetrics.confidence);
    console.log('  Consensus Score:', result.strategyMetrics.consensusScore);
    console.log('  Quality Score:', result.strategyMetrics.qualityScore);
    console.log('  Conflicts Resolved:', result.strategyMetrics.conflictsResolved);
    console.log('  Processing Time:', result.strategyMetrics.processingTime, 'ms');
  }
  
  console.log('\n--- A/B Test Report ---');
  // Extract from commentary
  const reportMatch = result.judgeCommentary.match(/## A\/B Test Results([\s\S]*?)(?=\n##|$)/);
  if (reportMatch) {
    console.log(reportMatch[0]);
  }
  
  return result;
}

// ============================================================================
// EXAMPLE 7: Custom Weighting Methods
// ============================================================================

export async function example7_customWeighting() {
  console.log('\n=== Example 7: Custom Weighting Methods ===\n');
  
  const judge = new RuthlessJudgeEnhanced(process.env.OPENROUTER_API_KEY!);
  
  const methods: Array<'linear' | 'exponential' | 'sigmoid'> = ['linear', 'exponential', 'sigmoid'];
  
  for (const method of methods) {
    console.log(`\n--- ${method.toUpperCase()} Weighting ---`);
    
    const result = await judge.judge(sampleResponses, {
      synthesisStrategy: 'weighted',
      confidenceWeighting: method,
      enableExplanations: false, // Faster
    });
    
    const weights = result.votingResults?.weighted?.weights;
    if (weights) {
      const sorted = Object.entries(weights)
        .sort(([, a], [, b]) => b - a);
      
      console.log('Weight Distribution:');
      sorted.forEach(([llmId, weight]) => {
        const bar = '█'.repeat(Math.round(weight * 50));
        console.log(`  ${llmId.padEnd(20)} ${(weight * 100).toFixed(1)}% ${bar}`);
      });
      
      // Calculate weight concentration (how much top response dominates)
      const topWeight = sorted[0][1];
      const concentration = topWeight / sorted.reduce((sum, [, w]) => sum + w, 0);
      console.log(`Concentration: ${(concentration * 100).toFixed(1)}% (higher = more weight on best)`);
    }
    
    // Small delay between methods
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

// ============================================================================
// EXAMPLE 8: Detailed Explanation Analysis
// ============================================================================

export async function example8_detailedExplanation() {
  console.log('\n=== Example 8: Detailed Explanation Analysis ===\n');
  
  const judge = new RuthlessJudgeEnhanced(process.env.OPENROUTER_API_KEY!);
  
  const result = await judge.judge(sampleResponses, {
    synthesisStrategy: 'ensemble',
    enableExplanations: true,
  });
  
  const exp = result.explanation!;
  
  console.log('=== SYNTHESIS OVERVIEW ===');
  console.log(exp.overview);
  console.log();
  
  console.log('=== KEY DECISIONS ===');
  exp.keyDecisions.forEach((decision, i) => {
    console.log(`\n${i + 1}. ${decision.decision}`);
    console.log(`   Rationale: ${decision.rationale}`);
    console.log(`   Confidence: ${decision.confidence}%`);
    if (decision.evidence.length > 0) {
      console.log('   Evidence:');
      decision.evidence.slice(0, 3).forEach(ev => {
        console.log(`     - ${ev}`);
      });
    }
  });
  
  if (exp.conflictResolutions.length > 0) {
    console.log('\n=== CONFLICT RESOLUTIONS ===');
    exp.conflictResolutions.forEach((resolution, i) => {
      console.log(`\n${i + 1}. Conflict: ${resolution.conflict}`);
      console.log(`   Strategy: ${resolution.strategy}`);
      console.log(`   Outcome: ${resolution.outcome}`);
      console.log(`   Reasoning: ${resolution.reasoning}`);
    });
  }
  
  console.log('\n=== WEIGHTING RATIONALE ===');
  console.log(exp.weightingRationale);
  
  console.log('\n=== QUALITY METRICS ===');
  const metrics = exp.qualityMetrics;
  console.log(`Factual Accuracy:      ${metrics.factualAccuracy.toFixed(1)}%`);
  console.log(`Coverage Completeness: ${metrics.coverageCompleteness.toFixed(1)}%`);
  console.log(`Clarity Score:         ${metrics.clarityScore.toFixed(1)}%`);
  console.log(`Consensus Level:       ${metrics.consensusLevel.toFixed(1)}%`);
  
  // Overall quality grade
  const avgQuality = (
    metrics.factualAccuracy +
    metrics.coverageCompleteness +
    metrics.clarityScore +
    metrics.consensusLevel
  ) / 4;
  
  const grade = avgQuality >= 90 ? 'A' : avgQuality >= 80 ? 'B' : avgQuality >= 70 ? 'C' : 'D';
  console.log(`\nOverall Quality Grade: ${grade} (${avgQuality.toFixed(1)}%)`);
  
  return result;
}

// ============================================================================
// EXAMPLE 9: Performance Comparison
// ============================================================================

export async function example9_performanceComparison() {
  console.log('\n=== Example 9: Performance Comparison ===\n');
  
  const judge = new RuthlessJudgeEnhanced(process.env.OPENROUTER_API_KEY!);
  
  const strategies: Array<'weighted' | 'condorcet' | 'borda' | 'approval' | 'ensemble'> = [
    'weighted',
    'condorcet',
    'borda',
    'approval',
    'ensemble',
  ];
  
  const results: Array<{ strategy: string; time: number; confidence: number }> = [];
  
  for (const strategy of strategies) {
    console.log(`Testing ${strategy}...`);
    const startTime = Date.now();
    
    const result = await judge.judge(sampleResponses, {
      synthesisStrategy: strategy,
      enableExplanations: false, // For speed
    });
    
    const time = Date.now() - startTime;
    results.push({
      strategy,
      time,
      confidence: result.confidence,
    });
    
    console.log(`  Time: ${time}ms, Confidence: ${result.confidence}%`);
    
    // Delay between calls
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n--- Performance Summary ---');
  console.log('Strategy       | Time (ms) | Confidence | Score');
  console.log('---------------|-----------|------------|-------');
  
  results.forEach(r => {
    const score = (100 - r.time / 50) * 0.3 + r.confidence * 0.7; // Combined score
    console.log(
      `${r.strategy.padEnd(14)} | ${String(r.time).padStart(9)} | ${String(r.confidence).padStart(10)} | ${score.toFixed(1)}`
    );
  });
  
  const fastest = results.reduce((min, r) => r.time < min.time ? r : min);
  const mostConfident = results.reduce((max, r) => r.confidence > max.confidence ? r : max);
  
  console.log(`\nFastest: ${fastest.strategy} (${fastest.time}ms)`);
  console.log(`Most Confident: ${mostConfident.strategy} (${mostConfident.confidence}%)`);
}

// ============================================================================
// MAIN RUNNER
// ============================================================================

export async function runAllExamples() {
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║  Advanced Ruthless Judge - Comprehensive Examples           ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
  
  try {
    // Run each example
    await example1_weightedSynthesis();
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await example2_condorcetMethod();
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await example3_bordaCount();
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await example4_approvalVoting();
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await example5_ensembleMethod();
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Uncomment to run slower examples:
    // await example6_abTesting();
    // await example7_customWeighting();
    // await example8_detailedExplanation();
    // await example9_performanceComparison();
    
    console.log('\n╔══════════════════════════════════════════════════════════════╗');
    console.log('║  All Examples Completed Successfully!                       ║');
    console.log('╚══════════════════════════════════════════════════════════════╝\n');
  } catch (error) {
    console.error('\n❌ Error running examples:', error);
    throw error;
  }
}

// Run if executed directly
if (require.main === module) {
  runAllExamples().catch(console.error);
}

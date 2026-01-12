import { SynthesisTier, SynthesisConfig } from "./types";

// ⚖️ THE RUTHLESS JUDGE - Synthesis Engine
// This engine analyzes expert outputs with uncompromising precision,
// cutting through noise to deliver clear, actionable verdicts.

export const SYNTHESIS_TIERS: Record<SynthesisTier, {
  name: string;
  icon: string;
  description: string;
  estimatedTime: string;
  estimatedCost: string;
  temperature: number;
  maxTokens: number;
}> = {
  quick: {
    name: "Swift Verdict",
    icon: "⚡",
    description: "Fast consensus extraction with ruthless efficiency",
    estimatedTime: "~15s",
    estimatedCost: "$0.0003",
    temperature: 0.3,
    maxTokens: 2000,
  },
  balanced: {
    name: "Balanced Judgment",
    icon: "⚖️",
    description: "Thorough analysis with strategic deduplication",
    estimatedTime: "~25s",
    estimatedCost: "$0.0005",
    temperature: 0.5,
    maxTokens: 3000,
  },
  deep: {
    name: "Exhaustive Verdict",
    icon: "🔍",
    description: "Multi-pass refinement with uncompromising scrutiny",
    estimatedTime: "~45s",
    estimatedCost: "$0.001",
    temperature: 0.7,
    maxTokens: 4000,
  },
};

export const DEFAULT_SYNTHESIS_CONFIG: SynthesisConfig = {
  tier: "balanced",
  model: "google/gemini-2.0-flash-001",
  fallbackModel: "deepseek/deepseek-chat",
  temperature: 0.4,
  maxTokens: 4000,
  customInstructions: "",
};

interface ExpertOutput {
  name: string;
  model: string;
  content: string;
  specialty?: string;
}

function buildQuickPrompt(
  expertOutputs: ExpertOutput[],
  task: string,
  customInstructions: string
): string {
  let prompt = `You are THE RUTHLESS JUDGE - a synthesis engine that delivers swift, uncompromising verdicts on ${expertOutputs.length} expert perspectives.\n\n`;
  prompt += `TASK: "${task}"\n\n`;
  prompt += `EXPERT TESTIMONIES:\n${"─".repeat(40)}\n`;

  expertOutputs.forEach((expert, i) => {
    prompt += `Expert ${i + 1}: ${expert.name} (Model: ${expert.model})\n`;
    prompt += `${expert.content}\n\n`;
  });

  if (customInstructions) {
    prompt += `SPECIAL FOCUS: ${customInstructions}\n\n`;
  }

  prompt += `DELIVER YOUR VERDICT DIRECTLY (no intermediate reasoning):
1. What do all/most experts agree on? → CONSENSUS
2. What unique insights did individual experts provide? → UNIQUE
3. Where do experts contradict each other? → CONFLICTS

FORMAT YOUR VERDICT:

## ⚖️ CONSENSUS
• [Point agreed by multiple experts]

## 💎 UNIQUE INSIGHTS
• [Expert Name]: [unique insight]

## ⚔️ CONTRADICTIONS
• [Expert A] vs [Expert B]: [brief conflict description]

## 🎯 FINAL VERDICT
[Single paragraph: synthesized actionable judgment]`;

  return prompt;
}

function buildBalancedPrompt(
  expertOutputs: ExpertOutput[],
  task: string,
  customInstructions: string
): string {
  let prompt = `You are THE RUTHLESS JUDGE - a synthesis engine with Chain-of-Thought reasoning that delivers balanced, uncompromising verdicts.\n\n`;
  prompt += `TASK: "${task}"\n\n`;
  prompt += `EXPERT TESTIMONIES:\n${"─".repeat(40)}\n`;

  expertOutputs.forEach((expert, i) => {
    prompt += `Expert ${i + 1}: ${expert.name} (${expert.model})\n`;
    prompt += `${expert.content}\n\n`;
  });

  if (customInstructions) {
    prompt += `SPECIAL FOCUS: ${customInstructions}\n\n`;
  }

  prompt += `USE CHAIN-OF-THOUGHT REASONING (show your judicial process):

**Step 1: Evidence Extraction**
First, extract the core claims from each expert:
${expertOutputs
    .map((e, i) => `- Expert ${i + 1} (${e.name}) claims: [extract 3-5 key points]`)
    .join("\n")}

**Step 2: Clustering Evidence**
Now, group similar claims across experts:
- Cluster A (topic): Mentioned by [which experts] saying [what]
- Cluster B (topic): Mentioned by [which experts] saying [what]
- Unique claims: [which expert said what unique thing]

**Step 3: Conflict Detection**
Identify where experts contradict each other:
- Conflict 1: [Expert X says A, Expert Y says opposite/different B]
- Analysis: [Why is this a genuine conflict vs just different framing?]

**Step 4: Resolution & Judgment**
For each conflict:
- Evaluate evidence: [Which side has stronger support?]
- Context matters: [Can both be true in different scenarios?]
- Synthesized verdict: [What's the integrated position?]

**Step 5: Final Verdict**
Based on the reasoning above:

## ⚖️ AREAS OF AGREEMENT
• [Consensus point] - supported by {Expert names}
  Evidence: [why they agree]

## UNIQUE VALUABLE INSIGHTS
• From {Expert}: [insight]
  Why it matters: [value of this unique perspective]

## CONFLICTS RESOLVED
• Issue: [what they disagreed on]
• Positions:
  - {Expert 1}: [position and reasoning]
  - {Expert 2}: [position and reasoning]
• Resolution: [synthesized position that preserves truth from both]
  Confidence: [High/Medium/Low]

## INTEGRATED RECOMMENDATION
[2-3 paragraphs synthesizing everything into clear, actionable advice with specific steps]`;

  return prompt;
}

function buildDeepPrompt(
  expertOutputs: ExpertOutput[],
  task: string,
  customInstructions: string
): string {
  let prompt = `You are THE RUTHLESS JUDGE - using Tree-of-Thought exploration to deliver exhaustive, uncompromising verdicts.\n\n`;
  prompt += `TASK: "${task}"\n\n`;
  prompt += `EXPERT TESTIMONIES:\n${"─".repeat(40)}\n`;

  expertOutputs.forEach((expert, i) => {
    prompt += `Expert ${i + 1}: ${expert.name} (${expert.model})\n`;
    prompt += `${expert.content}\n\n`;
  });

  if (customInstructions) {
    prompt += `SPECIAL FOCUS: ${customInstructions}\n\n`;
  }

  prompt += `USE TREE-OF-THOUGHT REASONING (explore multiple interpretive paths):

**Branch 1: Consensus-First Interpretation**
Hypothesis: Experts fundamentally agree, with minor stylistic differences.
Analysis:
- What are the core overlapping points? [list]
- How strong is the agreement? [evaluate evidence]
- What's the unified narrative? [synthesis]
Score this interpretation: [0.0-1.0 likelihood this framing is accurate]

**Branch 2: Conflict-First Interpretation**
Hypothesis: Experts have fundamental disagreements that matter.
Analysis:
- What are the major points of conflict? [list]
- Are these resolvable or genuine trade-offs? [evaluate]
- If unresolvable, what does that mean? [implications]
Score this interpretation: [0.0-1.0 likelihood this framing is accurate]

**Branch 3: Complementary Interpretation**
Hypothesis: Experts address different dimensions (not conflicting, just orthogonal).
Analysis:
- What dimension does each expert focus on? [time/risk/cost/technical/strategic]
- Can all views coexist as complementary? [evaluate]
- How do they fit together? [integration]
Score this interpretation: [0.0-1.0 likelihood this framing is accurate]

**Path Selection**
Based on evidence and scores, the most accurate framing is: **Branch X**
Reasoning: [explain why this interpretation best fits the data]

**SYNTHESIS USING SELECTED PATH:**

## EXECUTIVE SUMMARY
[2-3 sentences capturing the essence based on best-path framing]
Confidence: [High/Medium/Low]

## KEY FINDINGS
[Organized according to the selected interpretive path]
- Finding 1: [supported by which experts and why]
- Finding 2: [supported by which experts and why]
- Finding 3: [supported by which experts and why]

## RESOLVED DISAGREEMENTS
[Using the logic from the selected path]
- Disagreement 1:
  - Positions: [what each expert said]
  - Resolution: [how the selected path resolves this]
  - Supporting logic: [evidence-based reasoning]

## UNIQUE INSIGHTS WORTH NOTING
[Individual expert contributions that add unique value]
- From {Expert}: [insight]
  Value: [why this is important to preserve]

## INTEGRATED RECOMMENDATION

**Immediate Actions (0-1 month):**
• [Action 1 based on consensus]
• [Action 2 based on consensus]

**Medium-Term Strategy (1-6 months):**
• [Action based on complementary views]
• [Action based on resolved conflicts]

**Long-Term Considerations (6+ months):**
• [Strategic direction]

**Risks to Monitor:**
• [Risk 1 from unresolved tensions]
• [Risk 2 from expert caveats]

## CONFIDENCE ASSESSMENT

**High Confidence (>80%):**
- [Aspects where all experts agreed with strong evidence]

**Medium Confidence (50-80%):**
- [Aspects with some disagreement but reasonable synthesis]

**Low Confidence (<50%):**
- [Aspects requiring more information or context]
- Recommendation: [what additional info would help]`;

  return prompt;
}

export function getPromptBuilder(
  tier: SynthesisTier
): (expertOutputs: ExpertOutput[], task: string, customInstructions: string) => string {
  switch (tier) {
    case "quick":
      return buildQuickPrompt;
    case "balanced":
      return buildBalancedPrompt;
    case "deep":
      return buildDeepPrompt;
    default:
      return buildBalancedPrompt;
  }
}

export function extractDebateContext(synthesisContent: string): string {
  const lines = synthesisContent.split("\n");
  let context = "";
  let capture = false;

  for (const line of lines) {
    if (line.includes("## CONSENSUS") || line.includes("## AREAS OF AGREEMENT")) {
      context += "\n**CONSENSUS:**\n";
      capture = true;
    } else if (line.includes("## CONFLICT") || line.includes("## CONTRADICTION")) {
      context += "\n**CONFLICTS:**\n";
      capture = true;
    } else if (
      line.startsWith("## ") &&
      !line.includes("CONSENSUS") &&
      !line.includes("CONFLICT") &&
      !line.includes('CONTRADICTION')
    ) {
      capture = false;
    } else if (capture && line.trim()) {
      context += line + "\n";
    }
  }

  return context || synthesisContent.substring(0, 1000);
}

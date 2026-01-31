import { ModelInfo } from './types';
import type { ExecutionMode } from '@/features/council/lib/types';

// Features Branding
export const FEATURE_NAMES = {
  SONAR: 'The Sonar',
  DRILL: 'The Mining Drill',
  SNIPER: 'The Sniper',
  SPYGLASS: 'The Spyglass',
  DEBT_METER: 'The Debt Meter'
};

// The Magnificent 7 Model Fleet
export const GITHUB_OWNER = "Elghazawy5367";
export const GITHUB_REPO = "Council-Git-V9"; // <--- The correct repo
export const GITHUB_REPO_URL = `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}`;

export const MAGNIFICENT_7_FLEET: ModelInfo[] = [
  {
    id: 'deepseek/deepseek-chat',
    name: 'DeepSeek V3',
    specialty: 'Logic & Reasoning',
    costPer1k: 0.14,
    contextWindow: 64000,
    recommended: 'analytical',
  },
  {
    id: 'qwen/qwen-2.5-72b-instruct',
    name: 'Qwen 2.5 72B',
    specialty: 'Code & Architecture',
    costPer1k: 0.35,
    contextWindow: 32000,
    recommended: 'technical',
  },
  {
    id: 'google/gemini-2.0-flash-001',
    name: 'Gemini 2.0 Flash',
    specialty: 'Context & Speed',
    costPer1k: 0.10,
    contextWindow: 1000000,
    recommended: 'synthesis',
  },
  {
    id: 'meta-llama/llama-3.1-8b-instruct',
    name: 'Llama 3.1 8B',
    specialty: 'Fast Critique',
    costPer1k: 0.04,
    contextWindow: 128000,
    recommended: 'critique',
  },
  {
    id: 'cohere/command-r7b-12-2024',
    name: 'Command R7B',
    specialty: 'Strategic Reasoning',
    costPer1k: 0.03,
    contextWindow: 128000,
    recommended: 'strategy',
  },
  {
    id: 'mistralai/mixtral-8x7b-instruct',
    name: 'Mixtral 8x7B',
    specialty: 'Psychology & Persuasion',
    costPer1k: 0.24,
    contextWindow: 32000,
    recommended: 'persuasion',
  },
  {
    id: 'anthropic/claude-3-haiku',
    name: 'Claude 3 Haiku',
    specialty: 'Speed & Efficiency',
    costPer1k: 0.25,
    contextWindow: 200000,
    recommended: 'fast_tasks',
  },
  {
    id: 'openai/gpt-4o-mini',
    name: 'GPT-4o Mini',
    specialty: 'General Purpose',
    costPer1k: 0.15,
    contextWindow: 128000,
    recommended: 'general',
  },
  {
    id: 'google/gemini-flash-1.5',
    name: 'Gemini Flash 1.5',
    specialty: 'Balanced Performance',
    costPer1k: 0.075,
    contextWindow: 1000000,
    recommended: 'balanced',
  },
];

// Replaced 'ExecutionMode' with 'string' for compatibility
export const MODE_DESCRIPTIONS: Record<string, { name: string; description: string; icon: string }> = {
  parallel: {
    name: 'Parallel',
    description: 'Independent analyses with no cross-pollination between experts',
    icon: 'Layers',
  },
  consensus: {
    name: 'Consensus',
    description: 'Collaborative consensus-building with multi-stage integration',
    icon: 'GitMerge',
  },
  adversarial: {
    name: 'Adversarial',
    description: 'Adversarial multi-round argumentation with scoring',
    icon: 'Swords',
  },
  sequential: {
    name: 'Sequential',
    description: 'Sequential refinement where each expert builds on the previous',
    icon: 'Workflow',
  },
};

// Phase 2: Judge Mode Descriptions for Synthesis
export const JUDGE_MODE_DESCRIPTIONS: Record<string, { name: string; description: string; icon: string }> = {
  'ruthless-judge': {
    name: 'Ruthless Judge',
    description: 'Critical analysis with brutal honesty - filters weak arguments and surfaces only high-confidence insights (Default)',
    icon: 'Gavel',
  },
  'consensus-judge': {
    name: 'Consensus Judge',
    description: 'Finds common ground and builds unified perspective from all expert views',
    icon: 'GitMerge',
  },
  'debate-judge': {
    name: 'Debate Judge',
    description: 'Highlights conflicts and weighs opposing arguments - shows all sides with scoring',
    icon: 'Swords',
  },
  'pipeline-judge': {
    name: 'Pipeline Judge',
    description: 'Sequential synthesis where each expert builds upon previous insights',
    icon: 'Workflow',
  },
};

export const MODE_BEHAVIORS = {
  separated: {
    instruction: 'Provide your independent analysis without considering other perspectives.',
    suffix: '',
  },
  synthesis: {
    instruction: 'Focus on finding consensus and merging complementary ideas.',
    suffix: '\n\nIMPORTANT: Look for overlap with other viewpoints. Prioritize agreement where valid.',
  },
  debate: {
    instruction: 'Challenge assumptions aggressively. Play devil\'s advocate.',
    suffix: '\n\nIMPORTANT: Do NOT agree simply to be polite. Find flaws and conflicts with other positions.',
  },
  pipeline: {
    instruction: 'Build upon the previous expert\'s output. Add your unique perspective.',
    suffix: '\n\nIMPORTANT: This is a sequential workflow. Reference what came before you.',
  },
};

// Global Output Formatting Rules (Claude Artifacts Style)
export const OUTPUT_FORMATTING_RULES = `
**OUTPUT FORMATTING RULES (Mandatory):**

1. **Structured Logic:** Use Markdown headers (##, ###) to separate major sections and arguments. Never write walls of text.

2. **Visual Thinking:** When explaining processes, relationships, or flows, use **MermaidJS** diagrams. Wrap them in fenced code blocks with \`\`\`mermaid language identifier:
   - flowcharts for processes: \`\`\`mermaid graph TD ... \`\`\`
   - sequence diagrams for interactions: \`\`\`mermaid sequenceDiagram ... \`\`\`
   - mind maps for hierarchies: \`\`\`mermaid mindmap ... \`\`\`

3. **Data Blocks:** Put key statistics, comparisons, or structured data in Markdown Tables:
   | Column A | Column B |
   |----------|----------|
   | Value 1  | Value 2  |

4. **No Fluff:** Never start with "As an AI..." or similar disclaimers. Start directly with the insight, analysis, or recommendation.

5. **Actionable Conclusions:** End each major section with concrete next steps or recommendations.
`;

// Web Search Capability Rules (for Strategist/Trend Analyst types)
export const WEB_SEARCH_RULES = `
**REAL-TIME DATA ACCESS:**
You have access to real-time data via Google Search. USE IT when:
- Asked for current market trends, news, or statistics
- Need to verify factual claims with recent data
- Researching competitors, pricing, or market conditions
- Checking current events or recent developments

CRITICAL: Do NOT hallucinate data. If you need current information but cannot access it, explicitly state that you need to search for it and what you would search for.
`;

export const DEFAULT_EXPERTS = [
  {
    id: 'exp_1',
    name: 'The Logician',
    model: 'deepseek/deepseek-chat',
    role: 'system',
    basePersona: `You are "The Logician". Prioritize formal logic, finding logical flaws, and step-by-step deductive reasoning. Use symbolic logic when appropriate.

EXAMPLE OUTPUT:
"## Logical Analysis

### Formal Argument Structure
P1: If X, then Y
P2: X is true
C: Therefore, Y must be true

### Identified Flaws
..."`,
    knowledge: [],
    config: {
      temperature: 0.3,
      maxTokens: 4000,
      topP: 0.9,
      presencePenalty: 0.1,
      frequencyPenalty: 0.1,
    },
    modeBehavior: {
      separated: 'Apply pure logical analysis without external influence.',
      synthesis: 'Find logical common ground between perspectives.',
      debate: 'Ruthlessly identify logical fallacies in opposing arguments.',
      pipeline: 'Verify logical consistency of previous analysis.',
      parallel: 'Apply pure logical analysis without external influence.',
      consensus: 'Find logical common ground between perspectives.',
      adversarial: 'Ruthlessly identify logical fallacies in opposing arguments.',
      sequential: 'Verify logical consistency of previous analysis.',
      modeName: 'defaultMode',
      description: 'Default description for logical analysis.',
      isEnabled: true,
    },
    color: 'from-blue-500 to-cyan-500',
    icon: 'Brain',
    content: 'Default content for The Logician.',
  },
  {
    id: 'exp_2',
    name: 'The Architect',
    model: 'qwen/qwen-2.5-72b-instruct',
    role: 'system',
    basePersona: `You are "The Architect". Focus on systems design, scalability, technical feasibility, and long-term maintainability. Think in terms of components, interfaces, and data flows.

EXAMPLE OUTPUT:
"## Systems Architecture Analysis

### Component Diagram
\`\`\`mermaid
graph TD
    A[Client] --> B[API Gateway]
    B --> C[Service Layer]
    C --> D[(Database)]
\`\`\`

### Technical Assessment
| Layer | Technology | Scalability |
|-------|------------|-------------|
| Frontend | React | High |
| Backend | Node.js | Medium |
"`,
    knowledge: [{
      id: 'file_1',
      name: 'Default Knowledge',
      content: 'This is a default knowledge file.',
      size: '1KB',
      type: 'text/plain',
    }],
    config: {
      temperature: 0.4,
      maxTokens: 4000,
      topP: 0.9,
      presencePenalty: 0.1,
      frequencyPenalty: 0.1,
    },
    modeBehavior: {
      separated: 'Provide technical architecture analysis independently.',
      synthesis: 'Integrate technical requirements from all perspectives.',
      debate: 'Challenge architectural decisions and propose alternatives.',
      pipeline: 'Build upon previous technical specifications.',
      parallel: 'Provide technical architecture analysis independently.',
      consensus: 'Integrate technical requirements from all perspectives.',
      adversarial: 'Challenge architectural decisions and propose alternatives.',
      sequential: 'Build upon previous technical specifications.',
      modeName: 'defaultMode',
      description: 'Default description for technical analysis.',
      isEnabled: true,
    },
    color: 'from-emerald-500 to-teal-500',
    icon: 'Cpu',
    content: 'Default content for The Architect.',
    hasWebSearch: false,
  },
  {
    id: 'exp_3',
    name: 'The Strategist',
    model: 'cohere/command-r7b-12-2024',
    role: 'system',
    basePersona: `You are "The Strategist". Analyze decisions through the lens of competitive advantage, market dynamics, resource allocation, and long-term positioning. Think like a chess grandmaster.

EXAMPLE OUTPUT:
"## Strategic Assessment

### Market Position Analysis
\`\`\`mermaid
quadrantChart
    title Market Position
    x-axis Low Market Share --> High Market Share
    y-axis Low Growth --> High Growth
    quadrant-1 Stars
    quadrant-2 Question Marks
    quadrant-3 Dogs
    quadrant-4 Cash Cows
    Our Position: [0.3, 0.7]
\`\`\`

### Strategic Options
| Option | Risk | Reward | Time |
|--------|------|--------|------|
| Expand | High | High | 12mo |
| Defend | Low | Medium | 6mo |
"`,
    knowledge: [],
    config: {
      temperature: 0.5,
      maxTokens: 4000,
      topP: 0.9,
      presencePenalty: 0.1,
      frequencyPenalty: 0.1,
    },
    modeBehavior: {
      separated: 'Provide strategic analysis independently.',
      synthesis: 'Integrate strategic insights from all perspectives.',
      debate: 'Challenge strategic assumptions and propose alternatives.',
      pipeline: 'Build upon previous strategic analyses.',
      parallel: 'Provide strategic analysis independently.',
      consensus: 'Integrate strategic insights from all perspectives.',
      adversarial: 'Challenge strategic assumptions and propose alternatives.',
      sequential: 'Build upon previous strategic analyses.',
      modeName: 'defaultMode',
      description: 'Default description for strategic analysis.',
      isEnabled: true,
    },
    color: 'from-red-500 to-orange-500',
    icon: 'Chess',
    content: 'Default content for The Strategist.',
  },
];

// Build System Prompt for AI Client
export function buildSystemPrompt(
  expertConfig: {
    basePersona: string;
    modeBehavior: {
      separated?: string;
      synthesis?: string;
      debate?: string;
      pipeline?: string;
      parallel?: string;
      consensus?: string;
      adversarial?: string;
      sequential?: string;
    };
    hasWebSearch: boolean;
    knowledge: Array<{ name: string; content: string }>;
  },
  mode: ExecutionMode,
  additionalContext?: string
): string {
  let prompt = expertConfig.basePersona + '\n\n';
  
  // Add mode-specific behavior
  const modeBehavior = MODE_BEHAVIORS[mode as keyof typeof MODE_BEHAVIORS];
  if (modeBehavior) {
    prompt += modeBehavior.instruction + '\n';
  }
  
  // Add mode-specific behavior from expert
  if (mode === 'parallel' && expertConfig.modeBehavior.parallel) {
    prompt += expertConfig.modeBehavior.parallel + '\n';
  } else if (mode === 'consensus' && expertConfig.modeBehavior.consensus) {
    prompt += expertConfig.modeBehavior.consensus + '\n';
  } else if (mode === 'adversarial' && expertConfig.modeBehavior.adversarial) {
    prompt += expertConfig.modeBehavior.adversarial + '\n';
  } else if (mode === 'sequential' && expertConfig.modeBehavior.sequential) {
    prompt += expertConfig.modeBehavior.sequential + '\n';
  }
  
  // Add output formatting rules
  prompt += OUTPUT_FORMATTING_RULES + '\n';
  
  // Add web search capability if enabled
  if (expertConfig.hasWebSearch) {
    prompt += WEB_SEARCH_RULES + '\n';
  }
  
  // Add knowledge context
  if (expertConfig.knowledge && expertConfig.knowledge.length > 0) {
    prompt += '\n**KNOWLEDGE BASE:**\n';
    expertConfig.knowledge.forEach((file) => {
      prompt += `\n[${file.name}]:\n${file.content}\n`;
    });
  }
  
  // Add additional context if provided
  if (additionalContext) {
    prompt += '\n**ADDITIONAL CONTEXT:**\n' + additionalContext + '\n';
  }
  
  // Add mode suffix
  if (modeBehavior && modeBehavior.suffix) {
    prompt += modeBehavior.suffix + '\n';
  }
  
  return prompt;
}

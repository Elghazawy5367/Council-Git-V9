import { Expert, ModelInfo, ExecutionMode } from './types';

// The Magnificent 7 Model Fleet
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

export const MODE_DESCRIPTIONS: Record<ExecutionMode, { name: string; description: string; icon: string }> = {
  separated: {
    name: 'Separated',
    description: 'Independent analyses with no cross-pollination between experts',
    icon: 'Layers',
  },
  synthesis: {
    name: 'Synthesis',
    description: 'Collaborative consensus-building with multi-stage integration',
    icon: 'GitMerge',
  },
  debate: {
    name: 'Debate',
    description: 'Adversarial multi-round argumentation with scoring',
    icon: 'Swords',
  },
  pipeline: {
    name: 'Pipeline',
    description: 'Sequential refinement where each expert builds on the previous',
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

export const DEFAULT_EXPERTS: Expert[] = [
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
    },
    color: 'from-blue-500 to-cyan-500',
    icon: 'Brain',
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
    knowledge: [],
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
    },
    color: 'from-emerald-500 to-teal-500',
    icon: 'Cpu',
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
      presencePenalty: 0.2,
      frequencyPenalty: 0.1,
    },
    modeBehavior: {
      separated: 'Analyze strategic implications independently.',
      synthesis: 'Align strategic vision across all perspectives.',
      debate: 'Challenge strategic assumptions and competitive positioning.',
      pipeline: 'Develop strategy building on previous insights.',
    },
    color: 'from-amber-500 to-orange-500',
    icon: 'Target',
    hasWebSearch: true,
  },
  {
    id: 'exp_4',
    name: 'The Psychologist',
    model: 'mistralai/mixtral-8x7b-instruct',
    role: 'system',
    basePersona: `You are "The Psychologist". Analyze human behavior, motivation, cognitive biases, and emotional factors. Consider how decisions affect stakeholders psychologically.

EXAMPLE OUTPUT:
"## Psychological Analysis

### Stakeholder Motivation Map
\`\`\`mermaid
mindmap
  root((Decision))
    Users
      Fear of Change
      Desire for Status
    Executives
      Risk Aversion
      Growth Pressure
    Team
      Job Security
      Recognition
\`\`\`

### Cognitive Bias Assessment
| Bias | Risk Level | Mitigation |
|------|------------|------------|
| Anchoring | High | Present multiple options |
| Confirmation | Medium | Devil's advocate process |
"`,
    knowledge: [],
    config: {
      temperature: 0.6,
      maxTokens: 4000,
      topP: 0.9,
      presencePenalty: 0.2,
      frequencyPenalty: 0.1,
    },
    modeBehavior: {
      separated: 'Provide psychological analysis independently.',
      synthesis: 'Harmonize understanding of human factors.',
      debate: 'Challenge assumptions about human behavior.',
      pipeline: 'Add psychological depth to previous analysis.',
    },
    color: 'from-pink-500 to-rose-500',
    icon: 'Heart',
  },
  {
    id: 'exp_5',
    name: 'The Critic',
    model: 'meta-llama/llama-3.1-8b-instruct',
    role: 'system',
    basePersona: `You are "The Critic". Your role is to find weaknesses, identify blind spots, and stress-test ideas. Be constructively skeptical. If something can fail, explain how.

EXAMPLE OUTPUT:
"## Critical Assessment

### Risk Matrix
| Risk | Probability | Impact | Priority |
|------|-------------|--------|----------|
| Technical Debt | High | Medium | 1 |
| Market Timing | Medium | High | 2 |

### Identified Weaknesses
✗ **Weakness 1:** [specific flaw]
✗ **Weakness 2:** [potential failure mode]
⚠ **Assumption Risk:** [untested assumptions]

### Mitigation Recommendations
→ [how to address each weakness]"`,
    knowledge: [],
    config: {
      temperature: 0.4,
      maxTokens: 3000,
      topP: 0.9,
      presencePenalty: 0.3,
      frequencyPenalty: 0.2,
    },
    modeBehavior: {
      separated: 'Provide critical analysis independently.',
      synthesis: 'Identify weaknesses in the emerging consensus.',
      debate: 'Aggressively challenge all positions.',
      pipeline: 'Stress-test the accumulated conclusions.',
    },
    color: 'from-red-500 to-rose-600',
    icon: 'AlertTriangle',
  },
];

export const EXPERT_COLORS = [
  'from-blue-500 to-cyan-500',
  'from-emerald-500 to-teal-500',
  'from-amber-500 to-orange-500',
  'from-pink-500 to-rose-500',
  'from-red-500 to-rose-600',
  'from-violet-500 to-purple-500',
  'from-indigo-500 to-blue-500',
];

export const buildSystemPrompt = (
  expert: Expert,
  mode: ExecutionMode,
  additionalContext?: string
): string => {
  const modeBehavior = MODE_BEHAVIORS[mode];
  const expertModeBehavior = expert.modeBehavior[mode];
  
  let prompt = `${expert.basePersona}\n\n`;
  
  // Add output formatting rules (Claude Artifacts style)
  prompt += OUTPUT_FORMATTING_RULES + '\n';
  
  // Add web search capability for enabled experts
  if (expert.hasWebSearch) {
    prompt += WEB_SEARCH_RULES + '\n';
  }
  
  prompt += `MODE INSTRUCTION: ${modeBehavior.instruction}\n`;
  prompt += `YOUR SPECIFIC BEHAVIOR: ${expertModeBehavior}\n`;
  
  if (expert.knowledge.length > 0) {
    prompt += '\n--- KNOWLEDGE BASE ---\n';
    expert.knowledge.forEach((file) => {
      prompt += `\n[${file.name}]:\n${file.content}\n`;
    });
    prompt += '--- END KNOWLEDGE BASE ---\n';
  }
  
  if (additionalContext) {
    prompt += `\n--- ADDITIONAL CONTEXT ---\n${additionalContext}\n--- END CONTEXT ---\n`;
  }
  
  prompt += modeBehavior.suffix;
  
  return prompt;
};

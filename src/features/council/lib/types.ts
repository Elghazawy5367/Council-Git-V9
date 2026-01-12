// Council Feature Type Definitions

export interface ExpertConfig {
  temperature: number;
  maxTokens: number;
  topP: number;
  presencePenalty: number;
  frequencyPenalty: number;
}

export interface ModeBehavior {
  parallel: string;
  consensus: string;
  adversarial: string;
  sequential: string;
  modeName: string; // Added to align with ai-client.ts
  description: string; // Added to align with ai-client.ts
  isEnabled: boolean; // Added to align with ai-client.ts
}

export interface KnowledgeFile {
  id: string;
  name: string;
  content: string;
  size: string;
  type: string;
}

export interface Expert {
  id: string;
  name: string;
  model: string;
  role: string;
  basePersona: string;
  knowledge: KnowledgeFile[]; // Ensure this is properly typed
  config: ExpertConfig;
  modeBehavior: ModeBehavior;
  color: string;
  icon: string;
  output?: string;
  isLoading?: boolean;
  personaId?: string;
  hasWebSearch?: boolean;
  positionName?: string;
  positionSpecialty?: string;
  pluginId?: string;
  pluginConfig?: Record<string, unknown>;
  content?: string; // Added to align with control-panel-store.ts
}

export type ExecutionMode = 'parallel' | 'consensus' | 'adversarial' | 'sequential';

export type SynthesisTier = 'quick' | 'balanced' | 'deep';

export interface SynthesisConfig {
  tier: SynthesisTier;
  model?: string;
  fallbackModel?: string;
  temperature?: number;
  maxTokens?: number;
  customInstructions?: string;
  options?: Record<string, unknown>;
}

export interface SynthesisResult {
  content: string;
  tier: SynthesisTier;
  model: string;
  tokens: { prompt: number; completion: number };
  cost: number;
}

export interface ExecutionState {
  isRunning: boolean;
  currentPhase: string;
  progress: number;
  startTime?: Date;
  outputs: Record<string, string>;
  verdict: string;
  cost: number;
}

export interface DebateRound {
  round: number;
  expertId: string;
  statement: string;
  score?: number;
  rebuttal?: string;
}

export interface ExportData {
  experts: Expert[];
  outputs: Record<string, string>;
  task: string;
  mode: ExecutionMode;
  cost: number;
  timestamp: Date;
  verdict?: string;
  synthesisMetadata?: {
    tier: SynthesisTier;
    model: string;
    cost: number;
  };
}

export interface CouncilSession {
  id: string;
  timestamp: Date;
  task: string;
  mode: ExecutionMode;
  activeExpertCount: number;
  experts: {
    id: string;
    name: string;
    model: string;
  }[];
  outputs: Record<string, string>;
  verdict: string;
  synthesisConfig?: SynthesisConfig;
  cost: {
    experts: number;
    synthesis: number;
    total: number;
  };
}

// Added missing 'ExpertOutput' type definition
export interface ExpertOutput {
  name: string;
  model: string;
  content: string;
}

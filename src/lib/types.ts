// Shared Generic Type Definitions

export interface ModelInfo {
  id: string;
  name: string;
  specialty: string;
  costPer1k: number;
  contextWindow: number;
  recommended: string;
}

export interface VaultStatus {
  hasVault: boolean;
  isLocked: boolean;
  lastUnlock?: Date;
}

export interface FileUploadResult {
  success: boolean;
  content?: string;
  error?: string;
  name?: string;
  size?: string;
  type?: string;
}

export interface ModeBehavior {
  modeName: string;
  description: string;
  isEnabled: boolean;
  separated?: string;
  synthesis?: string;
  debate?: string;
  pipeline?: string;
  // Added additional properties to align with ai-client.ts usage
}

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

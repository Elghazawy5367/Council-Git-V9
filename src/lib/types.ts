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

// Structured synthesis output schemas
import { z } from 'zod';

export const ConflictSchema = z.object({
  topic: z.string().describe('The topic where experts disagree'),
  positions: z.array(z.string()).describe('Different expert positions on this topic'),
  severity: z.enum(['minor', 'moderate', 'critical']).describe('How critical the disagreement is'),
});

export const InsightSchema = z.object({
  category: z.string().describe('Category of insight (e.g., "opportunity", "risk", "pattern")'),
  content: z.string().describe('The insight itself'),
  confidence: z.enum(['low', 'medium', 'high']).describe('Confidence level based on expert consensus'),
  supportingExperts: z.array(z.string()).optional().describe('Which experts support this insight'),
});

export const ExpertWeightInfoSchema = z.object({
  expertName: z.string(),
  weight: z.number().describe('Overall weight score (0-1)'),
  normalizedWeight: z.number().describe('Weight as percentage of total'),
  factors: z.object({
    modelQuality: z.number(),
    outputQuality: z.number(),
    confidence: z.number(),
    domainMatch: z.number(),
  }).optional(),
});

export const SynthesisOutputSchema = z.object({
  consensus: z.string().describe('Main synthesized conclusion from all expert inputs'),
  keyInsights: z.array(InsightSchema).describe('Structured insights extracted from the synthesis'),
  conflicts: z.array(ConflictSchema).optional().describe('Areas where experts disagree'),
  confidence: z.enum(['low', 'medium', 'high']).describe('Overall confidence in the synthesis'),
  reasoning: z.string().optional().describe('Explanation of how the synthesis was constructed'),
  actionItems: z.array(z.string()).optional().describe('Concrete next steps or recommendations'),
  expertWeights: z.array(ExpertWeightInfoSchema).optional().describe('Weight analysis for each expert'),
});

export type SynthesisOutput = z.infer<typeof SynthesisOutputSchema>;
export type Insight = z.infer<typeof InsightSchema>;
export type Conflict = z.infer<typeof ConflictSchema>;
export type ExpertWeightInfo = z.infer<typeof ExpertWeightInfoSchema>;

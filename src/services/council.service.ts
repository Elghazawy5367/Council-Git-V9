/**
 * Council Service Layer
 * Encapsulates business logic for council operations
 */

import { Expert, ExecutionMode, SynthesisConfig, SynthesisResult } from '@/features/council/lib/types';
import { callExpertStreaming } from '@/features/council/api/ai-client';
import { saveSession } from '@/features/council/lib/session-history';

export interface ExpertOutput {
  name: string;
  model: string;
  content: string;
}

export interface CostBreakdown {
  experts: number;
  synthesis: number;
  total: number;
}

export interface StreamingCallbacks {
  onToken: (token: string) => void;
  onComplete: (fullText: string) => void;
  onError: (error: Error) => void;
}

export interface ExecutionContext {
  task: string;
  mode: ExecutionMode;
  activeExperts: Expert[];
  apiKey: string;
  synthesisConfig: SynthesisConfig;
}

export interface ExecutionResult {
  outputs: Record<string, { expertName: string; output: string; model: string }>;
  expertsCost: number;
  success: boolean;
  error?: Error;
}

/**
 * Execute a single expert analysis
 */
export async function executeExpert(
  expert: Expert,
  task: string,
  mode: ExecutionMode,
  apiKey: string,
  callbacks: StreamingCallbacks,
  previousOutputs?: Record<string, string>
): Promise<{ output: string; cost: number }> {
  let finalContent = '';

  const result = await callExpertStreaming(
    expert,
    task,
    mode,
    apiKey,
    {
      onToken: callbacks.onToken,
      onComplete: (fullText) => {
        finalContent = fullText;
        callbacks.onComplete(fullText);
      },
      onError: callbacks.onError,
    },
    undefined, // additionalContext
    previousOutputs
  );

  return {
    output: finalContent,
    cost: result.cost,
  };
}

/**
 * Execute all experts in the council
 */
export async function executeCouncilExperts(
  context: ExecutionContext,
  onExpertUpdate: (index: number, update: { output?: string; isLoading?: boolean; error?: string }) => void,
  onStatusUpdate: (message: string) => void
): Promise<ExecutionResult> {
  const collectedOutputs: Record<string, { expertName: string; output: string; model: string }> = {};
  let expertsCost = 0;

  for (let i = 0; i < context.activeExperts.length; i++) {
    const expert = context.activeExperts[i];
    onStatusUpdate(`${expert.name} is analyzing...`);
    onExpertUpdate(i, { isLoading: true, output: '' });

    const previousOutputs =
      context.mode === 'sequential' || context.mode === 'adversarial'
        ? Object.fromEntries(Object.entries(collectedOutputs).map(([id, data]) => [id, data.output]))
        : undefined;

    try {
      const result = await executeExpert(
        expert,
        context.task,
        context.mode,
        context.apiKey,
        {
          onToken: (token) => {
            onExpertUpdate(i, { output: token });
          },
          onComplete: (fullText) => {
            // Complete callback handled in executeExpert
          },
          onError: (error) => {
            console.error(`Streaming error for expert ${expert.name}:`, error);
          },
        },
        previousOutputs
      );

      collectedOutputs[expert.id] = {
        expertName: expert.name,
        output: result.output,
        model: expert.model,
      };
      expertsCost += result.cost;

      onExpertUpdate(i, { output: result.output, isLoading: false });
    } catch (error) {
      console.error(`Error with expert ${expert.name}:`, error);
      const errorMessage = 'Failed to generate output.';
      
      onExpertUpdate(i, { 
        output: errorMessage, 
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      collectedOutputs[expert.id] = {
        expertName: expert.name,
        output: errorMessage,
        model: expert.model,
      };
    }
  }

  return {
    outputs: collectedOutputs,
    expertsCost,
    success: true,
  };
}

/**
 * Save execution session to history
 */
export function saveExecutionSession(
  task: string,
  mode: ExecutionMode,
  activeExpertCount: number,
  activeExperts: Expert[],
  outputs: Record<string, { expertName: string; output: string; model: string }>,
  verdict: string,
  synthesisConfig: SynthesisConfig,
  cost: CostBreakdown
): void {
  saveSession({
    task,
    mode,
    activeExpertCount,
    experts: activeExperts.map((e) => ({ id: e.id, name: e.name, model: e.model })),
    outputs: Object.fromEntries(Object.entries(outputs).map(([id, data]) => [id, data.output])),
    verdict,
    synthesisConfig,
    cost,
  });
}

/**
 * Calculate total cost
 */
export function calculateTotalCost(expertsCost: number, synthesisCost: number): CostBreakdown {
  return {
    experts: expertsCost,
    synthesis: synthesisCost,
    total: expertsCost + synthesisCost,
  };
}

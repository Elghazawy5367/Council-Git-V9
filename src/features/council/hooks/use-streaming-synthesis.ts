// Streaming Synthesis Hook
import { useState, useCallback, useRef } from 'react';
import { synthesizeVerdictStreaming, type StreamingSynthesisCallbacks, type SynthesisConfig } from '@/features/council/api/ai-client';
import type { ExecutionMode } from '@/features/council/lib/types';
import type { SynthesisOutput } from '@/lib/types';

interface StreamingSynthesisState {
  isStreaming: boolean;
  streamingText: string;
  progress: number;
  error: Error | null;
}

interface StreamingSynthesisResult {
  verdict: string;
  cost: number;
  tier: string;
  structured?: SynthesisOutput;
  weights?: Array<{
    expertName: string;
    weight: number;
    normalizedWeight: number;
  }>;
}

export function useStreamingSynthesis() {
  const [state, setState] = useState<StreamingSynthesisState>({
    isStreaming: false,
    streamingText: '',
    progress: 0,
    error: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const executeSynthesis = useCallback(
    async (
      expertOutputs: Record<string, { expertName: string; output: string; model?: string }>,
      task: string,
      mode: ExecutionMode,
      apiKey: string,
      config?: SynthesisConfig
    ): Promise<StreamingSynthesisResult> => {
      // Reset state
      setState({
        isStreaming: true,
        streamingText: '',
        progress: 0,
        error: null,
      });

      // Create abort controller for cancellation
      abortControllerRef.current = new AbortController();

      const callbacks: StreamingSynthesisCallbacks = {
        onToken: (_token: string, fullText: string) => {
          setState(prev => ({
            ...prev,
            streamingText: fullText,
            progress: Math.min(95, (fullText.length / 2000) * 100), // Estimate progress
          }));
        },
        onComplete: (fullText: string) => {
          setState(prev => ({
            ...prev,
            isStreaming: false,
            streamingText: fullText,
            progress: 100,
          }));
        },
        onError: (error: Error) => {
          setState(prev => ({
            ...prev,
            isStreaming: false,
            error,
          }));
        },
      };

      try {
        const result = await synthesizeVerdictStreaming(
          expertOutputs,
          task,
          mode,
          apiKey,
          callbacks,
          config
        );

        return result;
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        setState(prev => ({
          ...prev,
          isStreaming: false,
          error: err,
        }));
        throw err;
      }
    },
    []
  );

  const cancelSynthesis = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setState(prev => ({
        ...prev,
        isStreaming: false,
        error: new Error('Synthesis cancelled by user'),
      }));
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      isStreaming: false,
      streamingText: '',
      progress: 0,
      error: null,
    });
  }, []);

  return {
    ...state,
    executeSynthesis,
    cancelSynthesis,
    reset,
  };
}

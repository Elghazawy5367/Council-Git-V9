import React, { memo, useCallback } from 'react';
import { useExecutionStore } from '@/features/council/store/execution-store';
import { Button } from '@/components/primitives/button';
import { RefreshCw, ThumbsUp, ThumbsDown } from 'lucide-react';
import { SynthesisConfig, SynthesisResult } from '@/features/council/lib/types';
import { UseMutationResult } from '@tanstack/react-query';
import { ExpertOutput } from '@/features/council/store/execution-store';
interface ExpertOutputFooterProps {
  expert: ExpertOutput;
  expertName?: string;
  output?: string;
  model?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
}
const ExpertOutputFooterComponent: React.FC<ExpertOutputFooterProps> = () => {
  const {
    executeCouncil,
    isLoading
  } = useExecutionStore();
  
  const onRetry = useCallback(() => {
    const mockMutationResult = {
      mutate: ({
        expertOutputs,
        task,
        config,
        apiKey,
        onProgress
      }: {
        expertOutputs: ExpertOutput[];
        task: string;
        config: SynthesisConfig;
        apiKey: string;
        onProgress: (message: string) => void;
      }) => {
        onProgress('Mock progress message');
      }
    } as UseMutationResult<SynthesisResult, Error, {
      expertOutputs: ExpertOutput[];
      task: string;
      config: SynthesisConfig;
      apiKey: string;
      onProgress: (message: string) => void;
    }, unknown>;
    executeCouncil(mockMutationResult);
  }, [executeCouncil]);
  
  return <div className="flex items-center justify-end gap-1 pt-2 border-t border-border/50 flex-shrink-0">
      <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-green-500/10 hover:text-green-500">
        <ThumbsUp className="h-3.5 w-3.5" />
      </Button>
      <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-red-500/10 hover:text-red-500">
        <ThumbsDown className="h-3.5 w-3.5" />
      </Button>
      <Button variant="ghost" size="icon" onClick={onRetry} disabled={isLoading} className="h-6 w-6 hover:bg-blue-500/10 hover:text-blue-500">
        <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
      </Button>
    </div>;
};

// Memoize to prevent unnecessary re-renders
export const ExpertOutputFooter = memo(ExpertOutputFooterComponent);
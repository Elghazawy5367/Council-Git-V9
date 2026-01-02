import React from 'react';
import { useExecutionStore } from '@/features/council/store/execution-store';
import { Button } from '@/components/primitives/button';
import { RefreshCw, ThumbsUp, ThumbsDown } from 'lucide-react';

interface ExpertOutputFooterProps {
  expertId: string;
  expertName?: string;
  output?: string;
  model?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
}

export const ExpertOutputFooter: React.FC<ExpertOutputFooterProps> = ({ expertId }) => {
  const { executeCouncil, isLoading } = useExecutionStore();

  // This is a placeholder for the retry logic
  const onRetry = () => {
    // Casting for now as we transition the store interface
    (executeCouncil as any)(expertId);
  };

  return (
    <div className="flex items-center justify-end gap-1 pt-2 border-t border-border/50 flex-shrink-0">
      <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-green-500/10 hover:text-green-500">
        <ThumbsUp className="h-3.5 w-3.5" />
      </Button>
      <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-red-500/10 hover:text-red-500">
        <ThumbsDown className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onRetry}
        disabled={isLoading}
        className="h-6 w-6 hover:bg-blue-500/10 hover:text-blue-500"
      >
        <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
      </Button>
    </div>
  );
};

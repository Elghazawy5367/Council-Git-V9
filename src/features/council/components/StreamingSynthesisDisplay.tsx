// Streaming Synthesis Display Component
import { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/primitives/card';
import { Button } from '@/components/primitives/button';
import { Progress } from '@/components/primitives/progress';

interface StreamingSynthesisDisplayProps {
  streamingText: string;
  isStreaming: boolean;
  progress: number;
  onCancel?: () => void;
  tier?: string;
}

export function StreamingSynthesisDisplay({
  streamingText,
  isStreaming,
  progress,
  onCancel,
  tier = 'balanced',
}: StreamingSynthesisDisplayProps): JSX.Element {
  const contentRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom as text streams in
  useEffect(() => {
    if (contentRef.current && isStreaming) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [streamingText, isStreaming]);

  const tierIcon = {
    quick: '⚡',
    balanced: '🎯',
    deep: '🔍',
  }[tier] || '🎯';

  const tierName = {
    quick: 'Quick',
    balanced: 'Balanced',
    deep: 'Deep',
  }[tier] || 'Balanced';

  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            {tierIcon} Synthesis ({tierName})
            {isStreaming && (
              <span className="inline-flex items-center gap-1 text-sm font-normal text-muted-foreground">
                <span className="animate-pulse">●</span> Streaming...
              </span>
            )}
          </span>
          {isStreaming && onCancel && (
            <Button
              variant="destructive"
              size="sm"
              onClick={onCancel}
              className="ml-auto"
            >
              ⏹ Cancel
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isStreaming && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>{progress.toFixed(0)}%</span>
            </div>
            <Progress value={progress} className="h-1" />
          </div>
        )}
        
        <div
          ref={contentRef}
          className="prose prose-sm dark:prose-invert max-w-none min-h-[200px] max-h-[600px] overflow-y-auto p-4 bg-muted/30 rounded-md"
        >
          {streamingText ? (
            <div className="whitespace-pre-wrap">{streamingText}</div>
          ) : (
            <div className="text-muted-foreground italic">
              Waiting for synthesis to begin...
            </div>
          )}
          {isStreaming && (
            <span className="inline-block w-2 h-4 ml-1 bg-primary animate-pulse" />
          )}
        </div>

        {!isStreaming && streamingText && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <svg
              className="w-4 h-4 text-green-500"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
            Synthesis complete ({streamingText.length} chars)
          </div>
        )}
      </CardContent>
    </Card>
  );
}

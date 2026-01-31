/**
 * LLMResponseCard Component
 * 
 * REQUIREMENTS:
 * 1. Header with LLM icon, name, provider badge
 * 2. Content area with markdown-rendered response
 * 3. Footer with 4 buttons (thumbs up/down, retry, copy, export)
 * 4. Status indicators (loading, success, error)
 * 5. Collapsible/expandable
 * 6. Syntax highlighting for code blocks
 */

import { useState, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/primitives/card';
import { Button } from '@/components/primitives/button';
import { Badge } from '@/components/primitives/badge';
import { Skeleton } from '@/components/primitives/skeleton';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/primitives/collapsible';
import { SafeMarkdown } from '@/components/primitives/SafeMarkdown';
import { 
  ThumbsUp, 
  ThumbsDown, 
  RotateCw, 
  Copy, 
  Download, 
  ChevronDown, 
  ChevronUp,
  AlertCircle,
  Clock,
  CheckCircle,
  DollarSign
} from 'lucide-react';
import { toast } from 'sonner';
import { AVAILABLE_LLMS } from '@/services/openrouter';
import type { LLMResponse } from '@/services/openrouter';

interface LLMResponseCardProps {
  response: LLMResponse;
  onFeedback?: (type: 'up' | 'down') => void;
  onRetry?: () => void;
}

export function LLMResponseCard({ response, onFeedback, onRetry }: LLMResponseCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);

  // Get LLM configuration from AVAILABLE_LLMS
  const llmConfig = AVAILABLE_LLMS.find(llm => llm.id === response.llmId);
  const llmIcon = llmConfig?.icon || '🤖';
  const llmName = response.llmName || llmConfig?.name || 'Unknown LLM';
  const llmProvider = llmConfig?.provider || 'Unknown';

  // Handle feedback
  const handleFeedback = (type: 'up' | 'down') => {
    const newFeedback = feedback === type ? null : type;
    setFeedback(newFeedback);
    
    if (onFeedback) {
      onFeedback(type);
    }
    
    if (newFeedback) {
      toast.success(`Feedback recorded: ${type === 'up' ? '👍' : '👎'}`);
    }
  };

  // Handle copy to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(response.response);
      toast.success('Response copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy to clipboard');
      console.error('Copy error:', error);
    }
  };

  // Handle export as file
  const handleExport = () => {
    try {
      const blob = new Blob([response.response], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${response.llmId}-response-${Date.now()}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Response exported!');
    } catch (error) {
      toast.error('Failed to export response');
      console.error('Export error:', error);
    }
  };

  // Handle retry
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
      toast.info('Retrying request...');
    }
  };

  // Format cost display
  const formatCost = (cost: number | undefined): string => {
    if (!cost) return '$0.00';
    return `$${cost.toFixed(4)}`;
  };

  // Format timestamp
  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  // Render loading state
  if (response.status === 'loading') {
    return (
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{llmIcon}</span>
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <Badge variant="outline" className="gap-1">
              <Clock className="h-3 w-3" />
              Loading
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
    );
  }

  // Render error state
  if (response.status === 'error') {
    return (
      <Card className="w-full border-destructive/50 bg-destructive/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{llmIcon}</span>
              <div>
                <CardTitle className="text-base">{llmName}</CardTitle>
                <Badge variant="outline" className="mt-1">{llmProvider}</Badge>
              </div>
            </div>
            <Badge variant="destructive" className="gap-1">
              <AlertCircle className="h-3 w-3" />
              Error
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
            <div className="space-y-2 flex-1">
              <p className="text-sm font-medium text-destructive">Failed to get response</p>
              <p className="text-sm text-muted-foreground">
                {response.error || 'An unknown error occurred'}
              </p>
            </div>
          </div>
          
          {/* Footer with retry button */}
          <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetry}
              disabled={!onRetry}
              className="gap-2"
            >
              <RotateCw className="h-4 w-4" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Render success state
  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <span className="text-2xl">{llmIcon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base">{llmName}</CardTitle>
                  <Badge variant="outline">{llmProvider}</Badge>
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatTime(response.timestamp)}
                  </div>
                  {response.tokens && (
                    <div className="flex items-center gap-1">
                      <span>{response.tokens.total} tokens</span>
                    </div>
                  )}
                  {response.cost && (
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      {formatCost(response.cost)}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="default" className="gap-1">
                <CheckCircle className="h-3 w-3" />
                Success
              </Badge>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>
        </CardHeader>
        
        <CollapsibleContent>
          <CardContent className="space-y-4">
            {/* Response content with markdown rendering and syntax highlighting */}
            <div className="rounded-lg border bg-muted/30 p-4 max-h-[600px] overflow-y-auto">
              {response.response ? (
                <SafeMarkdown content={response.response} />
              ) : (
                <p className="text-sm text-muted-foreground italic">No response content</p>
              )}
            </div>
            
            {/* Footer with action buttons */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t">
              <div className="flex items-center gap-2">
                {/* Feedback buttons */}
                <Button
                  variant={feedback === 'up' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleFeedback('up')}
                  className="gap-2"
                  disabled={!onFeedback}
                >
                  <ThumbsUp className="h-4 w-4" />
                  {feedback === 'up' && <span>Liked</span>}
                </Button>
                <Button
                  variant={feedback === 'down' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleFeedback('down')}
                  className="gap-2"
                  disabled={!onFeedback}
                >
                  <ThumbsDown className="h-4 w-4" />
                  {feedback === 'down' && <span>Disliked</span>}
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Retry button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRetry}
                  disabled={!onRetry}
                  className="gap-2"
                >
                  <RotateCw className="h-4 w-4" />
                  Retry
                </Button>
                
                {/* Copy button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Copy
                </Button>
                
                {/* Export button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExport}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

// Memoize to prevent unnecessary re-renders
export default memo(LLMResponseCard);

/**
 * Enhanced LLMResponseCard Component
 * 
 * Inspired by:
 * - Vercel AI SDK (streaming responses)
 * - OpenAI Playground (code blocks with copy)
 * - ChatGPT interface (typewriter effect)
 * 
 * Features:
 * 1. Streaming text with typewriter effect
 * 2. Syntax-highlighted code blocks with copy buttons
 * 3. Collapsible/expandable sections
 * 4. Loading states with skeleton
 * 5. Error states with retry
 * 6. Professional UI polish
 */

import { useState, memo, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/primitives/card';
import { Button } from '@/components/primitives/button';
import { Badge } from '@/components/primitives/badge';
import { Skeleton } from '@/components/primitives/skeleton';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/primitives/collapsible';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
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
  DollarSign,
  Check,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { AVAILABLE_LLMS } from '@/services/openrouter';
import type { LLMResponse } from '@/services/openrouter';

interface LLMResponseCardProps {
  response: LLMResponse;
  onFeedback?: (type: 'up' | 'down') => void;
  onRetry?: () => void;
  streaming?: boolean; // Enable typewriter effect
  streamingSpeed?: number; // Characters per chunk (default: 3)
}

/**
 * Custom hook for typewriter effect
 * Simulates character-by-character text streaming
 */
function useTypewriter(text: string, enabled: boolean, speed: number = 3): string {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  
  useEffect(() => {
    if (!enabled) {
      setDisplayedText(text);
      setIsComplete(true);
      return;
    }

    setDisplayedText('');
    setIsComplete(false);
    
    let currentIndex = 0;
    const intervalDuration = 16; // ~60fps for smooth animation
    
    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        // Add multiple characters per frame for faster streaming
        const chunk = text.slice(currentIndex, currentIndex + speed);
        currentIndex += speed;
        setDisplayedText(text.slice(0, currentIndex));
      } else {
        setIsComplete(true);
        clearInterval(interval);
      }
    }, intervalDuration);

    return () => clearInterval(interval);
  }, [text, enabled, speed]);

  return displayedText;
}

/**
 * Code block component with syntax highlighting and copy button
 */
function CodeBlock({ language, value, inline }: { language?: string; value: string; inline?: boolean }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success('Code copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy code');
    }
  };

  // Inline code
  if (inline) {
    return (
      <code className="px-1.5 py-0.5 rounded bg-muted text-primary font-mono text-[0.85em]">
        {value}
      </code>
    );
  }

  // Code block with syntax highlighting
  return (
    <div className="relative group my-4">
      {/* Language badge */}
      {language && (
        <div className="absolute top-3 left-3 px-2 py-1 text-[10px] uppercase tracking-wider text-muted-foreground bg-background/80 rounded z-10">
          {language}
        </div>
      )}
      
      {/* Copy button */}
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 p-2 rounded-md bg-background/80 hover:bg-background border border-border/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
        title="Copy code"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {/* Syntax highlighted code */}
      <SyntaxHighlighter
        language={language || 'text'}
        style={oneDark}
        customStyle={{
          margin: 0,
          borderRadius: '0.5rem',
          padding: '1.5rem',
          paddingTop: '2.5rem',
          fontSize: '0.875rem',
          lineHeight: '1.5',
        }}
        showLineNumbers={value.split('\n').length > 5}
        wrapLines={true}
        wrapLongLines={false}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
}

export function LLMResponseCard({ 
  response, 
  onFeedback, 
  onRetry,
  streaming = false,
  streamingSpeed = 3
}: LLMResponseCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  
  // Typewriter effect for streaming responses
  const displayedText = useTypewriter(
    response.response || '', 
    streaming && response.status === 'success',
    streamingSpeed
  );
  
  const isStreaming = streaming && displayedText.length < (response.response?.length || 0);
  const contentToRender = streaming ? displayedText : response.response;

  // Get LLM configuration
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
      await navigator.clipboard.writeText(response.response || '');
      toast.success('Response copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  // Handle export as file
  const handleExport = () => {
    try {
      const blob = new Blob([response.response || ''], { type: 'text/markdown' });
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
              {isStreaming ? (
                <Badge variant="secondary" className="gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Streaming
                </Badge>
              ) : (
                <Badge variant="default" className="gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Success
                </Badge>
              )}
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
            {/* Response content with enhanced markdown rendering */}
            <div className="rounded-lg border bg-muted/30 p-4 max-h-[600px] overflow-y-auto">
              {contentToRender ? (
                <div className="prose prose-sm prose-invert max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        const language = match ? match[1] : undefined;
                        const codeContent = String(children).replace(/\n$/, '');

                        return (
                          <CodeBlock
                            language={language}
                            value={codeContent}
                            inline={inline}
                          />
                        );
                      },
                      // Styled tables
                      table({ children }) {
                        return (
                          <div className="overflow-x-auto my-4">
                            <table className="min-w-full border-collapse border border-border/50 rounded-lg overflow-hidden">
                              {children}
                            </table>
                          </div>
                        );
                      },
                      thead({ children }) {
                        return <thead className="bg-muted/50">{children}</thead>;
                      },
                      th({ children }) {
                        return (
                          <th className="px-4 py-2 text-left text-sm font-semibold text-foreground border-b border-border/50">
                            {children}
                          </th>
                        );
                      },
                      td({ children }) {
                        return (
                          <td className="px-4 py-2 text-sm text-muted-foreground border-b border-border/30">
                            {children}
                          </td>
                        );
                      },
                      // Styled headers
                      h1({ children }) {
                        return <h1 className="text-2xl font-bold text-foreground mt-6 mb-4 border-b border-border/50 pb-2">{children}</h1>;
                      },
                      h2({ children }) {
                        return <h2 className="text-xl font-semibold text-foreground mt-5 mb-3">{children}</h2>;
                      },
                      h3({ children }) {
                        return <h3 className="text-lg font-medium text-foreground mt-4 mb-2">{children}</h3>;
                      },
                      h4({ children }) {
                        return <h4 className="text-base font-medium text-foreground mt-3 mb-2">{children}</h4>;
                      },
                      // Styled paragraphs
                      p({ children }) {
                        return <p className="mb-3 text-muted-foreground leading-relaxed">{children}</p>;
                      },
                      // Styled lists
                      ul({ children }) {
                        return <ul className="list-disc list-outside ml-4 mb-4 space-y-1">{children}</ul>;
                      },
                      ol({ children }) {
                        return <ol className="list-decimal list-outside ml-4 mb-4 space-y-1">{children}</ol>;
                      },
                      li({ children }) {
                        return <li className="text-muted-foreground">{children}</li>;
                      },
                      // Styled blockquotes
                      blockquote({ children }) {
                        return (
                          <blockquote className="border-l-4 border-primary/50 pl-4 my-4 italic text-muted-foreground bg-muted/20 py-2 rounded-r">
                            {children}
                          </blockquote>
                        );
                      },
                      // Styled links
                      a({ href, children }) {
                        return (
                          <a
                            href={href}
                            className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {children}
                          </a>
                        );
                      },
                      // Horizontal rule
                      hr() {
                        return <hr className="my-6 border-border/50" />;
                      },
                      // Strong text
                      strong({ children }) {
                        return <strong className="font-semibold text-foreground">{children}</strong>;
                      },
                      // Emphasis
                      em({ children }) {
                        return <em className="italic">{children}</em>;
                      },
                    }}
                  >
                    {contentToRender}
                  </ReactMarkdown>
                  {/* Blinking cursor during streaming */}
                  {isStreaming && (
                    <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-0.5" />
                  )}
                </div>
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

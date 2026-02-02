/**
 * Judge Section Component
 * 
 * REQUIREMENTS:
 * 1. Only visible after at least 2 LLM responses
 * 2. Radio buttons for judge mode selection
 * 3. Show which LLMs responded successfully
 * 4. "Run Judge" button (disabled if no responses)
 * 5. Judge output display with markdown
 * 6. Show score breakdown
 * 7. Show contradictions found
 * 8. Copy button for judge output
 */

import { useState, useMemo } from 'react';
import { useCouncilContext } from '@/contexts/CouncilContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/primitives/card';
import { Button } from '@/components/primitives/button';
import { RadioGroup, RadioGroupItem } from '@/components/primitives/radio-group';
import { Badge } from '@/components/primitives/badge';
import { Label } from '@/components/primitives/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/primitives/collapsible';
import { Separator } from '@/components/primitives/separator';
import SafeMarkdown from '@/components/primitives/SafeMarkdown';
import { Gavel, Copy, Download, ChevronDown, ChevronUp, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { JUDGE_MODE_DESCRIPTIONS } from '@/lib/config';
import { toast } from 'sonner';

export function JudgeSection(): JSX.Element | null {
  const { execution, judge, setJudgeMode, executeJudge } = useCouncilContext();

  // Local state
  const [isExpanded, setIsExpanded] = useState(true);
  const [isScoresExpanded, setIsScoresExpanded] = useState(false);
  const [isContradictionsExpanded, setIsContradictionsExpanded] = useState(false);

  // Only show if we have at least 2 successful responses - memoized for performance
  const successfulResponses = useMemo(() => 
    execution.llmResponses.filter((r) => r.status === 'success'),
    [execution.llmResponses]
  );

  if (successfulResponses.length < 2) {
    return null;
  }

  // Handle judge execution
  const handleRunJudge = async (): Promise<void> => {
    try {
      await executeJudge();
      toast.success('Judge synthesis completed!');
    } catch (error) {
      toast.error(`Judge synthesis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Handle copy to clipboard
  const handleCopy = async (): Promise<void> => {
    if (!judge.result) return;

    try {
      await navigator.clipboard.writeText(judge.result);
      toast.success('Judge output copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  // Handle export as markdown
  const handleExport = (): void => {
    if (!judge.result) return;

    try {
      const blob = new Blob([judge.result], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `judge-synthesis-${Date.now()}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Judge output exported!');
    } catch (error) {
      toast.error('Failed to export judge output');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gavel className="h-5 w-5 text-primary" />
            <CardTitle>Judge Synthesis</CardTitle>
            <Badge variant="outline" className="ml-2">
              {successfulResponses.length} Responses Ready
            </Badge>
          </div>
          {judge.result && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                disabled={judge.isRunning}
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExport}
                disabled={judge.isRunning}
              >
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Successful LLMs Display */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Successful Responses From:</Label>
          <div className="flex flex-wrap gap-2">
            {successfulResponses.map((response) => (
              <Badge key={response.llmId} variant="secondary" className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                {response.llmName}
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        {/* Judge Mode Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Select Judge Mode:</Label>
          <RadioGroup
            value={judge.mode}
            onValueChange={(value) => setJudgeMode(value as typeof judge.mode)}
            disabled={judge.isRunning}
          >
            <div className="grid gap-3">
              {Object.entries(JUDGE_MODE_DESCRIPTIONS).map(([mode, config]) => (
                <div key={mode} className="flex items-start space-x-2">
                  <RadioGroupItem value={mode} id={mode} />
                  <div className="grid gap-1 flex-1">
                    <Label
                      htmlFor={mode}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {config.name}
                      {mode === 'ruthless-judge' && (
                        <Badge variant="default" className="ml-2 text-xs">
                          Default
                        </Badge>
                      )}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {config.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        <Separator />

        {/* Run Judge Button */}
        <Button
          onClick={handleRunJudge}
          disabled={judge.isRunning || successfulResponses.length === 0}
          className="w-full h-12"
          size="lg"
        >
          {judge.isRunning ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Running Judge...
            </>
          ) : (
            <>
              <Gavel className="h-5 w-5 mr-2" />
              Run Judge
            </>
          )}
        </Button>

        {judge.isRunning && (
          <p className="text-sm text-muted-foreground text-center">
            Synthesizing {successfulResponses.length} expert responses...
          </p>
        )}

        {/* Judge Output Display */}
        {judge.result && (
          <>
            <Separator />

            <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
              <div className="flex items-center justify-between mb-4">
                <Label className="text-sm font-medium">Judge Output:</Label>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm">
                    {isExpanded ? (
                      <>
                        <ChevronUp className="h-4 w-4 mr-1" />
                        Collapse
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4 mr-1" />
                        Expand
                      </>
                    )}
                  </Button>
                </CollapsibleTrigger>
              </div>

              <CollapsibleContent>
                <div className="border rounded-lg p-4 bg-muted/50 max-h-[600px] overflow-y-auto prose prose-sm dark:prose-invert max-w-none">
                  <SafeMarkdown content={judge.result} />
                </div>
              </CollapsibleContent>
            </Collapsible>
          </>
        )}

        {/* Score Breakdown (if available) */}
        {judge.result && (
          <>
            <Separator />

            <Collapsible open={isScoresExpanded} onOpenChange={setIsScoresExpanded}>
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Score Breakdown:</Label>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm">
                    {isScoresExpanded ? (
                      <>
                        <ChevronUp className="h-4 w-4 mr-1" />
                        Hide
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4 mr-1" />
                        Show
                      </>
                    )}
                  </Button>
                </CollapsibleTrigger>
              </div>

              <CollapsibleContent className="mt-4">
                <div className="text-sm text-muted-foreground">
                  <p>Score breakdown will be available when using the Ruthless Judge service with structured output.</p>
                  <p className="mt-2">Currently showing synthesized output only.</p>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </>
        )}

        {/* Contradictions (if available) */}
        {judge.result && (
          <>
            <Separator />

            <Collapsible open={isContradictionsExpanded} onOpenChange={setIsContradictionsExpanded}>
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Contradictions Found:</Label>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm">
                    {isContradictionsExpanded ? (
                      <>
                        <ChevronUp className="h-4 w-4 mr-1" />
                        Hide
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4 mr-1" />
                        Show
                      </>
                    )}
                  </Button>
                </CollapsibleTrigger>
              </div>

              <CollapsibleContent className="mt-4">
                <div className="text-sm text-muted-foreground">
                  <p>Contradiction analysis will be available when using the Ruthless Judge service with structured output.</p>
                  <p className="mt-2">Currently showing synthesized output only.</p>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </>
        )}

        {/* Error Display */}
        {judge.error && (
          <>
            <Separator />
            <div className="border border-destructive rounded-lg p-4 bg-destructive/10">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-destructive">Judge Synthesis Failed</p>
                  <p className="text-sm text-muted-foreground mt-1">{judge.error}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

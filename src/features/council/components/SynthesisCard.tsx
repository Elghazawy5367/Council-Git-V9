import React, { useState } from 'react';
import { useExecutionStore } from '@/features/council/store/execution-store';
import { useSettingsStore } from '@/features/settings/store/settings-store';
import { SynthesisTier } from '@/features/council/lib/types';
import { SYNTHESIS_TIERS } from '@/lib/synthesis-engine';
import { Card, CardContent, CardHeader } from '@/components/primitives/card';
import { Button } from '@/components/primitives/button';
import { Slider } from '@/components/primitives/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/primitives/select';
import { Textarea } from '@/components/primitives/textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/primitives/collapsible';
import { ScrollArea } from '@/components/primitives/scroll-area';
import { SafeMarkdown } from '@/components/primitives/SafeMarkdown';
import {
  Brain,
  Copy,
  Settings2,
  ChevronDown,
  ChevronUp,
  Loader2,
  Zap,
  Target,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';

const TIER_ICONS: Record<SynthesisTier, React.ComponentType<{ className?: string }>> = {
  quick: Zap,
  balanced: Target,
  deep: Brain,
};

export const SynthesisCard: React.FC = () => {
  const { synthesisResult, isSynthesizing } = useExecutionStore();
  const { synthesisConfig, setSynthesisConfig } = useSettingsStore();
  const [showConfig, setShowConfig] = useState<any>(false);
  const tierConfig = SYNTHESIS_TIERS[synthesisConfig.tier];

  const handleCopy = async () => {
    if (synthesisResult?.content) {
      await navigator.clipboard.writeText(synthesisResult.content);
      toast.success('Synthesis copied to clipboard');
    }
  };

  return (
    <Card className="glass-panel transition-all duration-300 ring-2 ring-accent/30 h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground">Synthesizer</h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <span>{tierConfig.icon}</span>
                <span>{tierConfig.name}</span>
                <span className="text-muted-foreground/60">•</span>
                <span className="truncate">{synthesisConfig.model.split('/')[1]}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {synthesisResult?.content && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-primary/10"
                onClick={handleCopy}
              >
                <Copy className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-primary/10"
              onClick={() => setShowConfig(!showConfig)}
            >
              <Settings2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-3 overflow-hidden">
        {/* Configuration Panel */}
        <Collapsible open={showConfig} onOpenChange={setShowConfig}>
          <CollapsibleContent className="space-y-4 pb-3 border-b border-border/50">
            {/* Tier Selection */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Synthesis Tier</label>
              <div className="flex gap-2">
                {(Object.keys(SYNTHESIS_TIERS) as SynthesisTier[]).map((tier) => {
                  const TierIcon = TIER_ICONS[tier];
                  const tierInfo = SYNTHESIS_TIERS[tier];
                  return (
                    <Button
                      key={tier}
                      variant={synthesisConfig.tier === tier ? 'default' : 'outline'}
                      size="sm"
                      className={`flex-1 ${synthesisConfig.tier === tier ? 'bg-gradient-to-r from-primary to-secondary' : ''}`}
                      onClick={() => setSynthesisConfig({ ...synthesisConfig, tier })}
                    >
                      <TierIcon className="h-3.5 w-3.5 mr-1" />
                      {tierInfo.icon}
                    </Button>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground">
                {tierConfig.description} • {tierConfig.estimatedTime} • {tierConfig.estimatedCost}
              </p>
            </div>

            {/* Model Selection */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Model</label>
              <Select
                value={synthesisConfig.model}
                onValueChange={(value) => setSynthesisConfig({ ...synthesisConfig, model: value })}
              >
                <SelectTrigger className="h-8 text-xs bg-muted/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="google/gemini-2.0-flash-001">Gemini 2.0 Flash (1M context)</SelectItem>
                  <SelectItem value="google/gemini-flash-1.5">Gemini Flash 1.5 (1M context)</SelectItem>
                  <SelectItem value="deepseek/deepseek-chat">DeepSeek Chat (64K context)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Temperature */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Temperature</span>
                <span className="font-mono">{synthesisConfig.temperature.toFixed(2)}</span>
              </div>
              <Slider
                value={[synthesisConfig.temperature]}
                onValueChange={([value]) => setSynthesisConfig({ ...synthesisConfig, temperature: value })}
                min={0}
                max={1}
                step={0.1}
                className="slider-council"
              />
            </div>

            {/* Custom Instructions */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Custom Instructions</label>
              <Textarea
                value={synthesisConfig.customInstructions}
                onChange={(e) => setSynthesisConfig({ ...synthesisConfig, customInstructions: e.target.value })}
                placeholder="E.g., 'Focus on cost-benefit analysis'"
                className="min-h-[60px] text-xs bg-muted/50 resize-none"
              />
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {isSynthesizing ? (
            <div className="flex flex-col items-center justify-center h-full py-8">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-secondary blur-lg opacity-50 animate-pulse" />
                <Loader2 className="h-8 w-8 animate-spin text-primary relative z-10" />
              </div>
              <span className="text-xs text-muted-foreground mt-3">
                {tierConfig.icon} Running {tierConfig.name}...
              </span>
            </div>
          ) : synthesisResult?.content ? (
            <ScrollArea className="h-full">
              <SafeMarkdown content={synthesisResult.content} className="text-sm p-2" />
              {synthesisResult.cost > 0 && (
                <div className="text-xs text-muted-foreground mt-3 pt-2 border-t border-border/50 flex items-center gap-2">
                  <span>{tierConfig.icon} {synthesisConfig.tier}</span>
                  <span>•</span>
                  <span>{synthesisResult.model.split('/')[1]}</span>
                  <span>•</span>
                  <span>${synthesisResult.cost.toFixed(6)}</span>
                </div>
              )}
            </ScrollArea>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                <Brain className="h-6 w-6 text-muted-foreground/50" />
              </div>
              <p className="text-xs text-muted-foreground max-w-[180px]">
                Awaiting expert analyses to synthesize...
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SynthesisCard;

import React, { useMemo } from 'react';
import { useExpertStore } from '@/features/council/store/expert-store';
import { useControlPanelStore } from '@/features/council/store/control-panel-store';
import { Button } from '@/components/primitives/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/primitives/toggle-group';
import { Textarea } from '@/components/primitives/textarea';
import { Badge } from '@/components/primitives/badge';
import {
  Play,
  Zap,
  ChevronDown,
  ChevronUp,
  Activity,
  Settings2,
  Cpu,
  Layers,
  ArrowRightLeft,
  Coins,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

// Stable selector outside the component to avoid re-renders
const storeSelector = (state: any) => ({
  activeExpertCount: state.activeExpertCount,
  setActiveExpertCount: state.setActiveExpertCount,
  executionMode: state.executionMode,
  setExecutionMode: state.setExecutionMode,
  taskDescription: state.taskDescription,
  setTaskDescription: state.setTaskDescription,
  isExecuting: state.isExecuting,
  executionPhase: state.executionPhase,
  startPhase1: state.startPhase1,
  startPhase2: state.startPhase2,
});

export const ControlPanel: React.FC = () => {
  const {
    activeExpertCount,
    setActiveExpertCount,
    executionMode,
    setExecutionMode,
    taskDescription,
    setTaskDescription,
    isExecuting,
    executionPhase,
    startPhase1,
    startPhase2,
  } = useControlPanelStore(storeSelector);

  const [isExpanded, setIsExpanded] = React.useState(true);

  const experts = useExpertStore(state => state.experts);
  const activeExperts = experts.slice(0, activeExpertCount);

  const canStartPhase2 = useMemo(() => {
    return executionPhase === 'phase1-complete' || executionPhase === 'complete';
  }, [executionPhase]);

  // Handle auto-resize of textarea
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [taskDescription]);

  return (
    <div className="glass-panel border-border-default bg-bg-raised/80 overflow-hidden shadow-lg transition-all duration-300">
      {/* Animated progress bar */}
      {isExecuting && (
        <div className="h-0.5 w-full bg-bg-base overflow-hidden">
          <div className="h-full bg-primary-glow animate-shimmer" style={{ width: '100%' }} />
        </div>
      )}

      <div className="p-4 space-y-4">
        {/* Top Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-6">
            <div className="space-y-2">
               <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest flex items-center gap-1.5">
                  <Activity className="w-3 h-3" />
                  Fleet Mode
               </label>
               <ToggleGroup
                 type="single"
                 value={executionMode}
                 onValueChange={(val) => val && setExecutionMode(val as any)}
                 className="bg-bg-base p-1 rounded-lg border border-border-subtle"
               >
                 <ToggleGroupItem value="parallel" className="h-7 text-[10px] px-3 font-semibold data-[state=on]:bg-primary data-[state=on]:text-white">
                    Parallel
                 </ToggleGroupItem>
                 <ToggleGroupItem value="consensus" className="h-7 text-[10px] px-3 font-semibold data-[state=on]:bg-primary data-[state=on]:text-white">
                    Consensus
                 </ToggleGroupItem>
                 <ToggleGroupItem value="adversarial" className="h-7 text-[10px] px-3 font-semibold data-[state=on]:bg-primary data-[state=on]:text-white">
                    Adversary
                 </ToggleGroupItem>
                 <ToggleGroupItem value="sequential" className="h-7 text-[10px] px-3 font-semibold data-[state=on]:bg-primary data-[state=on]:text-white">
                    Sequential
                 </ToggleGroupItem>
               </ToggleGroup>
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest flex items-center gap-1.5">
                  <Cpu className="w-3 h-3" />
                  Expert Count
               </label>
               <ToggleGroup
                 type="single"
                 value={activeExpertCount.toString()}
                 onValueChange={(val) => val && setActiveExpertCount(parseInt(val))}
                 className="bg-bg-base p-1 rounded-lg border border-border-subtle"
               >
                 {[1, 3, 5, 7].map(n => (
                   <ToggleGroupItem key={n} value={n.toString()} className="h-7 w-8 text-[10px] font-bold data-[state=on]:bg-bg-elevated data-[state=on]:text-primary-glow data-[state=on]:border-primary/20">
                      {n}
                   </ToggleGroupItem>
                 ))}
               </ToggleGroup>
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest flex items-center gap-1.5">
                  <Layers className="w-3 h-3" />
                  Synthesis Tier
               </label>
               <Badge variant="outline" className="h-9 px-3 bg-bg-base border-border-subtle text-text-primary text-[10px] font-semibold flex items-center gap-2">
                  <ShieldCheck className="w-3 h-3 text-accent-emerald" />
                  Deep Multi-Perspective
               </Badge>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-text-tertiary hover:text-text-primary"
          >
            {isExpanded ? (
              <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest">
                Collapse <ChevronUp className="w-3.5 h-3.5" />
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest">
                Expand <ChevronDown className="w-3.5 h-3.5" />
              </span>
            )}
          </Button>
        </div>

        {isExpanded && (
          <div className="space-y-4 pt-2 animate-fade-in border-t border-border-subtle">
            <div className="relative group">
               <label className="absolute left-3 -top-2 px-1.5 bg-bg-raised text-[9px] font-bold text-primary-glow uppercase tracking-widest z-10">
                  Target Objective
               </label>
               <Textarea
                 ref={textareaRef}
                 value={taskDescription}
                 onChange={(e) => setTaskDescription(e.target.value)}
                 placeholder="Define the problem, research goal, or decision to analyze..."
                 className="min-h-[80px] bg-bg-base border-border-subtle focus-visible:ring-1 focus-visible:ring-primary/40 text-sm leading-relaxed text-text-secondary pt-4 rounded-xl group-hover:border-border-default transition-colors resize-none overflow-hidden"
               />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
               <div className="flex flex-wrap items-center gap-3">
                  <Button
                    onClick={startPhase1}
                    disabled={isExecuting || !taskDescription.trim()}
                    className="h-11 px-6 bg-primary hover:bg-primary-glow text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
                    aria-label="Start Phase 1: Gather expert intelligence"
                    aria-busy={isExecuting && executionPhase === 'phase1-experts'}
                  >
                    {isExecuting && executionPhase === 'phase1-experts' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Zap className="w-4 h-4" />
                    )}
                    Phase 1: Gather Intelligence
                  </Button>

                  <div className="flex items-center gap-2">
                    <ArrowRightLeft className="w-4 h-4 text-text-disabled" />
                    <Button
                      onClick={startPhase2}
                      disabled={isExecuting || !canStartPhase2}
                      variant="outline"
                      className={`h-11 px-6 font-bold rounded-xl flex items-center gap-2 border-border-subtle ${
                        canStartPhase2 ? 'bg-bg-elevated text-primary-glow border-primary/20 hover:bg-bg-overlay' : 'text-text-disabled opacity-50'
                      }`}
                      aria-label="Start Phase 2: Synthesize expert outputs"
                      title={!canStartPhase2 ? "Complete Phase 1 first to unlock synthesis" : ""}
                    >
                      {isExecuting && executionPhase === 'phase2-synthesis' ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <ShieldCheck className="w-4 h-4" />
                      )}
                      Phase 2: Final Synthesis
                    </Button>
                  </div>
               </div>

               <div className="flex items-center gap-4 bg-bg-base/50 px-4 py-2.5 rounded-xl border border-border-subtle">
                  <div className="flex flex-col">
                     <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest flex items-center gap-1">
                        <Coins className="w-3 h-3 text-accent-amber" />
                        Est. Cost
                     </span>
                     <span className="text-sm font-mono text-text-primary font-semibold">
                        ~$0.003
                     </span>
                  </div>
                  <div className="w-px h-8 bg-border-subtle" />
                  <div className="flex flex-col">
                     <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">
                        Context
                     </span>
                     <span className="text-sm font-mono text-text-primary font-semibold">
                        {activeExperts.length} Experts
                     </span>
                  </div>
                  {executionPhase === 'idle' && (
                     <Badge variant="outline" className="ml-2 border-accent-rose/20 bg-accent-rose/10 text-accent-rose animate-pulse flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Ready
                     </Badge>
                  )}
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Loader2: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

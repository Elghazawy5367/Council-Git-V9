import React, { useState, useCallback, lazy, Suspense } from 'react';
import { useExpertStore } from '@/features/council/store/expert-store';
import { useControlPanelStore } from '@/features/council/store/control-panel-store';
import { KnowledgeFile, Expert } from '@/lib/types';
import { pluginManager } from '@/lib/plugin-manager';
import { SafeMarkdown } from '@/components/primitives/SafeMarkdown';
import { MAGNIFICENT_7_FLEET } from '@/lib/config';
import { EXPERT_POSITIONS, PERSONA_LIBRARY } from '@/features/council/lib/persona-library';
import { Card, CardContent, CardHeader } from '@/components/primitives/card';
import { Button } from '@/components/primitives/button';
import { Slider } from '@/components/primitives/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/primitives/select';
import { Textarea } from '@/components/primitives/textarea';
import { Badge } from '@/components/primitives/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/primitives/collapsible';
import {
  Brain,
  Cpu,
  Target,
  Heart,
  AlertTriangle,
  Pencil,
  Upload,
  FileText,
  ChevronDown,
  ChevronUp,
  Settings2,
  Loader2,
  X,
  Maximize2,
  RotateCcw,
  Sparkles,
  Globe,
  Clock,
  DollarSign,
  Activity
} from 'lucide-react';
import { toast } from 'sonner';
import { ExpertOutputFooter } from './ExpertOutputFooter';

// Lazy load the expanded modal
const ExpertExpandedModal = lazy(() => import('./ExpertExpandedModal'));

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Brain,
  Cpu,
  Target,
  Heart,
  AlertTriangle,
};

// Deterministic gradient based on string hash
const generateGradient = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c1 = (hash & 0x00FFFFFF).toString(16).toUpperCase();
  const c2 = ((hash >> 1) & 0x00FFFFFF).toString(16).toUpperCase();
  return `linear-gradient(135deg, #${c1.padStart(6, '0')}, #${c2.padStart(6, '0')})`;
};

interface ExpertCardProps {
  index: number;
}

export const ExpertCard: React.FC<ExpertCardProps> = ({ index }) => {
  const expert = useExpertStore(state => state.experts[index]);
  const updateExpert = useExpertStore(state => state.updateExpert);
  const addKnowledge = useExpertStore(state => state.addKnowledge);
  const removeKnowledge = useExpertStore(state => state.removeKnowledge);
  const activeExpertCount = useControlPanelStore(state => state.activeExpertCount);
  const clearPersona = useControlPanelStore(state => state.clearPersona);
  const isActive = index < activeExpertCount;

  const [isConfigOpen, setIsConfigOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedPersona, setEditedPersona] = useState<string | undefined>();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  React.useEffect(() => {
    if (expert?.basePersona !== editedPersona) {
      setEditedPersona(expert?.basePersona);
    }
  }, [expert?.basePersona, editedPersona]);

  const handleRetry = useCallback(() => {
    toast.info(`Retrying ${expert?.name}...`);
  }, [expert?.name]);

  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files) return;

      const newKnowledge: KnowledgeFile[] = [];

      for (const file of Array.from(files)) {
        try {
          const content = await file.text();
          newKnowledge.push({
            id: `kb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: file.name,
            content,
            size: `${(file.size / 1024).toFixed(2)} KB`,
            type: file.type || 'text/plain',
          });
        } catch (error) {
          toast.error(`Failed to read ${file.name}`);
        }
      }

      if (newKnowledge.length > 0) {
        addKnowledge(index, newKnowledge);
        toast.success(`Added ${newKnowledge.length} file(s) to knowledge base`);
      }

      event.target.value = '';
    },
    [index, addKnowledge]
  );

  const handleModelChange = (modelId: string) => {
    updateExpert(index, { ...expert, model: modelId });
  };

  const handleConfigChange = (key: keyof Expert['config'], value: number) => {
    updateExpert(index, {
      ...expert,
      config: { ...expert.config, [key]: value },
    });
  };

  const handleSavePersona = () => {
    updateExpert(index, { ...expert, basePersona: editedPersona });
    setIsEditing(false);
    toast.success('Persona updated');
  };

  if (!expert) {
    return (
      <Card className="glass-panel h-96 flex items-center justify-center bg-bg-raised border-border-subtle">
        <div className="text-text-tertiary text-sm flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading expert...
        </div>
      </Card>
    );
  }

  const IconComponent = ICON_MAP[expert.icon] || Brain;
  const selectedModel = MAGNIFICENT_7_FLEET.find((m) => m.id === expert.model);
  
  const positionInfo = EXPERT_POSITIONS[index] || EXPERT_POSITIONS[0];
  const positionName = expert.positionName || positionInfo.position;
  
  const loadedPersona = expert.personaId ? PERSONA_LIBRARY[expert.personaId] : null;

  const handleClearPersonaClick = () => {
    clearPersona(index);
    toast.success(`${positionName} reset to default`);
  };

  return (
    <>
      <Card
        className={`glass-panel transition-all duration-300 flex flex-col h-full bg-bg-raised border-border-default hover:border-border-strong ${
          isActive ? 'ring-1 ring-primary/40' : 'opacity-60'
        } ${expert.isLoading ? 'animate-shimmer border-primary/40' : ''}`}
        role="article"
        aria-label={`Expert: ${positionName}${loadedPersona ? ` - ${loadedPersona.name}` : ''}`}
      >
        <CardHeader className="pb-3 flex-shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 relative"
                style={{ background: generateGradient(positionName) }}
              >
                <IconComponent className="w-6 h-6 text-white" />
                {expert.hasWebSearch && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent-cyan rounded-full flex items-center justify-center border-2 border-bg-raised">
                    <Globe className="w-2 h-2 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                   <h3 className="font-bold text-text-primary text-sm truncate">{positionName}</h3>
                   <Badge
                     variant={expert.isLoading ? 'default' : 'outline'}
                     className={`text-[9px] px-1.5 py-0 h-4 border-none flex items-center gap-1 ${
                       expert.isLoading ? 'bg-primary/20 text-primary-glow animate-pulse' : 'bg-bg-elevated text-text-tertiary'
                     }`}
                     aria-live="polite"
                   >
                     {expert.isLoading ? (
                        <>● Active</>
                     ) : (
                        <>○ Idle</>
                     )}
                   </Badge>
                </div>
                {loadedPersona ? (
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-primary text-xs font-semibold truncate">
                      {loadedPersona.icon} {loadedPersona.name}
                    </span>
                  </div>
                ) : (
                  <p className="text-xs text-text-secondary truncate mt-0.5">
                    {positionInfo.specialty}
                  </p>
                )}
                <p className="text-[10px] text-text-tertiary truncate mt-0.5">
                  {selectedModel?.name || 'Unknown Model'}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <div className="flex items-center gap-1">
                {expert.output && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-bg-elevated text-text-tertiary hover:text-text-primary"
                    onClick={() => setIsExpanded(true)}
                    title="Expand output"
                    aria-label={`Expand ${positionName} output`}
                  >
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-bg-elevated text-text-tertiary hover:text-text-primary"
                  onClick={() => setIsEditing(!isEditing)}
                  title="Edit persona"
                  aria-label={`Edit ${positionName} persona`}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
              {loadedPersona && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-[10px] text-text-tertiary hover:text-error"
                  onClick={handleClearPersonaClick}
                  title="Reset to default"
                  aria-label={`Reset ${positionName} persona to default`}
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Reset
                </Button>
              )}
            </div>
          </div>

          <Select value={expert.model} onValueChange={handleModelChange}>
            <SelectTrigger className="mt-3 h-9 bg-bg-base border-border-subtle text-xs hover:border-border-default focus:ring-1 focus:ring-primary/40" aria-label={`Select AI model for ${positionName}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-bg-overlay border-border-default">
              {MAGNIFICENT_7_FLEET.map((model) => (
                <SelectItem key={model.id} value={model.id} className="focus:bg-bg-elevated">
                  <div className="flex flex-col items-start py-1">
                    <span className="font-semibold text-xs text-text-primary">{model.name}</span>
                    <span className="text-[10px] text-text-tertiary">{model.specialty}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col space-y-4 overflow-hidden pt-0">
          <div className="space-y-2 flex-shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">
                Knowledge
              </span>
              <label className="cursor-pointer">
                <input
                  type="file"
                  multiple
                  accept=".txt,.md,.json,.pdf,.docx"
                  className="hidden"
                  onChange={handleFileUpload}
                  aria-label={`Upload knowledge files for ${positionName}`}
                />
                <Button variant="ghost" size="sm" className="h-7 px-2 text-[10px] bg-bg-base hover:bg-bg-elevated border border-border-subtle" asChild>
                  <span>
                    <Upload className="h-3 w-3 mr-1.5" />
                    Inject
                  </span>
                </Button>
              </label>
            </div>

            {expert.knowledge.length > 0 ? (
              <div className="space-y-1.5 max-h-20 overflow-y-auto pr-1">
                {expert.knowledge.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg bg-bg-base border border-border-subtle text-[10px] group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="h-3.5 w-3.5 text-accent-cyan shrink-0" />
                      <span className="truncate text-text-secondary">{file.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-error/20 hover:text-error"
                      onClick={() => removeKnowledge(index, file.id)}
                      aria-label={`Remove ${file.name}`}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-10 border border-dashed border-border-subtle rounded-lg flex items-center justify-center">
                 <p className="text-[10px] text-text-disabled italic">No context files provided</p>
              </div>
            )}
          </div>

            <Collapsible open={isConfigOpen} onOpenChange={setIsConfigOpen} className="flex-shrink-0">
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-between h-8 px-2 bg-bg-base/50 hover:bg-bg-elevated border border-border-subtle"
                >
                  <span className="flex items-center gap-2 text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                    <Settings2 className="h-3.5 w-3.5 text-text-tertiary" />
                    Parameters
                  </span>
                  {isConfigOpen ? (
                    <ChevronUp className="h-3.5 w-3.5 text-text-disabled" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5 text-text-disabled" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 pt-3 pb-1">
                {expert.pluginId && pluginManager.getExpertPlugin(expert.pluginId) ? (
                  pluginManager.getExpertPlugin(expert.pluginId)?.renderConfig(expert.pluginConfig || {}, (newCfg) => {
                    updateExpert(index, { ...expert, pluginConfig: newCfg });
                  })
                ) : (
                  <>
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-medium">
                        <span className="text-text-tertiary">Temperature</span>
                        <span className="text-text-primary font-mono">{expert.config.temperature.toFixed(2)}</span>
                      </div>
                      <Slider
                        value={[expert.config.temperature]}
                        onValueChange={([value]) => handleConfigChange('temperature', value)}
                        min={0}
                        max={2}
                        step={0.1}
                        className="cursor-pointer"
                        aria-label="Temperature control"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-medium">
                        <span className="text-text-tertiary">Max Tokens</span>
                        <span className="text-text-primary font-mono">{expert.config.maxTokens}</span>
                      </div>
                      <Slider
                        value={[expert.config.maxTokens]}
                        onValueChange={([value]) => handleConfigChange('maxTokens', value)}
                        min={1000}
                        max={8000}
                        step={500}
                        className="cursor-pointer"
                        aria-label="Max tokens control"
                      />
                    </div>
                  </>
                )}
              </CollapsibleContent>
            </Collapsible>

          {isEditing && (
            <div className="space-y-3 pt-3 border-t border-border-subtle flex-shrink-0">
              <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">Base Persona</label>
              <Textarea
                value={editedPersona}
                onChange={(e) => setEditedPersona(e.target.value)}
                className="min-h-[100px] text-xs bg-bg-base border-border-subtle resize-none focus-visible:ring-1 focus-visible:ring-primary/40"
              />
              <div className="flex gap-2">
                <Button size="sm" className="flex-1 h-8 text-xs bg-primary hover:bg-primary-glow text-white border-none" onClick={handleSavePersona}>
                  Update Persona
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs border-border-subtle hover:bg-bg-elevated"
                  onClick={() => {
                    setEditedPersona(expert.basePersona);
                    setIsEditing(false);
                  }}
                >
                  Discard
                </Button>
              </div>
            </div>
          )}

          <div className="flex-1 min-h-0 flex flex-col pt-3 border-t border-border-subtle">
            {expert.output && (
              <div className="flex-1 min-h-0 flex flex-col space-y-2">
                <div className="flex items-center justify-between flex-shrink-0">
                  <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">
                    Expert Intelligence
                  </span>
                  {expert.isLoading && <Loader2 className="h-3 w-3 animate-spin text-primary-glow" />}
                </div>
                <div className="flex-1 min-h-0 overflow-y-auto rounded-xl bg-bg-base/80 border border-border-subtle p-3 hover:border-border-default transition-colors">
                  <SafeMarkdown content={expert.output} className="text-xs text-text-secondary leading-relaxed" />
                </div>

                {/* Performance Row */}
                <div className="flex items-center gap-3 pt-1 text-[9px] text-text-disabled font-medium">
                    <span className="flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" /> 1.2s
                    </span>
                    <span className="flex items-center gap-1">
                        <DollarSign className="w-2.5 h-2.5" /> $0.0042
                    </span>
                    <span className="flex items-center gap-1">
                        <Activity className="w-2.5 h-2.5" /> 847 tkn
                    </span>
                </div>
              </div>
            )}

            {expert.isLoading && !expert.output && (
              <div className="flex-1 flex flex-col items-center justify-center py-8 space-y-4">
                 <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
                    <Loader2 className="h-8 w-8 animate-spin text-primary relative z-10" />
                 </div>
                 <div className="text-center space-y-1">
                    <p className="text-xs font-bold text-text-primary uppercase tracking-widest">Generating Insight</p>
                    <p className="text-[10px] text-text-tertiary">Synthesizing domain knowledge...</p>
                 </div>
              </div>
            )}
          </div>

          {expert.output && (
            <div className="pt-2">
                <ExpertOutputFooter
                expert={{
                    ...expert,
                    content: expert.content || expert.output || 'No content available',
                }}
                />
            </div>
          )}
        </CardContent>
      </Card>

      <Suspense fallback={null}>
        <ExpertExpandedModal
          expert={expert}
          isOpen={isExpanded}
          onClose={() => setIsExpanded(false)}
          onRetry={handleRetry}
        />
      </Suspense>
    </>
  );
};

export default React.memo(ExpertCard);

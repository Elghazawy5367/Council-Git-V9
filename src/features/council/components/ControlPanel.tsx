import React, { useRef } from 'react';
import { useControlPanelStore } from '@/features/council/store/control-panel-store';
import { useExecutionStore } from '@/features/council/store/execution-store';
import { useSettingsStore } from '@/features/settings/store/settings-store';
import { useShallow } from 'zustand/react/shallow';
import { MODE_DESCRIPTIONS } from '@/lib/config';
import { ExecutionMode, SynthesisConfig } from '@/features/council/lib/types';
import { Card, CardContent } from '@/components/primitives/card';
import { Button } from '@/components/primitives/button';
import { Textarea } from '@/components/primitives/textarea';
import { Slider } from '@/components/primitives/slider';
import { Badge } from '@/components/primitives/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/primitives/tabs';
import { useExecuteSynthesis } from '@/features/council/hooks/use-council-queries';
import {
  Settings,
  Upload,
  FileText,
  X,
  Layers,
  GitMerge,
  Swords,
  Workflow,
  Loader2,
  Play,
  Target,
  MessageSquare,
} from 'lucide-react';
import { toast } from 'sonner';
import { PersonaSelector } from './PersonaSelector';

const MODE_ICONS: Record<ExecutionMode, React.ComponentType<{ className?: string }>> = {
  parallel: Layers,
  consensus: GitMerge,
  adversarial: Swords,
  sequential: Workflow,
};

import { FeatureConfigModal } from './FeatureConfigModal';

export const ControlPanel: React.FC = () => {
  const [isConfigOpen, setIsConfigOpen] = React.useState(false);
  const [selectedFeatureTab, setSelectedFeatureTab] = React.useState<string | null>(null);

  const handleOpenConfig = (tab?: string) => {
    setSelectedFeatureTab(tab || null);
    setIsConfigOpen(true);
  };

  const {
    task,
    setTask,
    mode,
    setMode,
    activeExpertCount,
    setActiveExpertCount,
    debateRounds,
    setDebateRounds,
    fileData,
    setFileData,
  } = useControlPanelStore(useShallow((state) => ({
    task: state.task,
    setTask: state.setTask,
    mode: state.mode,
    setMode: state.setMode,
    activeExpertCount: state.activeExpertCount,
    setActiveExpertCount: state.setActiveExpertCount,
    debateRounds: state.debateRounds,
    setDebateRounds: state.setDebateRounds,
    fileData: state.fileData,
    setFileData: state.setFileData,
  })));

  const { isLoading, statusMessage } = useExecutionStore(useShallow((state) => ({ isLoading: state.isLoading, statusMessage: state.statusMessage })));
  const { vaultStatus, setShowSettings } = useSettingsStore(useShallow((state) => ({ vaultStatus: state.vaultStatus, setShowSettings: state.setShowSettings })));
  const synthesisMutation = useExecuteSynthesis();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const content = await file.text();
      setFileData({
        name: file.name,
        content,
        size: `${(file.size / 1024).toFixed(2)} KB`,
      });
      toast.success(`File "${file.name}" loaded`);
    } catch (error) {
      toast.error('Failed to read file');
    }

    event.target.value = '';
  };

  const handleFileRemove = () => {
    setFileData(null);
    toast.info('File context removed');
  };

  const handleExecuteClick = () => {
    if (vaultStatus.isLocked) {
      setShowSettings(true);
      toast.error('Please unlock the vault first');
      return;
    }
    if (!task.trim()) {
      toast.error('Please enter a task');
      return;
    }

    const defaultConfig: SynthesisConfig = {
      tier: 'quick',
      model: 'default-model',
      fallbackModel: 'fallback-model',
      temperature: 0.7,
      maxTokens: 1000,
      customInstructions: 'Default instructions', // Added missing property
    };

    synthesisMutation.mutate({
      task,
      config: synthesisMutation.variables?.config || defaultConfig,
      apiKey: synthesisMutation.variables?.apiKey || '',
      onProgress: synthesisMutation.variables?.onProgress || (() => {}),
    });
  };

  return (
    <Card className="glass-panel-elevated">
      <CardContent className="p-6 space-y-6">
        <PersonaSelector />

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Task / Question</label>
          <Textarea
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Describe the task or question you want the Council to analyze..."
            className="min-h-[120px] bg-muted/50 border-border/50 resize-none focus:ring-primary/50"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">Execution Mode</label>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
              onClick={() => handleOpenConfig()}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
          <Tabs value={mode} onValueChange={(v) => setMode(v as ExecutionMode)}>
            <TabsList className="grid grid-cols-4 w-full bg-muted/50 p-1">
              {(Object.keys(MODE_DESCRIPTIONS) as ExecutionMode[]).map((modeKey) => {
                const IconComponent = MODE_ICONS[modeKey];
                return (
                  <TabsTrigger
                    key={modeKey}
                    value={modeKey}
                    className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-primary-foreground"
                  >
                    <IconComponent className="h-4 w-4" />
                    <span className="hidden sm:inline">{MODE_DESCRIPTIONS[modeKey].name}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
          <p className="text-xs text-muted-foreground">{MODE_DESCRIPTIONS[mode].description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-foreground">Active Experts</label>
              <Badge variant="secondary" className="font-mono">{activeExpertCount}</Badge>
            </div>
            <Slider
              value={[activeExpertCount]}
              onValueChange={([value]) => setActiveExpertCount(value)}
              min={1}
              max={5}
              step={1}
              className="slider-council"
            />
            <div className="flex justify-between text-xs text-muted-foreground"><span>1</span><span>5</span></div>
          </div>

          {mode === 'adversarial' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-foreground">Debate Rounds</label>
                <Badge variant="secondary" className="font-mono">{debateRounds}</Badge>
              </div>
              <Slider
                value={[debateRounds]}
                onValueChange={([value]) => setDebateRounds(value)}
                min={1}
                max={5}
                step={1}
                className="slider-council"
              />
              <div className="flex justify-between text-xs text-muted-foreground"><span>1</span><span>5</span></div>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">File Context (Optional)</label>
          <input ref={fileInputRef} type="file" accept=".txt,.md,.json,.pdf,.docx,.csv" className="hidden" onChange={handleFileUpload} />
          {fileData ? (
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">{fileData.name}</p>
                  <p className="text-xs text-muted-foreground">{fileData.size}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleFileRemove}><X className="h-4 w-4" /></Button>
            </div>
          ) : (
            <Button variant="outline" className="w-full h-12 border-dashed border-2 hover:border-primary/50 hover:bg-primary/5" onClick={() => fileInputRef.current?.click()}>
              <Upload className="h-4 w-4 mr-2" />
              Upload context file
            </Button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2 border-red-500/20 hover:bg-red-500/10 text-xs"
            onClick={() => handleOpenConfig('reddit-sniper')}
          >
            <Target className="h-3.5 w-3.5 text-red-500" />
            Reddit Sniper
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2 border-orange-500/20 hover:bg-orange-500/10 text-xs"
            onClick={() => handleOpenConfig('reddit-pain-points')}
          >
            <MessageSquare className="h-3.5 w-3.5 text-orange-500" />
            Reddit Pain
          </Button>
        </div>

        <Button className="w-full h-14 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground font-semibold text-lg shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30" onClick={handleExecuteClick} disabled={isLoading || !task.trim()}>
          {isLoading ? (
            <><Loader2 className="h-5 w-5 mr-2 animate-spin" />{statusMessage || 'Processing...'}</>
          ) : (
            <><Play className="h-5 w-5 mr-2" />Execute Council</>
          )}
        </Button>

        <FeatureConfigModal 
          isOpen={isConfigOpen} 
          onClose={() => setIsConfigOpen(false)} 
          initialTab={selectedFeatureTab}
        />

        {isLoading && statusMessage && (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
            {statusMessage}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ControlPanel;

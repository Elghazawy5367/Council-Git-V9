import { create } from 'zustand';
import { toast } from 'sonner';
import { SynthesisResult, SynthesisConfig } from '@/features/council/lib/types';
import { useControlPanelStore } from './control-panel-store';
import { useExpertStore } from './expert-store';
import { useSettingsStore } from '@/features/settings/store/settings-store';
import { callExpertStreaming } from '@/features/council/api/ai-client';
import { SYNTHESIS_TIERS } from '@/lib/synthesis-engine';
import { saveSession } from '@/features/council/lib/session-history';
import { UseMutationResult } from '@tanstack/react-query';

interface ExpertOutput {
  name: string;
  model: string;
  content: string;
}

interface CostBreakdown {
  experts: number;
  synthesis: number;
  total: number;
}

interface ExecutionState {
  isLoading: boolean;
  isSynthesizing: boolean;
  statusMessage: string;
  cost: CostBreakdown;
  outputs: Record<string, string>;
  synthesisResult: SynthesisResult | null;
  verdict: string;
  executeCouncil: (synthesisMutation: UseMutationResult<SynthesisResult, Error, { expertOutputs: ExpertOutput[]; task: string; config: SynthesisConfig; apiKey: string; onProgress: (message: string) => void; }, unknown>) => Promise<void>;
  reset: () => void;
}

export const useExecutionStore = create<ExecutionState>((set) => ({
  isLoading: false,
  isSynthesizing: false,
  statusMessage: '',
  cost: { experts: 0, synthesis: 0, total: 0 },
  outputs: {},
  synthesisResult: null,
  verdict: '',

  executeCouncil: async (synthesisMutation) => {
    const { task, mode, activeExpertCount } = useControlPanelStore.getState();
    const { experts, updateExpert } = useExpertStore.getState();
    const { openRouterKey } = useSettingsStore.getState();

    if (!openRouterKey) {
      toast.error('Vault Locked', {
        action: { label: 'Unlock', onClick: () => useSettingsStore.getState().setShowSettings(true) },
      });
      return;
    }
    if (!task.trim()) {
      toast.error('Task is empty');
      return;
    }

    set({ 
      isLoading: true, 
      outputs: {}, 
      synthesisResult: null, 
      verdict: '', 
      cost: { experts: 0, synthesis: 0, total: 0 },
      statusMessage: 'Initializing Council...' 
    });

    const activeExperts = experts.slice(0, activeExpertCount);
    const collectedOutputs: Record<string, { expertName: string; output: string; model: string }> = {};
    let expertsCost = 0;

    for (let i = 0; i < activeExperts.length; i++) {
      const expert = activeExperts[i];
      set({ statusMessage: `${expert.name} is analyzing...` });
      updateExpert(i, { ...expert, isLoading: true, output: '' });

      const previousOutputs = mode === 'pipeline' || mode === 'debate' ? Object.fromEntries(Object.entries(collectedOutputs).map(([id, data]) => [id, data.output])) : undefined;

      try {
        const result = await callExpertStreaming(
          expert,
          task,
          mode,
          openRouterKey,
          {
            onToken: (token) => {
              const currentExpert = useExpertStore.getState().experts[i];
              updateExpert(i, { ...currentExpert, output: currentExpert.output + token });
              set(state => ({ outputs: { ...state.outputs, [expert.id]: (state.outputs[expert.id] || '') + token }}));
            },
            onComplete: (fullText) => {
              collectedOutputs[expert.id] = { expertName: expert.name, output: fullText, model: expert.model };
            },
            onError: (error) => {
              toast.error(`${expert.name} Failed`, { description: error.message });
            },
          },
          undefined,
          previousOutputs
        );
        expertsCost += result.cost;
        set(state => ({ cost: { ...state.cost, experts: expertsCost, total: expertsCost + state.cost.synthesis }}));
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        const errorOutput = `⚠️ Error: ${errorMessage}`;
        set(state => ({ outputs: { ...state.outputs, [expert.id]: errorOutput }}));
        collectedOutputs[expert.id] = { expertName: expert.name, output: errorOutput, model: expert.model };
      }

      updateExpert(i, { ...useExpertStore.getState().experts[i], isLoading: false });
    }

    if (Object.keys(collectedOutputs).length > 0) {
      set({ isSynthesizing: true });
      const synthesisConfig = useSettingsStore.getState().synthesisConfig;
      const tierConfig = SYNTHESIS_TIERS[synthesisConfig.tier];
      set({ statusMessage: `${tierConfig.icon} Running ${tierConfig.name}...`});

      const expertOutputsForSynthesis = Object.values(collectedOutputs).map((data) => ({
        name: data.expertName,
        model: data.model,
        content: data.output,
      }));

      synthesisMutation.mutate(
        {
          expertOutputs: expertOutputsForSynthesis,
          task,
          config: synthesisConfig,
          apiKey: openRouterKey,
          onProgress: (message) => set({ statusMessage: message }),
        },
        {
          onSuccess: (result) => {
            set({ synthesisResult: result, verdict: result.content });
            const newSynthesisCost = result.cost;
            set(state => ({
              cost: { experts: expertsCost, synthesis: newSynthesisCost, total: expertsCost + newSynthesisCost },
            }));
            saveSession({
              task,
              mode,
              activeExpertCount,
              experts: activeExperts.map((e) => ({ id: e.id, name: e.name, model: e.model })),
              outputs: Object.fromEntries(Object.entries(collectedOutputs).map(([id, data]) => [id, data.output])),
              verdict: result.content,
              synthesisConfig,
              cost: { experts: expertsCost, synthesis: newSynthesisCost, total: expertsCost + newSynthesisCost },
            });
            set({ isSynthesizing: false });
            toast.success('Council analysis complete!');
          },
          onError: (error) => {
            toast.error('Synthesis Failed', { description: error.message });
            const fallbackVerdict = 'Synthesis failed. Please review the expert outputs manually.';
            set({ verdict: fallbackVerdict, synthesisResult: { content: fallbackVerdict, tier: synthesisConfig.tier, model: 'fallback', tokens: { prompt: 0, completion: 0 }, cost: 0 }, isSynthesizing: false });
          },
        }
      );
    }

    set({ isLoading: false, statusMessage: '' });
  },

  reset: () => {
    set({
      isLoading: false,
      isSynthesizing: false,
      statusMessage: '',
      cost: { experts: 0, synthesis: 0, total: 0 },
      outputs: {},
      synthesisResult: null,
      verdict: '',
    });
  },
}));

import { create } from 'zustand';
import { toast } from 'sonner';
import { SynthesisResult, SynthesisConfig } from '@/features/council/lib/types';
import { callExpertStreaming } from '@/features/council/api/ai-client';
// import { SYNTHESIS_TIERS } from '@/lib/synthesis-engine'; // Unused import commented out
import { saveSession } from '@/features/council/lib/session-history';
import { UseMutationResult } from '@tanstack/react-query';

// Async imports to break circular dependencies
const getControlPanelStore = () => import('./control-panel-store').then(mod => mod.useControlPanelStore);
const getExpertStore = () => import('./expert-store').then(mod => mod.useExpertStore);
const getSettingsStore = () => import('@/features/settings/store/settings-store').then(mod => mod.useSettingsStore);

export interface ExpertOutput {
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
  status: string;
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
  status: '',

  executeCouncil: async (synthesisMutation) => {
    // Use async imports to prevent circular dependencies
    try {
      const controlPanelStore = await getControlPanelStore();
      const expertStore = await getExpertStore();
      const settingsStore = await getSettingsStore();
      
      const { task, mode, activeExpertCount } = controlPanelStore.getState();
      const { experts, updateExpert } = expertStore.getState();
      const { openRouterKey } = settingsStore.getState();

      if (!openRouterKey) {
        toast.error('Vault Locked', {
          action: { label: 'Unlock', onClick: () => settingsStore.getState().setShowSettings(true) },
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
        
        // Use async store updates to prevent render loops
        requestAnimationFrame(() => {
          updateExpert(i, { ...expert, isLoading: true, output: '' });
        });

        const previousOutputs = mode === 'sequential' || mode === 'adversarial' ? Object.fromEntries(Object.entries(collectedOutputs).map(([id, data]) => [id, data.output])) : undefined;

        try {
          // Capture the content from streaming callbacks
          let finalContent = '';
          
          const result = await callExpertStreaming(
            expert,
            task,
            mode,
            openRouterKey,
            {
              onToken: (token) => {
                // CRITICAL: Never use requestAnimationFrame in streaming callbacks
                // This causes infinite loops when combined with state updates
                // Use microtask queue (Promise) for non-blocking updates instead
                Promise.resolve().then(() => {
                  getExpertStore().then(useExpertStoreHook => {
                    const state = useExpertStoreHook.getState();
                    const currentExpert = state.experts[i];
                    if (currentExpert) {
                      state.updateExpert(i, { ...currentExpert, output: (currentExpert.output || '') + token });
                    }
                  }).catch(err => console.error('Error updating expert on token:', err));
                });
              },
              onComplete: (fullText) => {
                finalContent = fullText;
              },
              onError: (error) => {
                console.error(`Streaming error for expert ${expert.name}:`, error);
              }
            },
            undefined, // additionalContext
            previousOutputs // previousOutputs
          );

          collectedOutputs[expert.id] = { expertName: expert.name, output: finalContent, model: expert.model };
          expertsCost += result.cost;
          
          // Update expert with final result - use synchronous store update
          getExpertStore().then(useExpertStoreHook => {
            const state = useExpertStoreHook.getState();
            const updatedExpert = state.experts[i];
            if (updatedExpert) {
              state.updateExpert(i, { ...updatedExpert, output: finalContent, isLoading: false });
            }
          }).catch(err => console.error('Error updating expert final output:', err));

          set((state) => ({
            outputs: { ...state.outputs, [expert.id]: finalContent },
            cost: { ...state.cost, experts: expertsCost, total: expertsCost + state.cost.synthesis },
          }));
        } catch (error) {
          console.error(`Error with expert ${expert.name}:`, error);
          
          // Update expert error state - avoid requestAnimationFrame to prevent infinite loops
          getExpertStore().then(useExpertStoreHook => {
            const state = useExpertStoreHook.getState();
            const failedExpert = state.experts[i];
            if (failedExpert) {
              state.updateExpert(i, { ...failedExpert, output: 'Failed to generate output.', isLoading: false });
            }
          }).catch(err => console.error('Error updating expert on failure:', err));

          set((state) => ({
            outputs: { ...state.outputs, [expert.id]: 'Failed to generate output.' },
          }));
        }
      }

      // Synthesis phase
      const { synthesisConfig } = settingsStore.getState();
      
      set({ statusMessage: 'Synthesizing insights...', isSynthesizing: true });
      
      synthesisMutation.mutate(
        {
          expertOutputs: Object.values(collectedOutputs).map(data => ({
            name: data.expertName,
            model: data.model,
            content: data.output,
          })),
          task,
          config: synthesisConfig,
          apiKey: openRouterKey,
          onProgress: (message: string) => {
            set({ statusMessage: message });
          },
        },
        {
          onSuccess: (result) => {
            const newSynthesisCost = result.cost;
            set({ 
              synthesisResult: result, 
              verdict: result.content,
              statusMessage: 'Analysis complete'
            });
            set(() => ({
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

      set({ isLoading: false, statusMessage: '' });
    } catch (error) {
      console.error('ExecuteCouncil error:', error);
      set({ isLoading: false, statusMessage: '' });
      toast.error('Failed to execute council');
    }
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
      status: '',
    });
  },
}));
/**
 * Council Execution Slice
 * Manages execution logic, outputs, synthesis results
 */

import { StateCreator } from 'zustand';
import { toast } from 'sonner';
import { SynthesisResult, SynthesisConfig } from '@/features/council/lib/types';
import { UseMutationResult } from '@tanstack/react-query';
import * as councilService from '@/services/council.service';

export interface CouncilExecutionSlice {
  // Execution Results
  outputs: Record<string, string>;
  setOutputs: (outputs: Record<string, string>) => void;

  synthesisResult: SynthesisResult | null;
  setSynthesisResult: (result: SynthesisResult | null) => void;

  verdict: string;
  setVerdict: (verdict: string) => void;

  status: string;
  setStatus: (status: string) => void;

  // Execution Methods
  executePhase1: (
    getState: () => any,
    updateExpert: (index: number, update: any) => void,
    setExecutionPhase: (phase: any) => void,
    setIsLoading: (loading: boolean) => void,
    setStatusMessage: (message: string) => void,
    setCost: (cost: any) => void,
    setOutputs: (outputs: Record<string, string>) => void
  ) => Promise<void>;

  executePhase2: (
    synthesisMutation: UseMutationResult<SynthesisResult, Error, { expertOutputs: councilService.ExpertOutput[]; task: string; config: SynthesisConfig; apiKey: string; onProgress: (message: string) => void; }, unknown>,
    getState: () => any,
    setExecutionPhase: (phase: any) => void,
    setStatusMessage: (message: string) => void,
    setIsSynthesizing: (synthesizing: boolean) => void,
    setCost: (cost: any) => void
  ) => Promise<void>;

  executeCouncil: (
    synthesisMutation: UseMutationResult<SynthesisResult, Error, { expertOutputs: councilService.ExpertOutput[]; task: string; config: SynthesisConfig; apiKey: string; onProgress: (message: string) => void; }, unknown>,
    getState: () => any,
    updateExpert: (index: number, update: any) => void,
    setIsLoading: (loading: boolean) => void,
    setIsSynthesizing: (synthesizing: boolean) => void,
    setStatusMessage: (message: string) => void,
    setCost: (cost: any) => void,
    setOutputs: (outputs: Record<string, string>) => void
  ) => Promise<void>;

  reset: (resetUI: () => void) => void;
}

export const createCouncilExecutionSlice: StateCreator<
  CouncilExecutionSlice,
  [],
  [],
  CouncilExecutionSlice
> = (set) => ({
  // Initial State
  outputs: {},
  synthesisResult: null,
  verdict: '',
  status: '',

  // Actions
  setOutputs: (outputs) => set({ outputs }),
  setSynthesisResult: (result) => set({ synthesisResult: result }),
  setVerdict: (verdict) => set({ verdict }),
  setStatus: (status) => set({ status }),

  // Phase 1: Execute all experts in parallel
  executePhase1: async (
    getState,
    updateExpert,
    setExecutionPhase,
    setIsLoading,
    setStatusMessage,
    setCost,
    setOutputs
  ) => {
    const state = getState();

    // Import settings store dynamically
    const { useSettingsStore } = await import('@/features/settings/store/settings-store');
    const { openRouterKey, synthesisConfig } = useSettingsStore.getState();

    if (!openRouterKey) {
      toast.error('Vault Locked', {
        action: { label: 'Unlock', onClick: () => useSettingsStore.getState().setShowSettings(true) },
      });
      return;
    }
    if (!state.task.trim()) {
      toast.error('Task is empty');
      return;
    }

    setExecutionPhase('phase1-experts');
    setIsLoading(true);
    setOutputs({});
    set({ synthesisResult: null, verdict: '' });
    setCost({ experts: 0, synthesis: 0, total: 0 });
    setStatusMessage('Running Council - Phase 1: All experts analyzing in parallel...');

    const activeExperts = state.experts.slice(0, state.activeExpertCount);

    try {
      // Execute all experts in parallel (Phase 1)
      const result = await councilService.executeCouncilExperts(
        {
          task: state.task,
          mode: 'parallel', // Phase 1 is always parallel
          activeExperts,
          apiKey: openRouterKey,
          synthesisConfig,
        },
        (index, update) => {
          const currentExpert = getState().experts[index];
          if (currentExpert) {
            if (update.output !== undefined) {
              updateExpert(index, { 
                output: update.output === '' ? '' : (currentExpert.output || '') + update.output,
                isLoading: update.isLoading
              });
            } else if (update.isLoading !== undefined) {
              updateExpert(index, { isLoading: update.isLoading });
            }
          }
        },
        (message) => {
          setStatusMessage(message);
        }
      );

      setOutputs(Object.fromEntries(
        Object.entries(result.outputs).map(([id, data]) => [id, data.output])
      ));
      setCost({ experts: result.expertsCost, synthesis: 0, total: result.expertsCost });
      setExecutionPhase('phase1-complete');
      setIsLoading(false);
      setStatusMessage('Phase 1 Complete! All experts have responded. Select a judge mode and click "Run Judge" to synthesize.');

      toast.success('Phase 1 Complete! Ready for synthesis.');
    } catch (error) {
      console.error('ExecutePhase1 error:', error);
      setIsLoading(false);
      setExecutionPhase('idle');
      setStatusMessage('');
      toast.error('Failed to execute Phase 1');
    }
  },

  // Phase 2: Synthesize expert outputs with selected judge mode
  executePhase2: async (
    synthesisMutation,
    getState,
    setExecutionPhase,
    setStatusMessage,
    setIsSynthesizing,
    setCost
  ) => {
    const state = getState();
    
    if (state.executionPhase !== 'phase1-complete') {
      toast.error('Please run Phase 1 first (Run Council button)');
      return;
    }

    // Import settings store dynamically
    const { useSettingsStore } = await import('@/features/settings/store/settings-store');
    const { useDashboardStore } = await import('@/features/dashboard/store/dashboard-store');
    const { openRouterKey, synthesisConfig } = useSettingsStore.getState();
    
    const startTime = Date.now();

    setExecutionPhase('phase2-synthesis');
    setStatusMessage('Phase 2: Judge is synthesizing expert insights...');
    setIsSynthesizing(true);

    const activeExperts = state.experts.slice(0, state.activeExpertCount);

    // Convert outputs to expert outputs format
    const expertOutputs = Object.entries(state.outputs).map(([id, output]) => {
      const expert = activeExperts.find((e: any) => e.id === id);
      return {
        name: expert?.name || id,
        model: expert?.model || 'unknown',
        content: output,
      };
    });

    // Add judge mode to synthesis config
    const configWithJudge = {
      ...synthesisConfig,
      judgeMode: state.judgeMode,
      customInstructions: `${synthesisConfig.customInstructions || ''}\n\nJudge Mode: ${state.judgeMode}`,
    };

    synthesisMutation.mutate(
      {
        expertOutputs,
        task: state.task,
        config: configWithJudge,
        apiKey: openRouterKey,
        onProgress: (message: string) => {
          setStatusMessage(`Phase 2: ${message}`);
        },
      },
      {
        onSuccess: (synthesisResult) => {
          const newSynthesisCost = synthesisResult.cost || 0;
          const totalCost = councilService.calculateTotalCost(state.cost.experts, newSynthesisCost);
          const duration = Math.round((Date.now() - startTime) / 1000);

          set({ synthesisResult, verdict: synthesisResult.content });
          setStatusMessage('Phase 2 Complete! Synthesis ready.');
          setCost(totalCost);
          setIsSynthesizing(false);
          setExecutionPhase('complete');

          // Save to history
          councilService.saveExecutionSession(
            state.task,
            state.mode,
            state.activeExpertCount,
            activeExperts,
            Object.fromEntries(Object.entries(state.outputs).map(([id, output]) => [
              id,
              { expertName: activeExperts.find((e: any) => e.id === id)?.name || id, output, model: activeExperts.find((e: any) => e.id === id)?.model || 'unknown' }
            ])),
            synthesisResult.content,
            configWithJudge,
            totalCost
          );

          // Track in analytics
          useDashboardStore.getState().addDecisionRecord({
            timestamp: new Date(),
            mode: state.mode,
            task: state.task.substring(0, 200),
            expertCount: state.activeExpertCount,
            duration,
            cost: totalCost.total,
            verdict: synthesisResult.content.substring(0, 500),
            synthesisContent: synthesisResult.content,
            synthesisModel: synthesisResult.model,
            synthesisTier: synthesisResult.tier,
            success: true,
          }).catch((err: any) => console.error('Failed to save decision record:', err));

          toast.success('Council analysis complete!');
        },
        onError: (error) => {
          toast.error('Synthesis Failed', { description: error.message });
          const fallbackVerdict = 'Synthesis failed. Please review the expert outputs manually.';
          set({
            verdict: fallbackVerdict,
            synthesisResult: {
              content: fallbackVerdict,
              tier: configWithJudge.tier,
              model: 'fallback',
              tokens: { prompt: 0, completion: 0 },
              cost: 0,
            },
          });
          setIsSynthesizing(false);
          setExecutionPhase('idle');
        },
      }
    );
  },

  executeCouncil: async (
    synthesisMutation,
    getState,
    updateExpert,
    setIsLoading,
    setIsSynthesizing,
    setStatusMessage,
    setCost,
    setOutputs
  ) => {
    const state = getState();
    const startTime = Date.now();

    // Import settings and dashboard stores dynamically
    const { useSettingsStore } = await import('@/features/settings/store/settings-store');
    const { useDashboardStore } = await import('@/features/dashboard/store/dashboard-store');
    
    const { openRouterKey, synthesisConfig } = useSettingsStore.getState();

    if (!openRouterKey) {
      toast.error('Vault Locked', {
        action: { label: 'Unlock', onClick: () => useSettingsStore.getState().setShowSettings(true) },
      });
      return;
    }
    if (!state.task.trim()) {
      toast.error('Task is empty');
      return;
    }

    setIsLoading(true);
    setOutputs({});
    set({ synthesisResult: null, verdict: '' });
    setCost({ experts: 0, synthesis: 0, total: 0 });
    setStatusMessage('Initializing Council...');

    const activeExperts = state.experts.slice(0, state.activeExpertCount);

    try {
      const result = await councilService.executeCouncilExperts(
        {
          task: state.task,
          mode: state.mode,
          activeExperts,
          apiKey: openRouterKey,
          synthesisConfig,
        },
        (index, update) => {
          const currentExpert = getState().experts[index];
          if (currentExpert) {
            if (update.output !== undefined) {
              updateExpert(index, { 
                output: update.output === '' ? '' : (currentExpert.output || '') + update.output,
                isLoading: update.isLoading
              });
            } else if (update.isLoading !== undefined) {
              updateExpert(index, { isLoading: update.isLoading });
            }
          }
        },
        (message) => {
          setStatusMessage(message);
        }
      );

      setOutputs(Object.fromEntries(
        Object.entries(result.outputs).map(([id, data]) => [id, data.output])
      ));
      setCost({ experts: result.expertsCost, synthesis: 0, total: result.expertsCost });

      // Synthesis phase
      setStatusMessage('Synthesizing insights...');
      setIsSynthesizing(true);

      synthesisMutation.mutate(
        {
          expertOutputs: Object.values(result.outputs).map(data => ({
            name: data.expertName,
            model: data.model,
            content: data.output,
          })),
          task: state.task,
          config: synthesisConfig,
          apiKey: openRouterKey,
          onProgress: (message: string) => {
            setStatusMessage(message);
          },
        },
        {
          onSuccess: (synthesisResult) => {
            const newSynthesisCost = synthesisResult.cost || 0;
            const totalCost = councilService.calculateTotalCost(result.expertsCost, newSynthesisCost);
            const duration = Math.round((Date.now() - startTime) / 1000);

            set({ synthesisResult, verdict: synthesisResult.content });
            setStatusMessage('Analysis complete');
            setCost(totalCost);
            setIsSynthesizing(false);

            // Save to history
            councilService.saveExecutionSession(
              state.task,
              state.mode,
              state.activeExpertCount,
              activeExperts,
              result.outputs,
              synthesisResult.content,
              synthesisConfig,
              totalCost
            );

            // Track in analytics
            useDashboardStore.getState().addDecisionRecord({
              timestamp: new Date(),
              mode: state.mode,
              task: state.task.substring(0, 200),
              expertCount: state.activeExpertCount,
              duration,
              cost: totalCost.total,
              verdict: synthesisResult.content.substring(0, 500),
              synthesisContent: synthesisResult.content,
              synthesisModel: synthesisResult.model,
              synthesisTier: synthesisResult.tier,
              success: true,
            }).catch((err: any) => console.error('Failed to save decision record:', err));

            toast.success('Council analysis complete!');
          },
          onError: (error) => {
            toast.error('Synthesis Failed', { description: error.message });
            const fallbackVerdict = 'Synthesis failed. Please review the expert outputs manually.';
            set({
              verdict: fallbackVerdict,
              synthesisResult: {
                content: fallbackVerdict,
                tier: synthesisConfig.tier,
                model: 'fallback',
                tokens: { prompt: 0, completion: 0 },
                cost: 0,
              },
            });
            setIsSynthesizing(false);
          },
        }
      );

      setIsLoading(false);
      setStatusMessage('');
    } catch (error) {
      console.error('ExecuteCouncil error:', error);
      setIsLoading(false);
      setStatusMessage('');
      toast.error('Failed to execute council');
    }
  },

  reset: (resetUI) => {
    set({
      outputs: {},
      synthesisResult: null,
      verdict: '',
      status: '',
    });
    resetUI();
  },
});

/**
 * Council UI Slice
 * Manages UI-related state: loading, status messages, execution phases
 */

import { StateCreator } from 'zustand';
import * as councilService from '@/services/council.service';

export interface CouncilUISlice {
  // Execution Phase
  executionPhase: 'idle' | 'phase1-experts' | 'phase1-complete' | 'phase2-synthesis' | 'complete';
  setExecutionPhase: (phase: 'idle' | 'phase1-experts' | 'phase1-complete' | 'phase2-synthesis' | 'complete') => void;

  // Loading States
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  isSynthesizing: boolean;
  setIsSynthesizing: (synthesizing: boolean) => void;

  // Status Messages
  statusMessage: string;
  setStatusMessage: (message: string) => void;

  // Cost Tracking
  cost: councilService.CostBreakdown;
  setCost: (cost: councilService.CostBreakdown) => void;
  updateCost: (updates: Partial<councilService.CostBreakdown>) => void;

  // Reset UI state
  resetUI: () => void;
}

export const createCouncilUISlice: StateCreator<
  CouncilUISlice,
  [],
  [],
  CouncilUISlice
> = (set) => ({
  // Initial State
  executionPhase: 'idle',
  isLoading: false,
  isSynthesizing: false,
  statusMessage: '',
  cost: { experts: 0, synthesis: 0, total: 0 },

  // Actions
  setExecutionPhase: (phase) => set({ executionPhase: phase }),
  
  setIsLoading: (loading) => set({ isLoading: loading }),
  
  setIsSynthesizing: (synthesizing) => set({ isSynthesizing: synthesizing }),
  
  setStatusMessage: (message) => set({ statusMessage: message }),
  
  setCost: (cost) => set({ cost }),
  
  updateCost: (updates) => set((state) => ({
    cost: { ...state.cost, ...updates }
  })),

  resetUI: () => set({
    executionPhase: 'idle',
    isLoading: false,
    isSynthesizing: false,
    statusMessage: '',
    cost: { experts: 0, synthesis: 0, total: 0 },
  }),
});

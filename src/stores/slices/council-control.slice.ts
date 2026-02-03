/**
 * Council Control Slice
 * Manages control panel settings: task, mode, counts, etc.
 */

import { StateCreator } from 'zustand';
import { ExecutionMode } from '@/features/council/lib/types';

interface FileData {
  name: string;
  content: string;
  size: string;
}

export interface CouncilControlSlice {
  // Task Configuration
  task: string;
  setTask: (task: string) => void;

  // Execution Mode
  mode: ExecutionMode;
  setMode: (mode: ExecutionMode) => void;

  // Judge Mode (Phase 2)
  judgeMode: 'ruthless-judge' | 'consensus-judge' | 'debate-judge' | 'pipeline-judge';
  setJudgeMode: (mode: 'ruthless-judge' | 'consensus-judge' | 'debate-judge' | 'pipeline-judge') => void;

  // Expert Configuration
  activeExpertCount: number;
  setActiveExpertCount: (count: number) => void;

  // Debate Configuration
  debateRounds: number;
  setDebateRounds: (rounds: number) => void;

  // File Data
  fileData: FileData | null;
  setFileData: (fileData: FileData | null) => void;
}

export const createCouncilControlSlice: StateCreator<
  CouncilControlSlice,
  [],
  [],
  CouncilControlSlice
> = (set) => ({
  // Initial State
  task: '',
  mode: 'parallel',
  judgeMode: 'ruthless-judge',
  activeExpertCount: 5,
  debateRounds: 3,
  fileData: null,

  // Actions
  setTask: (task) => set({ task }),
  setMode: (mode) => set({ mode }),
  setJudgeMode: (mode) => set({ judgeMode: mode }),
  setActiveExpertCount: (count) => set({ activeExpertCount: count }),
  setDebateRounds: (rounds) => set({ debateRounds: rounds }),
  setFileData: (fileData) => set({ fileData }),
});

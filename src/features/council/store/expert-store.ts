import { create } from 'zustand';
import { Expert, KnowledgeFile } from '@/lib/types';

interface ExpertState {
  experts: Expert[];
  setExperts: (experts: Expert[]) => void;
  updateExpert: (index: number, expert: Expert) => void;
  addKnowledge: (expertIndex: number, files: KnowledgeFile[]) => void;
  removeKnowledge: (expertIndex: number, fileId: string) => void;
}

export const useExpertStore = create<ExpertState>((set) => ({
  experts: [],
  setExperts: (experts) => set({ experts }),
  updateExpert: (index, expert) =>
    set((state) => ({
      experts: state.experts.map((e, i) => (i === index ? expert : e)),
    })),
  addKnowledge: (expertIndex, files) =>
    set((state) => ({
      experts: state.experts.map((e, i) =>
        i === expertIndex
          ? { ...e, knowledge: [...e.knowledge, ...files] }
          : e
      ),
    })),
  removeKnowledge: (expertIndex, fileId) =>
    set((state) => ({
      experts: state.experts.map((e, i) =>
        i === expertIndex
          ? { ...e, knowledge: e.knowledge.filter((f) => f.id !== fileId) }
          : e
      ),
    })),
}));
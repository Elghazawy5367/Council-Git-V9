import { create } from 'zustand';
import { Expert, KnowledgeFile } from '@/features/council/lib/types';

interface ExpertState {
  experts: Expert[];
  setExperts: (experts: Expert[]) => void;
  updateExpert: (index: number, expert: Partial<Expert>) => void;
  addKnowledge: (expertIndex: number, files: KnowledgeFile[]) => void;
  removeKnowledge: (expertIndex: number, fileId: string) => void;
}

export const useExpertStore = create<ExpertState>((set) => ({
  experts: [],
  setExperts: (experts) => set({ experts }),
  updateExpert: (index, expertUpdates) =>
    set((state) => ({
      experts: state.experts.map((e, i) => {
        if (i !== index) return e;
        const updated = { ...e, ...expertUpdates };
        // Sync pluginConfig with legacy config if core-ai-expert
        if (updated.pluginId === 'core-ai-expert' && updated.pluginConfig) {
          updated.config = { ...updated.config, ...updated.pluginConfig };
        }
        return updated;
      }),
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
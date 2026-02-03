/**
 * Council Experts Slice
 * Manages expert state, knowledge, and persona/team loading
 */

import { StateCreator } from 'zustand';
import { toast } from 'sonner';
import { Expert, KnowledgeFile } from '@/features/council/lib/types';
import { DEFAULT_EXPERTS } from '@/lib/config';
import { loadPersonaIntoExpert, loadTeam as loadTeamFromLibrary } from '@/features/council/lib/persona-library';

export interface CouncilExpertsSlice {
  // Expert State
  experts: Expert[];
  
  // Expert Management
  setExperts: (experts: Expert[]) => void;
  updateExpert: (index: number, expert: Partial<Expert>) => void;
  
  // Knowledge Management
  addKnowledge: (expertIndex: number, files: KnowledgeFile[]) => void;
  removeKnowledge: (expertIndex: number, fileId: string) => void;
  
  // Persona/Team Loading
  loadPersona: (expertIndex: number, personaId: string) => void;
  loadTeam: (teamId: string, setMode: (mode: any) => void, setActiveExpertCount: (count: number) => void) => void;
  clearPersona: (expertIndex: number) => void;
  resetToDefault: (setActiveExpertCount: (count: number) => void, setMode: (mode: any) => void) => void;
}

export const createCouncilExpertsSlice: StateCreator<
  CouncilExpertsSlice,
  [],
  [],
  CouncilExpertsSlice
> = (set, get) => ({
  // Initial State
  experts: [],

  // Actions
  setExperts: (experts) => set({ experts }),

  updateExpert: (index, expertUpdates) =>
    set((state) => ({
      experts: state.experts.map((e, i) => {
        if (i !== index) return e;
        const updated = { ...e, ...expertUpdates };
        if (!updated.content) {
          updated.content = updated.output || 'No content available';
        }
        if (updated.pluginId === 'core-ai-expert' && updated.pluginConfig) {
          updated.config = { ...updated.config, ...updated.pluginConfig };
        }
        return updated;
      }),
    })),

  addKnowledge: (expertIndex, files) =>
    set((state) => ({
      experts: state.experts.map((e, i) =>
        i === expertIndex ? { ...e, knowledge: [...e.knowledge, ...files] } : e
      ),
    })),

  removeKnowledge: (expertIndex, fileId) =>
    set((state) => ({
      experts: state.experts.map((e, i) =>
        i === expertIndex ? { ...e, knowledge: e.knowledge.filter((f) => f.id !== fileId) } : e
      ),
    })),

  loadPersona: (expertIndex, personaId) => {
    const personaExpert = loadPersonaIntoExpert(personaId, expertIndex);
    if (personaExpert) {
      const newExperts = [...get().experts];
      newExperts[expertIndex - 1] = {
        id: personaExpert.id,
        name: personaExpert.name,
        model: personaExpert.model,
        role: personaExpert.role,
        basePersona: personaExpert.basePersona,
        knowledge: personaExpert.knowledge || [],
        config: personaExpert.config,
        modeBehavior: personaExpert.modeBehavior,
        content: personaExpert.content || 'No content available',
        color: personaExpert.color || '#000000',
        icon: personaExpert.icon || 'default-icon',
        isLoading: personaExpert.isLoading !== undefined ? personaExpert.isLoading : false,
      };
      set({ experts: newExperts });
      toast.success(`Loaded ${personaExpert.name} into Expert ${expertIndex}`);
    } else {
      toast.error('Failed to load persona');
    }
  },

  loadTeam: (teamId, setMode, setActiveExpertCount) => {
    const team = loadTeamFromLibrary(teamId);
    if (team) {
      setActiveExpertCount(team.experts.length);
      setMode(team.mode);
      const newExperts = [...DEFAULT_EXPERTS];
      team.experts.forEach((expert, index) => {
        newExperts[index] = {
          id: expert.id,
          name: expert.name,
          model: expert.model,
          role: expert.role,
          basePersona: expert.basePersona,
          knowledge: expert.knowledge || [],
          config: expert.config,
          modeBehavior: {
            ...expert.modeBehavior,
            modeName: expert.modeBehavior.modeName ?? "defaultMode",
            description: expert.modeBehavior.description ?? "No description provided",
            isEnabled: expert.modeBehavior.isEnabled ?? true,
          },
          content: expert.content || 'No content available',
          color: expert.color || '#000000',
          icon: expert.icon || 'default-icon',
          hasWebSearch: expert.hasWebSearch ?? false,
        };
      });
      set({ experts: newExperts });
      toast.success(`Loaded ${team.name} with ${team.experts.length} experts`);
    } else {
      toast.error('Failed to load team');
    }
  },

  clearPersona: (expertIndex) => {
    const defaultExpert = DEFAULT_EXPERTS[expertIndex - 1];
    if (defaultExpert) {
      const newExperts = [...get().experts];
      newExperts[expertIndex - 1] = { ...defaultExpert };
      set({ experts: newExperts });
      toast.success(`Reset Expert ${expertIndex} to default`);
    }
  },

  resetToDefault: (setActiveExpertCount, setMode) => {
    set({ experts: [...DEFAULT_EXPERTS] });
    setActiveExpertCount(5);
    setMode('synthesis');
    toast.success('Reset all experts to defaults');
  },
});

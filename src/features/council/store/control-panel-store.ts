import { create } from 'zustand';
import { toast } from 'sonner';
import { ExecutionMode } from '@/features/council/lib/types';
import { DEFAULT_EXPERTS } from '@/lib/config';
import { loadPersonaIntoExpert, loadTeam } from '@/features/council/lib/persona-library';

// Import useExpertStore dynamically to break circular dependencies
const getExpertStore = () => import('./expert-store').then(mod => mod.useExpertStore);

interface FileData {
  name: string;
  content: string;
  size: string;
}

interface ControlPanelState {
  task: string;
  setTask: (task: string) => void;
  mode: ExecutionMode;
  setMode: (mode: ExecutionMode) => void;
  activeExpertCount: number;
  setActiveExpertCount: (count: number) => void;
  debateRounds: number;
  setDebateRounds: (rounds: number) => void;
  fileData: FileData | null;
  setFileData: (fileData: FileData | null) => void;
  loadPersona: (expertIndex: number, personaId: string) => void;
  loadTeam: (teamId: string) => void;
  clearPersona: (expertIndex: number) => void;
  resetToDefault: () => void;
}

export const useControlPanelStore = create<ControlPanelState>((set) => ({
  task: '',
  setTask: (task) => set({ task }),
  mode: 'parallel',
  setMode: (mode) => set({ mode }),
  activeExpertCount: 5,
  setActiveExpertCount: (count) => set({ activeExpertCount: count }),
  debateRounds: 3,
  setDebateRounds: (rounds) => set({ debateRounds: rounds }),
  fileData: null,
  setFileData: (fileData) => set({ fileData }),

  loadPersona: (expertIndex, personaId) => {
    const personaExpert = loadPersonaIntoExpert(personaId, expertIndex);
    if (personaExpert) {
      // CRITICAL: Never use requestAnimationFrame + async - prevents infinite loops
      // Use synchronous promise chain with getState() directly from imported store
      getExpertStore().then(useExpertStoreHook => {
        const state = useExpertStoreHook.getState();
        const newExperts = [...state.experts];
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
        useExpertStoreHook.setState({ experts: newExperts });
        toast.success(`Loaded ${personaExpert.name} into Expert ${expertIndex}`);
      }).catch(() => toast.error('Failed to update expert'));
    } else {
      toast.error('Failed to load persona');
    }
  },

  loadTeam: (teamId) => {
    const team = loadTeam(teamId);
    if (team) {
      set({ activeExpertCount: team.experts.length, mode: team.mode });
      // CRITICAL: Avoid nested requestAnimationFrame + async patterns
      // Use synchronous promise chain to update store safely
      getExpertStore().then(useExpertStoreHook => {
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
        useExpertStoreHook.setState({ experts: newExperts });
        toast.success(`Loaded ${team.name} with ${team.experts.length} experts`);
      }).catch(() => toast.error('Failed to load team'));
    } else {
      toast.error('Failed to load team');
    }
  },

  clearPersona: (expertIndex) => {
    // CRITICAL: Avoid requestAnimationFrame + async patterns
    getExpertStore().then(useExpertStoreHook => {
      const state = useExpertStoreHook.getState();
      const defaultExpert = DEFAULT_EXPERTS[expertIndex - 1];
      if (defaultExpert) {
        const newExperts = [...state.experts];
        newExperts[expertIndex - 1] = { ...defaultExpert };
        useExpertStoreHook.setState({ experts: newExperts });
        toast.success(`Reset Expert ${expertIndex} to default`);
      }
    }).catch(() => toast.error('Failed to reset expert'));
  },

  resetToDefault: () => {
    // CRITICAL: Avoid requestAnimationFrame + async patterns
    getExpertStore().then(useExpertStoreHook => {
      useExpertStoreHook.setState({ experts: [...DEFAULT_EXPERTS] });
      set({ activeExpertCount: 5, mode: 'synthesis' });
      toast.success('Reset all experts to defaults');
    }).catch(() => toast.error('Failed to reset experts'));
  },
}));

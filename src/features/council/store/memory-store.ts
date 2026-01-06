import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  MemoryEntry,
  CouncilMemory,
} from '@/features/council/lib/council-memory';

const MAX_ENTRIES = 100;

const storage: Storage = {
  getItem: (key: string) => {
    const value = localStorage.getItem(key);
    return value || null;
  },
  setItem: (key: string, value: string) => {
    localStorage.setItem(key, value);
  },
  removeItem: (key: string) => {
    localStorage.removeItem(key);
  },
  length: localStorage.length,
  clear: () => {
    localStorage.clear();
  },
  key: (index: number) => {
    return localStorage.key(index);
  },
};

// Adjusted MemoryState to ensure compatibility with Partial<MemoryState>
interface MemoryState {
  memory: CouncilMemory;
  searchQuery: string;
  filterType: string | null;
  isLoading: boolean;
  loadMemory: () => Promise<void>;
  addEntry: (entry: MemoryEntry) => MemoryEntry;
  deleteMemoryEntry: (id: string) => void;
  clearAll: () => void;
  setEnabled: (enabled: boolean) => void;
  toggleEnabled: () => void;
  setSearchQuery: (searchQuery: string) => void;
  setFilterType: (filterType: string | null) => void;
}

// Patch StateCreator to relax replace parameter constraints
export const useMemoryStore = create<MemoryState>(
  // @ts-expect-error - Zustand v5 persist middleware type signature mismatch (non-breaking)
  persist(
    (set, get) => ({
      memory: {
        entries: [],
        userPreferences: {},
        domainKnowledge: {},
        enabled: true,
      },
      searchQuery: '',
      filterType: null,
      isLoading: false,

      loadMemory: async () => {
        // Hydration happens automatically with persist
      },

      addEntry: (entry) => {
        const newEntry: MemoryEntry = {
          ...entry,
          id: `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date(),
        };

        const currentMemory = get().memory;
        const entries = [newEntry, ...currentMemory.entries];
        
        let finalEntries = entries;
        if (entries.length > MAX_ENTRIES) {
          finalEntries = entries.sort((a, b) => {
            const recencyA = Date.now() - new Date(a.timestamp).getTime();
            const recencyB = Date.now() - new Date(b.timestamp).getTime();
            const scoreA = a.relevanceScore - (recencyA / (1000 * 60 * 60 * 24 * 7));
            const scoreB = b.relevanceScore - (recencyB / (1000 * 60 * 60 * 24 * 7));
            return scoreB - scoreA;
          }).slice(0, MAX_ENTRIES);
        }

        set((state) => ({
          ...state,
          memory: { ...state.memory, entries: finalEntries },
        }));
        return newEntry;
      },

      deleteMemoryEntry: (id) => {
        set((state) => ({
          ...state,
          memory: {
            ...state.memory,
            entries: state.memory.entries.filter((e) => e.id !== id),
          },
        }));
      },

      clearAll: () => {
        set((state) => ({
          ...state,
          memory: {
            entries: [],
            userPreferences: {},
            domainKnowledge: {},
            enabled: state.memory.enabled,
          },
        }));
      },

      setEnabled: (enabled) => {
        set((state) => ({
          ...state,
          memory: { ...state.memory, enabled },
        }));
      },

      toggleEnabled: () => {
        set((state) => ({
          ...state,
          memory: { ...state.memory, enabled: !state.memory.enabled },
        }));
      },

      setSearchQuery: (searchQuery) => set((state) => ({ ...state, searchQuery })),
      setFilterType: (filterType) => set((state) => ({ ...state, filterType })),
    }),
    {
      name: 'council_memory_v18',
      storage: createJSONStorage(() => storage),
    }
  )
);

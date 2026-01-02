import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { get, set, del } from 'idb-keyval';
import {
  MemoryEntry,
  CouncilMemory,
} from '@/features/council/lib/council-memory';

const MAX_ENTRIES = 100;

const storage = createJSONStorage(() => ({
  getItem: async (name: string) => {
    const value = await get(name);
    return value ? JSON.stringify(value) : null;
  },
  setItem: async (name: string, value: string) => {
    await set(name, JSON.parse(value));
  },
  removeItem: async (name: string) => {
    await del(name);
  },
}));

interface MemoryState {
  memory: CouncilMemory;
  searchQuery: string;
  filterType: string | null;
  isLoading: boolean;
  addEntry: (entry: Omit<MemoryEntry, 'id' | 'timestamp'>) => MemoryEntry;
  deleteEntry: (id: string) => void;
  clearAll: () => void;
  setEnabled: (enabled: boolean) => void;
  toggleEnabled: () => void;
  setSearchQuery: (query: string) => void;
  setFilterType: (type: string | null) => void;
  loadMemory: () => Promise<void>;
}

export const useMemoryStore = create<MemoryState>()(
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

        set({ memory: { ...currentMemory, entries: finalEntries } });
        return newEntry;
      },

      deleteEntry: (id) => {
        const currentMemory = get().memory;
        set({
          memory: {
            ...currentMemory,
            entries: currentMemory.entries.filter((e) => e.id !== id),
          }
        });
      },

      clearAll: () => {
        set({ 
          memory: { 
            entries: [], 
            userPreferences: {}, 
            domainKnowledge: {}, 
            enabled: get().memory.enabled 
          } 
        });
      },

      setEnabled: (enabled) => {
        set({ memory: { ...get().memory, enabled } });
      },

      toggleEnabled: () => {
        const current = get().memory.enabled;
        set({ memory: { ...get().memory, enabled: !current } });
      },

      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setFilterType: (filterType) => set({ filterType }),
    }),
    {
      name: 'council_memory_v18',
      storage: storage,
    }
  )
);

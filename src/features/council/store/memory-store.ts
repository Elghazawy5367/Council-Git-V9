
import { create } from 'zustand';
import {
  CouncilMemory,
  MemoryEntry,
  MemoryType,
  loadMemory as loadMemoryFromDb,
  deleteMemoryEntry as deleteMemoryEntryFromDb,
  clearMemory as clearMemoryFromDb,
  setMemoryEnabled as setMemoryEnabledInDb,
  addMemoryEntry as addMemoryEntryToDb,
} from '@/features/council/lib/council-memory';

interface MemoryState {
  memory: CouncilMemory | null;
  searchQuery: string;
  filterType: MemoryType | null;
  isLoading: boolean;
  loadMemory: () => Promise<void>;
  toggleEnabled: () => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  setFilterType: (type: MemoryType | null) => void;
  addEntry: (entry: Omit<MemoryEntry, 'id' | 'timestamp'>) => Promise<void>;
}

export const useMemoryStore = create<MemoryState>((set, get) => ({
  memory: null,
  searchQuery: '',
  filterType: null,
  isLoading: true,
  loadMemory: async () => {
    set({ isLoading: true });
    try {
      const memory = await loadMemoryFromDb();
      set({ memory, isLoading: false });
    } catch (error) {
      console.error('Failed to load memory:', error);
      set({ isLoading: false });
    }
  },
  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilterType: (type) => set({ filterType: type }),
  toggleEnabled: async () => {
    const state = get();
    if (state.memory) {
      const newEnabledState = !state.memory.enabled;
      await setMemoryEnabledInDb(newEnabledState);
      set({ memory: { ...state.memory, enabled: newEnabledState } });
    }
  },
  deleteEntry: async (id) => {
    const state = get();
    if (state.memory) {
      await deleteMemoryEntryFromDb(id);
      const newEntries = state.memory.entries.filter((e) => e.id !== id);
      set({ memory: { ...state.memory, entries: newEntries } });
    }
  },
  clearAll: async () => {
    await clearMemoryFromDb();
    const state = get();
    if (state.memory) {
      set({
        memory: {
          ...state.memory,
          entries: [],
          userPreferences: {},
          domainKnowledge: {},
        },
      });
    }
  },
  addEntry: async (entry) => {
    const newEntry = await addMemoryEntryToDb(entry);
    const state = get();
    if (state.memory) {
      const newEntries = [newEntry, ...state.memory.entries];
      set({ memory: { ...state.memory, entries: newEntries } });
    }
  },
}));

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { get, set, del } from 'idb-keyval';
import {
  MemoryEntry,
  CouncilMemory,
  MemoryType,
} from '@/features/council/lib/council-memory';

const MAX_ENTRIES = 100;

// Define the storage implementation for idb-keyval
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

interface MemoryState extends CouncilMemory {
  addEntry: (entry: Omit<MemoryEntry, 'id' | 'timestamp'>) => MemoryEntry;
  addEntries: (
    entries: Omit<MemoryEntry, 'id' | 'timestamp'>[]
  ) => MemoryEntry[];
  deleteEntry: (id: string) => void;
  clearMemory: () => void;
  setEnabled: (enabled: boolean) => void;
}

export const useMemoryStore = create<MemoryState>()(
  persist(
    (set, get) => ({
      entries: [],
      userPreferences: {},
      domainKnowledge: {},
      enabled: true,
      addEntry: (entry) => {
        const newEntry: MemoryEntry = {
          ...entry,
          id: `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date(),
        };

        set((state) => {
          const entries = [newEntry, ...state.entries];
          if (entries.length > MAX_ENTRIES) {
            entries.sort((a, b) => {
                const recencyA = Date.now() - new Date(a.timestamp).getTime();
                const recencyB = Date.now() - new Date(b.timestamp).getTime();
                const scoreA = a.relevanceScore - (recencyA / (1000 * 60 * 60 * 24 * 7)); // Decay over a week
                const scoreB = b.relevanceScore - (recencyB / (1000 * 60 * 60 * 24 * 7));
                return scoreB - scoreA;
              })
              .slice(0, MAX_ENTRIES);
          }
          return { entries };
        });

        return newEntry;
      },
      addEntries: (entries) => {
        const newEntries: MemoryEntry[] = entries.map((entry) => ({
          ...entry,
          id: `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date(),
        }));

        set((state) => {
          let allEntries = [...newEntries, ...state.entries];
          if (allEntries.length > MAX_ENTRIES) {
            allEntries = allEntries
            .sort((a, b) => {
                const recencyA = Date.now() - new Date(a.timestamp).getTime();
                const recencyB = Date.now() - new Date(b.timestamp).getTime();
                const scoreA = a.relevanceScore - (recencyA / (1000 * 60 * 60 * 24 * 7));
                const scoreB = b.relevanceScore - (recencyB / (1000 * 60 * 60 * 24 * 7));
                return scoreB - scoreA;
              })
              .slice(0, MAX_ENTRIES);
          }
          return { entries: allEntries };
        });

        return newEntries;
      },
      deleteEntry: (id) =>
        set((state) => ({
          entries: state.entries.filter((e) => e.id !== id),
        })),
      clearMemory: () =>
        set({ entries: [], userPreferences: {}, domainKnowledge: {} }),
      setEnabled: (enabled) => set({ enabled }),
    }),
    {
      name: 'council_memory_v18',
      storage: storage,
    }
  )
);

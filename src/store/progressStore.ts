import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { ProgressEntry } from '../types';

interface ProgressState {
  entries: ProgressEntry[];
  stepStreak: number;
  addEntry: (entry: Omit<ProgressEntry, 'id' | 'week'>) => void;
  updateStepStreak: (goalHit: boolean) => void;
  clearEntries: () => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      entries: [],
      stepStreak: 0,

      addEntry: (entry) => {
        const existing = get().entries;
        const week = existing.length + 1;
        const newEntry: ProgressEntry = {
          ...entry,
          id: `entry_${Date.now()}`,
          week,
        };
        set({ entries: [...existing, newEntry] });
      },

      updateStepStreak: (goalHit) => {
        set((s) => ({ stepStreak: goalHit ? s.stepStreak + 1 : 0 }));
      },

      clearEntries: () => set({ entries: [], stepStreak: 0 }),
    }),
    {
      name: 'aura-progress-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { computeAllMetrics } from '../services/calculations';
import { HealthMetrics, UserProfile } from '../types';

const DEFAULT_PROFILE: UserProfile = {
  age: 25,
  height: 170,
  weight: 70,
  gender: 'male',
  activityLevel: 'moderate',
  goal: 'maintain',
  dietType: 'any',
  cuisine: 'balanced',
  gymDays: 4,
  fitnessLevel: 'intermediate',
  equipment: 'full_gym',
  onboardingComplete: false,
};

interface UserState {
  profile: UserProfile;
  metrics: HealthMetrics | null;
  setProfile: (profile: Partial<UserProfile>) => void;
  completeOnboarding: (profile: UserProfile) => void;
  resetProfile: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      profile: DEFAULT_PROFILE,
      metrics: null,

      setProfile: (partial) => {
        const updated = { ...get().profile, ...partial };
        set({
          profile: updated,
          metrics: updated.onboardingComplete ? computeAllMetrics(updated) : null,
        });
      },

      completeOnboarding: (profile) => {
        const metrics = computeAllMetrics(profile);
        set({ profile: { ...profile, onboardingComplete: true }, metrics });
      },

      resetProfile: () => {
        set({ profile: DEFAULT_PROFILE, metrics: null });
      },
    }),
    {
      name: 'aura-user-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

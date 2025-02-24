import { create } from 'zustand';
import { type Achievement, type UserProgress, type Leaderboard } from '@shared/schema';
import { apiRequest } from './queryClient';

interface GamificationState {
  userId: string | null;
  achievements: Achievement[];
  progress: UserProgress | null;
  leaderboard: Leaderboard[];
  unlockedAchievements: Set<number>;
  points: number;
  setUserId: (id: string) => void;
  unlockAchievement: (achievementId: number) => Promise<void>;
  updateProgress: (update: Partial<UserProgress>) => Promise<void>;
  fetchAchievements: () => Promise<void>;
  fetchLeaderboard: () => Promise<void>;
}

export const useGamification = create<GamificationState>((set, get) => ({
  userId: null,
  achievements: [],
  progress: null,
  leaderboard: [],
  unlockedAchievements: new Set(),
  points: 0,

  setUserId: (id: string) => set({ userId: id }),

  unlockAchievement: async (achievementId: number) => {
    const { userId } = get();
    if (!userId) return;

    await apiRequest(`/api/achievements/${achievementId}/unlock`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });

    set(state => ({
      unlockedAchievements: new Set([...state.unlockedAchievements, achievementId])
    }));
  },

  updateProgress: async (update: Partial<UserProgress>) => {
    const { userId } = get();
    if (!userId) return;

    const response = await apiRequest(`/api/progress/${userId}`, {
      method: 'POST',
      body: JSON.stringify(update),
    });

    const progress = await response.json();
    set({ progress });
  },

  fetchAchievements: async () => {
    const response = await apiRequest('/api/achievements');
    const achievements = await response.json();
    set({ achievements });
  },

  fetchLeaderboard: async () => {
    const response = await apiRequest('/api/leaderboard');
    const leaderboard = await response.json();
    set({ leaderboard });
  },
}));

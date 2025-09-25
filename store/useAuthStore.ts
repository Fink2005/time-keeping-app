// store.ts
import { secureStorage } from '@/utils/secureStorage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type UserState = {
  token: string | null;
  userId: string | null;
  setToken: (token: string) => void;
  setUserId: (id: string) => void;
  logout: () => void;
};

export const useAuthStore = create<UserState>()(
  persist(
    (set, get) => ({
      token: null,
      userId: null,
      setToken: (token: string) => set({ token: token }),
      setUserId: (id: string) => set({ userId: id }),
      logout: () => set({ token: null, userId: null }),
    }),
    {
      name: 'user-storage', // Unique key for SecureStore
      storage: createJSONStorage(() => secureStorage), // Use your custom adapter
      partialize: (state) => ({ token: state.token, userId: state.userId }), // Only persist sensitive fields
    },
  ),
);

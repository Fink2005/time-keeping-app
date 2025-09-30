// store.ts

import { User } from '@/types/user';
import { secureStorage } from '@/utils/secureStorage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type UserState = {
  token: string | null;
  userInfo: User | null;
  setToken: (token: string) => void;
  setUserInfo: (data: User) => void;
  logout: () => void;
};

export const useAuthStore = create<UserState>()(
  persist(
    (set, get) => ({
      token: null,
      userInfo: null,
      setToken: (token: string) => set({ token: token }),
      setUserInfo: (data: User) => set({ userInfo: data }),
      logout: () => set({ token: null, userInfo: null }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => secureStorage), // Use your custom adapter
      partialize: (state) => ({ token: state.token, userInfo: state.userInfo }), // Only persist sensitive fields
    },
  ),
);

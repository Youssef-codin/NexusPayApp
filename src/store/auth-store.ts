import { create } from 'zustand';
import type { User } from '#/types';

interface AuthState {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setToken: (accessToken: string) => void;
  setUser: (user: User) => void;
  login: (accessToken: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,
  setToken: (accessToken) => set({ accessToken, isAuthenticated: true }),
  setUser: (user) => set({ user, isAuthenticated: true }),
  login: (accessToken, user) => set({ accessToken, user, isAuthenticated: true }),
  logout: () => set({ accessToken: null, user: null, isAuthenticated: false }),
}));

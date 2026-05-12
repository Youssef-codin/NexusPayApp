import { create } from 'zustand';
import type { User } from '#/types';

const STORAGE_KEY = 'nexuspay-user';

function readPersistedUser(): Pick<User, 'email' | 'full_name'> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Pick<User, 'email' | 'full_name'>) : null;
  } catch {
    return null;
  }
}

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
  user: readPersistedUser() as User | null,
  isAuthenticated: false,
  setToken: (accessToken) => set({ accessToken, isAuthenticated: true }),
  setUser: (user) => set({ user, isAuthenticated: true }),
  login: (accessToken, user) => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ email: user.email, full_name: user.full_name })
    );
    set({ accessToken, user, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ accessToken: null, user: null, isAuthenticated: false });
  },
}));

import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  login: (token, user) => {
    localStorage.setItem('mbnp_token', token);
    localStorage.setItem('mbnp_user', JSON.stringify(user));
    set({ token, user, isAuthenticated: true, isLoading: false });
  },

  logout: () => {
    localStorage.removeItem('mbnp_token');
    localStorage.removeItem('mbnp_user');
    set({ token: null, user: null, isAuthenticated: false, isLoading: false });
  },

  setUser: (user) => {
    localStorage.setItem('mbnp_user', JSON.stringify(user));
    set({ user });
  },

  initialize: () => {
    if (typeof window === 'undefined') return;

    try {
      const token = localStorage.getItem('mbnp_token');
      const userStr = localStorage.getItem('mbnp_user');
      
      if (token && userStr) {
        const user = JSON.parse(userStr);
        set({ token, user, isAuthenticated: true, isLoading: false });
      } else {
        set({ token: null, user: null, isAuthenticated: false, isLoading: false });
      }
    } catch (e) {
      localStorage.removeItem('mbnp_token');
      localStorage.removeItem('mbnp_user');
      set({ token: null, user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));

import { create } from 'zustand';

export interface UserProfile {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: string;
  designation?: string;
  department?: string;
}

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: UserProfile | null;
  isLoggedIn: boolean;
  login: (token: string, refreshToken: string, user: UserProfile) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  // Load initial state from localStorage
  const savedToken = localStorage.getItem('token');
  const savedRefreshToken = localStorage.getItem('refreshToken');
  const savedUser = localStorage.getItem('user');

  let user: UserProfile | null = null;
  if (savedUser) {
    try {
      user = JSON.parse(savedUser);
    } catch (e) {
      console.error('Failed to parse user profile from localStorage', e);
    }
  }

  return {
    token: savedToken,
    refreshToken: savedRefreshToken,
    user,
    isLoggedIn: !!savedToken,
    login: (token, refreshToken, user) => {
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      set({ token, refreshToken, user, isLoggedIn: true });
    },
    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      set({ token: null, refreshToken: null, user: null, isLoggedIn: false });
    },
  };
});

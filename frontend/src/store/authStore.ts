import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Role = 'guest' | 'user' | 'admin';

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  isVerified: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  sessionId: string;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

const getOrGenerateSessionId = () => {
  let sid = localStorage.getItem('session_id');
  if (!sid) {
    sid = typeof crypto?.randomUUID === 'function' 
      ? crypto.randomUUID() 
      : Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('session_id', sid);
  }
  return sid;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      sessionId: getOrGenerateSessionId(),
      isAuthenticated: false,
      setAuth: (user, token) => {
        localStorage.setItem('access_token', token);
        set({ user, token, isAuthenticated: true });
      },
      logout: () => {
        localStorage.removeItem('access_token');
        const newSid = typeof crypto?.randomUUID === 'function' 
          ? crypto.randomUUID() 
          : Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        localStorage.setItem('session_id', newSid);
        set({ user: null, token: null, isAuthenticated: false, sessionId: newSid });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated,
        sessionId: state.sessionId 
      }),
      onRehydrateStorage: () => (state) => {
        // Sync token back to localStorage so the axios interceptor can read it
        if (state?.token) {
          localStorage.setItem('access_token', state.token);
        } else {
          localStorage.removeItem('access_token');
        }
      },
    }
  )
);

import { useState } from 'react';
import type { User } from '../types/auth.types';

const AUTH_STORAGE_KEY = 'a11y-auth-user';

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    return null;
  });

  const login = (user: User) => {
    setUser(user);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return {
    user,
    isAuthenticated: !!user,
    login,
    logout,
  };
}

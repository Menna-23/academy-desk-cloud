import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Center, centers, users } from '@/data/mockData';

interface AuthState {
  user: User | null;
  center: Center | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthState>({
  user: null,
  center: null,
  login: () => false,
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [center, setCenter] = useState<Center | null>(null);

  const login = (username: string, password: string): boolean => {
    const found = users.find(u => u.username === username && u.password === password);
    if (found) {
      setUser(found);
      setCenter(centers.find(c => c.id === found.centerId) || null);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setCenter(null);
  };

  return (
    <AuthContext.Provider value={{ user, center, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

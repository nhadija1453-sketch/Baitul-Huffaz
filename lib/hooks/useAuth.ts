'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'ADMIN' | 'MUSYRIF' | 'SANTRI';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users
const DEMO_USERS = [
  { id: 'demo-admin-001', email: 'admin@baitulhuffaz.sch.id', password: 'admin123', fullName: 'Administrator', role: 'ADMIN' as const },
  { id: 'demo-musyrif-001', email: 'musyrif@baitulhuffaz.sch.id', password: 'musyrif123', fullName: 'Ustadz Mansyur', role: 'MUSYRIF' as const },
  { id: 'demo-santri-001', email: 'santri@baitulhuffaz.sch.id', password: 'santri123', fullName: 'Santri Demo', role: 'SANTRI' as const },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('baitul_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('baitul_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const foundUser = DEMO_USERS.find(u => u.email === email && u.password === password);

    if (foundUser) {
      const userData: User = {
        id: foundUser.id,
        email: foundUser.email,
        fullName: foundUser.fullName,
        role: foundUser.role,
      };
      setUser(userData);
      localStorage.setItem('baitul_user', JSON.stringify(userData));

      const session = {
        ...userData,
        exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
      };
      localStorage.setItem('baitul_session', JSON.stringify(session));

      return { success: true };
    }

    return { success: false, error: 'Email atau password salah' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('baitul_user');
    localStorage.removeItem('baitul_session');
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function useRole(allowedRoles: string[]) {
  const { user } = useAuth();
  return user ? allowedRoles.includes(user.role) : false;
}

export function useProtectedRoute(allowedRoles?: string[]) {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        window.location.href = '/login';
      } else if (allowedRoles && !allowedRoles.includes(user.role)) {
        const roleRoutes: Record<string, string> = {
          ADMIN: '/dashboard/admin',
          MUSYRIF: '/dashboard/musyrif',
          SANTRI: '/dashboard/santri',
        };
        window.location.href = roleRoutes[user.role] || '/login';
      }
    }
  }, [user, isLoading, allowedRoles]);

  return { user, isLoading };
}
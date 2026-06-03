'use client';

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'ADMIN' | 'MUSYRIF' | 'SANTRI';
  username?: string;
  nip?: string;
  nis?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (emailOrUsername: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  getSantriList: () => User[];
  getMusyrifList: () => User[];
  addSantri: (santri: User & { password: string }) => Promise<{ success: boolean; error?: string }>;
  addMusyrif: (musyrif: User & { password: string }) => Promise<{ success: boolean; error?: string }>;
  deleteSantri: (id: string) => Promise<{ success: boolean }>;
  deleteMusyrif: (id: string) => Promise<{ success: boolean }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default admin account (stored separately, not deletable)
const SYSTEM_ADMIN = { id: 'sys-admin-001', email: 'admin@baitulhuffaz.sch.id', password: 'admin123', fullName: 'Administrator', role: 'ADMIN' as const };

// Type for account storage
interface StoredAccount {
  id: string;
  username?: string;
  password: string;
  fullName: string;
  email?: string;
  role: string;
  nip?: string;
  nis?: string;
}

// Initial Musyrif accounts for demo
const INITIAL_MUSYRIF_ACCOUNTS: StoredAccount[] = [];

// Initial Santri accounts for demo
const INITIAL_SANTRI_ACCOUNTS: StoredAccount[] = [];

// Simple hash function for demo (in production, use bcrypt)
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(16);
}

// Verify password with hash
function verifyPassword(password: string, hashed: string): boolean {
  return simpleHash(password) === hashed;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
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

  // Login function - checks against all account types
  const login = async (emailOrUsername: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    const normalizedInput = emailOrUsername.toLowerCase().trim();

    // 1. Check system admin
    if (normalizedInput === SYSTEM_ADMIN.email.toLowerCase() && password === SYSTEM_ADMIN.password) {
      const userData: User = {
        id: SYSTEM_ADMIN.id,
        email: SYSTEM_ADMIN.email,
        fullName: SYSTEM_ADMIN.fullName,
        role: 'ADMIN',
      };
      setUser(userData);
      localStorage.setItem('baitul_user', JSON.stringify(userData));
      setIsLoading(false);
      return { success: true };
    }

    // 2. Check Musyrif accounts
    // First check initial accounts
    let musyrifAccount = INITIAL_MUSYRIF_ACCOUNTS.find(u =>
      (u.email?.toLowerCase() === normalizedInput || u.username?.toLowerCase() === normalizedInput) &&
      u.password === password &&
      u.role === 'MUSYRIF'
    );

    // If not found in initial, check localStorage
    if (!musyrifAccount) {
      const storedMusyrif = localStorage.getItem('musyrif_accounts');
      if (storedMusyrif) {
        const accounts = JSON.parse(storedMusyrif);
        musyrifAccount = accounts.find((u: any) =>
          (u.email?.toLowerCase() === normalizedInput || u.username?.toLowerCase() === normalizedInput) &&
          verifyPassword(password, u.password) &&
          u.role === 'MUSYRIF'
        );
      }
    }

    if (musyrifAccount) {
      const userData: User = {
        id: musyrifAccount.id,
        email: musyrifAccount.email || `${musyrifAccount.username}@baitulhuffaz.sch.id`,
        fullName: musyrifAccount.fullName,
        role: 'MUSYRIF',
        username: musyrifAccount.username,
        nip: musyrifAccount.nip,
      };
      setUser(userData);
      localStorage.setItem('baitul_user', JSON.stringify(userData));
      setIsLoading(false);
      return { success: true };
    }

    // 3. Check Santri accounts
    // First check initial accounts
    let santriAccount = INITIAL_SANTRI_ACCOUNTS.find(u =>
      (u.email?.toLowerCase() === normalizedInput || u.username?.toLowerCase() === normalizedInput) &&
      u.password === password &&
      u.role === 'SANTRI'
    );

    // If not found in initial, check localStorage
    if (!santriAccount) {
      const storedSantri = localStorage.getItem('santri_accounts');
      if (storedSantri) {
        const accounts = JSON.parse(storedSantri);
        santriAccount = accounts.find((u: any) =>
          (u.email?.toLowerCase() === normalizedInput || u.username?.toLowerCase() === normalizedInput) &&
          verifyPassword(password, u.password) &&
          u.role === 'SANTRI'
        );
      }
    }

    if (santriAccount) {
      const userData: User = {
        id: santriAccount.id,
        email: santriAccount.email || `${santriAccount.username}@baitulhuffaz.sch.id`,
        fullName: santriAccount.fullName,
        role: 'SANTRI',
        username: santriAccount.username,
        nis: santriAccount.nis,
      };
      setUser(userData);
      localStorage.setItem('baitul_user', JSON.stringify(userData));
      setIsLoading(false);
      return { success: true };
    }

    setIsLoading(false);
    return { success: false, error: 'Email/Username atau password salah' };
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('baitul_user');
    window.location.href = '/login';
  };

  // Get list of all Santri accounts
  const getSantriList = (): User[] => {
    const stored = localStorage.getItem('santri_accounts');
    if (stored) {
      const accounts = JSON.parse(stored);
      return accounts.filter((a: any) => a.role === 'SANTRI').map((a: any) => ({
        id: a.id,
        email: a.email || `${a.username}@baitulhuffaz.sch.id`,
        fullName: a.fullName,
        role: a.role as 'SANTRI',
        username: a.username,
        nis: a.nis,
      }));
    }
    return INITIAL_SANTRI_ACCOUNTS.map(a => ({
      id: a.id,
      email: a.email || `${a.username}@baitulhuffaz.sch.id`,
      fullName: a.fullName,
      role: 'SANTRI' as const,
      username: a.username || a.email,
      nis: a.nis,
    }));
  };

  // Get list of all Musyrif accounts
  const getMusyrifList = (): User[] => {
    const stored = localStorage.getItem('musyrif_accounts');
    if (stored) {
      const accounts = JSON.parse(stored);
      return accounts.filter((a: any) => a.role === 'MUSYRIF').map((a: any) => ({
        id: a.id,
        email: a.email || `${a.username}@baitulhuffaz.sch.id`,
        fullName: a.fullName,
        role: a.role as 'MUSYRIF',
        username: a.username || a.email,
        nip: a.nip,
      }));
    }
    return INITIAL_MUSYRIF_ACCOUNTS.map(a => ({
      id: a.id,
      email: a.email || `${a.username}@baitulhuffaz.sch.id`,
      fullName: a.fullName,
      role: 'MUSYRIF' as const,
      username: a.username || a.email,
      nip: a.nip,
    }));
  };

  // Add new Santri account
  const addSantri = async (santri: User & { password: string }): Promise<{ success: boolean; error?: string }> => {
    try {
      const stored = localStorage.getItem('santri_accounts');
      const accounts = stored ? JSON.parse(stored) : [];

      // Check if username already exists
      if (accounts.some((a: any) => a.username?.toLowerCase() ===santri.username?.toLowerCase())) {
        return { success: false, error: 'Username sudah digunakan' };
      }

      // Check if email already exists
      if (accounts.some((a: any) => a.email?.toLowerCase() ===santri.email?.toLowerCase())) {
        return { success: false, error: 'Email sudah digunakan' };
      }

      accounts.push({
        id: Date.now().toString(),
        email:santri.email,
        username:santri.username,
        fullName:santri.fullName,
        password: simpleHash(santri.password),
        role: 'SANTRI',
        nis:santri.nis,
        created_at: new Date().toISOString(),
      });

      localStorage.setItem('santri_accounts', JSON.stringify(accounts));
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Gagal menambahkan akun' };
    }
  };

  // Add new Musyrif account
  const addMusyrif = async (musyrif: User & { password: string }): Promise<{ success: boolean; error?: string }> => {
    try {
      const stored = localStorage.getItem('musyrif_accounts');
      const accounts = stored ? JSON.parse(stored) : [];

      // Check if username already exists
      if (accounts.some((a: any) => a.username?.toLowerCase() === musyrif.username?.toLowerCase())) {
        return { success: false, error: 'Username sudah digunakan' };
      }

      // Check if email already exists
      if (accounts.some((a: any) => a.email?.toLowerCase() === musyrif.email?.toLowerCase())) {
        return { success: false, error: 'Email sudah digunakan' };
      }

      accounts.push({
        id: Date.now().toString(),
        email: musyrif.email,
        username: musyrif.username,
        fullName: musyrif.fullName,
        password: simpleHash(musyrif.password),
        role: 'MUSYRIF',
        nip: musyrif.nip,
        created_at: new Date().toISOString(),
      });

      localStorage.setItem('musyrif_accounts', JSON.stringify(accounts));
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Gagal menambahkan akun' };
    }
  };

  // Delete Santri account
  const deleteSantri = async (id: string): Promise<{ success: boolean }> => {
    try {
      const stored = localStorage.getItem('santri_accounts');
      if (stored) {
        const accounts = JSON.parse(stored);
        const filtered = accounts.filter((a: any) => a.id !== id);
        localStorage.setItem('santri_accounts', JSON.stringify(filtered));
      }
      return { success: true };
    } catch {
      return { success: false };
    }
  };

  // Delete Musyrif account
  const deleteMusyrif = async (id: string): Promise<{ success: boolean }> => {
    try {
      const stored = localStorage.getItem('musyrif_accounts');
      if (stored) {
        const accounts = JSON.parse(stored);
        const filtered = accounts.filter((a: any) => a.id !== id);
        localStorage.setItem('musyrif_accounts', JSON.stringify(filtered));
      }
      return { success: true };
    } catch {
      return { success: false };
    }
  };

  const contextValue: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    getSantriList,
    getMusyrifList,
    addSantri,
    addMusyrif,
    deleteSantri,
    deleteMusyrif,
  };

  return React.createElement(
    AuthContext.Provider,
    { value: contextValue },
    children
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
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.replace('/login');
      } else if (allowedRoles && !allowedRoles.includes(user.role)) {
        const roleRoutes: Record<string, string> = {
          ADMIN: '/dashboard/admin',
          MUSYRIF: '/dashboard/musyrif',
          SANTRI: '/dashboard/santri',
        };
        router.replace(roleRoutes[user.role] || '/login');
      }
    }
  }, [user, isLoading, allowedRoles, router]);

  return { user, isLoading };
}
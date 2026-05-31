// Simple Auth System without Supabase
// Using bcryptjs for password hashing and JWT-like session management

import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'baitul_session';
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

// Simple hash function for demo (in production, use bcrypt or argon2)
// Using a simple XOR cipher for demo purposes
export function simpleHash(password: string): string {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = Array.from(data).map(b => b ^ 0x5A).map(b => b.toString(16)).join('');
  return hash;
}

export function verifyPassword(password: string, hash: string): boolean {
  return simpleHash(password) === hash;
}

// Session management
export interface Session {
  userId: string;
  email: string;
  fullName: string;
  role: 'ADMIN' | 'MUSYRIF' | 'SANTRI';
  exp: number;
}

export async function createSession(user: {
  id: string;
  email: string;
  full_name: string;
  role: string;
}): Promise<string> {
  const session: Session = {
    userId: user.id,
    email: user.email,
    fullName: user.full_name,
    role: user.role as 'ADMIN' | 'MUSYRIF' | 'SANTRI',
    exp: Date.now() + SESSION_DURATION,
  };

  const sessionString = Buffer.from(JSON.stringify(session)).toString('base64');
  return sessionString;
}

export async function getSession(): Promise<Session | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

    if (!sessionCookie?.value) {
      return null;
    }

    const session: Session = JSON.parse(Buffer.from(sessionCookie.value, 'base64').toString('utf-8'));

    if (Date.now() > session.exp) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export function setSessionCookie(sessionToken: string): void {
  // This will be handled in the response
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

// Role-based access control
export function canAccess(role: string, path: string): boolean {
  const permissions: Record<string, string[]> = {
    ADMIN: ['/dashboard/admin', '/dashboard/musyrif', '/dashboard/santri', '/api'],
    MUSYRIF: ['/dashboard/musyrif', '/api/setoran', '/api/nilai', '/api/absensi'],
    SANTRI: ['/dashboard/santri', '/api/nilai', '/api/raport'],
  };

  const allowedPaths = permissions[role] || [];
  return allowedPaths.some(pathPattern => path.startsWith(pathPattern));
}

// Demo users for testing (without real database)
export const demoUsers = [
  {
    id: 'demo-admin-001',
    email: 'admin@baitulhuffaz.sch.id',
    password: 'admin123',
    password_hash: simpleHash('admin123'),
    full_name: 'Administrator',
    role: 'ADMIN',
  },
  {
    id: 'demo-musyrif-001',
    email: 'musyrif@baitulhuffaz.sch.id',
    password: 'musyrif123',
    password_hash: simpleHash('musyrif123'),
    full_name: 'Ustadz Mansyur',
    role: 'MUSYRIF',
  },
  {
    id: 'demo-santri-001',
    email: 'santri@baitulhuffaz.sch.id',
    password: 'santri123',
    password_hash: simpleHash('santri123'),
    full_name: 'Santri Demo',
    role: 'SANTRI',
  },
];

export function findDemoUser(email: string) {
  return demoUsers.find(u => u.email === email) || null;
}

export function validateDemoCredentials(email: string, password: string) {
  const user = findDemoUser(email);
  if (!user) return null;
  if (user.password !== password) return null;
  return user;
}
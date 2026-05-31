'use client';

import React, { useState } from 'react';
import { BookOpen, User, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const result = await login(email, password);

    if (result.success) {
      // Redirect based on role
      const userEmail = email.toLowerCase();
      if (userEmail.includes('admin')) {
        router.push('/dashboard/admin');
      } else if (userEmail.includes('musyrif')) {
        router.push('/dashboard/musyrif');
      } else {
        router.push('/dashboard/santri');
      }
    } else {
      setError(result.error || 'Login gagal');
      setIsLoading(false);
    }
  };

  const fillDemoAccount = (type: 'admin' | 'musyrif' | 'santri') => {
    const accounts = {
      admin: { email: 'admin@baitulhuffaz.sch.id', password: 'admin123' },
      musyrif: { email: 'musyrif@baitulhuffaz.sch.id', password: 'musyrif123' },
      santris: { email: 'santri@baitulhuffaz.sch.id', password: 'santri123' },
    };
    setEmail(accounts[type].email);
    setPassword(accounts[type].password);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-tosca-50 px-4 py-12 sm:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-tosca-100/50 blur-3xl"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-tosca-200/30 blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md space-y-8 bg-white p-8 sm:p-10 rounded-3xl shadow-2xl border border-tosca-100">
        <div className="flex flex-col items-center">
          {/* Logo */}
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-tosca-600 shadow-lg shadow-tosca-200 mb-6 transform transition-transform hover:scale-105">
            <BookOpen className="h-12 w-12 text-white" />
          </div>

          {/* App Name & Welcome Message */}
          <h1 className="text-3xl font-extrabold tracking-tight text-tosca-900 mb-1">
            Baitul Huffaz
          </h1>
          <p className="text-lg font-medium text-tosca-600">
            Selamat Datang
          </p>
          <div className="h-1 w-12 bg-tosca-500 rounded-full mt-4 opacity-50"></div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm font-medium border border-red-100 animate-shake">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleLogin}>
          <div className="space-y-4">
            {/* Email Field */}
            <div className="relative group">
              <label htmlFor="email" className="block text-sm font-semibold text-tosca-700 mb-1.5 ml-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-tosca-400 group-focus-within:text-tosca-600 transition-colors">
                  <User size={18} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-xl border-0 py-3.5 pl-11 pr-4 text-tosca-900 ring-1 ring-inset ring-tosca-200 placeholder:text-tosca-300 focus:ring-2 focus:ring-inset focus:ring-tosca-600 sm:text-sm sm:leading-6 bg-tosca-50/30 transition-all"
                  placeholder="Masukkan email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="relative group">
              <label htmlFor="password" dir="ltr" className="block text-sm font-semibold text-tosca-700 mb-1.5 ml-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-tosca-400 group-focus-within:text-tosca-600 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border-0 py-3.5 pl-11 pr-4 text-tosca-900 ring-1 ring-inset ring-tosca-200 placeholder:text-tosca-400 focus:ring-2 focus:ring-inset focus:ring-tosca-600 sm:text-sm sm:leading-6 bg-tosca-50/30 transition-all"
                  placeholder="Masukkan password"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <div className="text-sm">
              <a href="/forgot-password" title="Lupa password?" className="font-semibold text-tosca-600 hover:text-tosca-700 transition-colors">
                Lupa password?
              </a>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center items-center gap-2 rounded-xl bg-tosca-600 px-3 py-4 text-sm font-bold leading-6 text-white shadow-lg shadow-tosca-200 hover:bg-tosca-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tosca-600 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Masuk
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-tosca-100">
          <p className="text-xs font-bold text-tosca-500 uppercase tracking-widest text-center mb-3">
            Template Akun Demo
          </p>
          <div className="grid grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => fillDemoAccount('admin')}
              className="flex flex-col items-center justify-center p-2.5 bg-tosca-50/50 hover:bg-tosca-100/70 border border-tosca-100 rounded-xl transition-all group text-left"
            >
              <span className="text-[10px] font-black text-tosca-700 uppercase">Admin</span>
              <span className="text-[11px] font-bold text-tosca-900 mt-0.5">admin</span>
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('musyrif')}
              className="flex flex-col items-center justify-center p-2.5 bg-tosca-50/50 hover:bg-tosca-100/70 border border-tosca-100 rounded-xl transition-all group text-left"
            >
              <span className="text-[10px] font-black text-tosca-700 uppercase">Musyrif</span>
              <span className="text-[11px] font-bold text-tosca-900 mt-0.5">musyrif</span>
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('santri')}
              className="flex flex-col items-center justify-center p-2.5 bg-tosca-50/50 hover:bg-tosca-100/70 border border-tosca-100 rounded-xl transition-all group text-left"
            >
              <span className="text-[10px] font-black text-tosca-700 uppercase">Santri</span>
              <span className="text-[11px] font-bold text-tosca-900 mt-0.5">santri</span>
            </button>
          </div>
        </div>

        <div className="text-center mt-4">
          <p className="text-sm text-tosca-500">
            Belum punya akun?{' '}
            <a href="/register" className="font-bold text-tosca-600 hover:text-tosca-700 transition-colors">
              Daftar Sekarang
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

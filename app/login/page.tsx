'use client';

import React, { useState } from 'react';
import { BookOpen, User, Lock, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { useSettings } from '@/lib/hooks/useSettings';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { settings } = useSettings();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await login(email, password);

    if (result.success) {
      // Get updated user from localStorage (since login updates state)
      const storedUser = localStorage.getItem('baitul_user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        // Redirect based on actual user role
        switch (userData.role) {
          case 'ADMIN':
            router.push('/dashboard/admin');
            break;
          case 'MUSYRIF':
            router.push('/dashboard/musyrif');
            break;
          case 'SANTRI':
            router.push('/dashboard/santri');
            break;
          default:
            router.push('/');
        }
      } else {
        // Fallback redirect
        if (email.toLowerCase().includes('admin')) {
          router.push('/dashboard/admin');
        } else if (email.toLowerCase().includes('ust') || email.toLowerCase().includes('musyrif')) {
          router.push('/dashboard/musyrif');
        } else {
          router.push('/dashboard/santri');
        }
      }
    } else {
      setError(result.error || 'Login gagal');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-tosca-50 via-white to-tosca-100 px-4 py-8 sm:py-12">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[20%] w-[50%] h-[50%] rounded-full bg-tosca-100/40 blur-3xl" />
        <div className="absolute -bottom-[20%] -right-[20%] w-[50%] h-[50%] rounded-full bg-tosca-200/30 blur-3xl" />
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-sm sm:max-w-md bg-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-tosca-100/50 p-6 sm:p-8 lg:p-10">
        {/* Header */}
        <div className="flex flex-col items-center mb-6 sm:mb-8">
          {/* Logo */}
          <div className={`w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-xl sm:rounded-2xl shadow-lg shadow-tosca-200/50 mb-4 sm:mb-6 transform transition-transform hover:scale-105 overflow-hidden ${settings.logoUrl ? 'bg-white p-3 border border-tosca-100' : 'bg-gradient-to-br from-tosca-500 to-tosca-700'}`}>
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt="Logo" className="max-h-full max-w-full object-contain" />
            ) : (
              <BookOpen className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
            )}
          </div>

          {/* App Name */}
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-tosca-900 mb-1 text-center">
            {settings.appName}
          </h1>
          <p className="text-sm sm:text-base text-tosca-500 font-medium text-center">
            {settings.systemInfo}
          </p>
          <div className="h-1 w-12 bg-tosca-400 rounded-full mt-3 opacity-60" />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium border border-red-100 mb-4 animate-shake">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form className="space-y-4 sm:space-y-5" onSubmit={handleLogin}>
          {/* Email/Username Field */}
          <div className="relative group">
            <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-tosca-700 mb-1.5 ml-1">
              Email / Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-tosca-400 group-focus-within:text-tosca-600 transition-colors">
                <User size={16} className="sm:w-[18px] sm:h-[18px]" />
              </div>
              <input
                id="email"
                name="email"
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-xl border border-tosca-200 py-3 sm:py-3.5 pl-10 sm:pl-11 pr-4 text-sm sm:text-base text-tosca-900 placeholder:text-tosca-300 focus:outline-none focus:ring-2 focus:ring-tosca-500 focus:border-tosca-500 bg-tosca-50/30 transition-all"
                placeholder="Masukkan email atau username"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="relative group">
            <label htmlFor="password" className="block text-xs sm:text-sm font-semibold text-tosca-700 mb-1.5 ml-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-tosca-400 group-focus-within:text-tosca-600 transition-colors">
                <Lock size={16} className="sm:w-[18px] sm:h-[18px]" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-xl border border-tosca-200 py-3 sm:py-3.5 pl-10 sm:pl-11 pr-10 sm:pr-11 text-sm sm:text-base text-tosca-900 placeholder:text-tosca-300 focus:outline-none focus:ring-2 focus:ring-tosca-500 focus:border-tosca-500 bg-tosca-50/30 transition-all"
                placeholder="Masukkan password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-tosca-400 hover:text-tosca-600 transition-colors cursor-pointer"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff size={18} className="sm:w-[20px] sm:h-[20px]" />
                ) : (
                  <Eye size={18} className="sm:w-[20px] sm:h-[20px]" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-tosca-600 hover:bg-tosca-700 text-white py-3 sm:py-4 rounded-xl text-sm sm:text-base font-bold shadow-lg shadow-tosca-200/50 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Masuk
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-[10px] sm:text-xs text-tosca-400 mt-5 sm:mt-6 leading-relaxed">
          {settings.appName} v1.0 &copy; 2026<br />
          <span className="text-tosca-300">Developer IAT Kelompok 1 Angkatan</span>
        </p>
      </div>
    </div>
  );
}
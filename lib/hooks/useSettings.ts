'use client';

import { useState, useEffect } from 'react';

export interface AppSettings {
  appName: string;
  systemInfo: string;
  logoUrl: string; // Base64 image string
  pwaIconUrl: string; // Base64 image string
  tahunAjaran: string; // Dynamic academic year
}

const DEFAULT_SETTINGS: AppSettings = {
  appName: 'Baitul Huffaz',
  systemInfo: 'Sistem Manajemen Hafalan',
  logoUrl: '',
  pwaIconUrl: '',
  tahunAjaran: '2024/2025',
};

export function getStoredSettings(): AppSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const stored = localStorage.getItem('baitul_settings');
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.error('Error reading settings', e);
  }
  return DEFAULT_SETTINGS;
}

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    setSettings(getStoredSettings());

    const handleStorageChange = () => {
      setSettings(getStoredSettings());
    };
    
    // Listen to custom window storage events for same-tab updates
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('baitul_settings_changed', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('baitul_settings_changed', handleStorageChange);
    };
  }, []);

  const saveSettings = (newSettings: Partial<AppSettings>) => {
    const current = getStoredSettings();
    const updated = { ...current, ...newSettings };
    setSettings(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('baitul_settings', JSON.stringify(updated));
      // Trigger event for same-window updates
      window.dispatchEvent(new Event('baitul_settings_changed'));
      // Trigger event for cross-tab updates
      window.dispatchEvent(new StorageEvent('storage', { key: 'baitul_settings' }));
    }
  };

  return { settings, saveSettings };
}

'use client';

import { useState, useEffect } from 'react';

export interface AppSettings {
  appName: string;
  systemInfo: string;
  logoUrl: string;
  pwaIconUrl: string;
  tahunAjaran: string;
}

const DEFAULT_SETTINGS: AppSettings = {
  appName: 'Baitul Huffaz',
  systemInfo: 'Sistem Manajemen Hafalan',
  logoUrl: '',
  pwaIconUrl: '',
  tahunAjaran: '2024/2025',
};

async function fetchSettings(): Promise<AppSettings> {
  try {
    const res = await fetch('/api/settings');
    const data = await res.json();
    if (data.data) {
      return { ...DEFAULT_SETTINGS, ...data.data };
    }
  } catch {
    // fallback to localStorage if API unavailable
  }
  return DEFAULT_SETTINGS;
}

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    fetchSettings().then(setSettings);
  }, []);

  const saveSettings = async (newSettings: Partial<AppSettings>) => {
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });
      setSettings(prev => ({ ...prev, ...newSettings }));
    } catch {
      // fallback to localStorage
      const current = JSON.parse(localStorage.getItem('baitul_settings') || '{}');
      const updated = { ...current, ...newSettings };
      localStorage.setItem('baitul_settings', JSON.stringify(updated));
      setSettings(prev => ({ ...prev, ...newSettings }));
    }
  };

  return { settings, saveSettings };
}

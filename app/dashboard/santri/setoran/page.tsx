'use client';
export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { useSettings } from '@/lib/hooks/useSettings';
import {
  ArrowLeft, BookOpen, Home, Star, Video, Award, User,
  CheckCircle2, AlertCircle, Sparkles, BookMarked
} from 'lucide-react';

interface SetoranRecord {
  id: string;
  santriId: string;
  santriName: string;
  kelasNama: string;
  nis: string;
  surah: string;
  ayat: string;
  tajwid: number;
  makhraj: number;
  kelancaran: number;
  rata: number;
  status: 'Lanjut' | 'Ulang';
  jenis: string;
  createdAt: string;
}

const statusConfig: Record<string, { color: string; icon: any; label: string }> = {
  Lanjut: { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2, label: 'Lanjut' },
  Ulang: { color: 'bg-amber-50 text-amber-700 border-amber-200', icon: AlertCircle, label: 'Ulangi' },
};

export default function SetoranSantriPage() {
  const { user } = useAuth();
  const { settings } = useSettings();
  const [records, setRecords] = useState<SetoranRecord[]>([]);
  const [stats, setStats] = useState({ total: 0, rataRata: 0 });

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      try {
        const res = await fetch(`/api/setoran?santuario_id=${user.id}`);
        const data = await res.json();
        const mapped = (data.data || []).map((r: any) => ({
          id: r.id,
          santriId: r.santuario_id,
          santriName: r.santri_name || '',
          kelasNama: r.kelas_nama || '',
          nis: r.nis || '',
          surah: r.surah || '',
          ayat: r.ayat_start ? (r.ayat_end ? `${r.ayat_start}-${r.ayat_end}` : String(r.ayat_start)) : '',
          tajwid: r.tajwid_score || 0,
          makhraj: r.makhraj_score || 0,
          kelancaran: r.kelancaran_score || 0,
          rata: r.rata_rata || 0,
          status: r.status === 'LANJUT' ? 'Lanjut' as const : 'Ulang' as const,
          jenis: r.jenis || 'SABAQ',
          createdAt: r.created_at || '',
        }));
        setRecords(mapped);

        if (mapped.length > 0) {
          const sum = mapped.reduce((acc: number, r: SetoranRecord) => acc + r.rata, 0);
          setStats({ total: mapped.length, rataRata: parseFloat((sum / mapped.length).toFixed(1)) });
        }
      } catch (e) {
        console.error('Error loading setoran', e);
      }
    };

    loadData();
  }, [user]);

  const avatarInitials = user
    ? user.fullName.split(' ').map(n => n.charAt(0)).slice(0, 2).join('')
    : '';

  return (
    <div className="min-h-screen bg-tosca-50/30 flex flex-col pb-24 lg:pb-8">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-tosca-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/santri" className="h-10 w-10 rounded-2xl bg-tosca-50 border border-tosca-100 flex items-center justify-center text-tosca-600 hover:bg-tosca-100 transition-colors cursor-pointer">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <span className="text-base font-black text-tosca-900 block">Setoran Hafalan</span>
              <span className="text-[10px] text-tosca-500 font-medium">Riwayat setoran Anda</span>
            </div>
          </div>
          <div className={`h-10 w-10 rounded-xl ${settings.logoUrl ? 'bg-white p-1 border border-tosca-100' : 'bg-tosca-600'} flex items-center justify-center text-white font-bold text-sm overflow-hidden`}>
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt="Logo" className="max-h-full max-w-full object-contain" />
            ) : (
              <BookOpen className="h-5 w-5" />
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 space-y-6">
        {stats.total > 0 && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-tosca-50 shadow-sm p-5">
              <p className="text-xs font-semibold text-tosca-500 uppercase tracking-wider">Total Setoran</p>
              <p className="text-3xl font-black text-tosca-900 mt-1">{stats.total}</p>
            </div>
            <div className="bg-white rounded-2xl border border-tosca-50 shadow-sm p-5">
              <p className="text-xs font-semibold text-tosca-500 uppercase tracking-wider">Rata-rata Nilai</p>
              <p className="text-3xl font-black text-tosca-900 mt-1">{stats.rataRata}</p>
            </div>
          </div>
        )}

        {records.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="h-16 w-16 mx-auto text-tosca-200 mb-4" />
            <p className="text-tosca-400 font-semibold">Belum ada setoran</p>
            <p className="text-tosca-300 text-sm mt-1">Setoran akan muncul setelah musyrif mencatatnya</p>
          </div>
        ) : (
          <div className="space-y-3">
            {records.map((rec) => {
              const StatusIcon = statusConfig[rec.status]?.icon || CheckCircle2;
              return (
                <div key={rec.id} className="bg-white rounded-2xl border border-tosca-50 shadow-sm p-5">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <BookMarked className="h-4 w-4 text-tosca-500" />
                        <span className="font-bold text-tosca-900">{rec.surah}</span>
                        {rec.ayat && <span className="text-tosca-400 text-sm">Ayat {rec.ayat}</span>}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-tosca-400">
                        <span className={`px-2 py-0.5 rounded-full border font-semibold ${statusConfig[rec.status]?.color || ''}`}>
                          <StatusIcon className="h-3 w-3 inline mr-0.5" />
                          {statusConfig[rec.status]?.label || rec.status}
                        </span>
                        <span>{rec.jenis}</span>
                        <span>{rec.createdAt ? new Date(rec.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-tosca-700">{rec.rata}</p>
                      <p className="text-[10px] text-tosca-400 font-semibold">NILAI</p>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                    <div className="bg-tosca-50 rounded-xl py-2">
                      <p className="text-xs text-tosca-400 font-medium">Tajwid</p>
                      <p className="text-sm font-bold text-tosca-700">{rec.tajwid}</p>
                    </div>
                    <div className="bg-tosca-50 rounded-xl py-2">
                      <p className="text-xs text-tosca-400 font-medium">Makhraj</p>
                      <p className="text-sm font-bold text-tosca-700">{rec.makhraj}</p>
                    </div>
                    <div className="bg-tosca-50 rounded-xl py-2">
                      <p className="text-xs text-tosca-400 font-medium">Kelancaran</p>
                      <p className="text-sm font-bold text-tosca-700">{rec.kelancaran}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-tosca-100 px-3 sm:px-4 py-2 flex items-center justify-around shadow-2xl">
        <Link href="/dashboard/santri" className="flex flex-col items-center gap-0.5 text-tosca-400 hover:text-tosca-600 transition-colors cursor-pointer">
          <Home className="h-5 w-5" />
          <span className="text-[10px] font-semibold">Home</span>
        </Link>
        <Link href="/dashboard/santri/nilai" className="flex flex-col items-center gap-0.5 text-tosca-400 hover:text-tosca-600 transition-colors cursor-pointer">
          <Star className="h-5 w-5" />
          <span className="text-[10px] font-semibold">Nilai</span>
        </Link>
        <Link href="/dashboard/santri/presensi" className="flex flex-col items-center gap-0.5 text-tosca-400 hover:text-tosca-600 transition-colors cursor-pointer">
          <BookOpen className="h-5 w-5" />
          <span className="text-[10px] font-semibold">Hadir</span>
        </Link>
        <Link href="/dashboard/santri/virtual-class" className="flex flex-col items-center gap-0.5 text-tosca-400 hover:text-tosca-600 transition-colors cursor-pointer">
          <Video className="h-5 w-5" />
          <span className="text-[10px] font-semibold">Virtual</span>
        </Link>
        <Link href="/dashboard/santri/profil" className="flex flex-col items-center gap-0.5 text-tosca-400 hover:text-tosca-600 transition-colors cursor-pointer">
          <User className="h-5 w-5" />
          <span className="text-[10px] font-semibold">User</span>
        </Link>
      </nav>
    </div>
  );
}
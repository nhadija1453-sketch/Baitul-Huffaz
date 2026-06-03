'use client';
export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '@/components/ui/sidebar';
import Navbar from '@/components/ui/navbar';
import { useSettings } from '@/lib/hooks/useSettings';
import {
  Award, Search, Filter, Plus, Eye, Download, Send,
  Save, X, CheckCircle2, AlertCircle, Clock, FileText,
  Users, BookMarked, RefreshCw, GraduationCap, Star
} from 'lucide-react';

// ─── Interfaces ────────────────────────────────────────────────────────────────

interface Santri {
  id: string; nis: string; nisn: string;
  nama_lengkap: string; kelas_id: string; kelas_nama: string; is_active: boolean;
}

interface TargetRecord {
  id: string; santriId: string; nis: string; santriName: string;
  kelasNama: string; juzTarget: string; namaSurat: string;
  progres: number; statusLulus: string; catatan?: string; updatedAt: string;
}

interface HafalanRecord {
  id: string; santriId: string; santriName: string; nis: string;
  surah: string; tajwid: number; makhraj: number; kelancaran: number;
  rata: number; status: string; createdAt: string;
}

interface SertifikatRecord {
  id: string; nomorSertifikat: string; santriId: string; nis: string;
  santriName: string; kelasNama: string; namaSurat: string; juzKe: string;
  statusKelulusan: string; paragrafTeks: string; namaSekolah: string;
  alamatSekolah: string; akreditasi: string; nilaiTajwid: number;
  nilaiMakhraj: number; nilaiKelancaran: number; nilaiRata: number;
  kotaPenandatangan: string; tanggalTerbit: string;
  namaPenanggungJawab: string; jabatan: string;
  isPublished: boolean; createdAt: string;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function generateNomor(existing: SertifikatRecord[]): string {
  const yr = new Date().getFullYear();
  const sameYear = existing.filter(r => r.nomorSertifikat.includes(String(yr)));
  const next = sameYear.length + 1;
  return `BH/SRT/${yr}/${String(next).padStart(3, '0')}`;
}

function avgHafalan(records: HafalanRecord[], santriId: string) {
  const mine = records.filter(r => r.santriId === santriId || r.nis === santriId);
  if (mine.length === 0) return { tajwid: 0, makhraj: 0, kelancaran: 0, rata: 0 };
  const sum = mine.reduce((a, r) => ({
    tajwid:     a.tajwid     + r.tajwid,
    makhraj:    a.makhraj    + r.makhraj,
    kelancaran: a.kelancaran + r.kelancaran,
    rata:       a.rata       + r.rata,
  }), { tajwid: 0, makhraj: 0, kelancaran: 0, rata: 0 });
  const n = mine.length;
  return {
    tajwid:     Math.round(sum.tajwid     / n),
    makhraj:    Math.round(sum.makhraj    / n),
    kelancaran: Math.round(sum.kelancaran / n),
    rata:       Math.round(sum.rata       / n),
  };
}

function todayStr() {
  return new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

const STATUS_TARGET = {
  'Lulus':       { badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  'Proses':      { badge: 'bg-amber-50 text-amber-700 border-amber-200',       dot: 'bg-amber-400'   },
  'Belum Lulus': { badge: 'bg-rose-50 text-rose-700 border-rose-200',          dot: 'bg-rose-500'    },
};

// ─── Default Form Settings (persisten) ────────────────────────────────────────
interface FormSettings {
  alamatSekolah: string; akreditasi: string;
  namaPenanggungJawab: string; jabatan: string; kotaPenandatangan: string;
}
const DEFAULT_FORM: FormSettings = {
  alamatSekolah: '', akreditasi: 'A',
  namaPenanggungJawab: '', jabatan: 'Kepala Pondok', kotaPenandatangan: 'Palembang',
};

// ─── Komponen Utama ────────────────────────────────────────────────────────────

export default function ManajemenSertifikat() {
  const { settings } = useSettings();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Data
  const [santriList,    setSantriList]    = useState<Santri[]>([]);
  const [targetRecords, setTargetRecords] = useState<TargetRecord[]>([]);
  const [hafalanRecs,   setHafalanRecs]   = useState<HafalanRecord[]>([]);
  const [sertifikatRecs,setSertifikatRecs]= useState<SertifikatRecord[]>([]);

  // Filter
  const [selectedKelas, setSelectedKelas] = useState('Semua Kelas');
  const [searchQuery,   setSearchQuery]   = useState('');

  // Notif
  const [notif, setNotif] = useState<string | null>(null);
  const showNotif = (msg: string) => { setNotif(msg); setTimeout(() => setNotif(null), 3500); };

  // Modal state
  const [isModalOpen,    setIsModalOpen]    = useState(false);
  const [modalSantri,    setModalSantri]    = useState<Santri | null>(null);
  const [modalTarget,    setModalTarget]    = useState<TargetRecord | null>(null);
  const [modalNilai,     setModalNilai]     = useState({ tajwid: 0, makhraj: 0, kelancaran: 0, rata: 0 });
  const [modalExisting,  setModalExisting]  = useState<SertifikatRecord | null>(null);
  const [isPDFLoading,   setIsPDFLoading]   = useState(false);

  // Form fields
  const [fParagraf,    setFParagraf]    = useState('');
  const [fAlamat,      setFAlamat]      = useState('');
  const [fAkreditasi,  setFAkreditasi]  = useState('A');
  const [fNamaTTD,     setFNamaTTD]     = useState('');
  const [fJabatan,     setFJabatan]     = useState('');
  const [fKota,        setFKota]        = useState('');
  const [fTanggal,     setFTanggal]     = useState('');

  // ── Load data ────────────────────────────────────────────────────────────────
  const loadData = useCallback(() => {
    // Santri
    const s = localStorage.getItem('santri_list');
    if (s) { try { setSantriList(JSON.parse(s)); } catch {} }
    else {
      setSantriList([]);
    }
    // Target
    const t = localStorage.getItem('baitul_target_records');
    if (t) { try { setTargetRecords(JSON.parse(t)); } catch {} }
    // Hafalan
    const h = localStorage.getItem('baitul_hafalan_records');
    if (h) { try { setHafalanRecs(JSON.parse(h)); } catch {} }
    // Sertifikat
    const sr = localStorage.getItem('baitul_sertifikat_records');
    if (sr) { try { setSertifikatRecs(JSON.parse(sr)); } catch {} }
    // Form settings
    const fs = localStorage.getItem('baitul_sertifikat_settings');
    if (fs) {
      try {
        const p: FormSettings = { ...DEFAULT_FORM, ...JSON.parse(fs) };
        setFAlamat(p.alamatSekolah); setFAkreditasi(p.akreditasi);
        setFNamaTTD(p.namaPenanggungJawab); setFJabatan(p.jabatan); setFKota(p.kotaPenandatangan);
      } catch {}
    }
  }, []);

  useEffect(() => {
    loadData();
    const h = (e: StorageEvent) => {
      if (['santri_list','baitul_target_records','baitul_hafalan_records','baitul_sertifikat_records'].includes(e.key || '')) loadData();
    };
    window.addEventListener('storage', h);
    return () => window.removeEventListener('storage', h);
  }, [loadData]);

  // ── Buka Modal ───────────────────────────────────────────────────────────────
  const openModal = (santri: Santri) => {
    const target  = targetRecords.find(r => r.santriId === santri.id) || null;
    const nilai   = avgHafalan(hafalanRecs, santri.id);
    const existing = sertifikatRecs.find(r => r.santriId === santri.id) || null;

    setModalSantri(santri);
    setModalTarget(target);
    setModalNilai(nilai);
    setModalExisting(existing);

    // Pre-fill form dari existing atau default
    if (existing) {
      setFParagraf(existing.paragrafTeks);
      setFAlamat(existing.alamatSekolah);
      setFAkreditasi(existing.akreditasi);
      setFNamaTTD(existing.namaPenanggungJawab);
      setFJabatan(existing.jabatan);
      setFKota(existing.kotaPenandatangan);
      setFTanggal(existing.tanggalTerbit);
    } else {
      setFParagraf(
        `Telah berhasil menyelesaikan hafalan Al-Quran dengan baik sesuai kaidah Tajwid yang benar ` +
        `di ${settings.appName}. Sertifikat ini diberikan sebagai penghargaan atas dedikasi dan ` +
        `ketekunan dalam menghafal Kitabullah.`
      );
      setFTanggal(todayStr());
    }
    setIsModalOpen(true);
  };

  // ── Simpan form settings ke localStorage ─────────────────────────────────────
  const persistFormSettings = () => {
    const p: FormSettings = {
      alamatSekolah: fAlamat, akreditasi: fAkreditasi,
      namaPenanggungJawab: fNamaTTD, jabatan: fJabatan, kotaPenandatangan: fKota,
    };
    localStorage.setItem('baitul_sertifikat_settings', JSON.stringify(p));
  };

  // ── Build SertifikatRecord dari form ─────────────────────────────────────────
  const buildRecord = (isPublished: boolean): SertifikatRecord => {
    const nomor = modalExisting?.nomorSertifikat || generateNomor(sertifikatRecs);
    return {
      id:                  modalExisting?.id || `srt-${Date.now()}`,
      nomorSertifikat:     nomor,
      santriId:            modalSantri!.id,
      nis:                 modalSantri!.nis,
      santriName:          modalSantri!.nama_lengkap,
      kelasNama:           modalSantri!.kelas_nama,
      namaSurat:           modalTarget?.namaSurat  || '—',
      juzKe:               modalTarget?.juzTarget  || '—',
      statusKelulusan:     modalTarget?.statusLulus || 'Proses',
      paragrafTeks:        fParagraf,
      namaSekolah:         settings.appName,
      alamatSekolah:       fAlamat,
      akreditasi:          fAkreditasi,
      nilaiTajwid:         modalNilai.tajwid,
      nilaiMakhraj:        modalNilai.makhraj,
      nilaiKelancaran:     modalNilai.kelancaran,
      nilaiRata:           modalNilai.rata,
      kotaPenandatangan:   fKota,
      tanggalTerbit:       fTanggal,
      namaPenanggungJawab: fNamaTTD,
      jabatan:             fJabatan,
      isPublished,
      createdAt:           modalExisting?.createdAt || new Date().toISOString(),
    };
  };

  // ── Simpan Draft ──────────────────────────────────────────────────────────────
  const handleSimpanDraft = () => {
    if (!modalSantri) return;
    persistFormSettings();
    const rec = buildRecord(false);
    const filtered = sertifikatRecs.filter(r => r.santriId !== modalSantri.id);
    const updated = [rec, ...filtered];
    setSertifikatRecs(updated);
    localStorage.setItem('baitul_sertifikat_records', JSON.stringify(updated));
    setModalExisting(rec);
    showNotif(`Draft sertifikat ${modalSantri.nama_lengkap} berhasil disimpan.`);
  };

  // ── Simpan & Terbitkan ────────────────────────────────────────────────────────
  const handleTerbitkan = () => {
    if (!modalSantri) return;
    persistFormSettings();
    const rec = buildRecord(true);
    const filtered = sertifikatRecs.filter(r => r.santriId !== modalSantri.id);
    const updated = [rec, ...filtered];
    setSertifikatRecs(updated);
    localStorage.setItem('baitul_sertifikat_records', JSON.stringify(updated));
    setModalExisting(rec);
    showNotif(`✅ Sertifikat ${modalSantri.nama_lengkap} berhasil diterbitkan!`);
    setIsModalOpen(false);
  };

  // ── Cabut Publikasi ───────────────────────────────────────────────────────────
  const handleCabutTerbit = () => {
    if (!modalSantri || !modalExisting) return;
    const rec = { ...modalExisting, isPublished: false };
    const filtered = sertifikatRecs.filter(r => r.santriId !== modalSantri.id);
    const updated = [rec, ...filtered];
    setSertifikatRecs(updated);
    localStorage.setItem('baitul_sertifikat_records', JSON.stringify(updated));
    setModalExisting(rec);
    showNotif(`Publikasi sertifikat ${modalSantri.nama_lengkap} dicabut.`);
  };

  // ── Generate PDF (Download / Preview) ─────────────────────────────────────────
  const handlePDF = async (action: 'download' | 'preview') => {
    if (!modalSantri) return;
    persistFormSettings();
    setIsPDFLoading(true);
    try {
      const [{ pdf }, { SertifikatPDF }, Reacts] = await Promise.all([
        import('@react-pdf/renderer'),
        import('@/lib/pdf/SertifikatTemplate'),
        import('react'),
      ]);
      const rec = buildRecord(modalExisting?.isPublished || false);
      const data = {
        ...rec,
        logoUrl: settings.logoUrl || undefined,
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const element = Reacts.default.createElement(SertifikatPDF, { data }) as any;
      const blob = await pdf(element).toBlob();
      const url  = URL.createObjectURL(blob);
      if (action === 'download') {
        const a = document.createElement('a');
        a.href = url;
        a.download = `Sertifikat-${rec.santriName}-${rec.nomorSertifikat}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        showNotif(`PDF berhasil diunduh!`);
      } else {
        window.open(url, '_blank');
      }
    } catch (err) {
      console.error(err);
      alert('Gagal membuat PDF. Pastikan semua data sudah terisi.');
    } finally {
      setIsPDFLoading(false);
    }
  };

  // ── Data Turunan ──────────────────────────────────────────────────────────────
  const classList = Array.from(new Set(santriList.map(s => s.kelas_nama)));

  const tableData = santriList
    .filter(s => selectedKelas === 'Semua Kelas' || s.kelas_nama === selectedKelas)
    .filter(s =>
      s.nama_lengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nis.includes(searchQuery)
    )
    .map(s => {
      const target   = targetRecords.find(r => r.santriId === s.id);
      const sertif   = sertifikatRecs.find(r => r.santriId === s.id);
      return { santri: s, target, sertif };
    });

  const totalTerbit = sertifikatRecs.filter(r => r.isPublished).length;
  const totalDraft  = sertifikatRecs.filter(r => !r.isPublished).length;

  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-tosca-50/30">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="lg:pl-72 transition-all duration-300">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">

          {/* ── Toast ── */}
          {notif && (
            <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[70] flex items-center gap-2 bg-slate-900/95 backdrop-blur text-white px-5 py-3 rounded-2xl shadow-xl animate-in fade-in slide-in-from-top-4 max-w-sm">
              <CheckCircle2 className="text-teal-400 shrink-0" size={18} />
              <span className="text-xs font-extrabold">{notif}</span>
            </div>
          )}

          {/* ── Header ── */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-tosca-50 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-tosca-900 flex items-center gap-3">
                <Award className="text-amber-500" size={32} />
                Manajemen Sertifikat
              </h1>
              <p className="text-tosca-600 font-semibold text-sm">
                Buat, pratinjau, dan terbitkan sertifikat hafalan santri dalam format PDF.
              </p>
            </div>
            {/* Filter Kelas */}
            <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 p-2 rounded-2xl shrink-0">
              <Filter className="text-tosca-500 ml-2 shrink-0" size={16} />
              <select
                value={selectedKelas}
                onChange={e => setSelectedKelas(e.target.value)}
                className="bg-transparent font-bold text-tosca-900 border-none outline-none text-sm pr-3 cursor-pointer"
              >
                <option value="Semua Kelas">Semua Kelas</option>
                {classList.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* ── Stats Cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Total Santri',    val: santriList.length, icon: Users,     bg: 'bg-tosca-100', color: 'text-tosca-600',  unit: 'Santri' },
              { label: 'Sudah Terbit',    val: totalTerbit,       icon: CheckCircle2, bg: 'bg-emerald-100', color: 'text-emerald-600', unit: 'Sertifikat' },
              { label: 'Draft / Belum',   val: totalDraft + (santriList.length - sertifikatRecs.length), icon: FileText, bg: 'bg-amber-100', color: 'text-amber-600', unit: 'Santri' },
            ].map(item => (
              <div key={item.label} className="bg-white p-5 rounded-2xl border border-tosca-50 shadow-sm flex items-center gap-4">
                <div className={`h-12 w-12 rounded-xl ${item.bg} ${item.color} flex items-center justify-center`}>
                  <item.icon size={22} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{item.label}</p>
                  <p className="text-2xl font-black text-slate-900">{item.val} <span className="text-sm font-bold text-slate-400">{item.unit}</span></p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Tabel Utama ── */}
          <div className="bg-white rounded-3xl border border-tosca-50 shadow-sm overflow-hidden">
            {/* Search bar */}
            <div className="p-5 border-b border-tosca-50 flex flex-col sm:flex-row justify-between items-center gap-4">
              <h3 className="text-sm font-black text-tosca-900 flex items-center gap-2">
                <GraduationCap className="text-tosca-600" size={18} /> Daftar Santri
              </h3>
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-tosca-400" size={16} />
                <input
                  type="text"
                  placeholder="Cari nama / NIS..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-tosca-200 rounded-2xl text-xs font-bold text-black placeholder:text-tosca-400 focus:ring-2 focus:ring-tosca-500 focus:outline-none shadow-sm"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-tosca-50/40 border-b border-tosca-100 text-[10px] font-black text-tosca-400 uppercase tracking-widest">
                    <th className="py-4 px-5 text-center w-12">No</th>
                    <th className="py-4 px-5">NIS / NISN</th>
                    <th className="py-4 px-5">Nama Lengkap</th>
                    <th className="py-4 px-5">Kelas</th>
                    <th className="py-4 px-5">Nama Surat</th>
                    <th className="py-4 px-5 text-center">Status Target</th>
                    <th className="py-4 px-5 text-center">Sertifikat</th>
                    <th className="py-4 px-5 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-tosca-50 text-xs">
                  {tableData.length === 0 ? (
                    <tr><td colSpan={8} className="py-12 text-center text-slate-400 font-bold">
                      <AlertCircle className="mx-auto text-tosca-200 mb-2" size={32} strokeWidth={1.5} />
                      Tidak ada data santri ditemukan.
                    </td></tr>
                  ) : tableData.map(({ santri, target, sertif }, idx) => {
                    const stCfg = STATUS_TARGET[(target?.statusLulus as keyof typeof STATUS_TARGET) || 'Proses'];
                    return (
                      <tr key={santri.id} className="hover:bg-tosca-50/20 transition-all">
                        <td className="py-4 px-5 text-center font-bold text-slate-400">{idx + 1}</td>
                        <td className="py-4 px-5">
                          <p className="font-extrabold text-slate-800">{santri.nis}</p>
                          <p className="text-[9px] text-slate-400">NISN: {santri.nisn}</p>
                        </td>
                        <td className="py-4 px-5 font-black text-slate-900">{santri.nama_lengkap}</td>
                        <td className="py-4 px-5">
                          <span className="px-2 py-0.5 bg-tosca-50 text-tosca-700 border border-tosca-100 rounded font-extrabold text-[9px] uppercase">
                            {santri.kelas_nama}
                          </span>
                        </td>
                        <td className="py-4 px-5">
                          {target?.namaSurat ? (
                            <div className="flex items-center gap-1.5">
                              <BookMarked className="text-tosca-400 shrink-0" size={12} />
                              <span className="font-bold text-slate-700">{target.namaSurat}</span>
                            </div>
                          ) : <span className="text-slate-300">—</span>}
                        </td>
                        <td className="py-4 px-5 text-center">
                          {target ? (
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl border text-[9px] font-black uppercase ${stCfg.badge}`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${stCfg.dot}`} />
                              {target.statusLulus}
                            </span>
                          ) : <span className="text-slate-300 font-bold">—</span>}
                        </td>
                        <td className="py-4 px-5 text-center">
                          {sertif ? (
                            sertif.isPublished ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl border bg-emerald-50 text-emerald-700 border-emerald-200 text-[9px] font-black uppercase">
                                ✅ Terbit
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl border bg-slate-50 text-slate-500 border-slate-200 text-[9px] font-black uppercase">
                                💾 Draft
                              </span>
                            )
                          ) : (
                            <span className="text-slate-300 font-bold text-[9px]">Belum Dibuat</span>
                          )}
                        </td>
                        <td className="py-4 px-5 text-center">
                          <button
                            onClick={() => openModal(santri)}
                            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wide transition-all ${
                              sertif
                                ? 'bg-slate-100 text-slate-600 hover:bg-tosca-100 hover:text-tosca-700'
                                : 'bg-tosca-600 text-white hover:bg-tosca-700 shadow-sm'
                            }`}
                          >
                            {sertif ? <RefreshCw size={12} /> : <Plus size={12} />}
                            {sertif ? 'Edit' : 'Buat'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* ══════════════════════════════════════════════════════
          MODAL BUAT / EDIT SERTIFIKAT
      ══════════════════════════════════════════════════════ */}
      {isModalOpen && modalSantri && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/60 backdrop-blur-sm overflow-y-auto py-6 px-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">

            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-tosca-900 to-teal-800 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-teal-300 font-extrabold uppercase tracking-widest mb-0.5">
                  {modalExisting ? (modalExisting.isPublished ? '✅ Sudah Terbit' : '💾 Draft') : '✨ Buat Baru'}
                </p>
                <h2 className="text-base font-black text-white flex items-center gap-2">
                  <Award size={18} className="text-amber-400" />
                  Sertifikat — {modalSantri.nama_lengkap}
                </h2>
                {modalExisting && (
                  <p className="text-[10px] text-teal-300 mt-0.5">No. {modalExisting.nomorSertifikat}</p>
                )}
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-white/70 hover:text-white transition-colors">
                <X size={22} />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">

              {/* ── Data Otomatis Santri ── */}
              <div className="bg-tosca-50/50 rounded-2xl border border-tosca-100 p-4 space-y-3">
                <p className="text-[10px] font-black text-tosca-500 uppercase tracking-widest">Data Santri (Otomatis)</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Nama Lengkap', val: modalSantri.nama_lengkap },
                    { label: 'NIS', val: modalSantri.nis },
                    { label: 'Kelas', val: modalSantri.kelas_nama },
                  ].map(item => (
                    <div key={item.label} className="bg-white rounded-xl p-3 border border-tosca-100">
                      <p className="text-[9px] text-tosca-400 font-bold uppercase">{item.label}</p>
                      <p className="text-xs font-black text-slate-800 mt-1 truncate">{item.val}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Data Target & Nilai ── */}
              <div className="bg-fuchsia-50/40 rounded-2xl border border-fuchsia-100 p-4 space-y-3">
                <p className="text-[10px] font-black text-fuchsia-600 uppercase tracking-widest">Data Hafalan (dari Target & Setoran)</p>
                {modalTarget ? (
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Nama Surat', val: modalTarget.namaSurat },
                      { label: 'Juz ke-', val: modalTarget.juzTarget },
                      { label: 'Status', val: modalTarget.statusLulus },
                    ].map(item => (
                      <div key={item.label} className="bg-white rounded-xl p-3 border border-fuchsia-100">
                        <p className="text-[9px] text-fuchsia-400 font-bold uppercase">{item.label}</p>
                        <p className="text-xs font-black text-slate-800 mt-1">{item.val}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-2">
                    <AlertCircle className="text-amber-500 shrink-0" size={16} />
                    <p className="text-xs text-amber-700 font-semibold">
                      Belum ada data target. Musyrif perlu mengisi Target Hafalan terlebih dahulu.
                    </p>
                  </div>
                )}
                {/* Nilai */}
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: 'Tajwid',     val: modalNilai.tajwid },
                    { label: 'Makhraj',    val: modalNilai.makhraj },
                    { label: 'Kelancaran', val: modalNilai.kelancaran },
                    { label: 'Rata-rata',  val: modalNilai.rata },
                  ].map(item => (
                    <div key={item.label} className={`rounded-xl p-3 border text-center ${item.label === 'Rata-rata' ? 'bg-tosca-50 border-tosca-200' : 'bg-white border-fuchsia-100'}`}>
                      <p className="text-[9px] text-slate-400 font-bold uppercase">{item.label}</p>
                      <p className={`text-lg font-black mt-1 ${item.label === 'Rata-rata' ? 'text-tosca-700' : 'text-slate-800'}`}>{item.val || '—'}</p>
                    </div>
                  ))}
                </div>
                {hafalanRecs.filter(r => r.santriId === modalSantri.id).length === 0 && (
                  <p className="text-[10px] text-slate-400 font-semibold italic text-center">
                    * Nilai 0 karena belum ada data setoran hafalan untuk santri ini.
                  </p>
                )}
              </div>

              {/* ── Input: Data Sekolah ── */}
              <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Data Kop Sertifikat</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Alamat Sekolah / Pondok</label>
                    <input
                      type="text"
                      placeholder="Jl. Contoh No. 1, Kota, Provinsi"
                      value={fAlamat}
                      onChange={e => setFAlamat(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-tosca-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Akreditasi</label>
                    <select
                      value={fAkreditasi}
                      onChange={e => setFAkreditasi(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-tosca-500"
                    >
                      {['A','B','C','Belum Terakreditasi'].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* ── Input: Paragraf Teks ── */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                  Paragraf Teks Sertifikat
                </label>
                <textarea
                  rows={4}
                  value={fParagraf}
                  onChange={e => setFParagraf(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-tosca-500 resize-none leading-relaxed"
                />
              </div>

              {/* ── Input: Data TTD ── */}
              <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Data Penandatanganan</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Kota Penandatangan</label>
                    <input type="text" placeholder="Palembang" value={fKota} onChange={e => setFKota(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-tosca-500" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Tanggal Terbit</label>
                    <input type="text" placeholder="03 Juni 2026" value={fTanggal} onChange={e => setFTanggal(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-tosca-500" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Nama Penanggung Jawab</label>
                    <input type="text" placeholder="Ust. Ahmad, S.Pd.I" value={fNamaTTD} onChange={e => setFNamaTTD(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-tosca-500" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Jabatan</label>
                    <input type="text" placeholder="Kepala Pondok" value={fJabatan} onChange={e => setFJabatan(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-tosca-500" />
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer — Tombol Aksi */}
            <div className="p-5 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center gap-3">
              {/* Preview */}
              <button
                onClick={() => handlePDF('preview')}
                disabled={isPDFLoading}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-black uppercase hover:bg-slate-100 transition-all disabled:opacity-50"
              >
                <Eye size={14} /> Preview
              </button>

              {/* Unduh PDF */}
              <button
                onClick={() => handlePDF('download')}
                disabled={isPDFLoading}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-tosca-200 text-tosca-700 rounded-xl text-xs font-black uppercase hover:bg-tosca-50 transition-all disabled:opacity-50"
              >
                <Download size={14} />
                {isPDFLoading ? 'Memproses...' : 'Unduh PDF'}
              </button>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Simpan Draft */}
              <button
                onClick={handleSimpanDraft}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-800 text-white rounded-xl text-xs font-black uppercase transition-all"
              >
                <Save size={14} /> Simpan Draft
              </button>

              {/* Cabut / Terbitkan */}
              {modalExisting?.isPublished ? (
                <button
                  onClick={handleCabutTerbit}
                  className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black uppercase transition-all"
                >
                  <X size={14} /> Cabut Terbit
                </button>
              ) : (
                <button
                  onClick={handleTerbitkan}
                  className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase transition-all shadow-md"
                >
                  <Send size={14} /> Terbitkan
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

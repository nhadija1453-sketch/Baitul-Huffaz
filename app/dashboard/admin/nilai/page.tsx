'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/ui/sidebar';
import Navbar from '@/components/ui/navbar';
import { 
  GraduationCap, 
  Search, 
  Filter, 
  Star, 
  TrendingUp, 
  ChevronRight, 
  FileSearch,
  CheckCircle2,
  X
} from 'lucide-react';

export default function ManajemenNilai() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeModal, setActiveModal] = useState<'filter' | 'analysis' | 'detail' | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [nilaiList, setNilaiList] = useState<any[]>([]);

  React.useEffect(() => {
    const stored = localStorage.getItem('baitul_hafalan_records');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const mapped = parsed.map((r: any) => ({
          id: r.id,
          nama: r.santriName,
          juz: r.surah.includes('Juz') ? r.surah.replace(/Juz\s+/i, '') : '30', // extract or fallback
          surat: r.surah,
          nilai: r.rata.toFixed(0),
          status: r.rata >= 90 ? 'Mumtaz' : r.rata >= 80 ? 'Lancar' : 'Murojaah'
        }));
        setNilaiList(mapped);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const openDetail = (student: any) => {
    setSelectedStudent(student);
    setActiveModal('detail');
  };

  return (
    <div className="min-h-screen bg-tosca-50/30">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="lg:pl-72 transition-all duration-300">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {/* Header Card with White Background */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-tosca-50 shadow-sm mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-tosca-900">Manajemen Nilai</h1>
              <p className="text-tosca-600 font-medium">Pantau perkembangan hafalan dan evaluasi santri Baitul Huffaz.</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setActiveModal('filter')}
                className="flex items-center justify-center gap-2 bg-white border-2 border-tosca-50 text-tosca-600 px-5 py-3 rounded-2xl font-bold hover:bg-tosca-50 transition-all active:scale-95"
              >
                <Filter size={18} />
                Filter
              </button>
              <button 
                onClick={() => setActiveModal('analysis')}
                className="flex items-center justify-center gap-2 bg-tosca-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-tosca-100 hover:bg-tosca-700 transition-all active:scale-95"
              >
                <TrendingUp size={20} />
                Analisis Progres
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-tosca-50 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-tosca-50 bg-tosca-50/20">
              <div className="relative group max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-tosca-400">
                  <Search size={20} />
                </div>
                <input 
                  type="text" 
                  placeholder="Cari nama santri..." 
                  className="pl-11 pr-4 py-3 bg-white border border-tosca-200 rounded-2xl text-sm font-bold text-black placeholder:text-tosca-400 focus:ring-2 focus:ring-tosca-500 w-full shadow-sm transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="divide-y divide-tosca-50">
              {nilaiList.length === 0 ? (
                <div className="p-8 text-center text-slate-400 font-bold">
                  Belum ada data nilai hafalan.
                </div>
              ) : nilaiList.filter(n => n.nama.toLowerCase().includes(searchTerm.toLowerCase())).map((n) => (
                <div key={n.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-tosca-50/30 transition-all duration-300 group">
                  <div className="flex items-center gap-5">
                    <div className="h-14 w-14 rounded-2xl bg-tosca-600 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-tosca-100 group-hover:scale-110 transition-transform">
                      {n.nilai}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-lg font-extrabold text-tosca-900">{n.nama}</h4>
                      <p className="text-sm text-tosca-500 font-bold flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-tosca-100 text-tosca-700 rounded-md text-[10px] uppercase">Juz {n.juz}</span>
                        {n.surat}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1 text-yellow-500 mb-1.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={16} fill={i < 4 ? 'currentColor' : 'none'} className={i < 4 ? 'animate-pulse' : ''} />
                        ))}
                      </div>
                      <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm ${
                        n.status === 'Mumtaz' ? 'bg-green-500 text-white' : 
                        n.status === 'Lancar' ? 'bg-blue-500 text-white' : 'bg-orange-500 text-white'
                      }`}>
                        {n.status}
                      </span>
                    </div>
                    <button 
                      onClick={() => openDetail(n)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-tosca-50 text-tosca-700 rounded-xl text-sm font-bold hover:bg-tosca-900 hover:text-white transition-all shadow-sm"
                    >
                      <FileSearch size={18} />
                      Detail Nilai
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Modal Filter */}
      {activeModal === 'filter' && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-tosca-50 flex items-center justify-between bg-tosca-50/20">
              <h2 className="text-xl font-bold text-tosca-900 flex items-center gap-2">
                <Filter size={20} /> Filter Nilai
              </h2>
              <button onClick={() => setActiveModal(null)} className="text-tosca-400 hover:text-tosca-600"><X size={24} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-tosca-700">Pilih Kelas</label>
                <select className="w-full px-4 py-3 rounded-xl border border-tosca-100 font-bold text-tosca-900">
                  <option>Semua Kelas</option>
                  <option>7A</option>
                  <option>8A</option>
                  <option>9A</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-tosca-700">Status Kelancaran</label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {['Mumtaz', 'Lancar', 'Murojaah'].map(s => (
                    <button key={s} className="px-4 py-2 rounded-full border border-tosca-100 text-xs font-bold text-tosca-600 hover:bg-tosca-600 hover:text-white transition-all">{s}</button>
                  ))}
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="w-full py-4 bg-tosca-600 text-white rounded-2xl font-bold shadow-lg shadow-tosca-200 mt-4">Terapkan Filter</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Analisis Progres */}
      {activeModal === 'analysis' && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-tosca-50 flex items-center justify-between bg-tosca-600 text-white">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <TrendingUp size={20} /> Analisis Progres Hafalan
              </h2>
              <button onClick={() => setActiveModal(null)} className="text-white/80 hover:text-white"><X size={24} /></button>
            </div>
            <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-6 text-center">
              <div className="p-6 bg-tosca-50 rounded-3xl border border-tosca-100">
                <p className="text-tosca-500 text-xs font-bold uppercase mb-1">Rata-rata Nilai</p>
                <p className="text-4xl font-black text-tosca-900">88.5</p>
              </div>
              <div className="p-6 bg-tosca-50 rounded-3xl border border-tosca-100">
                <p className="text-tosca-500 text-xs font-bold uppercase mb-1">Total Hafalan</p>
                <p className="text-4xl font-black text-tosca-900">1,240 <span className="text-sm font-bold">Ayat</span></p>
              </div>
              <div className="sm:col-span-2 p-6 bg-tosca-900 text-white rounded-3xl">
                <p className="font-bold mb-4">Statistik Status Santri</p>
                <div className="flex items-center justify-around">
                  <div><p className="text-2xl font-black">45%</p><p className="text-[10px] uppercase font-bold text-tosca-300">Mumtaz</p></div>
                  <div className="h-10 w-[1px] bg-white/20"></div>
                  <div><p className="text-2xl font-black">40%</p><p className="text-[10px] uppercase font-bold text-tosca-300">Lancar</p></div>
                  <div className="h-10 w-[1px] bg-white/20"></div>
                  <div><p className="text-2xl font-black">15%</p><p className="text-[10px] uppercase font-bold text-tosca-300">Murojaah</p></div>
                </div>
              </div>
            </div>
            <div className="p-6 bg-tosca-50/30 text-center">
              <button onClick={() => setActiveModal(null)} className="px-8 py-3 bg-tosca-600 text-white rounded-xl font-bold shadow-lg">Tutup Analisis</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detail Nilai */}
      {activeModal === 'detail' && selectedStudent && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-tosca-50 flex items-center gap-4 bg-tosca-50/20">
              <div className="h-16 w-16 rounded-2xl bg-tosca-600 flex items-center justify-center text-white text-2xl font-black">
                {selectedStudent.nilai}
              </div>
              <div>
                <h2 className="text-xl font-black text-tosca-900">{selectedStudent.nama}</h2>
                <p className="text-sm text-tosca-500 font-bold uppercase tracking-wider">Laporan Detail Hafalan</p>
              </div>
              <button onClick={() => setActiveModal(null)} className="ml-auto text-tosca-400 hover:text-tosca-600"><X size={24} /></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-tosca-50 rounded-2xl">
                  <p className="text-[10px] font-bold text-tosca-400 uppercase mb-1">Capaian Terakhir</p>
                  <p className="font-bold text-tosca-900">Juz {selectedStudent.juz}</p>
                </div>
                <div className="p-4 bg-tosca-50 rounded-2xl">
                  <p className="text-[10px] font-bold text-tosca-400 uppercase mb-1">Surah</p>
                  <p className="font-bold text-tosca-900">{selectedStudent.surat}</p>
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-sm font-bold text-tosca-900 px-1">Riwayat Pekan Ini</p>
                {[
                  { tgl: '14 Mei', kgt: 'Sabaq (Hafalan Baru)', n: '90' },
                  { tgl: '15 Mei', kgt: 'Sabqi (Murojaah Baru)', n: '85' },
                  { tgl: '16 Mei', kgt: 'Manzil (Murojaah Lama)', n: selectedStudent.nilai },
                ].map((r, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border border-tosca-50 rounded-xl hover:bg-tosca-50/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-tosca-400 w-12">{r.tgl}</span>
                      <span className="text-sm font-bold text-tosca-800">{r.kgt}</span>
                    </div>
                    <span className="text-sm font-black text-tosca-600">{r.n}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => window.print()} className="w-full py-4 border-2 border-tosca-50 text-tosca-600 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-tosca-50 transition-all">
                <FileSearch size={20} /> Cetak Raport Hafalan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

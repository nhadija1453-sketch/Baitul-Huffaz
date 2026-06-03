# 📋 ANALISIS MASALAH: ICON & TAMPILAN MODUL TIDAK KONSISTEN
**Status:** Analisis & Dokumentasi (BUKAN PERBAIKAN)  
**Tanggal:** 1 Juni 2026  
**Dashboard yang Dianalisis:** Santri & Musyrif

---

## 1️⃣ DAFTAR MASALAH YANG TERIDENTIFIKASI

### A. Icon Tidak Konsisten antara Santri & Musyrif Dashboard

| No | Modul | Icon Santri | Icon Musyrif | Status | Catatan |
|-----|-------|-----------|-------------|--------|---------|
| 1 | Beranda | `Home` | `Sliders` | ❌ BERBEDA | Santri: Home icon, Musyrif: Sliders (settings) |
| 2 | Setoran | ❌ TIDAK ADA | `BookOpen` | ⚠️ MISSING | Santri TIDAK punya modul Setoran di launcher |
| 3 | Nilai | `Star` | `Star` | ✅ SAMA | Keduanya menggunakan Star icon |
| 4 | Evaluasi | `ClipboardList` | `ClipboardList` | ✅ SAMA | Keduanya menggunakan ClipboardList icon |
| 5 | Target | `Target` | `Target` | ✅ SAMA | Keduanya menggunakan Target icon |
| 6 | Presensi | ❌ TIDAK ADA | `CheckSquare` | ⚠️ MISSING | Santri TIDAK punya modul Presensi |
| 7 | Jadwal | ❌ TIDAK ADA | `Calendar` | ⚠️ MISSING | Santri TIDAK punya modul Jadwal |
| 8 | Zoom/Video | `Video` | ❌ TIDAK ADA | ⚠️ MISSING | Musyrif TIDAK punya modul Zoom |
| 9 | Sertifikat | `Award` | `Award` | ✅ SAMA | Keduanya menggunakan Award icon |

### B. Perbedaan Modul yang Ditampilkan

**Santri Dashboard (6 Modul):**
```
1. Beranda (Home)
2. Nilai (Star)
3. Evaluasi (ClipboardList)
4. Target (Target)
5. Zoom (Video)
6. Sertifikat (Award)
```

**Musyrif Dashboard (9 Modul):**
```
1. Dashboard (Sliders)
2. Setoran (BookOpen)
3. Input Nilai (Star)
4. Status (BookOpenCheck)
5. Evaluasi (ClipboardList)
6. Presensi (CheckSquare)
7. Jadwal (Calendar)
8. Target (Target)
9. Sertifikat (Award)
```

### C. Perbedaan Warna Gradient

| Modul | Santri Gradient | Musyrif Gradient | Status |
|-------|-----------------|-----------------|--------|
| Beranda/Dashboard | `from-teal-500 to-emerald-600` | `from-teal-500 to-emerald-600` | ✅ SAMA |
| Setoran | - | `from-sky-500 to-blue-600` | - |
| Nilai | `from-amber-400 to-orange-500` | `from-amber-400 to-orange-500` | ✅ SAMA |
| Status | - | `from-rose-500 to-pink-600` | - |
| Evaluasi | `from-violet-500 to-purple-600` | `from-violet-500 to-purple-600` | ✅ SAMA |
| Presensi | - | `from-green-500 to-emerald-600` | - |
| Jadwal | - | `from-indigo-500 to-blue-700` | - |
| Target | `from-fuchsia-500 to-purple-700` | `from-fuchsia-500 to-purple-700` | ✅ SAMA |
| Zoom | `from-sky-500 to-blue-600` | - | - |
| Sertifikat | `from-yellow-500 to-amber-600` | `from-yellow-500 to-amber-600` | ✅ SAMA |

---

## 2️⃣ MASALAH UTAMA: MODUL TIDAK BERFUNGSI SEPERTI SEHARUSNYA

### Perilaku SAAT INI:
Ketika user **MENGKLIK** modul/icon, sistem hanya **MENGGANTI TAMPILAN KONTEN** di area bawah launcher (conditional rendering dengan `activeSection` state), BUKAN membuka halaman/table baru.

### Perilaku SEHARUSNYA:
Ketika user **MENGKLIK** modul tertentu, maka:

#### 🎯 Modul "Setoran" (Musyrif)
- **Seharusnya membuka:** Tabel Input Setoran Hafalan Baru
- **Fitur yang harus ada:**
  - Form input dengan field: Pilih Santri, Surah, Rentang Ayat, Status, Nilai (Tajwid, Makhraj, Kelancaran)
  - Tombol Simpan Data Setoran
  - Tabel display riwayat setoran terbaru dengan kolom: Nama, Surah, Ayat, Status, Tanggal, Nilai
  - ✅ **FITUR INI SUDAH BERFUNGSI** (hanya perlu tampilan lebih baik)

#### 📊 Modul "Input Nilai" (Musyrif)
- **Seharusnya membuka:** Tabel Detail Nilai Santri
- **Fitur yang harus ada:**
  - Tabel dengan kolom: Nama Santri, Tajwid, Makhraj, Kelancaran, Skor Akhir
  - Nilai bisa di-edit per santri
  - Menampilkan rata-rata nilai keseluruhan
  - ✅ **FITUR INI SUDAH BERFUNGSI** (hanya perlu tampilan lebih baik)

#### 👥 Modul "Status" (Musyrif)
- **Seharusnya membuka:** Status Hafalan Santri (Lanjut/Ulangi)
- **Fitur yang harus ada:**
  - Dua panel: Status Lanjut (Hijau) dan Status Ulangi (Merah)
  - List santri dengan status mereka
  - ✅ **FITUR INI SUDAH BERFUNGSI**

#### 📝 Modul "Evaluasi" (Santri & Musyrif)
- **Seharusnya membuka:** Form Evaluasi & Karakter Santri
- **Fitur yang harus ada:**
  - Form update predikat adab (Sangat Baik, Baik, Cukup)
  - Tabel daftar sikap santri dengan predikat
  - ✅ **FITUR INI SUDAH BERFUNGSI**

#### ✔️ Modul "Presensi" (Musyrif)
- **Seharusnya membuka:** Form Input Kehadiran Santri
- **Fitur yang harus ada:**
  - List santri dengan tombol status: Hadir, Izin, Sakit, Alpa
  - Opsi select per santri
  - ✅ **FITUR INI SUDAH BERFUNGSI**

#### 📅 Modul "Jadwal" (Musyrif)
- **Seharusnya membuka:** Form & Tabel Jadwal Halaqah
- **Fitur yang harus ada:**
  - Form input: Sesi, Jam, Lokasi
  - Tabel display jadwal aktif
  - ✅ **FITUR INI SUDAH BERFUNGSI**

#### 🎯 Modul "Target" (Santri & Musyrif)
- **Seharusnya membuka:** Form & Display Target Hafalan
- **Fitur yang harus ada:**
  - Target aktif dengan progress bar
  - Daftar juz yang sudah selesai
  - (Musyrif: bisa update target per santri)
  - ✅ **FITUR INI SUDAH BERFUNGSI**

#### 🎥 Modul "Zoom" (Santri)
- **Seharusnya membuka:** Form Akses Room Halaqah Online
- **Fitur yang harus ada:**
  - Tampilan zoom meeting ID dan passcode
  - Tombol "Gabung Halaqah Sekarang"
  - Simulated live view saat bergabung
  - ✅ **FITUR INI SUDAH BERFUNGSI**

#### 📜 Modul "Sertifikat" (Santri & Musyrif)
- **Seharusnya membuka:** Daftar Sertifikat Kelulusan
- **Fitur yang harus ada:**
  - List sertifikat per juz
  - Tombol download sertifikat
  - ✅ **FITUR INI SUDAH BERFUNGSI**

---

## 3️⃣ ANALISIS DETAIL PER MASALAH

### ❌ MASALAH #1: Icon "Beranda" Tidak Konsisten
**File Affected:**
- [app/dashboard/santri/page.tsx](app/dashboard/santri/page.tsx#L9) → menggunakan `Home`
- [app/dashboard/musyrif/page.tsx](app/dashboard/musyrif/page.tsx#L30) → menggunakan `Sliders`

**Penyebab:**
```typescript
// SANTRI (Home icon)
{ id: 'overview', label: 'Beranda', icon: Home, ... }

// MUSYRIF (Sliders icon - lebih seperti settings)
{ id: 'overview', label: 'Dashboard', icon: Sliders, ... }
```

**Dampak:**
- User confusion tentang fungsi modul
- Inconsistent visual language
- Tidak ada keselarasan UX/UI design system

**Saran Perbaikan:**
```typescript
// Gunakan icon yang sama untuk kedua dashboard
// Opsi 1: Gunakan Home untuk keduanya (paling intuitif untuk "beranda")
{ id: 'overview', label: 'Beranda/Dashboard', icon: Home, ... }

// Opsi 2: Gunakan LayoutGrid atau LayoutDashboard
import { LayoutDashboard } from 'lucide-react';
{ id: 'overview', label: 'Dashboard', icon: LayoutDashboard, ... }

// Opsi 3: Gunakan Sliders tapi konsisten untuk keduanya
{ id: 'overview', label: 'Dashboard', icon: Sliders, ... }
```

---

### ❌ MASALAH #2: Santri Dashboard Tidak Punya Modul "Setoran"
**File Affected:**
- [app/dashboard/santri/page.tsx](app/dashboard/santri/page.tsx#L18-L25)

**Current Code:**
```typescript
const modules = [
  { id: 'overview', label: 'Beranda', icon: Home, color: 'from-teal-500 to-emerald-600' },
  { id: 'nilai', label: 'Nilai', icon: Star, color: 'from-amber-400 to-orange-500' },
  { id: 'evaluasi', label: 'Evaluasi', icon: ClipboardList, color: 'from-violet-500 to-purple-600' },
  { id: 'target', label: 'Target', icon: Target, color: 'from-fuchsia-500 to-purple-700' },
  { id: 'zoom', label: 'Zoom', icon: Video, color: 'from-sky-500 to-blue-600' },
  { id: 'sertifikat', label: 'Sertifikat', icon: Award, color: 'from-yellow-500 to-amber-600' },
];
```

**Penyebab:**
- Design decision: menganggap santri cukup lihat nilai, bukan input setoran
- Setoran hanya di-manage oleh musyrif

**Dampak:**
- Santri tidak bisa melihat history setoran mereka di dashboard
- Asymmetric functionality antara santri dan musyrif

**Saran Perbaikan:**
```typescript
// Tambahkan modul "Setoran" untuk santri
const modules = [
  { id: 'overview', label: 'Beranda', icon: Home, color: 'from-teal-500 to-emerald-600' },
  { id: 'setoran', label: 'Setoran', icon: BookOpen, color: 'from-sky-500 to-blue-600' },  // BARU
  { id: 'nilai', label: 'Nilai', icon: Star, color: 'from-amber-400 to-orange-500' },
  // ... rest of modules
];

// Tambahkan conditional rendering untuk section 'setoran'
{active === 'setoran' && (
  <div className="bg-white rounded-2xl border border-tosca-50 shadow-sm p-6 space-y-4">
    <h3 className="text-sm font-black text-tosca-900 flex items-center gap-2">
      <BookOpen className="text-sky-500" size={18} /> Riwayat Setoran Hafalan
    </h3>
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-tosca-100 text-[10px] font-black text-tosca-400 uppercase tracking-widest bg-tosca-50">
            <th className="py-3 px-4">Tanggal</th>
            <th className="py-3 px-4">Surah & Ayat</th>
            <th className="py-3 px-4 text-center">Tajwid</th>
            <th className="py-3 px-4 text-center">Makhraj</th>
            <th className="py-3 px-4 text-center">Kelancaran</th>
            <th className="py-3 px-4 text-center">Nilai Akhir</th>
            <th className="py-3 px-4 text-center">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-tosca-50 text-xs">
          {riwayat.map(r => (
            <tr key={r.id} className="hover:bg-tosca-50/50">
              <td className="py-3 px-4 font-medium">{r.tgl}</td>
              <td className="py-3 px-4 font-black">Surah {r.surah} ({r.ayat})</td>
              <td className="py-3 px-4 text-center font-bold">{r.tajwid}</td>
              <td className="py-3 px-4 text-center font-bold">{r.makhraj}</td>
              <td className="py-3 px-4 text-center font-bold">{r.kelancaran}</td>
              <td className="py-3 px-4 text-center">
                <span className="px-2 py-0.5 bg-tosca-600 text-white rounded text-[10px] font-black">{r.rata}</span>
              </td>
              <td className="py-3 px-4 text-center">
                <span className={`px-2 py-0.5 rounded text-[9px] font-black ${r.status === 'Lanjut' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                  {r.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}
```

---

### ❌ MASALAH #3: Musyrif Dashboard Tidak Punya Modul "Zoom"
**File Affected:**
- [app/dashboard/musyrif/page.tsx](app/dashboard/musyrif/page.tsx#L26-L36)

**Penyebab:**
- Design decision: Zoom room adalah untuk santri, bukan musyrif

**Dampak:**
- Musyrif hanya bisa lihat zoom credentials dari student view
- Tidak ada unified way untuk musyrif manage zoom session

**Saran Perbaikan (Optional):**
```typescript
// Jika diperlukan, tambahkan modul "Monitor Zoom" untuk musyrif
const modules = [
  { id: 'overview', label: 'Dashboard', icon: Sliders, color: 'from-teal-500 to-emerald-600' },
  { id: 'setoran', label: 'Setoran', icon: BookOpen, color: 'from-sky-500 to-blue-600' },
  // ... existing modules
  { id: 'zoom', label: 'Monitor Zoom', icon: Video, color: 'from-sky-500 to-blue-600' },
];
```

---

### ❌ MASALAH #4: Tampilan Tabel Input Setoran Terlalu Panjang & Kompleks
**File Affected:**
- [app/dashboard/musyrif/page.tsx](app/dashboard/musyrif/page.tsx#L410-L470)

**Current Issue:**
```typescript
{/* INPUT SETORAN */}
{activeSection === 'setoran' && (
  <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-6 max-w-2xl mx-auto">
    <div className="border-b border-slate-55 pb-4">
      <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
        <BookOpen className="text-tosca-600" size={20} /> Input Setoran Hafalan Baru
      </h3>
    </div>
    {/* ... FORM FIELDS ... */}
  </div>
)}
```

**Penyebab:**
- Form dan tabel digabung dalam satu section
- Layout tidak responsif untuk mobile dengan banyak input field
- Visual hierarchy kurang jelas

**Dampak:**
- UX tidak optimal di mobile device
- Form terlalu bergumul dengan tabel display
- User bingung flow input vs display

**Saran Perbaikan:**
```typescript
// Pisahkan menjadi 2 layout:
// 1. Form Input (left/top) - max-w-sm
// 2. Tabel Display (right/bottom) - flex-1

{activeSection === 'setoran' && (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {/* FORM SECTION */}
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-6 md:col-span-1">
      <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
        <BookOpen className="text-tosca-600" size={20} /> Input Setoran Baru
      </h3>
      <form onSubmit={handleAddSetoran} className="space-y-4">
        {/* ... form fields ... */}
      </form>
    </div>

    {/* TABEL DISPLAY SECTION */}
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4 md:col-span-2">
      <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
        <BookOpen className="text-tosca-600" size={20} /> Daftar Setoran Terbaru
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          {/* ... table content ... */}
        </table>
      </div>
    </div>
  </div>
)}
```

---

### ❌ MASALAH #5: Input Nilai Table Tidak Bisa Di-Edit
**File Affected:**
- [app/dashboard/musyrif/page.tsx](app/dashboard/musyrif/page.tsx#L480-L510)

**Current Code:**
```typescript
{/* INPUT NILAI */}
{activeSection === 'nilai' && (
  <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 space-y-6">
    <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
      <Star size={16} className="text-amber-500" /> Detail Aspek Nilai Santri
    </h3>
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        {/* TABEL HANYA DISPLAY, TIDAK BISA DI-EDIT */}
```

**Penyebab:**
- Table hanya menampilkan data read-only
- Tidak ada edit buttons atau inline editing
- User harus kembali ke form setoran untuk update nilai

**Dampak:**
- UX tidak ideal - user tidak bisa quick-edit nilai di tabel
- Workflow tidak efisien
- Sulit melakukan bulk update

**Saran Perbaikan:**
```typescript
{/* INPUT NILAI - EDITABLE */}
{activeSection === 'nilai' && (
  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
    {/* FORM UPDATE NILAI (left) */}
    <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4 lg:col-span-1">
      <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">Update Nilai</h4>
      <form onSubmit={handleUpdateSingleNilai} className="space-y-3">
        <select 
          value={selectedSantriId}
          onChange={(e) => setSelectedSantriId(e.target.value)}
          className="w-full p-2.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 bg-white"
        >
          {santriList.map(s => (
            <option key={s.id} value={s.id}>{s.nama}</option>
          ))}
        </select>
        
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase">Tajwid</label>
          <input 
            type="number" 
            value={inputTajwid} 
            onChange={(e) => setInputTajwid(e.target.value)}
            min="0" max="100"
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 font-bold text-center text-black"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase">Makhraj</label>
          <input 
            type="number" 
            value={inputMakhraj} 
            onChange={(e) => setInputMakhraj(e.target.value)}
            min="0" max="100"
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 font-bold text-center text-black"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase">Kelancaran</label>
          <input 
            type="number" 
            value={inputKelancaran} 
            onChange={(e) => setInputKelancaran(e.target.value)}
            min="0" max="100"
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 font-bold text-center text-black"
          />
        </div>
        
        <button type="submit" className="w-full py-2.5 bg-tosca-600 text-white rounded-lg text-xs font-bold shadow">
          Update Nilai
        </button>
      </form>
    </div>

    {/* TABEL NILAI (right) */}
    <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4 lg:col-span-3">
      <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">Daftar Nilai Santri</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50">
              <th className="py-3 px-4">Nama</th>
              <th className="py-3 px-4 text-center">Tajwid</th>
              <th className="py-3 px-4 text-center">Makhraj</th>
              <th className="py-3 px-4 text-center">Kelancaran</th>
              <th className="py-3 px-4 text-center">Skor Akhir</th>
              <th className="py-3 px-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 font-bold text-xs text-slate-800">
            {santriList.map(s => {
              const avg = Math.round((s.tajwid + s.makhraj + s.kelancaran) / 3);
              return (
                <tr key={s.id} className="hover:bg-slate-50/20">
                  <td className="py-3 px-4 font-black">{s.nama}</td>
                  <td className="py-3 px-4 text-center">{s.tajwid}</td>
                  <td className="py-3 px-4 text-center">{s.makhraj}</td>
                  <td className="py-3 px-4 text-center">{s.kelancaran}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 bg-tosca-600 text-white rounded text-[10px] font-black">{avg}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleSelectForEdit(s.id)}
                      className="text-tosca-600 hover:text-tosca-700 text-[10px] font-bold uppercase"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)}
```

---

## 4️⃣ RINGKASAN INCONSISTENCY CHECKLIST

### Icon Consistency Status:
- ❌ Beranda/Dashboard icon: `Home` vs `Sliders` (INCONSISTENT)
- ✅ Nilai icon: `Star` vs `Star` (CONSISTENT)
- ✅ Evaluasi icon: `ClipboardList` vs `ClipboardList` (CONSISTENT)
- ✅ Target icon: `Target` vs `Target` (CONSISTENT)
- ✅ Sertifikat icon: `Award` vs `Award` (CONSISTENT)
- ⚠️ Setoran: Missing di Santri (ASYMMETRIC)
- ⚠️ Zoom: Missing di Musyrif (ASYMMETRIC)
- ⚠️ Status: Missing di Santri (ASYMMETRIC)
- ⚠️ Presensi: Missing di Santri (ASYMMETRIC)
- ⚠️ Jadwal: Missing di Santri (ASYMMETRIC)

### Tampilan Consistency Status:
- ✅ Modul grid layout: Responsive (3-4-9 cols) - CONSISTENT
- ✅ Card styling: Gradient + shadow - CONSISTENT
- ✅ Color scheme: Tosca primary color - CONSISTENT
- ⚠️ Form layout: Terlalu panjang di setoran (NEEDS REDESIGN)
- ⚠️ Table display: Read-only di nilai (NEEDS EDIT FEATURE)
- ❌ Label naming: "Dashboard" vs "Beranda" (INCONSISTENT)

---

## 5️⃣ REKOMENDASI PRIORITAS PERBAIKAN

### 🔴 HIGH PRIORITY (Critical for UX):
1. **Perbaiki icon "Beranda/Dashboard"** → Gunakan `Home` untuk kedua dashboard
2. **Tambahkan modul "Setoran" di Santri** → User bisa lihat history setoran
3. **Pisahkan layout Form + Tabel** di modul Setoran & Nilai

### 🟡 MEDIUM PRIORITY (Important for functionality):
4. Tambahkan fitur edit nilai inline di tabel
5. Standardize label naming ("Beranda" vs "Dashboard")
6. Tambahkan modul "Monitor Zoom" untuk Musyrif (optional)

### 🟢 LOW PRIORITY (Nice to have):
7. Add action buttons (Edit/Delete) untuk setiap item di tabel
8. Add search & filter functionality di tabel
9. Add export data feature (CSV/PDF)

---

## 6️⃣ PREVIEW MOCKUP AFTER FIX

### Santri Dashboard (Updated):
```
[Beranda] [Setoran] [Nilai] [Evaluasi] [Target] [Zoom] [Sertifikat]
   Home    BookOpen   Star      Clipboard  Target  Video   Award
```

### Musyrif Dashboard (Updated):
```
[Dashboard] [Setoran] [Nilai] [Status] [Evaluasi] [Presensi] [Jadwal] [Target] [Sertifikat]
    Home     BookOpen   Star   Book✓    Clipboard  CheckSq   Calendar Target  Award
```

---

## 7️⃣ DOKUMENTASI FILE YANG PERLU DIMODIFIKASI

### File 1: [app/dashboard/santri/page.tsx](app/dashboard/santri/page.tsx)
**Lines to modify:**
- Line 8-9: Icon imports (tambah `BookOpen`)
- Line 18-25: `modules` array (tambah setoran)
- Line 200+: Conditional render (tambah section 'setoran')

**Changes needed:**
```diff
- { id: 'overview', label: 'Beranda', icon: Home, ... },
+ { id: 'overview', label: 'Beranda', icon: Home, ... },
+ { id: 'setoran', label: 'Setoran', icon: BookOpen, color: 'from-sky-500 to-blue-600' },
  { id: 'nilai', label: 'Nilai', icon: Star, ... },
  // ... rest unchanged
```

### File 2: [app/dashboard/musyrif/page.tsx](app/dashboard/musyrif/page.tsx)
**Lines to modify:**
- Line 1-20: Icon imports (sudah lengkap)
- Line 30: Ubah icon `Sliders` → `Home`
- Line 407-480: Redesign layout form + table (pisahkan grid)
- Line 480-510: Tambah edit functionality untuk nilai

**Changes needed:**
```diff
- { id: 'overview', label: 'Dashboard', icon: Sliders, ... },
+ { id: 'overview', label: 'Dashboard', icon: Home, ... },  // atau LayoutDashboard

  // Redesign setoran section layout (grid 3 col)
  // Redesign nilai section dengan edit form
```

---

## 8️⃣ PERKIRAAN EFFORT & TIMELINE

| Task | Effort | Est. Time |
|------|--------|-----------|
| Fix icon consistency | Low | 15 min |
| Add Setoran module ke Santri | Medium | 45 min |
| Redesign form+table layout | Medium | 1 hour |
| Add edit nilai functionality | Medium | 1 hour |
| Testing & QA | Medium | 30 min |
| **TOTAL** | **Medium** | **~3.5 hours** |

---

## ✅ CATATAN ANALISIS SELESAI

**Status:** ✅ Analisis Selesai - BUKAN PERBAIKAN  
**Tanggal Selesai:** 1 Juni 2026  
**Approval:** Menunggu approval dari PM/user untuk melanjutkan perbaikan

---

## 📞 NEXT STEPS

1. ✅ **User Review** → Review dokumen analisis ini
2. ⏳ **Approval** → Approve perubahan atau minta modifikasi
3. ⏳ **Implementation** → Implementasi perbaikan sesuai prioritas
4. ⏳ **Testing** → QA & testing di staging
5. ⏳ **Deployment** → Deploy ke production

---

**Dokumen ini berisi ANALISIS LENGKAP tanpa melakukan PERBAIKAN kode.**  
**Silakan review dan approve sebelum melanjutkan ke fase implementasi.**

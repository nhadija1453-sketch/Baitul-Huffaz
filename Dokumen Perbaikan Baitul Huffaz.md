# DOKUMEN PERBAIKAN PROYEK BAITUL HUFFAZ

**Versi:** 1.0  
**Tanggal:** 31 Mei 2026  
**Proyek:** Sistem Manajemen Lembaga Tahfizh Al-Qur'an Baitul Huffaz  
** Teknologi:** Next.js 14 + TypeScript + Tailwind CSS + Supabase

---

## 1. RINGKASAN PROYEK

### 1.1 Deskripsi Sistem
Baitul Huffaz adalah sistem manajemen lembaga tahfizh Al-Qur'an yang menyediakan fitur untuk:
- **Dashboard Admin**: Manajemen data keseluruhan (santri, musyrif, jadwal, nilai)
- **Dashboard Musyrif**: Input setoran hafalan, penilaian, evaluasi, presensi
- **Dashboard Santri**: Monitoring hafalan, raport, sertifikat, akses zoom
- **Autentikasi**: Login multi-role (Admin, Musyrif, Santri)

### 1.2 Struktur Direktori
```
Baitul Huffaz/
├── app/                    # Next.js App Router
│   ├── absensi/ # Halaman absensi (redirect)
│   ├── dashboard/
│   │   ├── admin/         # Modul admin (nilai, jadwal, kelas, musyrif, sertifikat, settings, raport, santri)
│   │   ├── musyrif/       # Dashboard musyrif lengkap
│   │   └── santri/        # Dashboard santri
│   ├── evaluasi/          # Halaman evaluasi (redirect)
│   ├── forgot-password/   # Lupa password
│   ├── hafalan/           # Halaman hafalan (redirect)
│   ├── jadwal/            # Halaman jadwal (redirect)
│   ├── login/             # Halaman login
│   ├── raport/            # Halaman raport (redirect)
│   ├── register/          # Halaman registrasi
│   ├── sertifikat/        # Halaman sertifikat
│   ├── target/            # Halaman target
│   └── zoom/              # Halaman zoom
├── components/
│   ├── musyrif/          # Komponen khusus musyrif
│   └── ui/               # Komponen UI generik (button, card, input, modal, navbar, sidebar, table, badge, loader)
├── lib/
│   ├── auth/             # Modul autentikasi
│   ├── hooks/            # Custom React hooks
│   ├── services/         # Service layer (absensi, evaluasi, hafalan, jadwal, raport, sertifikat)
│   └── supabase/         # Konfigurasi Supabase
├── database/
│   ├── migrations/       # SQL migrations
│   └── seed/            # Data seed
├── styles/               # Konfigurasi styling
├── public/              # Asset statis
└── middleware.ts        # Middleware autentikasi
```

### 1.3 Teknologi yang Digunakan
| Komponen | Teknologi | Versi |
|----------|-----------|-------|
| Framework | Next.js | 14.2.3 |
| Bahasa | TypeScript | 5 |
| Styling | Tailwind CSS | 3.4.1 |
| Database | Supabase |2.43.2 |
| Auth | Supabase Auth | 0.10.0 |
| Icons | Lucide React | 0.378.0 |
| UI | Custom Components | - |

---

## 2. ANALISIS TEKNIS

### 2.1 Kode yang Sudah Ada (GOOD)

#### a. Struktur Komponen yang Modular
```
✓ Komponen UI terpisah (button, card, input, modal, navbar, sidebar)
✓ Reusable components dengan props yang jelas
✓ Styling konsisten menggunakan Tailwind CSS dengan custom color palette (tosca)
```

#### b. Dashboard Musyrif yang Komprehensif
- Modul launcher horizontal (Android-style UI)
- Form input setoran hafalan
- Sistem penilaian (tajwid, makhraj, kelancaran)
- Input kehadiran dan evaluasi
- Manajemen jadwal
- Download sertifikat

#### c. Dashboard Admin yang Lengkap
- Statistik overview
- Recent activities dengan modal detail
- Quick add data
- Tabel manajemen data (santri, musyrif, jadwal)
- Filter dan search functionality

#### d. Dashboard Santri yang User-Friendly
- Hero card dengan info profil
- Menu horizontal launcher
- Modul nilai, evaluasi, target, zoom, sertifikat
- Bottom navigation untuk mobile

### 2.2 Kode yang Perlu Diperbaiki (ISSUES)

---

## 3. DAFTAR PERMASALAHAN

### 3.1 CRITICAL ISSUES (Harus Segera Diperbaiki)

#### **[CRITICAL-01] Redirect Pages Tidak Berfungsi**
```
File: app/absensi/page.tsx, app/hafalan/page.tsx, app/raport/page.tsx
Masalah: Halaman-halaman ini hanya berisi redirect ke /login tanpa fungsi aktif
Dampak: User tidak bisa mengakses fitur absensi, hafalan, dan raport langsung
Solusi: Implementasikan halaman-halaman ini dengan fitur lengkap
```

#### **[CRITICAL-02] Autentikasi Menggunakan Mock Data**
```
File: app/login/page.tsx (baris 19-31)
Masalah: Login menggunakan hardcoded credentials (admin/admin123, musyrif/musyrif123, dll)
Dampak: 
  - Tidak aman untuk production
  - Tidak terintegrasi dengan Supabase Auth
  - User tidak bisa registrasi dan login dengan akun nyata
Solusi: Integrasikan dengan Supabase Auth yang sudah dikonfigurasi
```

#### **[CRITICAL-03] Supabase Environment Placeholder**
```
File: .env.local, lib/supabase/client.ts
Masalah: URL dan ANON_KEY menggunakan placeholder
Dampak: Aplikasi tidak bisa terhubung ke database Supabase
Solusi: Ganti dengan credentials Supabase yang sebenarnya
```

#### **[CRITICAL-04] Route Protection Tidak Ada**
```
File: middleware.ts
Masalah: Middleware hanya memanggil updateSession tanpa implementasi
Dampak: User bisa mengakses dashboard tanpa login
Solusi: Implementasikan route protection yangproper
```

### 3.2 HIGH PRIORITY ISSUES (Harus Diperbaiki)

#### **[HIGH-01] Data Mengunakan Dummy/Static**
```
File: Semua halaman dashboard
Masalah: Semua data di-hardcode dalam komponen (mock data)
Dampak:
  - Data tidak persisten (hilang saat refresh)
  - Tidak ada integrasi database
  - Fitur CRUD tidak berfungsi nyata
Solusi: Integrasikan dengan Supabase untuk semua data operations
```

#### **[HIGH-02] Missing Database Schema**
```
File: database/migrations/users.sql
Masalah: Hanya ada1 tabel (users), tidak ada tabel untuk:
  - kelas (kelas/group)
  - setoran (hafalan records)
  - jadwal (schedule)
  - absensi (attendance)
  - nilai (grades)
  - sertifikat (certificates)
  - evaluasi (evaluations)
Dampak: Tidak ada struktur database yang lengkap
Solusi: Buat complete database schema
```

#### **[HIGH-03] Register Page Empty**
```
File: app/register/page.tsx
Masalah: File tidak ada atau kosong
Dampak: User tidak bisa membuat akun baru
Solusi: Implementasikan halaman registrasi
```

#### **[HIGH-04] Forgot Password Empty**
```
File: app/forgot-password/page.tsx
Masalah: File tidak ada atau kosong
Dampak: User tidak bisa reset password
Solusi: Implementasikan halaman forgot password
```

### 3.3 MEDIUM PRIORITY ISSUES

#### **[MEDIUM-01] Missing Error Handling**
```
File: Semua file service di lib/services/
Masalah: Tidak ada error handling untuk API calls
Dampak: User tidak mendapat feedback saat terjadi error
Solusi: Tambahkan try-catch dan toast notifications untuk error
```

#### **[MEDIUM-02] Missing Loading States**
```
File: Semua halaman dengan async operations
Masalah: Tidak ada indikasi loading saat fetch data
Dampak: User tidak tahu aplikasi sedang memproses
Solusi: Gunakan loader component yang sudah ada
```

#### **[MEDIUM-03] Missing Form Validation**
```
File: Semua form (login, register, input setoran, dll)
Masalah: Validasi input minimal atau tidak ada
Dampak: Data tidak valid bisa masuk ke sistem
Solusi: Tambahkan validasi client-side dan server-side
```

#### **[MEDIUM-04] Duplicate Code**
```
File: components/ui/*.tsx
Masalah: Beberapa komponen memiliki kode yang berulang
Solusi: Buat base components dan extends untuk konsistensi
```

### 3.4 LOW PRIORITY ISSUES

#### **[LOW-01] Missing Responsive Optimization**
```
File: app/dashboard/admin/*.tsx
Masalah: Beberapa komponen belum optimal untuk mobile
Solusi: Tambahkan responsive classes
```

#### **[LOW-02] Missing SEO Metadata**
```
File: app/layout.tsx
Masalah: Tidak ada metadata untuk SEO
Solusi: Tambahkan metadata untuk setiap halaman
```

#### **[LOW-03] Missing Keyboard Navigation**
```
Masalah: Tidak ada keyboard shortcuts untuk navigasi
Solusi: Implementasikan keyboard navigation
```

---

## 4. MATRIKS PRIORITAS PERBAIKAN

| Priority | Issue ID | Deskripsi | Estimasi Waktu | Effort |
|----------|----------|----------|----------------|--------|
| CRITICAL | CRITICAL-01 | Redirect pages |8 jam | High |
| CRITICAL | CRITICAL-02 | Auth integration | 12 jam | High |
| CRITICAL | CRITICAL-03 | Supabase credentials | 1 jam | Low |
| CRITICAL | CRITICAL-04 | Route protection | 4 jam | Medium |
| HIGH | HIGH-01 | Database integration | 16 jam | High |
| HIGH | HIGH-02 | Database schema | 8 jam | Medium |
| HIGH | HIGH-03 | Register page | 4 jam | Medium |
| HIGH | HIGH-04 | Forgot password | 2 jam | Low |
| MEDIUM | MEDIUM-01 | Error handling | 6 jam | Medium |
| MEDIUM | MEDIUM-02 | Loading states | 4 jam | Low |
| MEDIUM | MEDIUM-03 | Form validation | 8 jam | Medium |
| MEDIUM | MEDIUM-04 | Code refactoring | 12 jam | High |
| LOW | LOW-01 | Responsive | 4 jam | Low |
| LOW | LOW-02 | SEO | 2 jam | Low |
| LOW | LOW-03 | Keyboard nav | 4 jam | Medium |

**Total Estimasi:** ~95 jam kerja

---

## 5. REKOMENDASI PERBAIKAN

### 5.1 Fase 1: Core Infrastructure (Critical Issues)

#### A. Konfigurasi Supabase
```bash
#1. Buat project Supabase baru
# 2. Dapatkan URL dan ANON KEY dari dashboard Supabase
# 3. Update .env.local dengan credentials asli
```

#### B. Database Schema Lengkap
```sql
-- Tables yang perlu dibuat:

-- 1. kelas (kelompok halaqah)
CREATE TABLE public.kelas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama VARCHAR(100) NOT NULL,
  musyrif_id UUID REFERENCES public.users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. setoran (record hafalan)
CREATE TABLE public.setoran (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  santuario_id UUID REFERENCES public.users(id),
  musyrif_id UUID REFERENCES public.users(id),
  surah VARCHAR(100) NOT NULL,
  ayat_start INT,
  ayat_end INT,
  tajwid_score INT,
  makhraj_score INT,
  kelancaran_score INT,
  rata_rata INT,
  status VARCHAR(20) CHECK (status IN ('LANJUT', 'ULANGI')),
  catatan TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. jadwal
CREATE TABLE public.jadwal (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sesi VARCHAR(100) NOT NULL,
  jam_mulai TIME,
  jam_selesai TIME,
  lokasi VARCHAR(200),
  musyrif_id UUID REFERENCES public.users(id),
  hari VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 4. absensi
CREATE TABLE public.absensi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  santuario_id UUID REFERENCES public.users(id),
  tanggal DATE NOT NULL,
  status VARCHAR(20) CHECK (status IN ('HADIR', 'IZIN', 'SAKIT', 'ALPA')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 5. evaluasi
CREATE TABLE public.evaluasi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  santuario_id UUID REFERENCES public.users(id),
  musyrif_id UUID REFERENCES public.users(id),
  predikat_adab VARCHAR(50),
  catatan TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 6. target_hafalan
CREATE TABLE public.target_hafalan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  santuario_id UUID REFERENCES public.users(id),
  juz_target INT,
  progres INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 7. sertifikat
CREATE TABLE public.sertifikat (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  santuario_id UUID REFERENCES public.users(id),
  juz INT NOT NULL,
  tgl_cetak DATE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### C. Implementasi Autentikasi
```typescript
// lib/supabase/server.ts - Server-side Supabase client
// lib/supabase/client.ts - Client-side Supabase client
// lib/auth/session.ts - Session management
// lib/auth/roles.ts - Role-based access control
```

#### D. Route Protection
```typescript
// middleware.ts - Protect all /dashboard/* routes
// components/ui/sidebar.tsx - Dynamic menu based on role
```

### 5.2 Fase 2: Feature Implementation (High Priority)

#### A. Halaman Absensi
```typescript
// Fitur yang diperlukan:
- Calendar view untuk absensi
- Input status kehadiran (Hadir, Izin, Sakit, Alpa)
- Statistik kehadiran per bulan
- Export laporan absensi
```

#### B. Halaman Hafalan
```typescript
// Fitur yang diperlukan:
- Form input setoran baru
- Daftar setoran terbaru
- Progress hafalan per Juz
- Filter berdasarkan tanggal/ustadz
```

#### C. Halaman Raport
```typescript
// Fitur yang diperlukan:
- Ringkasan nilai hafalan
- Grafik perkembangan
- Cetak raport PDF
- Riwayat setoran lengkap
```

#### D. Halaman Register & Forgot Password
```typescript
// Register:
- Form registrasi dengan validasi
- Role selection (Santri/Musyrif)
- Integrasi Supabase Auth

// Forgot Password:
- Input email
- Send reset link via Supabase
- Reset password form
```

### 5.3 Fase 3: Data Integration (Medium Priority)

#### A. Service Layer Implementation
```typescript
// lib/services/absensi.service.ts
// lib/services/hafalan.service.ts
// lib/services/nilai.service.ts
// lib/services/jadwal.service.ts
// lib/services/sertifikat.service.ts
```

#### B. Error Handling & Loading States
```typescript
// Gunakan Loader component untuk loading states
// Implementasi toast notifications untuk error
// Fallback UI untuk error states
```

### 5.4 Fase 4: Polish & Optimization (Low Priority)

#### A. Code Refactoring
```typescript
// Buat base components
// Ekstrak common utilities
// Buat custom hooks untuk reusable logic
```

#### B. SEO & Accessibility
```typescript
// Tambahkan metadata untuk setiap halaman
// Implementasi ARIA labels
// Keyboard navigation
```

---

## 6. CHECKLIST PERBAIKAN

### 6.1 Checklist Technical

- [ ] Konfigurasi Supabase dengan credentials asli
- [ ] Buat complete database schema
- [ ] Enable Row Level Security (RLS) policies
- [ ] Implementasi Supabase Auth (login, register, logout)
- [ ] Implementasi route protection di middleware
- [ ] Buat service layer untuk semua data operations
- [ ] Implementasi error handling di semua service
- [ ] Implementasi loading states
- [ ] Form validation (client & server side)
- [ ] Responsive design optimization
- [ ] SEO metadata
- [ ] Accessibility improvements

### 6.2 Checklist Features

#### Admin Dashboard
- [ ] Manajemen Santri (CRUD lengkap)
- [ ] Manajemen Musyrif (CRUD lengkap)
- [ ] Manajemen Kelas (CRUD lengkap)
- [ ] Manajemen Jadwal (CRUD lengkap)
- [ ] Input & Review Nilai
- [ ] Generate Raport
- [ ] Generate Sertifikat
- [ ] Statistik & Analytics

#### Musyrif Dashboard
- [ ] Input Setoran Hafalan
- [ ] Input Penilaian (Tajwid, Makhraj, Kelancaran)
- [ ] Input Kehadiran
- [ ] Input Evaluasi Sikap
- [ ] Update Target Hafalan
- [ ] Manajemen Jadwal
- [ ] Download Sertifikat

#### Santri Dashboard
- [ ] Lihat Nilai Hafalan
- [ ] Lihat Raport
- [ ] Lihat Progress Target
- [ ] Akses Zoom Link
- [ ] Download Sertifikat
- [ ] Notifikasi (jika ada)

### 6.3 Checklist Testing

- [ ] Unit tests untuk service layer
- [ ] Integration tests untuk API calls
- [ ] E2E tests untuk critical flows
- [ ] Responsive testing (mobile, tablet, desktop)
- [ ] Cross-browser testing
- [ ] Accessibility testing

---

## 7. ROADMAP IMPLEMENTASI

### Sprint 1: Core Infrastructure (1-2 minggu)
1. Konfigurasi Supabase
2. Database schema & migrations
3. Autentikasi (login, register, logout)
4. Route protection

### Sprint 2: Basic Features (2-3 minggu)
1. Dashboard Admin dasar
2. Dashboard Musyrif dasar
3. Dashboard Santri dasar
4. CRUD operations dasar

### Sprint 3: Advanced Features (2-3 minggu)
1. Halaman Absensi lengkap
2. Halaman Hafalan lengkap
3. Halaman Raport lengkap
4. Fitur Sertifikat

### Sprint 4: Polish & Launch (1-2 minggu)
1. Error handling & loading states
2. Form validation
3. Responsive optimization
4. SEO & accessibility
5. Testing & bug fixing
6. Deployment

---

## 8. KESIMPULAN

Proyek Baitul Huffaz memiliki fondasi yang baik dengan:
- UI/UX yang modern dan menarik
- Struktur kode yang modular
- Komponen reusable
- Responsive design

Namun, sistem ini membutuhkan perbaikan signifikan pada:
1. **Integrasi database** - saat ini menggunakan mock data
2. **Autentikasi** - belum terintegrasi dengan Supabase Auth
3. **Fitur lengkap** - beberapa halaman masih kosong/redirect
4. **Error handling** - belum ada penanganan error yang proper

Dengan mengikuti roadmap di atas, sistem dapat dikembangkan menjadi aplikasi production-ready yang aman, scalable, dan user-friendly.

---

**Dokumen ini dibuat untuk membantu tim pengembang dalam melakukan perbaikan dan pengembangan sistem Baitul Huffaz.**

*Dibuat oleh: Claude Code AI Assistant*  
*Tanggal: 31 Mei 2026*

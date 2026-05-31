-- ============================================
-- DATABASE SCHEMA BAITUL HUFFAZ
-- PostgreSQL (Neon / Vercel Postgres)
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE: users
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'SANTRI' CHECK (role IN ('ADMIN', 'MUSYRIF', 'SANTRI')),
  avatar_url VARCHAR(500),
  nis VARCHAR(50),
  nip VARCHAR(50),
  kelas_id UUID,
  phone VARCHAR(20),
  address TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: kelas (Halaqah/Group)
-- ============================================
CREATE TABLE IF NOT EXISTS kelas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nama VARCHAR(100) NOT NULL,
  tingkat VARCHAR(50),
  musyrif_id UUID REFERENCES users(id),
  kapasitas INT DEFAULT 30,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key to users
ALTER TABLE users ADD CONSTRAINT fk_users_kelas FOREIGN KEY (kelas_id) REFERENCES kelas(id);

-- ============================================
-- TABLE: setoran (Hafalan Records)
-- ============================================
CREATE TABLE IF NOT EXISTS setoran (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  santuario_id UUID NOT NULL REFERENCES users(id),
  musyrif_id UUID NOT NULL REFERENCES users(id),
  surah VARCHAR(100) NOT NULL,
  ayat_start INT,
  ayat_end INT,
  juz INT,
  halaman_start INT,
  halaman_end INT,
  tajwid_score INT DEFAULT 0 CHECK (tajwid_score >= 0 AND tajwid_score <= 100),
  makhraj_score INT DEFAULT 0 CHECK (makhraj_score >= 0 AND makhraj_score <= 100),
  kelancaran_score INT DEFAULT 0 CHECK (kelancaran_score >= 0 AND kelancaran_score <= 100),
  rata_rata INT DEFAULT 0 CHECK (rata_rata >= 0 AND rata_rata <= 100),
  status VARCHAR(20) NOT NULL CHECK (status IN ('LANJUT', 'ULANGI')),
  jenis VARCHAR(20) DEFAULT 'SABAQ' CHECK (jenis IN ('SABAQ', 'SABQI', 'MANZIL')),
  catatan TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: jadwal
-- ============================================
CREATE TABLE IF NOT EXISTS jadwal (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sesi VARCHAR(100) NOT NULL,
  jam_mulai TIME NOT NULL,
  jam_selesai TIME NOT NULL,
  lokasi VARCHAR(200),
  hari VARCHAR(20) NOT NULL CHECK (hari IN ('SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU', 'MINGGU')),
  kelas_id UUID REFERENCES kelas(id),
  musyrif_id UUID REFERENCES users(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: absensi
-- ============================================
CREATE TABLE IF NOT EXISTS absensi (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  santuario_id UUID NOT NULL REFERENCES users(id),
  jadwal_id UUID REFERENCES jadwal(id),
  tanggal DATE NOT NULL DEFAULT CURRENT_DATE,
  status VARCHAR(20) NOT NULL CHECK (status IN ('HADIR', 'IZIN', 'SAKIT', 'ALPA')),
  jam_hadir TIME,
  jam_pulang TIME,
  keterangan TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: evaluasi
-- ============================================
CREATE TABLE IF NOT EXISTS evaluasi (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  santuario_id UUID NOT NULL REFERENCES users(id),
  musyrif_id UUID NOT NULL REFERENCES users(id),
  predikat_adab VARCHAR(50),
  predikat_kedisiplinan VARCHAR(50),
  catatan TEXT,
  periode VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: target_hafalan
-- ============================================
CREATE TABLE IF NOT EXISTS target_hafalan (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  santuario_id UUID NOT NULL REFERENCES users(id),
  juz_target INT NOT NULL,
  tgl_target DATE,
  progres INT DEFAULT 0 CHECK (progres >= 0 AND progres <= 100),
  status VARCHAR(20) DEFAULT 'AKTIF' CHECK (status IN ('AKTIF', 'SELESAI', 'GAGAL')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: sertifikat
-- ============================================
CREATE TABLE IF NOT EXISTS sertifikat (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  santuario_id UUID NOT NULL REFERENCES users(id),
  juz INT NOT NULL,
  tgl_cetak DATE,
  no_sertifikat VARCHAR(100),
  file_url VARCHAR(500),
  status VARCHAR(20) DEFAULT 'TERBIT' CHECK (status IN ('TERBIT', 'DALAM_PROSES', 'DIBATALKAN')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: raport
-- ============================================
CREATE TABLE IF NOT EXISTS raport (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  santuario_id UUID NOT NULL REFERENCES users(id),
  musyrif_id UUID NOT NULL REFERENCES users(id),
  periode VARCHAR(20) NOT NULL,
  tahun_ajaran VARCHAR(20),
  rata_rata_tajwid DECIMAL(5,2),
  rata_rata_makhraj DECIMAL(5,2),
  rata_rata_kelancaran DECIMAL(5,2),
  rata_rata_total DECIMAL(5,2),
  predikat_akhlak VARCHAR(50),
  jumlah_setoran INT,
  total_juz_habis INT,
  catatan_pembimbing TEXT,
  tgl_cetak DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: zoom_meetings
-- ============================================
CREATE TABLE IF NOT EXISTS zoom_meetings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  judul VARCHAR(200) NOT NULL,
  meeting_id VARCHAR(100),
  passcode VARCHAR(50),
  link VARCHAR(500),
  jadwal_id UUID REFERENCES jadwal(id),
  tgl_meeting DATE,
  jam_mulai TIME,
  jam_selesai TIME,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_setoran_santri ON setoran(santuario_id);
CREATE INDEX IF NOT EXISTS idx_setoran_musyrif ON setoran(musyrif_id);
CREATE INDEX IF NOT EXISTS idx_setoran_tanggal ON setoran(created_at);
CREATE INDEX IF NOT EXISTS idx_absensi_tanggal ON absensi(tanggal);
CREATE INDEX IF NOT EXISTS idx_absensi_santri ON absensi(santuario_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_jadwal_hari ON jadwal(hari);
CREATE INDEX IF NOT EXISTS idx_target_santri ON target_hafalan(santuario_id);

COMMIT;
# PANDUAN DEPLOYMENT BAITUL HUFFAZ

## Langkah 1: Persiapan Akun

### 1.1 Akun Vercel
1. Buka [vercel.com](https://vercel.com)
2. Daftar / Login dengan GitHub
3. Verifikasi email

### 1.2 Akun Neon (Database PostgreSQL)
1. Buka [neon.tech](https://neon.tech)
2. Daftar dengan GitHub
3. Buat project baru: "baitul-huffaz"
4. Copy connection string

## Langkah 2: Setup Database Neon

### 2.1 Buat Project Neon
1. Buka [neon.tech](https://neon.tech)
2. Klik "New Project"
3. Isi:
   - Project Name: `baitul-huffaz`
   - Region: Singapore (untuk Indonesia)
   - PostgreSQL Version: 15
4. Klik "Create Project"

### 2.2 Jalankan Schema
1. Buka Neon Dashboard > SQL Editor
2. Copy isi dari `database/migrations/001_schema.sql`
3. Paste dan execute

## Langkah 3: Push ke GitHub

### 3.1 Buat Repository GitHub
1. Buka [github.com](https://github.com)
2. Klik "New repository"
3. Nama: `baitul-huffaz`
4. Visibility: Public/Private sesuai kebutuhan
5. Jangan initialize with README

### 3.2 Push Kode
```bash
cd "D:\2026\04. Mei\Kelompok 1 kls regurer\Baitul Huffaz"

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/baitul-huffaz.git

# Push
git push -u origin main
```

## Langkah 4: Deploy ke Vercel

### 4.1 Import Project
1. Buka [vercel.com](https://vercel.com)
2. Klik "Add New..." > "Project"
3. Import dari GitHub: `baitul-huffaz`
4. Klik "Import"

### 4.2 Configure Project
1. Framework Preset: Next.js
2. Root Directory: `./` (default)
3. Build Command: `npm run build` (default)
4. Output Directory: `.next` (default)

### 4.3 Environment Variables
Klik "Environment Variables" dan tambahkan:

| Name | Value |
|------|-------|
| `DATABASE_URL` | Connection string dari Neon |
| `NEXT_PUBLIC_APP_NAME` | Baitul Huffaz |

Connection string Neon пример:
```
postgresql://username:password@ep-xxx-xxx-xxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
```

### 4.4 Deploy
1. Klik "Deploy"
2. Tunggu proses build (~2-3 menit)
3. Jika berhasil, akan muncul URL seperti: `baitul-huffaz.vercel.app`

## Langkah 5: Setup Custom Domain (Opsional)

### 5.1 Beli Domain
Bisa menggunakan:
- Niagahoster
- Domainesia
- Google Domains

### 5.2 Konfigurasi Vercel
1. Buka Vercel Dashboard > Project > Settings > Domains
2. Masukkan domain: `baitulhuffaz.sch.id`
3. Tambahkan DNS records sesuai instruksi

## Langkah 6: Verifikasi Deployment

### 6.1 Test Login
1. Buka URL deployment
2. Login dengan akun demo:
   - Admin: `admin@baitulhuffaz.sch.id` / `admin123`
   - Musyrif: `musyrif@baitulhuffaz.sch.id` / `musyrif123`
   - Santri: `santri@baitulhuffaz.sch.id` / `santri123`

### 6.2 Test CRUD
1. Login sebagai Admin
2. Test tambah/edit/hapus data
3. Test export laporan

## Troubleshooting

### Error: Connection Refused
Pastikan `DATABASE_URL` sudah benar dengan `?sslmode=require`

### Error: Module Not Found
```bash
npm install
npm run build
```

### Error: Build Failed
Cek logs di Vercel Dashboard > Deployments

## Struktur Database

```
users          - Data user (admin, musyrif, santri)
kelas          - Data kelas/halaqah
setoran        - Record setoran hafalan
jadwal         - Jadwal kegiatan
absensi        - Kehadiran harian
evaluasi       - Evaluasi sikap/adab
target_hafalan - Target hafalan per santri
sertifikat     - Data sertifikat
raport         - Raport hafalan
zoom_meetings  - Data meeting zoom
```

## Link Penting

- Vercel Dashboard: https://vercel.com/dashboard
- Neon Dashboard: https://neon.tech dashboard
- GitHub Repository: https://github.com/YOUR_USERNAME/baitul-huffaz

---

**Catatan:** Pastikan untuk update credentials demo user dengan data real di production!

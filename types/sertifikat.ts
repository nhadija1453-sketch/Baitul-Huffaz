export interface Sertifikat {
  id: string;
  santuario_id: string;
  juz: number;
  tgl_cetak: string | null;
  no_sertifikat: string | null;
  file_url: string | null;
  status: 'TERBIT' | 'DALAM_PROSES' | 'DIBATALKAN';
  created_at: string;
}

export interface SertifikatRecord {
  id: string;
  nomorSertifikat: string;
  santriId: string;
  nis: string;
  santriName: string;
  kelasNama: string;
  namaSurat: string;
  juzKe: string;
  statusKelulusan: string;
  paragrafTeks: string;
  namaSekolah: string;
  alamatSekolah: string;
  akreditasi: string;
  nilaiTajwid: number;
  nilaiMakhraj: number;
  nilaiKelancaran: number;
  nilaiRata: number;
  kotaPenandatangan: string;
  tanggalTerbit: string;
  namaPenanggungJawab: string;
  jabatan: string;
  isPublished: boolean;
  createdAt: string;
}

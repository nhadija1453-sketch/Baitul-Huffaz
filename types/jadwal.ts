export interface Jadwal {
  id: string;
  sesi: string;
  jam_mulai: string;
  jam_selesai: string;
  lokasi: string | null;
  hari: 'SENIN' | 'SELASA' | 'RABU' | 'KAMIS' | 'JUMAT' | 'SABTU' | 'MINGGU';
  kelas_id: string | null;
  musyrif_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface JadwalData {
  id: number;
  sesi: string;
  jam: string;
  lokasi: string;
  musyrif: string;
  hari: string;
}

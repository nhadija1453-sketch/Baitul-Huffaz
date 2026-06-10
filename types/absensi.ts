export interface Absensi {
  id: string;
  santuario_id: string;
  jadwal_id: string | null;
  tanggal: string;
  status: 'HADIR' | 'IZIN' | 'SAKIT' | 'ALPA';
  jam_hadir: string | null;
  jam_pulang: string | null;
  keterangan: string | null;
  created_at: string;
}

export interface PresensiRecord {
  id: string;
  meetingId: string;
  meetingName: string;
  santriId: string;
  santriName: string;
  nis: string;
  kelasNama: string;
  status: 'Hadir' | 'Izin' | 'Sakit' | 'Alpa';
  createdAt: string;
}

export interface Evaluasi {
  id: string;
  santuario_id: string;
  musyrif_id: string;
  predikat_adab: string | null;
  predikat_kedisiplinan: string | null;
  catatan: string | null;
  periode: string | null;
  created_at: string;
}

export interface EvaluasiRecord {
  id: string;
  santriId: string;
  santriName: string;
  kelasNama: string;
  adab: string;
  keterangan: string;
  updatedAt: string;
}

import { query, queryOne, transaction } from '@/lib/db/client';
import { Setoran } from '@/types/hafalan';

export async function getAllSetoran(): Promise<Setoran[]> {
  const sql = `
    SELECT s.*, u.full_name as santri_name, u.nis, k.nama as kelas_nama
    FROM setoran s
    JOIN users u ON s.santuario_id = u.id
    LEFT JOIN kelas k ON u.kelas_id = k.id
    ORDER BY s.created_at DESC
  `;
  return query<Setoran>(sql);
}

export async function getSetoranBySantri(santuarioId: string): Promise<Setoran[]> {
  const sql = `
    SELECT s.*, u.full_name as santri_name, u.nis, k.nama as kelas_nama
    FROM setoran s
    JOIN users u ON s.santuario_id = u.id
    LEFT JOIN kelas k ON u.kelas_id = k.id
    WHERE s.santuario_id = $1
    ORDER BY s.created_at DESC
  `;
  return query<Setoran>(sql, [santuarioId]);
}

export async function getSetoranByMusyrif(musyrifId: string): Promise<Setoran[]> {
  const sql = `
    SELECT s.*, u.full_name as santri_name, u.nis, k.nama as kelas_nama
    FROM setoran s
    JOIN users u ON s.santuario_id = u.id
    LEFT JOIN kelas k ON u.kelas_id = k.id
    WHERE s.musyrif_id = $1
    ORDER BY s.created_at DESC
  `;
  return query<Setoran>(sql, [musyrifId]);
}

export async function getSetoranById(id: string): Promise<Setoran | null> {
  const sql = `
    SELECT s.*, u.full_name as santri_name, u.nis, k.nama as kelas_nama
    FROM setoran s
    JOIN users u ON s.santuario_id = u.id
    LEFT JOIN kelas k ON u.kelas_id = k.id
    WHERE s.id = $1
  `;
  return queryOne<Setoran>(sql, [id]);
}

export async function createSetoran(data: {
  santuario_id: string;
  musyrif_id: string;
  surah: string;
  ayat_start?: number | null;
  ayat_end?: number | null;
  juz?: number | null;
  halaman_start?: number | null;
  halaman_end?: number | null;
  tajwid_score: number;
  makhraj_score: number;
  kelancaran_score: number;
  rata_rata: number;
  status: 'LANJUT' | 'ULANGI';
  jenis?: 'SABAQ' | 'SABQI' | 'MANZIL';
  catatan?: string | null;
}): Promise<Setoran> {
  const sql = `
    INSERT INTO setoran (santuario_id, musyrif_id, surah, ayat_start, ayat_end, juz, halaman_start, halaman_end, tajwid_score, makhraj_score, kelancaran_score, rata_rata, status, jenis, catatan)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
    RETURNING *
  `;
  return queryOne<Setoran>(sql, [
    data.santuario_id, data.musyrif_id, data.surah,
    data.ayat_start ?? null, data.ayat_end ?? null,
    data.juz ?? null, data.halaman_start ?? null, data.halaman_end ?? null,
    data.tajwid_score, data.makhraj_score, data.kelancaran_score,
    data.rata_rata, data.status, data.jenis ?? 'SABAQ', data.catatan ?? null
  ]) as Promise<Setoran>;
}

export async function updateSetoran(id: string, data: Partial<Setoran>): Promise<Setoran | null> {
  const fields: string[] = [];
  const values: unknown[] = [];
  let paramIndex = 1;

  for (const [key, value] of Object.entries(data)) {
    if (key !== 'id' && key !== 'created_at' && key !== 'updated_at') {
      fields.push(`${key} = $${paramIndex}`);
      values.push(value);
      paramIndex++;
    }
  }

  if (fields.length === 0) return null;

  values.push(id);
  const sql = `UPDATE setoran SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${paramIndex} RETURNING *`;
  return queryOne<Setoran>(sql, values);
}

export async function deleteSetoran(id: string): Promise<boolean> {
  const result = await query<{ id: string }>('DELETE FROM setoran WHERE id = $1 RETURNING id', [id]);
  return result.length > 0;
}

export async function getSetoranStats(santuarioId: string): Promise<{
  total: number;
  rataTajwid: number;
  rataMakhraj: number;
  rataKelancaran: number;
}> {
  const sql = `
    SELECT
      COUNT(*) as total,
      COALESCE(AVG(tajwid_score), 0) as rata_tajwid,
      COALESCE(AVG(makhraj_score), 0) as rata_makhraj,
      COALESCE(AVG(kelancaran_score), 0) as rata_kelancaran
    FROM setoran
    WHERE santuario_id = $1
  `;
  const result = await queryOne<{
    total: number;
    rata_tajwid: number;
    rata_makhraj: number;
    rata_kelancaran: number;
  }>(sql, [santuarioId]);
  return {
    total: Number(result?.total ?? 0),
    rataTajwid: Number(result?.rata_tajwid ?? 0),
    rataMakhraj: Number(result?.rata_makhraj ?? 0),
    rataKelancaran: Number(result?.rata_kelancaran ?? 0),
  };
}

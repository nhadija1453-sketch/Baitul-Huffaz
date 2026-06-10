import { query, queryOne } from '@/lib/db/client';
import { Evaluasi } from '@/types/evaluasi';

export async function getAllEvaluasi(): Promise<Evaluasi[]> {
  const sql = `
    SELECT e.*, u.full_name as santri_name, u.nis, k.nama as kelas_nama
    FROM evaluasi e
    JOIN users u ON e.santuario_id = u.id
    LEFT JOIN kelas k ON u.kelas_id = k.id
    ORDER BY e.created_at DESC
  `;
  return query<Evaluasi>(sql);
}

export async function getEvaluasiBySantri(santuarioId: string): Promise<Evaluasi[]> {
  const sql = `
    SELECT e.*, u.full_name as santri_name, u.nis, k.nama as kelas_nama
    FROM evaluasi e
    JOIN users u ON e.santuario_id = u.id
    LEFT JOIN kelas k ON u.kelas_id = k.id
    WHERE e.santuario_id = $1
    ORDER BY e.created_at DESC
  `;
  return query<Evaluasi>(sql, [santuarioId]);
}

export async function getEvaluasiByMusyrif(musyrifId: string): Promise<Evaluasi[]> {
  const sql = `
    SELECT e.*, u.full_name as santri_name, u.nis, k.nama as kelas_nama
    FROM evaluasi e
    JOIN users u ON e.santuario_id = u.id
    LEFT JOIN kelas k ON u.kelas_id = k.id
    WHERE e.musyrif_id = $1
    ORDER BY e.created_at DESC
  `;
  return query<Evaluasi>(sql, [musyrifId]);
}

export async function createEvaluasi(data: {
  santuario_id: string;
  musyrif_id: string;
  predikat_adab?: string | null;
  predikat_kedisiplinan?: string | null;
  catatan?: string | null;
  periode?: string | null;
}): Promise<Evaluasi> {
  const sql = `
    INSERT INTO evaluasi (santuario_id, musyrif_id, predikat_adab, predikat_kedisiplinan, catatan, periode)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;
  return queryOne<Evaluasi>(sql, [
    data.santuario_id, data.musyrif_id,
    data.predikat_adab ?? null, data.predikat_kedisiplinan ?? null,
    data.catatan ?? null, data.periode ?? null
  ]) as Promise<Evaluasi>;
}

export async function updateEvaluasi(id: string, data: Partial<Evaluasi>): Promise<Evaluasi | null> {
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
  const sql = `UPDATE evaluasi SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${paramIndex} RETURNING *`;
  return queryOne<Evaluasi>(sql, values);
}

export async function deleteEvaluasi(id: string): Promise<boolean> {
  const result = await query<{ id: string }>('DELETE FROM evaluasi WHERE id = $1 RETURNING id', [id]);
  return result.length > 0;
}

export async function getEvaluasiByPeriode(periode: string): Promise<Evaluasi[]> {
  const sql = `
    SELECT e.*, u.full_name as santri_name, u.nis, k.nama as kelas_nama
    FROM evaluasi e
    JOIN users u ON e.santuario_id = u.id
    LEFT JOIN kelas k ON u.kelas_id = k.id
    WHERE e.periode = $1
    ORDER BY u.full_name ASC
  `;
  return query<Evaluasi>(sql, [periode]);
}

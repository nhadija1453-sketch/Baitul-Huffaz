import { query, queryOne } from '@/lib/db/client';
import { Sertifikat } from '@/types/sertifikat';

export async function getAllSertifikat(): Promise<Sertifikat[]> {
  const sql = `
    SELECT s.*, u.full_name as santri_name, u.nis, k.nama as kelas_nama
    FROM sertifikat s
    JOIN users u ON s.santuario_id = u.id
    LEFT JOIN kelas k ON u.kelas_id = k.id
    ORDER BY s.created_at DESC
  `;
  return query<Sertifikat>(sql);
}

export async function getSertifikatBySantri(santuarioId: string): Promise<Sertifikat[]> {
  const sql = `
    SELECT s.*, u.full_name as santri_name, u.nis, k.nama as kelas_nama
    FROM sertifikat s
    JOIN users u ON s.santuario_id = u.id
    LEFT JOIN kelas k ON u.kelas_id = k.id
    WHERE s.santuario_id = $1
    ORDER BY s.created_at DESC
  `;
  return query<Sertifikat>(sql, [santuarioId]);
}

export async function createSertifikat(data: {
  santuario_id: string;
  juz: number;
  tgl_cetak?: string | null;
  no_sertifikat?: string | null;
  file_url?: string | null;
  status?: 'TERBIT' | 'DALAM_PROSES' | 'DIBATALKAN';
}): Promise<Sertifikat> {
  const sql = `
    INSERT INTO sertifikat (santuario_id, juz, tgl_cetak, no_sertifikat, file_url, status)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;
  return queryOne<Sertifikat>(sql, [
    data.santuario_id, data.juz, data.tgl_cetak ?? null,
    data.no_sertifikat ?? null, data.file_url ?? null, data.status ?? 'DALAM_PROSES'
  ]) as Promise<Sertifikat>;
}

export async function updateSertifikat(id: string, data: Partial<Sertifikat>): Promise<Sertifikat | null> {
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
  const sql = `UPDATE sertifikat SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${paramIndex} RETURNING *`;
  return queryOne<Sertifikat>(sql, values);
}

export async function deleteSertifikat(id: string): Promise<boolean> {
  const result = await query<{ id: string }>('DELETE FROM sertifikat WHERE id = $1 RETURNING id', [id]);
  return result.length > 0;
}

export async function getNextNoSertifikat(): Promise<string> {
  const sql = "SELECT COALESCE(MAX(CAST(SUBSTRING(no_sertifikat FROM 3) AS INTEGER)), 0) + 1 as next_no FROM sertifikat WHERE no_sertifikat ~ '^SH\\d+$'";
  const result = await queryOne<{ next_no: string }>(sql);
  const nextNo = Number(result?.next_no ?? 1);
  return `SH${String(nextNo).padStart(5, '0')}`;
}

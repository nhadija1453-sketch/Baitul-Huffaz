import { query, queryOne } from '@/lib/db/client';
import { Absensi } from '@/types/absensi';

export async function getAllAbsensi(): Promise<Absensi[]> {
  const sql = `
    SELECT a.*, u.full_name as santri_name, u.nis, k.nama as kelas_nama
    FROM absensi a
    JOIN users u ON a.santuario_id = u.id
    LEFT JOIN kelas k ON u.kelas_id = k.id
    ORDER BY a.tanggal DESC, a.created_at DESC
  `;
  return query<Absensi>(sql);
}

export async function getAbsensiBySantri(santuarioId: string): Promise<Absensi[]> {
  const sql = `
    SELECT a.*, u.full_name as santri_name, u.nis, k.nama as kelas_nama
    FROM absensi a
    JOIN users u ON a.santuario_id = u.id
    LEFT JOIN kelas k ON u.kelas_id = k.id
    WHERE a.santuario_id = $1
    ORDER BY a.tanggal DESC
  `;
  return query<Absensi>(sql, [santuarioId]);
}

export async function getAbsensiByDate(tanggal: string): Promise<Absensi[]> {
  const sql = `
    SELECT a.*, u.full_name as santri_name, u.nis, k.nama as kelas_nama
    FROM absensi a
    JOIN users u ON a.santuario_id = u.id
    LEFT JOIN kelas k ON u.kelas_id = k.id
    WHERE a.tanggal = $1
    ORDER BY u.full_name ASC
  `;
  return query<Absensi>(sql, [tanggal]);
}

export async function getAbsensiByKelas(kelasId: string): Promise<Absensi[]> {
  const sql = `
    SELECT a.*, u.full_name as santri_name, u.nis, k.nama as kelas_nama
    FROM absensi a
    JOIN users u ON a.santuario_id = u.id
    LEFT JOIN kelas k ON u.kelas_id = k.id
    WHERE u.kelas_id = $1
    ORDER BY a.tanggal DESC
  `;
  return query<Absensi>(sql, [kelasId]);
}

export async function createAbsensi(data: {
  santuario_id: string;
  jadwal_id?: string | null;
  tanggal: string;
  status: 'HADIR' | 'IZIN' | 'SAKIT' | 'ALPA';
  jam_hadir?: string | null;
  jam_pulang?: string | null;
  keterangan?: string | null;
}): Promise<Absensi> {
  const sql = `
    INSERT INTO absensi (santuario_id, jadwal_id, tanggal, status, jam_hadir, jam_pulang, keterangan)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `;
  return queryOne<Absensi>(sql, [
    data.santuario_id, data.jadwal_id ?? null, data.tanggal, data.status,
    data.jam_hadir ?? null, data.jam_pulang ?? null, data.keterangan ?? null
  ]) as Promise<Absensi>;
}

export async function upsertAbsensi(data: {
  santuario_id: string;
  tanggal: string;
  status: 'HADIR' | 'IZIN' | 'SAKIT' | 'ALPA';
  keterangan?: string | null;
}): Promise<Absensi> {
  const sql = `
    INSERT INTO absensi (santuario_id, tanggal, status, keterangan)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (santuario_id, tanggal) DO UPDATE SET status = $3, keterangan = $4, updated_at = NOW()
    RETURNING *
  `;
  return queryOne<Absensi>(sql, [
    data.santuario_id, data.tanggal, data.status, data.keterangan ?? null
  ]) as Promise<Absensi>;
}

export async function updateAbsensi(id: string, data: Partial<Absensi>): Promise<Absensi | null> {
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
  const sql = `UPDATE absensi SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${paramIndex} RETURNING *`;
  return queryOne<Absensi>(sql, values);
}

export async function deleteAbsensi(id: string): Promise<boolean> {
  const result = await query<{ id: string }>('DELETE FROM absensi WHERE id = $1 RETURNING id', [id]);
  return result.length > 0;
}

export async function getAbsensiStats(santuarioId: string): Promise<{
  hadir: number;
  izin: number;
  sakit: number;
  alpa: number;
  total: number;
}> {
  const sql = `
    SELECT
      COALESCE(SUM(CASE WHEN status = 'HADIR' THEN 1 ELSE 0 END), 0) as hadir,
      COALESCE(SUM(CASE WHEN status = 'IZIN' THEN 1 ELSE 0 END), 0) as izin,
      COALESCE(SUM(CASE WHEN status = 'SAKIT' THEN 1 ELSE 0 END), 0) as sakit,
      COALESCE(SUM(CASE WHEN status = 'ALPA' THEN 1 ELSE 0 END), 0) as alpa,
      COUNT(*) as total
    FROM absensi
    WHERE santuario_id = $1
  `;
  const result = await queryOne<{
    hadir: string; izin: string; sakit: string; alpa: string; total: string;
  }>(sql, [santuarioId]);
  return {
    hadir: Number(result?.hadir ?? 0),
    izin: Number(result?.izin ?? 0),
    sakit: Number(result?.sakit ?? 0),
    alpa: Number(result?.alpa ?? 0),
    total: Number(result?.total ?? 0),
  };
}

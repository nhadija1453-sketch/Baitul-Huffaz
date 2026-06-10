import { query } from '@/lib/db/client';

export async function getRaportData(santuarioId: string) {
  const setoranSql = `
    SELECT surah, tajwid_score, makhraj_score, kelancaran_score, rata_rata, status, jenis, created_at
    FROM setoran
    WHERE santuario_id = $1
    ORDER BY created_at DESC
  `;
  const absensiSql = `
    SELECT tanggal, status
    FROM absensi
    WHERE santuario_id = $1
    ORDER BY tanggal DESC
  `;
  const evaluasiSql = `
    SELECT predikat_adab, predikat_kedisiplinan, catatan, periode
    FROM evaluasi
    WHERE santuario_id = $1
    ORDER BY created_at DESC
  `;
  const santriSql = `
    SELECT u.id, u.full_name, u.nis, k.nama as kelas_nama
    FROM users u
    LEFT JOIN kelas k ON u.kelas_id = k.id
    WHERE u.id = $1
  `;

  const [setoranRecords, absensiRecords, evaluasiRecords, santriInfo] = await Promise.all([
    query(setoranSql, [santuarioId]),
    query(absensiSql, [santuarioId]),
    query(evaluasiSql, [santuarioId]),
    query(santriSql, [santuarioId]),
  ]);

  return {
    santri: santriInfo[0] || null,
    setoran: setoranRecords,
    absensi: absensiRecords,
    evaluasi: evaluasiRecords,
  };
}

export async function getKelasRaportData(kelasId: string) {
  const sql = `
    SELECT u.id, u.full_name, u.nis,
      COALESCE((SELECT AVG(rata_rata) FROM setoran WHERE santuario_id = u.id), 0) as rata_setoran,
      COALESCE((SELECT COUNT(*) FROM absensi WHERE santuario_id = u.id AND status = 'HADIR'), 0) as total_hadir,
      COALESCE((SELECT COUNT(*) FROM absensi WHERE santuario_id = u.id), 0) as total_absensi
    FROM users u
    WHERE u.kelas_id = $1 AND u.role = 'SANTRI'
    ORDER BY u.full_name
  `;
  return query(sql, [kelasId]);
}

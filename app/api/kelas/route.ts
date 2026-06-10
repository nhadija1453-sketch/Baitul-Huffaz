import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db/client';

export interface Kelas {
  id: string;
  nama: string;
  level: number;
  deskripsi: string | null;
  created_at: string;
  updated_at: string;
}

export async function GET() {
  try {
    const sql = `
      SELECT k.*, u.id as musyrif_id, u.full_name as wali
      FROM kelas k
      LEFT JOIN users u ON u.kelas_id = k.id AND u.role = 'MUSYRIF'
      ORDER BY k.nama ASC
    `;
    const data = await query<any>(sql);
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data kelas' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const sql = `INSERT INTO kelas (nama, level, deskripsi) VALUES ($1, $2, $3) RETURNING *`;
    const data = await queryOne<Kelas>(sql, [body.nama, body.level ?? 7, body.deskripsi ?? null]);
    if (body.musyrif_id && data) {
      await query('UPDATE users SET kelas_id = $1 WHERE id = $2 AND role = $3', [data.id, body.musyrif_id, 'MUSYRIF']);
    }
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menyimpan kelas' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db/client';

export interface Kelas {
  id: string;
  nama: string;
  deskripsi: string | null;
  created_at: string;
  updated_at: string;
}

export async function GET() {
  try {
    const data = await query<Kelas>('SELECT * FROM kelas ORDER BY nama ASC');
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data kelas' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const sql = `INSERT INTO kelas (nama, deskripsi) VALUES ($1, $2) RETURNING *`;
    const data = await queryOne<Kelas>(sql, [body.nama, body.deskripsi ?? null]);
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menyimpan kelas' }, { status: 500 });
  }
}

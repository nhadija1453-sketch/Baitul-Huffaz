import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db/client';

export interface ZoomMeeting {
  id: string;
  musyrif_id: string;
  topic: string;
  description: string | null;
  meeting_date: string;
  meeting_time: string;
  duration: number;
  link: string;
  password: string | null;
  host_name: string | null;
  created_at: string;
  updated_at: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const musyrif_id = searchParams.get('musyrif_id');

    let sql = `
      SELECT z.*, u.full_name as musyrif_name
      FROM zoom_meetings z
      JOIN users u ON z.musyrif_id = u.id
    `;
    const params: unknown[] = [];

    if (musyrif_id) {
      sql += ' WHERE z.musyrif_id = $1';
      params.push(musyrif_id);
    }
    sql += ' ORDER BY z.meeting_date DESC, z.meeting_time DESC';

    const data = await query(sql, params);
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data meeting' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const sql = `
      INSERT INTO zoom_meetings (musyrif_id, topic, description, meeting_date, meeting_time, duration, link, password, host_name)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    const data = await queryOne<ZoomMeeting>(sql, [
      body.musyrif_id, body.topic, body.description ?? null,
      body.meeting_date, body.meeting_time, body.duration,
      body.link, body.password ?? null, body.host_name ?? null
    ]);
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menyimpan meeting' }, { status: 500 });
  }
}

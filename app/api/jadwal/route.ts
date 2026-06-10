import { NextRequest, NextResponse } from 'next/server';
import { getAllJadwal, getJadwalByHari, getJadwalByKelas, getJadwalByMusyrif, createJadwal } from '@/lib/services/jadwal.service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hari = searchParams.get('hari');
    const kelas_id = searchParams.get('kelas_id');
    const musyrif_id = searchParams.get('musyrif_id');

    let data;
    if (hari) {
      data = await getJadwalByHari(hari as any);
    } else if (kelas_id) {
      data = await getJadwalByKelas(kelas_id);
    } else if (musyrif_id) {
      data = await getJadwalByMusyrif(musyrif_id);
    } else {
      data = await getAllJadwal();
    }
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data jadwal' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const jadwal = await createJadwal(body);
    return NextResponse.json({ data: jadwal });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menyimpan jadwal' }, { status: 500 });
  }
}

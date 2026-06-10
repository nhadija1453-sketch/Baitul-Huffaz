import { NextRequest, NextResponse } from 'next/server';
import { getAllAbsensi, getAbsensiBySantri, getAbsensiByDate, getAbsensiByKelas, createAbsensi, upsertAbsensi } from '@/lib/services/absensi.service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const santuario_id = searchParams.get('santuario_id');
    const tanggal = searchParams.get('tanggal');
    const kelas_id = searchParams.get('kelas_id');

    let data;
    if (santuario_id) {
      data = await getAbsensiBySantri(santuario_id);
    } else if (tanggal) {
      data = await getAbsensiByDate(tanggal);
    } else if (kelas_id) {
      data = await getAbsensiByKelas(kelas_id);
    } else {
      data = await getAllAbsensi();
    }
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data absensi' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (body.upsert) {
      const absensi = await upsertAbsensi(body);
      return NextResponse.json({ data: absensi });
    }
    const absensi = await createAbsensi(body);
    return NextResponse.json({ data: absensi });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menyimpan absensi' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getAllSetoran, getSetoranBySantri, getSetoranByMusyrif, createSetoran } from '@/lib/services/hafalan.service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const santuario_id = searchParams.get('santuario_id');
    const musyrif_id = searchParams.get('musyrif_id');

    let data;
    if (santuario_id) {
      data = await getSetoranBySantri(santuario_id);
    } else if (musyrif_id) {
      data = await getSetoranByMusyrif(musyrif_id);
    } else {
      data = await getAllSetoran();
    }
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data setoran' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const setoran = await createSetoran(body);
    return NextResponse.json({ data: setoran });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menyimpan setoran' }, { status: 500 });
  }
}

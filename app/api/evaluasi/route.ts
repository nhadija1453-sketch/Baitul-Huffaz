import { NextRequest, NextResponse } from 'next/server';
import { getAllEvaluasi, getEvaluasiBySantri, getEvaluasiByMusyrif, getEvaluasiByPeriode, createEvaluasi } from '@/lib/services/evaluasi.service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const santuario_id = searchParams.get('santuario_id');
    const musyrif_id = searchParams.get('musyrif_id');
    const periode = searchParams.get('periode');

    let data;
    if (santuario_id) {
      data = await getEvaluasiBySantri(santuario_id);
    } else if (musyrif_id) {
      data = await getEvaluasiByMusyrif(musyrif_id);
    } else if (periode) {
      data = await getEvaluasiByPeriode(periode);
    } else {
      data = await getAllEvaluasi();
    }
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data evaluasi' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const evaluasi = await createEvaluasi(body);
    return NextResponse.json({ data: evaluasi });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menyimpan evaluasi' }, { status: 500 });
  }
}

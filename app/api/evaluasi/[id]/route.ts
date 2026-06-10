import { NextRequest, NextResponse } from 'next/server';
import { updateEvaluasi, deleteEvaluasi } from '@/lib/services/evaluasi.service';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const evaluasi = await updateEvaluasi(params.id, body);
    if (!evaluasi) {
      return NextResponse.json({ error: 'Evaluasi tidak ditemukan' }, { status: 404 });
    }
    return NextResponse.json({ data: evaluasi });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengupdate evaluasi' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await deleteEvaluasi(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menghapus evaluasi' }, { status: 500 });
  }
}

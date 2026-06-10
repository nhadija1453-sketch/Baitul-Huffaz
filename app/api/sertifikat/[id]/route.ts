import { NextRequest, NextResponse } from 'next/server';
import { updateSertifikat, deleteSertifikat } from '@/lib/services/sertifikat.service';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const sertifikat = await updateSertifikat(params.id, body);
    if (!sertifikat) {
      return NextResponse.json({ error: 'Sertifikat tidak ditemukan' }, { status: 404 });
    }
    return NextResponse.json({ data: sertifikat });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengupdate sertifikat' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await deleteSertifikat(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menghapus sertifikat' }, { status: 500 });
  }
}

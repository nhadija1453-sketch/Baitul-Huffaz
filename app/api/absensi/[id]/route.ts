import { NextRequest, NextResponse } from 'next/server';
import { updateAbsensi, deleteAbsensi } from '@/lib/services/absensi.service';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const absensi = await updateAbsensi(params.id, body);
    if (!absensi) {
      return NextResponse.json({ error: 'Absensi tidak ditemukan' }, { status: 404 });
    }
    return NextResponse.json({ data: absensi });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengupdate absensi' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await deleteAbsensi(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menghapus absensi' }, { status: 500 });
  }
}

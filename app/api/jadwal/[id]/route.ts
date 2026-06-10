import { NextRequest, NextResponse } from 'next/server';
import { updateJadwal, deleteJadwal } from '@/lib/services/jadwal.service';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const jadwal = await updateJadwal(params.id, body);
    if (!jadwal) {
      return NextResponse.json({ error: 'Jadwal tidak ditemukan' }, { status: 404 });
    }
    return NextResponse.json({ data: jadwal });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengupdate jadwal' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await deleteJadwal(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menghapus jadwal' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getSetoranById, updateSetoran, deleteSetoran } from '@/lib/services/hafalan.service';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const setoran = await getSetoranById(params.id);
    if (!setoran) {
      return NextResponse.json({ error: 'Setoran tidak ditemukan' }, { status: 404 });
    }
    return NextResponse.json({ data: setoran });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data setoran' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const setoran = await updateSetoran(params.id, body);
    if (!setoran) {
      return NextResponse.json({ error: 'Setoran tidak ditemukan' }, { status: 404 });
    }
    return NextResponse.json({ data: setoran });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengupdate setoran' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await deleteSetoran(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menghapus setoran' }, { status: 500 });
  }
}

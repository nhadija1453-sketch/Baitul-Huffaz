import { NextRequest, NextResponse } from 'next/server';

// Demo users for authentication
const DEMO_USERS = [
  { id: 'demo-admin-001', email: 'admin@baitulhuffaz.sch.id', password: 'admin123', fullName: 'Administrator', role: 'ADMIN' },
  { id: 'demo-musyrif-001', email: 'musyrif@baitulhuffaz.sch.id', password: 'musyrif123', fullName: 'Ustadz Mansyur', role: 'MUSYRIF' },
  { id: 'demo-santri-001', email: 'santri@baitulhuffaz.sch.id', password: 'santri123', fullName: 'Santri Demo', role: 'SANTRI' },
];

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email dan password wajib diisi' },
        { status: 400 }
      );
    }

    const user = DEMO_USERS.find(u => u.email === email && u.password === password);

    if (!user) {
      return NextResponse.json(
        { error: 'Email atau password salah' },
        { status: 401 }
      );
    }

    // Create session token (in production, use proper JWT)
    const sessionToken = Buffer.from(JSON.stringify({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    })).toString('base64');

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    });

    // Set cookie
    response.cookies.set('baitul_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('baitul_session');
  return response;
}
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { COTIZACIONES_COOKIE, signCotizacionesToken } from '@/lib/auth/cotizacionesSession';

const PASSWORD_HASH = '$2b$10$06cxdHMCFcjF5BK7OMTfCuVTf/VE9A9Qj6/qmNF/5MdTEls2EnOBW';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    if (!password) {
      return NextResponse.json({ error: 'Contraseña requerida' }, { status: 400 });
    }
    const valid = await bcrypt.compare(password, PASSWORD_HASH);
    if (!valid) {
      return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });
    }

    // Emite la sesión: sin esta cookie, /list responde 401.
    const token = await signCotizacionesToken();
    const response = NextResponse.json({ success: true });
    response.cookies.set(COTIZACIONES_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 12,
    });
    return response;
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

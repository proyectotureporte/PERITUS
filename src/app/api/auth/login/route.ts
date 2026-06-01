import { NextRequest, NextResponse } from 'next/server';
import { getRegistroForAuth } from '@/lib/db/registroPeritus';
import { comparePassword } from '@/lib/auth/passwords';
import { signToken } from '@/lib/auth/jwt';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password: rawPassword, type } = body as {
      email?: string;
      password: string;
      type: 'portal';
    };

    const password = rawPassword?.trim();

    if (!password) {
      return NextResponse.json({ success: false, error: 'Contrasena requerida' }, { status: 400 });
    }

    if (type !== 'portal') {
      return NextResponse.json({ success: false, error: 'Tipo de login invalido' }, { status: 400 });
    }

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email requerido' }, { status: 400 });
    }

    const correo = email.trim().toLowerCase();
    const perito = await getRegistroForAuth(correo);

    if (!perito) {
      return NextResponse.json({ success: false, error: 'Email o contrasena incorrectos' }, { status: 401 });
    }

    if (!perito.contrasenaHash) {
      return NextResponse.json(
        { success: false, error: 'Cuenta sin contrasena configurada. Contacte soporte.' },
        { status: 401 }
      );
    }

    const validPassword = await comparePassword(password, perito.contrasenaHash);
    if (!validPassword) {
      return NextResponse.json({ success: false, error: 'Email o contrasena incorrectos' }, { status: 401 });
    }

    const token = await signToken({
      sub: perito.id,
      role: 'cliente',
      displayName: perito.nombreApellido ?? '',
    });

    const response = NextResponse.json({
      success: true,
      data: { role: 'cliente', displayName: perito.nombreApellido, userId: perito.id },
    });

    response.cookies.set('crm-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err) {
    console.error('[auth/login] Error no capturado:', err);
    return NextResponse.json({ success: false, error: 'Error interno del servidor' }, { status: 500 });
  }
}

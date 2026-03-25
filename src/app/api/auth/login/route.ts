import { NextRequest, NextResponse } from 'next/server';
import { writeClient } from '@/lib/sanity/client';
import { comparePassword } from '@/lib/auth/passwords';
import { signToken } from '@/lib/auth/jwt';

interface RegistroPeritus {
  _id: string;
  nombreApellido: string;
  correo: string;
  contrasenaHash: string;
  activo: boolean;
  'clientRef._id': string;
}

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

    if (type === 'portal') {
      if (!email) {
        return NextResponse.json({ success: false, error: 'Email requerido' }, { status: 400 });
      }

      const correo = email.trim().toLowerCase();
      console.log('[auth/login] Intentando login para:', correo);

      let perito: RegistroPeritus | null = null;
      try {
        perito = await writeClient.fetch<RegistroPeritus | null>(
          `*[_type == "registroPeritus" && correo == $correo && activo == true][0]{
            _id, nombreApellido, correo, contrasenaHash, activo,
            "clientRefId": clientRef._ref
          }`,
          { correo }
        );
        console.log('[auth/login] Resultado Sanity — encontrado:', !!perito, '| tiene hash:', !!perito?.contrasenaHash);
      } catch (sanityErr) {
        console.error('[auth/login] Error consultando Sanity:', sanityErr);
        throw sanityErr;
      }

      if (!perito) {
        console.log('[auth/login] Usuario no encontrado en registroPeritus para:', correo);
        return NextResponse.json({ success: false, error: 'Email o contrasena incorrectos' }, { status: 401 });
      }

      if (!perito.contrasenaHash) {
        console.log('[auth/login] Usuario sin contrasenaHash:', perito._id);
        return NextResponse.json(
          { success: false, error: 'Cuenta sin contrasena configurada. Contacte soporte.' },
          { status: 401 }
        );
      }

      const validPassword = await comparePassword(password, perito.contrasenaHash);
      console.log('[auth/login] Contraseña válida:', validPassword);
      if (!validPassword) {
        return NextResponse.json({ success: false, error: 'Email o contrasena incorrectos' }, { status: 401 });
      }

      let token: string;
      try {
        token = await signToken({
          sub: perito._id,
          role: 'cliente',
          displayName: perito.nombreApellido,
        });
        console.log('[auth/login] Token generado OK');
      } catch (jwtErr) {
        console.error('[auth/login] Error generando JWT:', jwtErr);
        throw jwtErr;
      }

      const response = NextResponse.json({
        success: true,
        data: { role: 'cliente', displayName: perito.nombreApellido, userId: perito._id },
      });

      response.cookies.set('crm-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });

      return response;
    }

    return NextResponse.json({ success: false, error: 'Tipo de login invalido' }, { status: 400 });
  } catch (err) {
    console.error('[auth/login] Error no capturado:', err);
    console.error('[auth/login] Stack:', err instanceof Error ? err.stack : String(err));
    return NextResponse.json({ success: false, error: 'Error interno del servidor' }, { status: 500 });
  }
}

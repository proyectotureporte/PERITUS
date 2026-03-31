import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

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
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

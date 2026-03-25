import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import { client } from '@/lib/sanity/client';
import { getCrmUserByIdQuery } from '@/lib/sanity/queries';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('crm-token')?.value;
  if (!token) {
    return NextResponse.json({ success: false, error: 'No autenticado' }, { status: 401 });
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.json({ success: false, error: 'Token invalido' }, { status: 401 });
  }

  // sub es registroPeritus._id — no hay mustChangePassword en Peritus
  const mustChangePassword = false;

  return NextResponse.json({
    success: true,
    data: {
      sub: payload.sub,
      role: payload.role,
      displayName: payload.displayName,
      mustChangePassword,
    },
  });
}

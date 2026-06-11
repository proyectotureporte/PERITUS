import { NextRequest, NextResponse } from 'next/server';
import { listCotizaciones } from '@/lib/db/cotizacion';
import { COTIZACIONES_COOKIE, verifyCotizacionesToken } from '@/lib/auth/cotizacionesSession';

export async function GET(request: NextRequest) {
  // Estos datos incluyen información personal (nombre, email, teléfono): exigir
  // la sesión emitida por /api/portal/cotizaciones/auth. Sin ella, 401.
  const token = request.cookies.get(COTIZACIONES_COOKIE)?.value;
  if (!(await verifyCotizacionesToken(token))) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const cotizaciones = await listCotizaciones();
    return NextResponse.json({ success: true, data: cotizaciones });
  } catch (error) {
    console.error('Error fetching cotizaciones:', error);
    return NextResponse.json({ error: 'Error al obtener cotizaciones' }, { status: 500 });
  }
}

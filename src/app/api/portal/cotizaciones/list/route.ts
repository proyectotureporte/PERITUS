import { NextResponse } from 'next/server';
import { listCotizaciones } from '@/lib/db/cotizacion';

export async function GET() {
  try {
    const cotizaciones = await listCotizaciones();
    return NextResponse.json({ success: true, data: cotizaciones });
  } catch (error) {
    console.error('Error fetching cotizaciones:', error);
    return NextResponse.json({ error: 'Error al obtener cotizaciones' }, { status: 500 });
  }
}

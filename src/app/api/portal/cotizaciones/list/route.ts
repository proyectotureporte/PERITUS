import { NextResponse } from 'next/server';
import { writeClient } from '@/lib/sanity/client';

export async function GET() {
  try {
    const cotizaciones = await writeClient.fetch(
      `*[_type == "cotizacion"] | order(_createdAt desc) {
        _id, _createdAt, nombre, email, telefono,
        tipoPeritaje, ciudad, descripcion, estado
      }`
    );
    return NextResponse.json({ success: true, data: cotizaciones });
  } catch (error) {
    console.error('Error fetching cotizaciones:', error);
    return NextResponse.json({ error: 'Error al obtener cotizaciones' }, { status: 500 });
  }
}

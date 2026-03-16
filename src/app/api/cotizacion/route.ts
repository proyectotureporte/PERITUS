import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getSanityClient } from '@/lib/sanity/client';

const cotizacionSchema = z.object({
  nombre: z.string().min(2, 'Nombre requerido'),
  email: z.string().email('Email inválido'),
  telefono: z.string().min(7, 'Teléfono inválido'),
  tipoPeritaje: z.string().min(1, 'Seleccione un tipo de peritaje'),
  ciudad: z.string().min(2, 'Ciudad requerida'),
  descripcion: z.string().min(10, 'Mínimo 10 caracteres'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = cotizacionSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: result.error.flatten() },
        { status: 400 }
      );
    }

    if (!process.env.SANITY_PROJECT_ID || !process.env.SANITY_API_TOKEN) {
      return NextResponse.json(
        { error: 'Sanity no está configurado. Configure SANITY_PROJECT_ID y SANITY_API_TOKEN.' },
        { status: 500 }
      );
    }

    const sanityClient = getSanityClient();
    const doc = await sanityClient.create({
      _type: 'cotizacion',
      nombre: result.data.nombre,
      email: result.data.email,
      telefono: result.data.telefono,
      tipoPeritaje: result.data.tipoPeritaje,
      ciudad: result.data.ciudad,
      descripcion: result.data.descripcion,
      fechaCreacion: new Date().toISOString(),
      estado: 'pendiente',
    });

    return NextResponse.json({ success: true, id: doc._id });
  } catch (error) {
    console.error('Error al crear cotización:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

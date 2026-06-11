import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createCotizacion } from '@/lib/db/cotizacion';

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
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Cuerpo de la petición inválido' }, { status: 400 });
    }
    const result = cotizacionSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const id = await createCotizacion(result.data);

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Error al crear cotización:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

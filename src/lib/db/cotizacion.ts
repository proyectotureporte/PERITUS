import { query, buildInsert, newId } from './pool';
import type { Cotizacion } from '@/lib/types';

const SELECT = `
  c.id AS "_id", c.created_at AS "_createdAt", c.nombre, c.email, c.telefono,
  c.tipo_peritaje AS "tipoPeritaje", c.ciudad, c.descripcion,
  c.fecha_creacion AS "fechaCreacion", c.estado
`;

/** Listado para el portal de cotizaciones (admin). */
export async function listCotizaciones(): Promise<Cotizacion[]> {
  return query<Cotizacion>(
    `SELECT ${SELECT} FROM cotizacion c ORDER BY c.created_at DESC`,
  );
}

export interface CotizacionInput {
  nombre: string;
  email: string;
  telefono: string;
  tipoPeritaje: string;
  ciudad: string;
  descripcion: string;
  estado?: string;
}

export async function createCotizacion(input: CotizacionInput): Promise<string> {
  const id = newId();
  const { text, values } = buildInsert('cotizacion', {
    id,
    nombre: input.nombre,
    email: input.email,
    telefono: input.telefono,
    tipo_peritaje: input.tipoPeritaje,
    ciudad: input.ciudad,
    descripcion: input.descripcion,
    fecha_creacion: new Date().toISOString(),
    estado: input.estado ?? 'pendiente',
  });
  await query(text, values);
  return id;
}

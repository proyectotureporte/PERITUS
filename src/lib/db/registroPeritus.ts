import { query, queryOne, buildInsert, buildUpdate, newId, pruneUndefined } from './pool';
import type { PeritusRegistro, PeritusDocStatus } from '@/lib/types';

const SELECT = `
  r.id AS "_id", r.peritus_id AS "peritusId", r.nombre_apellido AS "nombreApellido",
  r.cedula, r.correo, r.celular, r.ciudad, r.profesion_oficio AS "profesionOficio",
  r.cargo, r.experiencia, r.especialidad, r.edad, r.file_url AS "hojaDeVidaUrl",
  r.estado_documentacion AS "estadoDocumentacion", r.notas_validacion AS "notasValidacion",
  r.fecha_registro AS "fechaRegistro"
`;

export async function getRegistroById(id: string): Promise<PeritusRegistro | null> {
  return queryOne<PeritusRegistro>(`SELECT ${SELECT} FROM registro_peritus r WHERE r.id = $1`, [id]);
}

// ── Auth de portal (incluye hash; solo activos) ─────────────────────────────
export interface RegistroAuth {
  id: string;
  nombreApellido: string | null;
  contrasenaHash: string | null;
  clientId: string | null;
}

/** Login: busca por correo (activo) e incluye el hash de contraseña. */
export async function getRegistroForAuth(correo: string): Promise<RegistroAuth | null> {
  return queryOne<RegistroAuth>(
    `SELECT r.id, r.nombre_apellido AS "nombreApellido",
            r.contrasena_hash AS "contrasenaHash", r.client_id AS "clientId"
     FROM registro_peritus r
     WHERE lower(r.correo) = lower($1) AND r.activo = TRUE
     ORDER BY r.created_at DESC LIMIT 1`,
    [correo],
  );
}

/** Portal: clientId del cliente asociado a un registroPeritus activo. */
export async function getClientIdForRegistro(registroId: string): Promise<string | null> {
  const row = await queryOne<{ clientId: string | null }>(
    `SELECT client_id AS "clientId" FROM registro_peritus
     WHERE id = $1 AND activo = TRUE`,
    [registroId],
  );
  return row?.clientId ?? null;
}

/** Cambio de contraseña del portal. */
export async function setContrasenaHash(registroId: string, contrasenaHash: string): Promise<void> {
  await query('UPDATE registro_peritus SET contrasena_hash = $1 WHERE id = $2', [contrasenaHash, registroId]);
}

// ── Registro web ────────────────────────────────────────────────────────────
/** Devuelve cedula/correo si ya existe un registro con alguno de los dos. */
export async function findDuplicate(
  cedula: string,
  correo: string,
): Promise<{ cedula: string | null; correo: string | null } | null> {
  return queryOne<{ cedula: string | null; correo: string | null }>(
    `SELECT cedula, correo FROM registro_peritus
     WHERE cedula = $1 OR lower(correo) = lower($2) LIMIT 1`,
    [cedula, correo],
  );
}

/**
 * Mayor peritus_id NUMÉRICO (formato `PER-####`) para auto-numerar el siguiente.
 * Ordena por el valor entero del sufijo, no por fecha ni lexicográficamente, e
 * IGNORA los ids no numéricos heredados de la migración de Sanity (p. ej.
 * `PER-V1ADZA`). Así el siguiente id nunca colisiona con uno ya existente.
 */
export async function getMaxNumericPeritusId(): Promise<string | null> {
  const row = await queryOne<{ peritusId: string | null }>(
    `SELECT peritus_id AS "peritusId" FROM registro_peritus
     WHERE peritus_id ~ '^PER-[0-9]+$'
     ORDER BY (substring(peritus_id from 5))::int DESC LIMIT 1`,
  );
  return row?.peritusId ?? null;
}

export interface RegistroPeritusInput {
  peritusId?: string | null;
  nombreApellido?: string | null;
  cedula?: string | null;
  correo?: string | null;
  celular?: string | null;
  ciudad?: string | null;
  profesionOficio?: string | null;
  cargo?: string | null;
  experiencia?: string | null;
  especialidad?: string | null;
  edad?: string | null;
  fileUrl?: string | null;
  fileAssetId?: string | null;
  fileName?: string | null;
  mimeType?: string | null;
  fileSize?: number | null;
  clientId?: string | null;
  fechaRegistro?: string | null;
  estadoDocumentacion?: PeritusDocStatus;
  notasValidacion?: string | null;
  activo?: boolean;
  contrasenaHash?: string | null;
}

function toColumns(input: Partial<RegistroPeritusInput>): Record<string, unknown> {
  return pruneUndefined({
    peritus_id: input.peritusId,
    nombre_apellido: input.nombreApellido,
    cedula: input.cedula,
    correo: input.correo,
    celular: input.celular,
    ciudad: input.ciudad,
    profesion_oficio: input.profesionOficio,
    cargo: input.cargo,
    experiencia: input.experiencia,
    especialidad: input.especialidad,
    edad: input.edad,
    file_url: input.fileUrl,
    file_asset_id: input.fileAssetId,
    file_name: input.fileName,
    mime_type: input.mimeType,
    file_size: input.fileSize,
    client_id: input.clientId,
    fecha_registro: input.fechaRegistro,
    estado_documentacion: input.estadoDocumentacion,
    notas_validacion: input.notasValidacion,
    activo: input.activo,
    contrasena_hash: input.contrasenaHash,
  });
}

export async function createRegistroPeritus(input: RegistroPeritusInput): Promise<PeritusRegistro | null> {
  const id = newId();
  const { text, values } = buildInsert('registro_peritus', { id, ...toColumns(input) });
  await query(text, values);
  return getRegistroById(id);
}

export async function updateRegistroPeritus(
  id: string,
  patch: Partial<RegistroPeritusInput>,
): Promise<PeritusRegistro | null> {
  const upd = buildUpdate('registro_peritus', id, toColumns(patch));
  if (upd) await query(upd.text, upd.values);
  return getRegistroById(id);
}

import { query, queryOne, buildInsert, buildUpdate, newId, pruneUndefined } from './pool';
import type { CrmClient } from '@/lib/types';

const BASE = `
  c.id AS "_id", 'crmClient' AS "_type", c.created_at AS "_createdAt", c.updated_at AS "_updatedAt",
  c.brand, c.name, c.email, c.phone, c.company, c.position, c.notes, c.status, c.created_by AS "createdBy"
`;

export interface ListClientsParams {
  search?: string;
  brand?: string;
}

export async function getClientById(id: string): Promise<CrmClient | null> {
  return queryOne<CrmClient>(`SELECT ${BASE} FROM crm_client c WHERE c.id = $1`, [id]);
}

export async function getClientByEmail(email: string): Promise<CrmClient | null> {
  return queryOne<CrmClient>(
    `SELECT ${BASE} FROM crm_client c WHERE lower(c.email) = lower($1) ORDER BY c.created_at ASC LIMIT 1`,
    [email],
  );
}

export interface CrmClientInput {
  brand?: 'CNP' | 'Peritus';
  name: string;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  position?: string | null;
  notes?: string | null;
  status?: CrmClient['status'] | null;
  createdBy?: string | null;
}

export async function createClient(input: CrmClientInput): Promise<CrmClient | null> {
  const id = newId();
  const { text, values } = buildInsert('crm_client', {
    id,
    brand: input.brand ?? 'CNP',
    name: input.name,
    email: input.email ?? null,
    phone: input.phone ?? null,
    company: input.company ?? null,
    position: input.position ?? null,
    notes: input.notes ?? null,
    status: input.status ?? null,
    created_by: input.createdBy ?? null,
  });
  await query(text, values);
  return getClientById(id);
}

export async function updateClient(id: string, patch: Partial<CrmClientInput>): Promise<CrmClient | null> {
  const data = pruneUndefined({
    brand: patch.brand,
    name: patch.name,
    email: patch.email,
    phone: patch.phone,
    company: patch.company,
    position: patch.position,
    notes: patch.notes,
    status: patch.status,
    created_by: patch.createdBy,
  });
  const upd = buildUpdate('crm_client', id, data);
  if (upd) await query(upd.text, upd.values);
  return getClientById(id);
}

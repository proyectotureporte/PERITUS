import { query, queryOne, buildInsert, newId } from './pool';
import type { CrmUser } from '@/lib/types';

// Campos seguros (sin password_hash).
const SAFE = `
  u.id AS "_id", 'crmUser' AS "_type", u.created_at AS "_createdAt", u.updated_at AS "_updatedAt",
  u.username, u.email, u.display_name AS "displayName", u.phone, u.role, u.active,
  u.avatar_url AS "avatarUrl", u.must_change_password AS "mustChangePassword"
`;

const WITH_HASH = `${SAFE}, u.password_hash AS "passwordHash"`;

const FROM = `FROM crm_user u`;

export async function getUserByEmail(email: string): Promise<CrmUser | null> {
  return queryOne<CrmUser>(
    `SELECT ${WITH_HASH} ${FROM} WHERE lower(u.email) = lower($1) AND u.active = TRUE`,
    [email],
  );
}

export async function getUserById(id: string): Promise<CrmUser | null> {
  return queryOne<CrmUser>(`SELECT ${SAFE} ${FROM} WHERE u.id = $1`, [id]);
}

export interface CrmUserInput {
  username?: string | null;
  email?: string | null;
  displayName?: string | null;
  phone?: string | null;
  passwordHash?: string | null;
  role?: CrmUser['role'];
  active?: boolean;
  mustChangePassword?: boolean;
  avatarUrl?: string | null;
  companyId?: string | null;
}

export async function createUser(input: CrmUserInput): Promise<CrmUser | null> {
  const id = newId();
  const { text, values } = buildInsert('crm_user', {
    id,
    username: input.username ?? null,
    email: input.email ?? null,
    display_name: input.displayName ?? null,
    phone: input.phone ?? null,
    password_hash: input.passwordHash ?? null,
    role: input.role ?? 'juridico',
    active: input.active ?? true,
    must_change_password: input.mustChangePassword ?? false,
    avatar_url: input.avatarUrl ?? null,
    company_id: input.companyId ?? null,
  });
  await query(text, values);
  return getUserById(id);
}

export async function setUserPassword(id: string, passwordHash: string, mustChange = false): Promise<void> {
  await query(
    'UPDATE crm_user SET password_hash = $1, must_change_password = $2 WHERE id = $3',
    [passwordHash, mustChange, id],
  );
}

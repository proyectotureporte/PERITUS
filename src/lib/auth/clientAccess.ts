import { queryOne } from '@/lib/db';
import { getClientIdForRegistro } from '@/lib/db/registroPeritus';

/**
 * El `sub` del JWT del portal es `registroPeritus.id`; `client_id` apunta al
 * crm_client asociado. Resuelve el clientId del usuario del portal.
 */
export async function getClientIdForUser(userId: string): Promise<string | null> {
  return getClientIdForRegistro(userId);
}

/**
 * Verifica que el usuario del portal sea dueño del caso
 * (cases.client_id == su clientId).
 */
export async function verifyClientOwnsCase(
  userId: string,
  caseId: string,
): Promise<{ owns: boolean; clientId: string | null }> {
  const clientId = await getClientIdForUser(userId);
  if (!clientId) return { owns: false, clientId: null };

  const row = await queryOne<{ client_id: string | null }>(
    'SELECT client_id FROM cases WHERE id = $1',
    [caseId],
  );

  return {
    owns: row?.client_id === clientId,
    clientId,
  };
}

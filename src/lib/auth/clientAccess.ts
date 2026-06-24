import { queryOne } from '@/lib/db';
import { getExpertUserIdForRegistro } from '@/lib/db/registroPeritus';

/**
 * El `sub` del JWT del portal es `registroPeritus.id`. Cada perito tiene una
 * cuenta `crm_user` (rol 'perito') vinculada en `registro_peritus.user_id`, y es
 * ese id el que figura en `cases.assigned_expert_id`. Resuelve el id de
 * usuario-perito del usuario del portal.
 */
export async function getExpertUserIdForUser(userId: string): Promise<string | null> {
  return getExpertUserIdForRegistro(userId);
}

/**
 * Verifica que el usuario del portal (perito) sea el experto asignado al caso
 * (cases.assigned_expert_id == su id de usuario-perito).
 */
export async function verifyExpertOwnsCase(
  userId: string,
  caseId: string,
): Promise<{ owns: boolean; expertUserId: string | null }> {
  const expertUserId = await getExpertUserIdForUser(userId);
  if (!expertUserId) return { owns: false, expertUserId: null };

  const row = await queryOne<{ assigned_expert_id: string | null }>(
    'SELECT assigned_expert_id FROM cases WHERE id = $1',
    [caseId],
  );

  return {
    owns: row?.assigned_expert_id === expertUserId,
    expertUserId,
  };
}

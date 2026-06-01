import { logCaseEvent as dbLogCaseEvent } from '@/lib/db/caseEvent';

interface LogEventParams {
  caseId: string;
  eventType: string;
  description: string;
  userId?: string | null;
  userName?: string | null;
}

/**
 * Registra un evento de caso en PostgreSQL (case_event). No bloqueante.
 * Mantiene la firma anterior (userId/userName) para no tocar los call sites.
 */
export async function logCaseEvent({ caseId, eventType, description, userId, userName }: LogEventParams) {
  await dbLogCaseEvent({
    caseId,
    eventType,
    description,
    createdById: userId ?? null,
    createdByName: userName ?? null,
  });
}

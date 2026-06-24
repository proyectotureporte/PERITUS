import { query, queryOne, buildInsert, buildUpdate, newId, pruneUndefined, nestedObj } from './pool';
import type { Case, CaseExpanded } from '@/lib/types';

// --- fragmentos de objetos anidados (refs -> {...}) -------------------------
const clientList = nestedObj('cl', { _id: 'cl.id', name: 'cl.name', email: 'cl.email', company: 'cl.company', brand: 'cl.brand' });
const clientFull = nestedObj('cl', { _id: 'cl.id', name: 'cl.name', email: 'cl.email', company: 'cl.company', phone: 'cl.phone', brand: 'cl.brand' });
const userEmail = (a: string) => nestedObj(a, { _id: `${a}.id`, displayName: `${a}.display_name`, email: `${a}.email` });
const userName = (a: string) => nestedObj(a, { _id: `${a}.id`, displayName: `${a}.display_name` });

const SCALARS = `
  c.id AS "_id", c.created_at AS "_createdAt", c.updated_at AS "_updatedAt",
  c.brand, c.case_code AS "caseCode", c.title, c.description, c.discipline, c.status,
  c.status_changed_by_role AS "statusChangedByRole", c.complexity, c.priority,
  c.estimated_amount AS "estimatedAmount", c.has_hearing AS "hasHearing",
  c.hearing_date AS "hearingDate", c.hearing_link AS "hearingLink", c.deadline_date AS "deadlineDate",
  c.city, c.court_name AS "courtName", c.case_number AS "caseNumber", c.risk_score AS "riskScore"
`;

const JOINS = `
  LEFT JOIN crm_client cl ON cl.id = c.client_id
  LEFT JOIN crm_user cm ON cm.id = c.commercial_id
  LEFT JOIN crm_user ta ON ta.id = c.technical_analyst_id
  LEFT JOIN crm_user ae ON ae.id = c.assigned_expert_id
  LEFT JOIN crm_user af ON af.id = c.assigned_financiero_id
  LEFT JOIN crm_user cb ON cb.id = c.created_by_id
`;

export async function getCaseById(id: string): Promise<CaseExpanded | null> {
  return queryOne<CaseExpanded>(
    `SELECT ${SCALARS},
       ${clientFull} AS "client",
       ${userEmail('cm')} AS "commercial",
       ${userEmail('ta')} AS "technicalAnalyst",
       ${userEmail('ae')} AS "assignedExpert",
       ${userEmail('af')} AS "assignedFinanciero",
       ${userName('cb')} AS "createdBy"
     FROM cases c ${JOINS}
     WHERE c.id = $1`,
    [id],
  );
}

/** Portal perito: casos ASIGNADOS al perito (assigned_expert_id) con sus refs. */
export async function listCasesForExpert(expertUserId: string): Promise<CaseExpanded[]> {
  return query<CaseExpanded>(
    `SELECT
       c.id AS "_id", c.created_at AS "_createdAt", c.updated_at AS "_updatedAt",
       c.brand, c.case_code AS "caseCode", c.title, c.discipline, c.status, c.complexity, c.priority,
       c.estimated_amount AS "estimatedAmount", c.has_hearing AS "hasHearing",
       c.hearing_date AS "hearingDate", c.deadline_date AS "deadlineDate",
       c.city, c.court_name AS "courtName", c.case_number AS "caseNumber",
       ${clientList} AS "client",
       ${userEmail('cm')} AS "commercial",
       ${userEmail('ae')} AS "assignedExpert"
     FROM cases c
     LEFT JOIN crm_client cl ON cl.id = c.client_id
     LEFT JOIN crm_user cm ON cm.id = c.commercial_id
     LEFT JOIN crm_user ae ON ae.id = c.assigned_expert_id
     WHERE c.assigned_expert_id = $1 AND c.status <> 'archivado'
     ORDER BY c.created_at DESC`,
    [expertUserId],
  );
}

// --- CRUD -------------------------------------------------------------------
export interface CaseInput {
  brand?: 'CNP' | 'Peritus';
  caseCode?: string | null;
  title: string;
  description?: string | null;
  clientId?: string | null;
  commercialId?: string | null;
  technicalAnalystId?: string | null;
  assignedExpertId?: string | null;
  assignedFinancieroId?: string | null;
  discipline?: Case['discipline'] | null;
  status?: Case['status'] | 'archivado';
  statusChangedByRole?: string | null;
  complexity?: Case['complexity'];
  priority?: Case['priority'];
  estimatedAmount?: number | null;
  hasHearing?: boolean;
  hearingDate?: string | null;
  hearingLink?: string | null;
  deadlineDate?: string | null;
  city?: string | null;
  courtName?: string | null;
  caseNumber?: string | null;
  riskScore?: number | null;
  createdById?: string | null;
}

function toColumns(input: Partial<CaseInput>): Record<string, unknown> {
  return pruneUndefined({
    brand: input.brand,
    case_code: input.caseCode,
    title: input.title,
    description: input.description,
    client_id: input.clientId,
    commercial_id: input.commercialId,
    technical_analyst_id: input.technicalAnalystId,
    assigned_expert_id: input.assignedExpertId,
    assigned_financiero_id: input.assignedFinancieroId,
    discipline: input.discipline,
    status: input.status,
    status_changed_by_role: input.statusChangedByRole,
    complexity: input.complexity,
    priority: input.priority,
    estimated_amount: input.estimatedAmount,
    has_hearing: input.hasHearing,
    hearing_date: input.hearingDate,
    hearing_link: input.hearingLink,
    deadline_date: input.deadlineDate,
    city: input.city,
    court_name: input.courtName,
    case_number: input.caseNumber,
    risk_score: input.riskScore,
    created_by_id: input.createdById,
  });
}

export async function createCase(input: CaseInput): Promise<CaseExpanded | null> {
  const id = newId();
  const { text, values } = buildInsert('cases', { id, ...toColumns(input) });
  await query(text, values);
  return getCaseById(id);
}

export async function updateCase(id: string, patch: Partial<CaseInput>): Promise<CaseExpanded | null> {
  const upd = buildUpdate('cases', id, toColumns(patch));
  if (upd) await query(upd.text, upd.values);
  return getCaseById(id);
}

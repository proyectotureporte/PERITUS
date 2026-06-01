import { query, queryOne, buildInsert, buildUpdate, newId, pruneUndefined, nestedObj } from './pool';
import type { Quote, QuoteStatus } from '@/lib/types';

const approvedByObj = nestedObj('ab', { _id: 'ab.id', displayName: 'ab.display_name' });
const createdByObj = nestedObj('cb', { _id: 'cb.id', displayName: 'cb.display_name' });
const caseObj = nestedObj('c', { _id: 'c.id', caseCode: 'c.case_code', title: 'c.title' });

const SELECT = `
  q.id AS "_id", q.created_at AS "_createdAt", q.version,
  q.total_price AS "totalPrice", q.discount_percentage AS "discountPercentage",
  q.final_value AS "finalValue", q.status, q.valid_until AS "validUntil",
  q.sent_at AS "sentAt", q.approved_at AS "approvedAt", q.rejection_reason AS "rejectionReason",
  q.notes, q.first_payment_date AS "firstPaymentDate", q.last_payment_date AS "lastPaymentDate",
  q.first_payment_percentage AS "firstPaymentPercentage", q.custom_split AS "customSplit",
  q.file_url AS "quoteDocumentUrl",
  ${approvedByObj} AS "approvedBy",
  ${createdByObj} AS "createdBy"
`;

const JOINS = `
  LEFT JOIN crm_user ab ON ab.id = q.approved_by_id
  LEFT JOIN crm_user cb ON cb.id = q.created_by_id
`;

export async function listCaseQuotes(caseId: string): Promise<Quote[]> {
  return query<Quote>(
    `SELECT ${SELECT} FROM quote q ${JOINS} WHERE q.case_id = $1 ORDER BY q.version DESC`,
    [caseId],
  );
}

export async function getQuoteById(id: string): Promise<Quote | null> {
  return queryOne<Quote>(
    `SELECT ${SELECT}, ${caseObj} AS "case"
     FROM quote q ${JOINS} LEFT JOIN cases c ON c.id = q.case_id
     WHERE q.id = $1`,
    [id],
  );
}

export async function countCaseQuotes(caseId: string): Promise<number> {
  const row = await queryOne<{ count: number }>(
    'SELECT count(*)::int AS count FROM quote WHERE case_id = $1',
    [caseId],
  );
  return row?.count ?? 0;
}

export interface QuoteInput {
  caseId: string;
  version?: number;
  totalPrice?: number | null;
  discountPercentage?: number;
  finalValue?: number | null;
  status?: QuoteStatus;
  validUntil?: string | null;
  sentAt?: string | null;
  approvedAt?: string | null;
  approvedById?: string | null;
  rejectionReason?: string | null;
  notes?: string | null;
  createdById?: string | null;
  fileUrl?: string | null;
  fileAssetId?: string | null;
  fileName?: string | null;
  mimeType?: string | null;
  fileSize?: number | null;
  firstPaymentDate?: string | null;
  lastPaymentDate?: string | null;
  firstPaymentPercentage?: number;
  customSplit?: boolean;
}

function toColumns(input: Partial<QuoteInput>): Record<string, unknown> {
  return pruneUndefined({
    case_id: input.caseId,
    version: input.version,
    total_price: input.totalPrice,
    discount_percentage: input.discountPercentage,
    final_value: input.finalValue,
    status: input.status,
    valid_until: input.validUntil,
    sent_at: input.sentAt,
    approved_at: input.approvedAt,
    approved_by_id: input.approvedById,
    rejection_reason: input.rejectionReason,
    notes: input.notes,
    created_by_id: input.createdById,
    file_url: input.fileUrl,
    file_asset_id: input.fileAssetId,
    file_name: input.fileName,
    mime_type: input.mimeType,
    file_size: input.fileSize,
    first_payment_date: input.firstPaymentDate,
    last_payment_date: input.lastPaymentDate,
    first_payment_percentage: input.firstPaymentPercentage,
    custom_split: input.customSplit,
  });
}

export async function createQuote(input: QuoteInput): Promise<Quote | null> {
  const id = newId();
  const { text, values } = buildInsert('quote', { id, ...toColumns(input) });
  await query(text, values);
  return getQuoteById(id);
}

export async function updateQuote(id: string, patch: Partial<QuoteInput>): Promise<Quote | null> {
  const upd = buildUpdate('quote', id, toColumns(patch));
  if (upd) await query(upd.text, upd.values);
  return getQuoteById(id);
}

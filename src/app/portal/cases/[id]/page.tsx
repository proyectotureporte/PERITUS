'use client';

import { useEffect, useState, useCallback } from 'react';
import { use } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Calendar, MapPin, Scale, Clock, Download, FileText } from 'lucide-react';
import PortalDocumentUpload from '@/components/portal/PortalDocumentUpload';
import {
  CASE_STATUS_LABELS,
  CASE_STATUS_COLORS,
  DISCIPLINE_LABELS,
  COMPLEXITY_LABELS,
  PRIORITY_LABELS,
  QUOTE_STATUS_LABELS,
  QUOTE_STATUS_COLORS,
  DOCUMENT_CATEGORY_LABELS,
  type CaseExpanded,
  type CaseStatus,
  type CaseDiscipline,
  type CaseComplexity,
  type CasePriority,
  type Quote,
  type QuoteStatus,
  type CaseEvent,
  type CaseDocument,
  type DocumentCategory,
  CASE_EVENT_LABELS,
  type CaseEventType,
} from '@/lib/types';

function formatDate(d?: string) {
  if (!d) return '-';
  return new Date(d).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatCurrency(v?: number | null) {
  if (v == null) return '$0';
  return `${v.toLocaleString('es-CO')}`;
}

function formatFileSize(bytes?: number) {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const glass = 'bg-white/10 backdrop-blur-sm rounded-xl border border-white/20';

export default function PortalCaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [caseData, setCaseData] = useState<CaseExpanded | null>(null);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [events, setEvents] = useState<CaseEvent[]>([]);
  const [documents, setDocuments] = useState<CaseDocument[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDocuments = useCallback(async () => {
    try {
      const res = await fetch(`/api/cases/${id}/documents`);
      const data = await res.json();
      if (data.success) setDocuments(data.data || []);
    } catch {
      /* ignore */
    }
  }, [id]);

  useEffect(() => {
    async function load() {
      try {
        const [caseRes, quotesRes, eventsRes, docsRes] = await Promise.all([
          fetch(`/api/cases/${id}`),
          fetch(`/api/cases/${id}/quotes`),
          fetch(`/api/cases/${id}/events`),
          fetch(`/api/cases/${id}/documents`),
        ]);
        const caseJson = await caseRes.json();
        const quotesJson = await quotesRes.json();
        const eventsJson = await eventsRes.json();
        const docsJson = await docsRes.json();

        if (caseJson.success) setCaseData(caseJson.data);
        if (quotesJson.success) setQuotes(quotesJson.data || []);
        if (eventsJson.success) setEvents(eventsJson.data || []);
        if (docsJson.success) setDocuments(docsJson.data || []);
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48 bg-white/10" />
        <Skeleton className="h-64 bg-white/10" />
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="text-center py-12">
        <p className="text-white">Caso no encontrado</p>
        <Link
          href="/portal/cases"
          className="mt-4 inline-block text-sm text-white underline"
        >
          Volver
        </Link>
      </div>
    );
  }

  const sc = CASE_STATUS_COLORS[caseData.status as CaseStatus];

  return (
    <>
      <Link
        href="/portal/cases"
        className="mb-4 inline-flex items-center gap-1 text-sm text-white hover:text-white/80 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Mis Casos
      </Link>

      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <span className="font-mono text-sm text-white">{caseData.caseCode}</span>
          <Badge className={`${sc?.bg} ${sc?.text} border-0`}>
            <span className={`mr-1 inline-block h-1.5 w-1.5 rounded-full ${sc?.dot}`} />
            {CASE_STATUS_LABELS[caseData.status as CaseStatus]}
          </Badge>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">{caseData.title}</h1>
      </div>

      <Tabs defaultValue="info" className="space-y-4">
        <TabsList className="bg-white/10 border border-white/20 h-auto p-1">
          <TabsTrigger value="info" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">Informacion</TabsTrigger>
          <TabsTrigger value="quotes" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">Cotizaciones ({quotes.length})</TabsTrigger>
          <TabsTrigger value="documents" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">Documentos ({documents.length})</TabsTrigger>
          <TabsTrigger value="timeline" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">Historial ({events.length})</TabsTrigger>
        </TabsList>

        {/* INFO */}
        <TabsContent value="info">
          <div className={`${glass} p-6 space-y-4`}>
            {caseData.description && (
              <div>
                <p className="text-xs font-medium text-white/70 mb-1">Descripcion</p>
                <p className="text-sm text-white">{caseData.description}</p>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <Scale className="h-4 w-4 text-white/70 shrink-0" />
                <div>
                  <p className="text-xs text-white/70">Disciplina</p>
                  <p className="text-sm font-medium text-white">
                    {DISCIPLINE_LABELS[caseData.discipline as CaseDiscipline]}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-white/70 shrink-0" />
                <div>
                  <p className="text-xs text-white/70">Prioridad</p>
                  <p className="text-sm font-medium text-white">
                    {PRIORITY_LABELS[caseData.priority as CasePriority]}
                  </p>
                </div>
              </div>

              {caseData.city && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-white/70 shrink-0" />
                  <div>
                    <p className="text-xs text-white/70">Ciudad</p>
                    <p className="text-sm font-medium text-white">{caseData.city}</p>
                  </div>
                </div>
              )}

              {caseData.hearingDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-white/70 shrink-0" />
                  <div>
                    <p className="text-xs text-white/70">Audiencia</p>
                    <p className="text-sm font-medium text-white">{formatDate(caseData.hearingDate)}</p>
                  </div>
                </div>
              )}

              {caseData.deadlineDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-white/70 shrink-0" />
                  <div>
                    <p className="text-xs text-white/70">Fecha limite</p>
                    <p className="text-sm font-medium text-white">{formatDate(caseData.deadlineDate)}</p>
                  </div>
                </div>
              )}

              {caseData.courtName && (
                <div>
                  <p className="text-xs text-white/70">Juzgado</p>
                  <p className="text-sm font-medium text-white">{caseData.courtName}</p>
                </div>
              )}

              {caseData.caseNumber && (
                <div>
                  <p className="text-xs text-white/70">Expediente</p>
                  <p className="text-sm font-medium text-white">{caseData.caseNumber}</p>
                </div>
              )}
            </div>

            <div>
              <p className="text-xs text-white/70">Complejidad</p>
              <p className="text-sm font-medium text-white">
                {COMPLEXITY_LABELS[caseData.complexity as CaseComplexity]}
              </p>
            </div>

            {caseData.commercial && (
              <div>
                <p className="text-xs text-white/70">Asesor Comercial</p>
                <p className="text-sm font-medium text-white">{caseData.commercial.displayName}</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* COTIZACIONES */}
        <TabsContent value="quotes">
          {quotes.length === 0 ? (
            <div className={`${glass} py-12 text-center`}>
              <p className="text-sm text-white">No hay cotizaciones aun</p>
            </div>
          ) : (
            <div className="space-y-3">
              {quotes.map((q) => {
                const qc = QUOTE_STATUS_COLORS[q.status as QuoteStatus];
                return (
                  <div key={q._id} className={`${glass} p-4`}>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">
                            {formatCurrency(q.finalValue)}
                          </span>
                          <Badge className={`${qc?.bg} ${qc?.text} border-0 text-xs`}>
                            <span
                              className={`mr-1 inline-block h-1.5 w-1.5 rounded-full ${qc?.dot}`}
                            />
                            {QUOTE_STATUS_LABELS[q.status as QuoteStatus]}
                          </Badge>
                          <span className="text-xs text-white">v{q.version}</span>
                        </div>
                        <p className="text-xs text-white">
                          Precio: {formatCurrency(q.totalPrice)} | Dcto: {q.discountPercentage}% |{' '}
                          {formatDate(q._createdAt)}
                        </p>
                        {q.notes && (
                          <p className="text-xs text-white">{q.notes}</p>
                        )}
                      </div>
                      {q.status === 'enviada' && (
                        <div className="flex gap-2">
                          <button
                            className="px-3 py-1.5 rounded-lg text-sm font-medium border border-red-400/50 text-red-300 hover:bg-red-500/20 transition-colors"
                            onClick={async () => {
                              const reason = prompt('Razon del rechazo:');
                              if (!reason) return;
                              await fetch(`/api/quotes/${q._id}/reject`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ rejectionReason: reason }),
                              });
                              window.location.reload();
                            }}
                          >
                            Rechazar
                          </button>
                          <button
                            className="px-3 py-1.5 rounded-lg text-sm font-medium bg-[#d4a843] text-[#0a2a6e] hover:bg-[#c49a30] transition-colors"
                            onClick={async () => {
                              await fetch(`/api/quotes/${q._id}/approve`, { method: 'POST' });
                              window.location.reload();
                            }}
                          >
                            Aprobar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* DOCUMENTOS */}
        <TabsContent value="documents">
          <div className="space-y-4">
            <div className={`${glass} p-6`}>
              <h3 className="text-sm font-medium text-white mb-3">Subir Documento</h3>
              <PortalDocumentUpload caseId={id} onUploadComplete={loadDocuments} />
            </div>

            {documents.length === 0 ? (
              <div className={`${glass} py-12 text-center`}>
                <FileText className="mx-auto mb-3 h-8 w-8 text-white" />
                <p className="text-sm text-white">No hay documentos disponibles</p>
              </div>
            ) : (
              <div className="space-y-2">
                {documents.map((doc) => (
                  <div key={doc._id} className={`${glass} px-4 py-3 flex items-center justify-between`}>
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText className="h-5 w-5 text-white shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">{doc.fileName}</p>
                        <p className="text-xs text-white">
                          {DOCUMENT_CATEGORY_LABELS[doc.category as DocumentCategory] || doc.category}
                          {doc.fileSize ? ` | ${formatFileSize(doc.fileSize)}` : ''}
                          {' | '}{formatDate(doc._createdAt)}
                        </p>
                        {doc.description && (
                          <p className="text-xs text-white mt-0.5">{doc.description}</p>
                        )}
                      </div>
                    </div>
                    {doc.fileUrl && (
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="shrink-0 p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* HISTORIAL */}
        <TabsContent value="timeline">
          {events.length === 0 ? (
            <div className={`${glass} py-12 text-center`}>
              <p className="text-sm text-white">Sin actividad</p>
            </div>
          ) : (
            <div className="space-y-2">
              {events.map((ev) => (
                <div key={ev._id} className={`${glass} px-4 py-3 flex items-start gap-3`}>
                  <div className="mt-1.5 h-2 w-2 rounded-full bg-[#d4a843] shrink-0" />
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium text-white">
                      {CASE_EVENT_LABELS[ev.eventType as CaseEventType]}
                    </p>
                    {ev.description && (
                      <p className="text-xs text-white">{ev.description}</p>
                    )}
                    <p className="text-xs text-white">
                      {formatDate(ev._createdAt)} |{' '}
                      {ev.createdBy?.displayName || ev.createdByName || 'Sistema'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </>
  );
}

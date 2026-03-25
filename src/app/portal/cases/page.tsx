'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Briefcase, ChevronRight } from 'lucide-react';
import {
  CASE_STATUS_LABELS,
  CASE_STATUS_COLORS,
  DISCIPLINE_LABELS,
  type CaseExpanded,
  type CaseStatus,
  type CaseDiscipline,
} from '@/lib/types';

export default function PortalCasesPage() {
  const [cases, setCases] = useState<CaseExpanded[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/cases');
        const data = await res.json();
        if (data.success) setCases(data.data || []);
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-white">Mis Casos</h1>
        <p className="text-sm text-white">Seguimiento de tus dictámenes periciales</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-xl bg-white/10 animate-pulse" />
          ))}
        </div>
      ) : cases.length === 0 ? (
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 py-12 flex flex-col items-center">
          <Briefcase className="mb-3 h-8 w-8 text-white" />
          <p className="text-sm text-white">No tienes casos asignados</p>
        </div>
      ) : (
        <div className="space-y-3">
          {cases.map((c) => {
            const sc = CASE_STATUS_COLORS[c.status as CaseStatus];
            return (
              <Link key={c._id} href={`/portal/cases/${c._id}`}>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/15 transition-colors cursor-pointer px-4 py-4 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-white">{c.caseCode}</span>
                      <Badge className={`${sc?.bg} ${sc?.text} border-0 text-xs`}>
                        <span className={`mr-1 inline-block h-1.5 w-1.5 rounded-full ${sc?.dot}`} />
                        {CASE_STATUS_LABELS[c.status as CaseStatus]}
                      </Badge>
                    </div>
                    <p className="font-medium text-white">{c.title}</p>
                    <p className="text-xs text-white">
                      {DISCIPLINE_LABELS[c.discipline as CaseDiscipline]} |{' '}
                      {new Date(c._createdAt).toLocaleDateString('es-CO')}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-white" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}

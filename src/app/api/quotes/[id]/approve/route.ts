import { NextRequest, NextResponse } from 'next/server';
import { getQuoteById, updateQuote } from '@/lib/db/quote';
import { logCaseEvent } from '@/lib/sanity/logEvent';
import type { Quote } from '@/lib/types';

type QuoteWithCase = Quote & { case?: { _id: string; caseCode: string; title: string } };

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = request.headers.get('x-user-id');
    const userName = request.headers.get('x-user-name');

    const existing = (await getQuoteById(id)) as QuoteWithCase | null;
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Cotizacion no encontrada' }, { status: 404 });
    }

    if (existing.status !== 'enviada') {
      return NextResponse.json({ success: false, error: 'Solo se pueden aprobar cotizaciones enviadas' }, { status: 400 });
    }

    const updated = await updateQuote(id, {
      status: 'aprobada',
      approvedAt: new Date().toISOString(),
      approvedById: userId && userId !== 'admin' ? userId : null,
    });

    if (existing.case?._id) {
      const versionLabel = existing.version ? ` v${existing.version}` : '';
      await logCaseEvent({
        caseId: existing.case._id,
        eventType: 'quote_approved',
        description: `Cotizacion${versionLabel} aprobada`,
        userId,
        userName,
      });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json({ success: false, error: 'Error aprobando cotizacion' }, { status: 500 });
  }
}

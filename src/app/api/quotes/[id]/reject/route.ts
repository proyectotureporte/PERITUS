import { NextRequest, NextResponse } from 'next/server';
import { getQuoteById, updateQuote } from '@/lib/db/quote';
import { logCaseEvent } from '@/lib/sanity/logEvent';
import { verifyExpertOwnsCase } from '@/lib/auth/clientAccess';
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
    const userRole = request.headers.get('x-user-role') || '';

    let body: { rejectionReason?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, error: 'Cuerpo de la peticion invalido' }, { status: 400 });
    }
    const { rejectionReason } = body;

    const existing = (await getQuoteById(id)) as QuoteWithCase | null;
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Cotizacion no encontrada' }, { status: 404 });
    }

    // El perito solo puede rechazar cotizaciones de los casos que tiene asignados.
    if (userRole === 'cliente') {
      const caseId = existing.case?._id;
      const { owns } = caseId
        ? await verifyExpertOwnsCase(userId || '', caseId)
        : { owns: false };
      if (!owns) {
        return NextResponse.json({ success: false, error: 'No tiene acceso a esta cotizacion' }, { status: 403 });
      }
    }

    if (existing.status !== 'enviada') {
      return NextResponse.json({ success: false, error: 'Solo se pueden rechazar cotizaciones enviadas' }, { status: 400 });
    }

    if (!rejectionReason) {
      return NextResponse.json({ success: false, error: 'La razon de rechazo es requerida' }, { status: 400 });
    }

    const updated = await updateQuote(id, { status: 'rechazada', rejectionReason });

    if (existing.case?._id) {
      await logCaseEvent({
        caseId: existing.case._id,
        eventType: 'quote_rejected',
        description: `Cotizacion rechazada: ${rejectionReason}`,
        userId,
        userName,
      });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json({ success: false, error: 'Error rechazando cotizacion' }, { status: 500 });
  }
}

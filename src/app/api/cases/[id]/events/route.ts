import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/sanity/client';
import { listCaseEventsQuery } from '@/lib/sanity/queries';
import { verifyClientOwnsCase } from '@/lib/auth/clientAccess';
import type { CaseEvent } from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userRole = request.headers.get('x-user-role') || '';
    const userId = request.headers.get('x-user-id') || '';

    if (userRole === 'cliente') {
      const { owns } = await verifyClientOwnsCase(userId, id);
      if (!owns) {
        return NextResponse.json({ success: false, error: 'No tiene acceso a este caso' }, { status: 403 });
      }
    }

    const events = await client.fetch<CaseEvent[]>(listCaseEventsQuery, { caseId: id });
    return NextResponse.json({ success: true, data: events });
  } catch {
    return NextResponse.json({ success: false, error: 'Error obteniendo eventos' }, { status: 500 });
  }
}

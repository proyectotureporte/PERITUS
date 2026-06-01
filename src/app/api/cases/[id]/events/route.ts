import { NextRequest, NextResponse } from 'next/server';
import { listCaseEvents } from '@/lib/db/caseEvent';
import { verifyClientOwnsCase } from '@/lib/auth/clientAccess';

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

    const events = await listCaseEvents(id);
    return NextResponse.json({ success: true, data: events });
  } catch {
    return NextResponse.json({ success: false, error: 'Error obteniendo eventos' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { listCaseQuotes } from '@/lib/db/quote';
import { verifyExpertOwnsCase } from '@/lib/auth/clientAccess';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userRole = request.headers.get('x-user-role') || '';
    const userId = request.headers.get('x-user-id') || '';

    if (userRole === 'cliente') {
      const { owns } = await verifyExpertOwnsCase(userId, id);
      if (!owns) {
        return NextResponse.json({ success: false, error: 'No tiene acceso a este caso' }, { status: 403 });
      }
    }

    const quotes = await listCaseQuotes(id);
    return NextResponse.json({ success: true, data: quotes });
  } catch {
    return NextResponse.json({ success: false, error: 'Error obteniendo cotizaciones' }, { status: 500 });
  }
}

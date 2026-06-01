import { NextRequest, NextResponse } from 'next/server';
import { listCasesForClient } from '@/lib/db/cases';
import { getClientIdForUser } from '@/lib/auth/clientAccess';

export async function GET(request: NextRequest) {
  try {
    const userRole = request.headers.get('x-user-role') || '';
    const userId = request.headers.get('x-user-id') || '';

    if (userRole === 'cliente') {
      const clientId = await getClientIdForUser(userId);
      if (!clientId) {
        return NextResponse.json({ success: true, data: [], meta: { total: 0, page: 1, limit: 20, totalPages: 0 } });
      }
      const cases = await listCasesForClient(clientId);
      return NextResponse.json({ success: true, data: cases, meta: { total: cases.length, page: 1, limit: cases.length, totalPages: 1 } });
    }

    return NextResponse.json({ success: false, error: 'Acceso denegado' }, { status: 403 });
  } catch {
    return NextResponse.json({ success: false, error: 'Error obteniendo casos' }, { status: 500 });
  }
}

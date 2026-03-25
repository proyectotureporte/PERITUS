import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/sanity/client';
import { listCasesForClientQuery } from '@/lib/sanity/queries';
import { getClientIdForUser } from '@/lib/auth/clientAccess';
import type { CaseExpanded } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const userRole = request.headers.get('x-user-role') || '';
    const userId = request.headers.get('x-user-id') || '';

    if (userRole === 'cliente') {
      const clientId = await getClientIdForUser(userId);
      if (!clientId) {
        return NextResponse.json({ success: true, data: [], meta: { total: 0, page: 1, limit: 20, totalPages: 0 } });
      }
      const cases = await client.fetch<CaseExpanded[]>(listCasesForClientQuery, { clientId });
      return NextResponse.json({ success: true, data: cases, meta: { total: cases.length, page: 1, limit: cases.length, totalPages: 1 } });
    }

    return NextResponse.json({ success: false, error: 'Acceso denegado' }, { status: 403 });
  } catch {
    return NextResponse.json({ success: false, error: 'Error obteniendo casos' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getCaseById } from '@/lib/db/cases';
import { verifyExpertOwnsCase } from '@/lib/auth/clientAccess';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userRole = request.headers.get('x-user-role') || '';
    const userId = request.headers.get('x-user-id') || '';
    const caseData = await getCaseById(id);

    if (!caseData) {
      return NextResponse.json({ success: false, error: 'Caso no encontrado' }, { status: 404 });
    }

    if (userRole === 'cliente') {
      const { owns } = await verifyExpertOwnsCase(userId, id);
      if (!owns) {
        return NextResponse.json({ success: false, error: 'No tiene acceso a este caso' }, { status: 403 });
      }
    }

    return NextResponse.json({ success: true, data: caseData });
  } catch {
    return NextResponse.json({ success: false, error: 'Error obteniendo caso' }, { status: 500 });
  }
}

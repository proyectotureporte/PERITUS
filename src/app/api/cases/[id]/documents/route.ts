import { NextRequest, NextResponse } from 'next/server';
import { client, writeClient } from '@/lib/sanity/client';
import { listClientVisibleDocumentsQuery, getCaseByIdQuery } from '@/lib/sanity/queries';
import { verifyClientOwnsCase } from '@/lib/auth/clientAccess';
import { DOCUMENT_CATEGORY_LABELS, type DocumentCategory, type CaseExpanded } from '@/lib/types';
import { logCaseEvent } from '@/lib/sanity/logEvent';

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
      const documents = await client.fetch(listClientVisibleDocumentsQuery, { caseId: id });
      return NextResponse.json({ success: true, data: documents });
    }

    return NextResponse.json({ success: false, error: 'Acceso denegado' }, { status: 403 });
  } catch {
    return NextResponse.json({ success: false, error: 'Error obteniendo documentos' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = request.headers.get('x-user-id');
    const userName = request.headers.get('x-user-name');
    const userRole = request.headers.get('x-user-role') || '';

    if (userRole === 'cliente') {
      const { owns } = await verifyClientOwnsCase(userId || '', id);
      if (!owns) {
        return NextResponse.json({ success: false, error: 'No tiene acceso a este caso' }, { status: 403 });
      }
    }

    const existing = await client.fetch<CaseExpanded | null>(getCaseByIdQuery, { id });
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Caso no encontrado' }, { status: 404 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const description = (formData.get('description') as string) || '';
    const category = 'soporte_tecnico';

    if (!file) {
      return NextResponse.json({ success: false, error: 'Archivo requerido' }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'El archivo excede el limite de 10MB' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const asset = await writeClient.assets.upload('file', buffer, {
      filename: file.name,
      contentType: file.type,
    });

    const doc: { _type: 'caseDocument'; [key: string]: unknown } = {
      _type: 'caseDocument',
      case: { _type: 'reference', _ref: id },
      category,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      version: 1,
      isVisibleToClient: true,
      description,
      uploadedByName: userName || 'Cliente',
      file: { _type: 'file', asset: { _type: 'reference', _ref: asset._id } },
    };

    if (userId && userId !== 'admin') {
      doc.uploadedBy = { _type: 'reference', _ref: userId };
    }

    const created = await writeClient.create(doc);

    const catLabel = DOCUMENT_CATEGORY_LABELS[category as DocumentCategory] || category;
    logCaseEvent({
      caseId: id,
      eventType: 'document_uploaded',
      description: `Documento subido: "${file.name}" (${catLabel})`,
      userId,
      userName,
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: 'Error subiendo documento' }, { status: 500 });
  }
}

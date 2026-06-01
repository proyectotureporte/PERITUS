import { NextRequest, NextResponse } from 'next/server';
import { listClientVisibleDocuments, createCaseDocument } from '@/lib/db/caseDocument';
import { getCaseById } from '@/lib/db/cases';
import { uploadFile } from '@/lib/sanity/assets';
import { verifyClientOwnsCase } from '@/lib/auth/clientAccess';
import { DOCUMENT_CATEGORY_LABELS, type DocumentCategory } from '@/lib/types';
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
      const documents = await listClientVisibleDocuments(id);
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

    const existing = await getCaseById(id);
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Caso no encontrado' }, { status: 404 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const description = (formData.get('description') as string) || '';
    const category: DocumentCategory = 'soporte_tecnico';

    if (!file) {
      return NextResponse.json({ success: false, error: 'Archivo requerido' }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'El archivo excede el limite de 10MB' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const asset = await uploadFile(buffer, file.name, file.type);

    const created = await createCaseDocument({
      caseId: id,
      uploadedById: userId,
      uploadedByName: userName || 'Cliente',
      category,
      fileUrl: asset.url,
      fileAssetId: asset.assetId,
      fileName: file.name,
      mimeType: file.type,
      fileSize: file.size,
      version: 1,
      isVisibleToClient: true,
      description,
    });

    const catLabel = DOCUMENT_CATEGORY_LABELS[category] || category;
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

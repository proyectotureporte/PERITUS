import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  FileText,
  User,
  Calendar,
  Clock,
  DollarSign,
  MessageSquare,
  Download,
  Upload,
  CheckCircle,
  Play,
  Send,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';
import { ChatWindow } from '@/components/chat/ChatWindow';

interface CaseDetail {
  id: string;
  case_number: string;
  title: string;
  description: string;
  specialty: string;
  urgency: string;
  status: string;
  court_name: string | null;
  court_case_number: string | null;
  deadline: string | null;
  estimated_hours: number | null;
  agreed_rate: number | null;
  total_amount: number | null;
  payment_status: string;
  client_notes: string | null;
  expert_notes: string | null;
  created_at: string;
  assigned_at: string | null;
  started_at: string | null;
  completed_at: string | null;
  client_profiles: {
    id: string;
    profiles: { id: string; full_name: string; email: string; phone: string | null } | null;
  } | null;
  expert_profiles: {
    id: string;
    profiles: { id: string; full_name: string } | null;
  } | null;
}

interface Document {
  id: string;
  name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  created_at: string;
  uploaded_by: string;
}

interface Report {
  id: string;
  version: number;
  title: string;
  status: string;
  file_url: string | null;
  submitted_at: string | null;
  created_at: string;
}

async function getCase(id: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from('cases')
    .select(`
      *,
      client_profiles (
        id,
        profiles (id, full_name, email, phone)
      ),
      expert_profiles (
        id,
        profiles (id, full_name)
      )
    `)
    .eq('id', id)
    .single();

  return data as CaseDetail | null;
}

async function getCaseDocuments(caseId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('case_documents')
    .select('*')
    .eq('case_id', caseId)
    .order('created_at', { ascending: false });
  return (data || []) as Document[];
}

async function getCaseReports(caseId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('case_reports')
    .select('*')
    .eq('case_id', caseId)
    .order('version', { ascending: false });
  return (data || []) as Report[];
}

async function getChatRoom(caseId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('chat_rooms')
    .select('id')
    .eq('case_id', caseId)
    .single();
  const room = data as { id: string } | null;
  return room?.id || null;
}

function getStatusBadge(status: string) {
  const map: Record<string, { label: string; variant: 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline' }> = {
    assigned: { label: 'Asignado', variant: 'secondary' },
    in_progress: { label: 'En Progreso', variant: 'default' },
    review: { label: 'En Revisión', variant: 'warning' },
    completed: { label: 'Completado', variant: 'success' },
    cancelled: { label: 'Cancelado', variant: 'outline' },
    disputed: { label: 'Disputado', variant: 'destructive' },
  };
  const info = map[status] || { label: status, variant: 'outline' as const };
  return <Badge variant={info.variant}>{info.label}</Badge>;
}

function getReportStatusBadge(status: string) {
  const map: Record<string, { label: string; variant: 'default' | 'secondary' | 'success' | 'warning' | 'destructive' }> = {
    draft: { label: 'Borrador', variant: 'secondary' },
    submitted: { label: 'Enviado', variant: 'default' },
    revision_requested: { label: 'Revisión', variant: 'warning' },
    approved: { label: 'Aprobado', variant: 'success' },
    final: { label: 'Final', variant: 'success' },
  };
  const info = map[status] || { label: status, variant: 'default' as const };
  return <Badge variant={info.variant}>{info.label}</Badge>;
}

export default async function PeritoCaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [caso, documents, reports, chatRoomId] = await Promise.all([
    getCase(id),
    getCaseDocuments(id),
    getCaseReports(id),
    getChatRoom(id),
  ]);

  if (!caso) {
    notFound();
  }

  const currentUserId = caso.expert_profiles?.profiles?.id || '';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/perito/casos">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{caso.case_number}</h1>
              {getStatusBadge(caso.status)}
            </div>
            <p className="text-gray-500 mt-1">{caso.title}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {caso.status === 'assigned' && (
            <Button>
              <Play className="h-4 w-4 mr-2" />
              Iniciar Trabajo
            </Button>
          )}
          {caso.status === 'in_progress' && (
            <Button>
              <Send className="h-4 w-4 mr-2" />
              Enviar Informe
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Case Info */}
          <Card>
            <CardHeader>
              <CardTitle>Detalles del Caso</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Descripción</h4>
                <p className="mt-1 text-gray-900">{caso.description}</p>
              </div>
              {caso.client_notes && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Notas del Cliente</h4>
                  <p className="mt-1 text-gray-900">{caso.client_notes}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Especialidad</h4>
                  <Badge variant="outline" className="mt-1">{caso.specialty}</Badge>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Urgencia</h4>
                  <Badge
                    variant={caso.urgency === 'critical' ? 'destructive' : caso.urgency === 'urgent' ? 'warning' : 'outline'}
                    className="mt-1"
                  >
                    {caso.urgency}
                  </Badge>
                </div>
                {caso.court_name && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Juzgado</h4>
                    <p className="mt-1">{caso.court_name}</p>
                  </div>
                )}
                {caso.court_case_number && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">No. Radicado</h4>
                    <p className="mt-1 font-mono">{caso.court_case_number}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Documentos ({documents.length})
                </CardTitle>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Subir
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {documents.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No hay documentos</p>
              ) : (
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-sm text-gray-500">
                            {(doc.file_size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Reports */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Informes Periciales</CardTitle>
                <Button size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Nuevo Informe
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {reports.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No hay informes enviados</p>
                  <Button className="mt-4">Crear Informe</Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {reports.map((report) => (
                    <div
                      key={report.id}
                      className="p-4 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{report.title}</span>
                            <Badge variant="outline">v{report.version}</Badge>
                            {getReportStatusBadge(report.status)}
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {report.submitted_at
                              ? `Enviado ${formatRelativeTime(report.submitted_at)}`
                              : `Creado ${formatRelativeTime(report.created_at)}`}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {report.file_url && (
                            <a href={report.file_url} target="_blank" rel="noopener noreferrer">
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            </a>
                          )}
                          <Button variant="outline" size="sm">Editar</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Chat */}
          {chatRoomId && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Chat con Cliente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChatWindow
                  roomId={chatRoomId}
                  currentUserId={currentUserId}
                  participantName={caso.client_profiles?.profiles?.full_name || 'Cliente'}
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Client Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Cliente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium">{caso.client_profiles?.profiles?.full_name}</p>
                  <p className="text-sm text-gray-500">{caso.client_profiles?.profiles?.email}</p>
                  {caso.client_profiles?.profiles?.phone && (
                    <p className="text-sm text-gray-500">{caso.client_profiles.profiles.phone}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dates & Deadline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Fechas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Creado</span>
                <span>{new Date(caso.created_at).toLocaleDateString('es-CO')}</span>
              </div>
              {caso.assigned_at && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Asignado</span>
                  <span>{new Date(caso.assigned_at).toLocaleDateString('es-CO')}</span>
                </div>
              )}
              {caso.deadline && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Fecha Límite</span>
                  <span className="font-medium text-red-600">
                    {new Date(caso.deadline).toLocaleDateString('es-CO')}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Pago
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                {caso.total_amount && (
                  <p className="text-3xl font-bold text-green-600">
                    {formatCurrency(caso.total_amount)}
                  </p>
                )}
                <Badge
                  variant={
                    caso.payment_status === 'released' ? 'success' :
                    caso.payment_status === 'escrow' ? 'default' : 'warning'
                  }
                  className="mt-2"
                >
                  {caso.payment_status === 'pending' && 'Pendiente'}
                  {caso.payment_status === 'escrow' && 'En Escrow'}
                  {caso.payment_status === 'released' && 'Liberado'}
                </Badge>
                {caso.payment_status === 'escrow' && (
                  <p className="text-xs text-gray-500 mt-2">
                    Se liberará al completar el caso
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {caso.status === 'assigned' && (
                <Button className="w-full">
                  <Play className="h-4 w-4 mr-2" />
                  Iniciar Trabajo
                </Button>
              )}
              {caso.status === 'in_progress' && (
                <>
                  <Button className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Subir Informe
                  </Button>
                  <Button variant="outline" className="w-full">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Marcar Completado
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

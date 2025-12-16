import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  FileText,
  User,
  UserCheck,
  Calendar,
  Clock,
  DollarSign,
  MessageSquare,
  Download,
  AlertCircle,
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
    profiles: { id: string; full_name: string; email: string } | null;
  } | null;
  expert_profiles: {
    id: string;
    profiles: { id: string; full_name: string; email: string } | null;
  } | null;
}

interface Document {
  id: string;
  name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  created_at: string;
}

interface TimelineEntry {
  id: string;
  action: string;
  description: string;
  created_at: string;
  profiles: { full_name: string } | null;
}

async function getCase(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('cases')
    .select(`
      *,
      client_profiles (
        id,
        profiles (id, full_name, email)
      ),
      expert_profiles (
        id,
        profiles (id, full_name, email)
      )
    `)
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return data as CaseDetail;
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

async function getCaseTimeline(caseId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('case_timeline')
    .select(`*, profiles:actor_id (full_name)`)
    .eq('case_id', caseId)
    .order('created_at', { ascending: false });
  return (data || []) as TimelineEntry[];
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
    draft: { label: 'Borrador', variant: 'outline' },
    pending_assignment: { label: 'Pendiente Asignación', variant: 'warning' },
    assigned: { label: 'Asignado', variant: 'secondary' },
    in_progress: { label: 'En Progreso', variant: 'default' },
    review: { label: 'En Revisión', variant: 'secondary' },
    completed: { label: 'Completado', variant: 'success' },
    cancelled: { label: 'Cancelado', variant: 'outline' },
    disputed: { label: 'Disputado', variant: 'destructive' },
  };
  const info = map[status] || { label: status, variant: 'outline' as const };
  return <Badge variant={info.variant}>{info.label}</Badge>;
}

export default async function CaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [caso, documents, timeline, chatRoomId] = await Promise.all([
    getCase(id),
    getCaseDocuments(id),
    getCaseTimeline(id),
    getChatRoom(id),
  ]);

  if (!caso) {
    notFound();
  }

  const currentUserId = caso.client_profiles?.profiles?.id || '';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/cliente/casos">
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
        {caso.status === 'pending_assignment' && (
          <Link href={`/cliente/buscar?case=${caso.id}`}>
            <Button>Buscar Perito</Button>
          </Link>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Case Info */}
          <Card>
            <CardHeader>
              <CardTitle>Información del Caso</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Descripción</h4>
                <p className="mt-1 text-gray-900">{caso.description}</p>
              </div>
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
                {caso.deadline && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Fecha Límite</h4>
                    <p className="mt-1">{new Date(caso.deadline).toLocaleDateString('es-CO')}</p>
                  </div>
                )}
                {caso.total_amount && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Monto Total</h4>
                    <p className="mt-1 font-medium text-green-600">{formatCurrency(caso.total_amount)}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Documentos ({documents.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {documents.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No hay documentos adjuntos</p>
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
                            {(doc.file_size / 1024).toFixed(1)} KB • {formatRelativeTime(doc.created_at)}
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

          {/* Chat */}
          {chatRoomId && caso.expert_profiles && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Chat con Perito
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChatWindow
                  roomId={chatRoomId}
                  currentUserId={currentUserId}
                  participantName={caso.expert_profiles?.profiles?.full_name || 'Perito'}
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Perito Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Perito Asignado
              </CardTitle>
            </CardHeader>
            <CardContent>
              {caso.expert_profiles ? (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <UserCheck className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{caso.expert_profiles.profiles?.full_name}</p>
                    <p className="text-sm text-gray-500">{caso.expert_profiles.profiles?.email}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <AlertCircle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                  <p className="text-gray-500">Sin perito asignado</p>
                  <Link href={`/cliente/buscar?case=${caso.id}`}>
                    <Button size="sm" className="mt-2">Buscar Perito</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Actividad
              </CardTitle>
            </CardHeader>
            <CardContent>
              {timeline.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Sin actividad registrada</p>
              ) : (
                <div className="space-y-4">
                  {timeline.slice(0, 10).map((entry) => (
                    <div key={entry.id} className="flex gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                      <div>
                        <p className="text-sm text-gray-900">{entry.description}</p>
                        <p className="text-xs text-gray-500">
                          {entry.profiles?.full_name} • {formatRelativeTime(entry.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Estado de Pago
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-2">
                <Badge
                  variant={
                    caso.payment_status === 'released' ? 'success' :
                    caso.payment_status === 'escrow' ? 'default' : 'warning'
                  }
                  className="text-lg px-4 py-1"
                >
                  {caso.payment_status === 'pending' && 'Pendiente'}
                  {caso.payment_status === 'escrow' && 'En Escrow'}
                  {caso.payment_status === 'released' && 'Liberado'}
                  {caso.payment_status === 'refunded' && 'Reembolsado'}
                </Badge>
                {caso.total_amount && (
                  <p className="mt-2 text-2xl font-bold text-gray-900">
                    {formatCurrency(caso.total_amount)}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

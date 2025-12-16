import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import {
  FileText,
  Search,
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  UserCheck,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatRelativeTime, formatCurrency } from '@/lib/utils';

interface Case {
  id: string;
  case_number: string;
  title: string;
  description: string;
  specialty: string;
  urgency: string;
  status: string;
  total_amount: number | null;
  payment_status: string;
  created_at: string;
  deadline: string | null;
  client_profiles: {
    profiles: { full_name: string } | null;
  } | null;
  expert_profiles: {
    profiles: { full_name: string } | null;
  } | null;
}

async function getCases() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('cases')
    .select(`
      *,
      client_profiles (
        profiles (full_name)
      ),
      expert_profiles (
        profiles (full_name)
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching cases:', error);
    return [];
  }

  return data as Case[];
}

async function getCaseStats() {
  const supabase = await createClient();

  const { count: total } = await supabase
    .from('cases')
    .select('*', { count: 'exact', head: true });

  const { count: pending } = await supabase
    .from('cases')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending_assignment');

  const { count: inProgress } = await supabase
    .from('cases')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'in_progress');

  const { count: completed } = await supabase
    .from('cases')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'completed');

  const { count: disputed } = await supabase
    .from('cases')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'disputed');

  return {
    total: total || 0,
    pending: pending || 0,
    inProgress: inProgress || 0,
    completed: completed || 0,
    disputed: disputed || 0,
  };
}

function getStatusBadge(status: string) {
  const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline' }> = {
    draft: { label: 'Borrador', variant: 'outline' },
    pending_assignment: { label: 'Pendiente', variant: 'warning' },
    assigned: { label: 'Asignado', variant: 'secondary' },
    in_progress: { label: 'En Progreso', variant: 'default' },
    review: { label: 'En Revisión', variant: 'secondary' },
    completed: { label: 'Completado', variant: 'success' },
    cancelled: { label: 'Cancelado', variant: 'outline' },
    disputed: { label: 'Disputado', variant: 'destructive' },
  };

  const statusInfo = statusMap[status] || { label: status, variant: 'outline' as const };
  return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
}

function getUrgencyBadge(urgency: string) {
  switch (urgency) {
    case 'critical':
      return <Badge variant="destructive">Crítico</Badge>;
    case 'urgent':
      return <Badge variant="warning">Urgente</Badge>;
    default:
      return <Badge variant="outline">Normal</Badge>;
  }
}

export default async function CasosPage() {
  const [cases, stats] = await Promise.all([getCases(), getCaseStats()]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Casos</h1>
        <p className="text-gray-500 mt-1">
          Administra todos los casos periciales del sistema
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-5">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-amber-500" />
              <div>
                <p className="text-sm text-gray-500">Pendientes</p>
                <p className="text-xl font-bold">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">En Progreso</p>
                <p className="text-xl font-bold">{stats.inProgress}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-500">Completados</p>
                <p className="text-xl font-bold">{stats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-gray-500">Disputados</p>
                <p className="text-xl font-bold">{stats.disputed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cases List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Todos los Casos</CardTitle>
              <CardDescription>Lista completa de casos periciales</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtrar
              </Button>
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {cases.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No hay casos registrados</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cases.map((caso) => (
                <div
                  key={caso.id}
                  className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-mono text-sm text-gray-500">
                          {caso.case_number}
                        </span>
                        {getStatusBadge(caso.status)}
                        {getUrgencyBadge(caso.urgency)}
                        <Badge variant="outline">{caso.specialty}</Badge>
                      </div>
                      <h3 className="font-medium text-gray-900 mt-2">{caso.title}</h3>
                      <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                        {caso.description}
                      </p>
                      <div className="flex items-center gap-6 mt-3 text-sm">
                        <div className="flex items-center gap-1 text-gray-500">
                          <User className="h-4 w-4" />
                          <span>Cliente: {caso.client_profiles?.profiles?.full_name || 'N/A'}</span>
                        </div>
                        {caso.expert_profiles && (
                          <div className="flex items-center gap-1 text-gray-500">
                            <UserCheck className="h-4 w-4" />
                            <span>Perito: {caso.expert_profiles.profiles?.full_name || 'N/A'}</span>
                          </div>
                        )}
                        {caso.total_amount && (
                          <span className="text-gray-500">
                            Monto: {formatCurrency(caso.total_amount)}
                          </span>
                        )}
                        <span className="text-gray-400">
                          {formatRelativeTime(caso.created_at)}
                        </span>
                      </div>
                    </div>
                    <Link href={`/admin/casos/${caso.id}`}>
                      <Button variant="outline" size="sm">
                        Ver Detalles
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

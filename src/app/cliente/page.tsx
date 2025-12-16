import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import {
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Plus,
  ArrowRight,
  Calendar,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatRelativeTime, formatCurrency, STATUS_LABELS } from '@/lib/utils';

interface ClientCaseData {
  id: string;
  case_number: string;
  title: string;
  status: string;
  total_amount: number | null;
  deadline: string | null;
  created_at: string;
  expert_profiles: {
    id: string;
    profile_id: string;
    profiles: { full_name: string; avatar_url: string | null } | null;
  } | null;
}

async function getClientData(userId: string) {
  const supabase = await createClient();

  // Get client profile
  const { data: clientProfile } = await supabase
    .from('client_profiles')
    .select('*')
    .eq('profile_id', userId)
    .single();

  const typedClientProfile = clientProfile as { id: string } | null;

  // Get recent cases
  const { data: cases } = await supabase
    .from('cases')
    .select(`
      *,
      expert_profiles (
        id,
        profile_id,
        profiles (full_name, avatar_url)
      )
    `)
    .eq('client_id', typedClientProfile?.id || '')
    .order('created_at', { ascending: false })
    .limit(5);

  // Get case statistics
  const { count: totalCases } = await supabase
    .from('cases')
    .select('*', { count: 'exact', head: true })
    .eq('client_id', typedClientProfile?.id || '');

  const { count: activeCases } = await supabase
    .from('cases')
    .select('*', { count: 'exact', head: true })
    .eq('client_id', typedClientProfile?.id || '')
    .in('status', ['pending_assignment', 'assigned', 'in_progress', 'review']);

  const { count: completedCases } = await supabase
    .from('cases')
    .select('*', { count: 'exact', head: true })
    .eq('client_id', typedClientProfile?.id || '')
    .eq('status', 'completed');

  // Get unread notifications
  const { count: unreadNotifications } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_read', false);

  return {
    clientProfile: typedClientProfile,
    cases: (cases || []) as ClientCaseData[],
    stats: {
      total: totalCases || 0,
      active: activeCases || 0,
      completed: completedCases || 0,
      notifications: unreadNotifications || 0,
    },
  };
}

export default async function ClientDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const typedProfile = profile as { full_name: string } | null;
  const { cases, stats } = await getClientData(user.id);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'destructive'> = {
      draft: 'secondary',
      pending_assignment: 'warning',
      assigned: 'default',
      in_progress: 'info' as 'default',
      review: 'purple' as 'default',
      completed: 'success',
      cancelled: 'destructive',
      disputed: 'destructive',
    };
    return <Badge variant={variants[status] || 'secondary'}>{STATUS_LABELS[status] || status}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Bienvenido, {typedProfile?.full_name?.split(' ')[0]}
          </h1>
          <p className="text-gray-500 mt-1">
            Aquí tienes un resumen de tu actividad reciente
          </p>
        </div>
        <Link href="/cliente/casos/nuevo">
          <Button size="lg" className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Caso
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Casos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-100 rounded-xl">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">En Progreso</p>
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Completados</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-xl">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Notificaciones</p>
                <p className="text-2xl font-bold text-gray-900">{stats.notifications}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Cases */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Casos Recientes</CardTitle>
                <CardDescription>Tus últimos casos y su estado actual</CardDescription>
              </div>
              <Link href="/cliente/casos">
                <Button variant="ghost" size="sm" className="gap-1">
                  Ver todos
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {cases.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No tienes casos aún</p>
                  <Link href="/cliente/casos/nuevo">
                    <Button>Crear tu primer caso</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {cases.map((caso) => (
                    <Link
                      key={caso.id}
                      href={`/cliente/casos/${caso.id}`}
                      className="block p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-sm text-gray-500">
                              {caso.case_number}
                            </span>
                            {getStatusBadge(caso.status)}
                          </div>
                          <h3 className="font-medium text-gray-900 truncate">
                            {caso.title}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Creado {formatRelativeTime(caso.created_at)}
                          </p>
                        </div>
                        {caso.total_amount && (
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              {formatCurrency(caso.total_amount)}
                            </p>
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/cliente/casos/nuevo" className="block">
                <Button variant="outline" className="w-full justify-start gap-3">
                  <Plus className="h-4 w-4" />
                  Crear Nuevo Caso
                </Button>
              </Link>
              <Link href="/cliente/buscar" className="block">
                <Button variant="outline" className="w-full justify-start gap-3">
                  <TrendingUp className="h-4 w-4" />
                  Buscar Perito
                </Button>
              </Link>
              <Link href="/cliente/mensajes" className="block">
                <Button variant="outline" className="w-full justify-start gap-3">
                  <Calendar className="h-4 w-4" />
                  Ver Mensajes
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Próximos Vencimientos</CardTitle>
              <CardDescription>Fechas límite de tus casos</CardDescription>
            </CardHeader>
            <CardContent>
              {cases.filter((c) => c.deadline).length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No hay vencimientos próximos
                </p>
              ) : (
                <div className="space-y-3">
                  {cases
                    .filter((c) => c.deadline)
                    .slice(0, 3)
                    .map((caso) => (
                      <div key={caso.id} className="flex items-center gap-3 text-sm">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {caso.title}
                          </p>
                          <p className="text-gray-500">
                            {caso.deadline && formatRelativeTime(caso.deadline)}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

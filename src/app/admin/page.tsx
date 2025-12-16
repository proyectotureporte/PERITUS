import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import {
  Users,
  FileText,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle,
  UserCheck,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatRelativeTime, formatCurrency } from '@/lib/utils';

interface RecentCase {
  id: string;
  case_number: string;
  title: string;
  status: string;
  created_at: string;
  client_profiles: { profiles: { full_name: string } } | null;
  expert_profiles: { profiles: { full_name: string } } | null;
}

interface PendingExpert {
  id: string;
  created_at: string;
  profiles: { full_name: string; email: string } | null;
}

async function getAdminStats() {
  const supabase = await createClient();

  // Users stats
  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  const { count: totalClients } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'cliente');

  const { count: totalExperts } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'perito');

  // Pending verifications
  const { count: pendingVerifications } = await supabase
    .from('expert_profiles')
    .select('*', { count: 'exact', head: true })
    .eq('verification_status', 'documents_submitted');

  // Cases stats
  const { count: totalCases } = await supabase
    .from('cases')
    .select('*', { count: 'exact', head: true });

  const { count: activeCases } = await supabase
    .from('cases')
    .select('*', { count: 'exact', head: true })
    .in('status', ['pending_assignment', 'assigned', 'in_progress', 'review']);

  // Payments
  const { data: payments } = await supabase
    .from('payments')
    .select('amount')
    .eq('status', 'released');

  const paymentsTyped = payments as { amount: number }[] | null;
  const totalRevenue = paymentsTyped?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

  // Suspicious activities
  const { count: unresolvedAlerts } = await supabase
    .from('suspicious_activities')
    .select('*', { count: 'exact', head: true })
    .eq('resolved', false);

  // Recent activity
  const { data: recentCases } = await supabase
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
    .order('created_at', { ascending: false })
    .limit(5);

  const { data: pendingExperts } = await supabase
    .from('expert_profiles')
    .select(`
      *,
      profiles (full_name, email)
    `)
    .eq('verification_status', 'documents_submitted')
    .order('created_at', { ascending: false })
    .limit(5);

  return {
    stats: {
      totalUsers: totalUsers || 0,
      totalClients: totalClients || 0,
      totalExperts: totalExperts || 0,
      pendingVerifications: pendingVerifications || 0,
      totalCases: totalCases || 0,
      activeCases: activeCases || 0,
      totalRevenue,
      unresolvedAlerts: unresolvedAlerts || 0,
    },
    recentCases: (recentCases || []) as RecentCase[],
    pendingExperts: (pendingExperts || []) as PendingExpert[],
  };
}

export default async function AdminDashboardPage() {
  const { stats, recentCases, pendingExperts } = await getAdminStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
        <p className="text-gray-500 mt-1">
          Vista general del sistema PERITUS
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Usuarios</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                <p className="text-xs text-gray-500">
                  {stats.totalClients} clientes, {stats.totalExperts} peritos
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-100 rounded-xl">
                <FileText className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Casos Totales</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCases}</p>
                <p className="text-xs text-gray-500">
                  {stats.activeCases} activos
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Ingresos Totales</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.totalRevenue)}
                </p>
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
                <p className="text-sm text-gray-500">Alertas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.unresolvedAlerts}
                </p>
                <p className="text-xs text-gray-500">sin resolver</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Pending Verifications */}
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                Verificaciones Pendientes
                {stats.pendingVerifications > 0 && (
                  <Badge variant="destructive">{stats.pendingVerifications}</Badge>
                )}
              </CardTitle>
              <CardDescription>Peritos esperando aprobación</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {pendingExperts.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-gray-500">No hay verificaciones pendientes</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingExperts.map((expert) => (
                    <div
                      key={expert.id}
                      className="p-3 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">
                            {expert.profiles?.full_name}
                          </p>
                          <p className="text-sm text-gray-500">{expert.profiles?.email}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatRelativeTime(expert.created_at)}
                          </p>
                        </div>
                        <Link href={`/admin/verificaciones/${expert.id}`}>
                          <Button size="sm">Revisar</Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                <Link href="/admin/verificaciones">
                  <Button variant="ghost" className="w-full gap-1">
                    Ver todas
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Cases */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Casos Recientes</CardTitle>
              <CardDescription>Últimos casos registrados en el sistema</CardDescription>
            </div>
            <Link href="/admin/casos">
              <Button variant="ghost" size="sm" className="gap-1">
                Ver todos
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentCases.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No hay casos registrados</p>
            ) : (
              <div className="space-y-4">
                {recentCases.map((caso) => (
                    <div
                      key={caso.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-gray-200"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm text-gray-500">
                            {caso.case_number}
                          </span>
                          <Badge
                            variant={
                              caso.status === 'completed'
                                ? 'success'
                                : caso.status === 'in_progress'
                                ? 'default'
                                : 'secondary'
                            }
                          >
                            {caso.status}
                          </Badge>
                        </div>
                        <p className="font-medium text-gray-900 truncate mt-1">
                          {caso.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          Cliente: {caso.client_profiles?.profiles?.full_name}
                          {caso.expert_profiles && ` • Perito: ${caso.expert_profiles.profiles?.full_name}`}
                        </p>
                      </div>
                      <Link href={`/admin/casos/${caso.id}`}>
                        <Button variant="outline" size="sm">
                          Ver
                        </Button>
                      </Link>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/admin/verificaciones">
              <Button variant="outline" className="w-full h-24 flex-col gap-2">
                <UserCheck className="h-6 w-6" />
                <span>Verificar Peritos</span>
              </Button>
            </Link>
            <Link href="/admin/casos?status=pending_assignment">
              <Button variant="outline" className="w-full h-24 flex-col gap-2">
                <Clock className="h-6 w-6" />
                <span>Casos Pendientes</span>
              </Button>
            </Link>
            <Link href="/admin/alertas">
              <Button variant="outline" className="w-full h-24 flex-col gap-2">
                <AlertTriangle className="h-6 w-6" />
                <span>Revisar Alertas</span>
              </Button>
            </Link>
            <Link href="/admin/reportes">
              <Button variant="outline" className="w-full h-24 flex-col gap-2">
                <TrendingUp className="h-6 w-6" />
                <span>Ver Reportes</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

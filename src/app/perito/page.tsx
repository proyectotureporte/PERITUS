import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import {
  FileText,
  Clock,
  CheckCircle,
  DollarSign,
  TrendingUp,
  Star,
  AlertTriangle,
  ArrowRight,
  Calendar,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatRelativeTime, formatCurrency, STATUS_LABELS } from '@/lib/utils';

interface ExpertProfileData {
  id: string;
  profile_id: string;
  specialties: string[];
  rating_average: number | null;
  rating_count: number;
  verification_status: string;
  response_time_hours: number;
  is_available: boolean;
}

interface ExpertCaseData {
  id: string;
  case_number: string;
  title: string;
  status: string;
  total_amount: number | null;
  deadline: string | null;
  created_at: string;
  client_profiles: {
    id: string;
    profile_id: string;
    company_name: string | null;
    profiles: { full_name: string; avatar_url: string | null } | null;
  } | null;
}

async function getExpertData(userId: string) {
  const supabase = await createClient();

  // Get expert profile
  const { data: expertProfile } = await supabase
    .from('expert_profiles')
    .select('*')
    .eq('profile_id', userId)
    .single();

  const typedExpertProfile = expertProfile as ExpertProfileData | null;

  if (!typedExpertProfile) {
    return { expertProfile: null, cases: [] as ExpertCaseData[], stats: { active: 0, completed: 0, pending: 0, earnings: 0 } };
  }

  // Get assigned cases
  const { data: cases } = await supabase
    .from('cases')
    .select(`
      *,
      client_profiles (
        id,
        profile_id,
        company_name,
        profiles (full_name, avatar_url)
      )
    `)
    .eq('expert_id', typedExpertProfile.id)
    .order('created_at', { ascending: false })
    .limit(5);

  // Get pending requests (cases waiting for assignment)
  const { count: pendingRequests } = await supabase
    .from('cases')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending_assignment')
    .contains('specialty', typedExpertProfile.specialties || []);

  // Get statistics
  const { count: activeCases } = await supabase
    .from('cases')
    .select('*', { count: 'exact', head: true })
    .eq('expert_id', typedExpertProfile.id)
    .in('status', ['assigned', 'in_progress', 'review']);

  const { count: completedCases } = await supabase
    .from('cases')
    .select('*', { count: 'exact', head: true })
    .eq('expert_id', typedExpertProfile.id)
    .eq('status', 'completed');

  // Get total earnings (released payments)
  const { data: payments } = await supabase
    .from('payments')
    .select('amount')
    .eq('payee_id', userId)
    .eq('status', 'released');

  const paymentsTyped = payments as { amount: number }[] | null;
  const totalEarnings = paymentsTyped?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

  return {
    expertProfile: typedExpertProfile,
    cases: (cases || []) as ExpertCaseData[],
    stats: {
      active: activeCases || 0,
      completed: completedCases || 0,
      pending: pendingRequests || 0,
      earnings: totalEarnings,
    },
  };
}

export default async function ExpertDashboardPage() {
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
  const { expertProfile, cases, stats } = await getExpertData(user.id);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'destructive'> = {
      draft: 'secondary',
      pending_assignment: 'warning',
      assigned: 'default',
      in_progress: 'default',
      review: 'default',
      completed: 'success',
      cancelled: 'destructive',
      disputed: 'destructive',
    };
    return <Badge variant={variants[status] || 'secondary'}>{STATUS_LABELS[status] || status}</Badge>;
  };

  // Check verification status
  const needsVerification = !expertProfile || expertProfile.verification_status !== 'verified';

  return (
    <div className="space-y-6">
      {/* Verification Warning */}
      {needsVerification && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="py-4">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-amber-100 rounded-full">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-amber-900">
                  Completa tu verificación
                </h3>
                <p className="text-sm text-amber-700">
                  Para recibir casos, necesitas completar tu perfil y verificar tus credenciales.
                </p>
              </div>
              <Link href="/perito/verificacion">
                <Button variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-100">
                  Completar
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Bienvenido, {typedProfile?.full_name?.split(' ')[0]}
          </h1>
          <p className="text-gray-500 mt-1">
            Panel de control de tu actividad pericial
          </p>
        </div>
        {expertProfile?.verification_status === 'verified' && (
          <Link href="/perito/solicitudes">
            <Button size="lg" className="gap-2">
              Ver Solicitudes
              {stats.pending > 0 && (
                <Badge variant="destructive" className="ml-1">
                  {stats.pending}
                </Badge>
              )}
            </Button>
          </Link>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-100 rounded-xl">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Casos Activos</p>
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
              <div className="p-3 bg-blue-100 rounded-xl">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Ingresos Totales</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.earnings)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Calificación</p>
                <p className="text-2xl font-bold text-gray-900">
                  {expertProfile?.rating_average?.toFixed(1) || '0.0'}
                  <span className="text-sm font-normal text-gray-500">/5</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Active Cases */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Casos en Progreso</CardTitle>
                <CardDescription>Tus casos asignados actualmente</CardDescription>
              </div>
              <Link href="/perito/casos">
                <Button variant="ghost" size="sm" className="gap-1">
                  Ver todos
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {cases.filter(c => !['completed', 'cancelled'].includes(c.status)).length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No tienes casos activos</p>
                  <Link href="/perito/solicitudes">
                    <Button>Ver solicitudes disponibles</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {cases
                    .filter(c => !['completed', 'cancelled'].includes(c.status))
                    .map((caso) => {
                      const clientProfile = caso.client_profiles as {
                        company_name?: string;
                        profiles: { full_name: string };
                      };

                      return (
                        <Link
                          key={caso.id}
                          href={`/perito/casos/${caso.id}`}
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
                                Cliente: {clientProfile?.company_name || clientProfile?.profiles?.full_name}
                              </p>
                            </div>
                            {caso.deadline && (
                              <div className="text-right">
                                <p className="text-sm text-amber-600 font-medium">
                                  Vence {formatRelativeTime(caso.deadline)}
                                </p>
                              </div>
                            )}
                          </div>
                        </Link>
                      );
                    })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Tu Rendimiento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Casos este mes</span>
                <span className="font-semibold">{stats.active + stats.completed}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Tasa de aceptación</span>
                <span className="font-semibold text-green-600">95%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Tiempo respuesta</span>
                <span className="font-semibold">{expertProfile?.response_time_hours || 24}h</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Reseñas positivas</span>
                <span className="font-semibold text-green-600">98%</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/perito/solicitudes" className="block">
                <Button variant="outline" className="w-full justify-start gap-3">
                  <TrendingUp className="h-4 w-4" />
                  Ver Solicitudes
                  {stats.pending > 0 && (
                    <Badge variant="destructive" className="ml-auto">
                      {stats.pending}
                    </Badge>
                  )}
                </Button>
              </Link>
              <Link href="/perito/recursos" className="block">
                <Button variant="outline" className="w-full justify-start gap-3">
                  <FileText className="h-4 w-4" />
                  Centro de Recursos
                </Button>
              </Link>
              <Link href="/perito/perfil" className="block">
                <Button variant="outline" className="w-full justify-start gap-3">
                  <Calendar className="h-4 w-4" />
                  Editar Perfil
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

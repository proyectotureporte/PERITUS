import { createClient } from '@/lib/supabase/server';
import {
  TrendingUp,
  Users,
  FileText,
  DollarSign,
  Calendar,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';

async function getReportData() {
  const supabase = await createClient();

  // Users by role
  const { data: usersByRole } = await supabase
    .from('profiles')
    .select('role');

  const usersTyped = usersByRole as { role: string }[] | null;
  const roleCount = (usersTyped || []).reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Cases by status
  const { data: casesByStatus } = await supabase
    .from('cases')
    .select('status');

  const casesStatusTyped = casesByStatus as { status: string }[] | null;
  const statusCount = (casesStatusTyped || []).reduce((acc, caso) => {
    acc[caso.status] = (acc[caso.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Cases by specialty
  const { data: casesBySpecialty } = await supabase
    .from('cases')
    .select('specialty');

  const casesSpecialtyTyped = casesBySpecialty as { specialty: string }[] | null;
  const specialtyCount = (casesSpecialtyTyped || []).reduce((acc, caso) => {
    acc[caso.specialty] = (acc[caso.specialty] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Payments
  const { data: payments } = await supabase
    .from('payments')
    .select('amount, status, created_at');

  const paymentsTyped = payments as { amount: number; status: string; created_at: string }[] | null;

  const totalRevenue = paymentsTyped
    ?.filter((p) => p.status === 'released')
    .reduce((sum, p) => sum + Number(p.amount), 0) || 0;

  const pendingPayments = paymentsTyped
    ?.filter((p) => p.status === 'escrow')
    .reduce((sum, p) => sum + Number(p.amount), 0) || 0;

  // Expert stats
  const { data: experts } = await supabase
    .from('expert_profiles')
    .select('verification_status, rating_average, completed_cases');

  const expertsTyped = experts as { verification_status: string; rating_average: number; completed_cases: number }[] | null;

  const verifiedExperts = expertsTyped?.filter((e) => e.verification_status === 'verified').length || 0;
  const avgRating = expertsTyped?.length
    ? expertsTyped.reduce((sum, e) => sum + Number(e.rating_average), 0) / expertsTyped.length
    : 0;

  return {
    users: {
      total: usersByRole?.length || 0,
      byRole: roleCount,
    },
    cases: {
      total: casesByStatus?.length || 0,
      byStatus: statusCount,
      bySpecialty: specialtyCount,
    },
    payments: {
      totalRevenue,
      pendingPayments,
      totalTransactions: paymentsTyped?.length || 0,
    },
    experts: {
      total: expertsTyped?.length || 0,
      verified: verifiedExperts,
      avgRating: avgRating.toFixed(2),
    },
  };
}

const statusLabels: Record<string, string> = {
  draft: 'Borrador',
  pending_assignment: 'Pendiente',
  assigned: 'Asignado',
  in_progress: 'En Progreso',
  review: 'En Revisión',
  completed: 'Completado',
  cancelled: 'Cancelado',
  disputed: 'Disputado',
};

const specialtyLabels: Record<string, string> = {
  finanzas: 'Finanzas',
  psicologia: 'Psicología',
  ingenieria: 'Ingeniería',
  medicina: 'Medicina',
  informatica: 'Informática',
  seguridad_digital: 'Seguridad Digital',
  documentologia: 'Documentología',
  grafologia: 'Grafología',
  contabilidad: 'Contabilidad',
  ambiental: 'Ambiental',
  urbanistica: 'Urbanística',
  legal: 'Legal',
};

export default async function ReportesPage() {
  const data = await getReportData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reportes y Analíticas</h1>
        <p className="text-gray-500 mt-1">
          Métricas y estadísticas del sistema PERITUS
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Ingresos Totales</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(data.payments.totalRevenue)}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <ArrowUpRight className="h-4 w-4 text-green-500" />
              <span className="text-green-600">En escrow: {formatCurrency(data.payments.pendingPayments)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Usuarios</p>
                <p className="text-2xl font-bold text-gray-900">{data.users.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
              <span>{data.users.byRole.cliente || 0} clientes</span>
              <span>•</span>
              <span>{data.users.byRole.perito || 0} peritos</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Casos</p>
                <p className="text-2xl font-bold text-gray-900">{data.cases.total}</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-xl">
                <FileText className="h-6 w-6 text-amber-600" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <span className="text-gray-500">
                {data.cases.byStatus.completed || 0} completados
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Rating Promedio</p>
                <p className="text-2xl font-bold text-gray-900">{data.experts.avgRating}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
              <span>{data.experts.verified} peritos verificados</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Cases by Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Casos por Estado
            </CardTitle>
            <CardDescription>Distribución de casos según su estado actual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(data.cases.byStatus).map(([status, count]) => {
                const percentage = data.cases.total > 0
                  ? Math.round((count / data.cases.total) * 100)
                  : 0;
                return (
                  <div key={status}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">
                        {statusLabels[status] || status}
                      </span>
                      <span className="text-sm font-medium">{count} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              {Object.keys(data.cases.byStatus).length === 0 && (
                <p className="text-gray-500 text-center py-4">No hay datos disponibles</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Cases by Specialty */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Casos por Especialidad
            </CardTitle>
            <CardDescription>Distribución de casos según especialidad</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(data.cases.bySpecialty)
                .sort(([, a], [, b]) => b - a)
                .map(([specialty, count]) => {
                  const percentage = data.cases.total > 0
                    ? Math.round((count / data.cases.total) * 100)
                    : 0;
                  return (
                    <div key={specialty}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">
                          {specialtyLabels[specialty] || specialty}
                        </span>
                        <span className="text-sm font-medium">{count} ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-amber-500 h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              {Object.keys(data.cases.bySpecialty).length === 0 && (
                <p className="text-gray-500 text-center py-4">No hay datos disponibles</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Distribución de Usuarios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
              <div className="flex items-center justify-between">
                <span className="text-blue-700 font-medium">Clientes</span>
                <Badge variant="default">{data.users.byRole.cliente || 0}</Badge>
              </div>
              <p className="text-2xl font-bold text-blue-900 mt-2">
                {data.users.total > 0
                  ? Math.round(((data.users.byRole.cliente || 0) / data.users.total) * 100)
                  : 0}%
              </p>
            </div>
            <div className="p-4 rounded-lg bg-green-50 border border-green-200">
              <div className="flex items-center justify-between">
                <span className="text-green-700 font-medium">Peritos</span>
                <Badge variant="success">{data.users.byRole.perito || 0}</Badge>
              </div>
              <p className="text-2xl font-bold text-green-900 mt-2">
                {data.users.total > 0
                  ? Math.round(((data.users.byRole.perito || 0) / data.users.total) * 100)
                  : 0}%
              </p>
            </div>
            <div className="p-4 rounded-lg bg-red-50 border border-red-200">
              <div className="flex items-center justify-between">
                <span className="text-red-700 font-medium">Admins</span>
                <Badge variant="destructive">{data.users.byRole.admin || 0}</Badge>
              </div>
              <p className="text-2xl font-bold text-red-900 mt-2">
                {data.users.total > 0
                  ? Math.round(((data.users.byRole.admin || 0) / data.users.total) * 100)
                  : 0}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

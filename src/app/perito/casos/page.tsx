import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Calendar,
  DollarSign,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';

interface Case {
  id: string;
  case_number: string;
  title: string;
  description: string;
  specialty: string;
  urgency: string;
  status: string;
  deadline: string | null;
  total_amount: number | null;
  payment_status: string;
  created_at: string;
  client_profiles: {
    profiles: { full_name: string; email: string } | null;
  } | null;
}

async function getExpertCases() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  // Get expert profile
  const { data: expertProfileData } = await supabase
    .from('expert_profiles')
    .select('id')
    .eq('profile_id', user.id)
    .single();

  const expertProfile = expertProfileData as { id: string } | null;
  if (!expertProfile) return [];

  const { data } = await supabase
    .from('cases')
    .select(`
      *,
      client_profiles (
        profiles (full_name, email)
      )
    `)
    .eq('expert_id', expertProfile.id)
    .order('created_at', { ascending: false });

  return (data || []) as Case[];
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

function getUrgencyBadge(urgency: string) {
  switch (urgency) {
    case 'critical':
      return <Badge variant="destructive">Crítico</Badge>;
    case 'urgent':
      return <Badge variant="warning">Urgente</Badge>;
    default:
      return null;
  }
}

export default async function PeritosCasosPage() {
  const cases = await getExpertCases();

  const activeCases = cases.filter((c) => ['assigned', 'in_progress', 'review'].includes(c.status));
  const completedCases = cases.filter((c) => c.status === 'completed');
  const otherCases = cases.filter((c) => ['cancelled', 'disputed'].includes(c.status));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis Casos</h1>
          <p className="text-gray-500 mt-1">Gestiona tus casos asignados</p>
        </div>
        <Link href="/perito/solicitudes">
          <Button>Ver Solicitudes</Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Activos</p>
                <p className="text-xl font-bold">{activeCases.length}</p>
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
                <p className="text-xl font-bold">{completedCases.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <DollarSign className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-500">Ingresos Totales</p>
                <p className="text-xl font-bold">
                  {formatCurrency(
                    completedCases.reduce((sum, c) => sum + (c.total_amount || 0), 0)
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="activos">
        <TabsList>
          <TabsTrigger value="activos">Activos ({activeCases.length})</TabsTrigger>
          <TabsTrigger value="completados">Completados ({completedCases.length})</TabsTrigger>
          <TabsTrigger value="otros">Otros ({otherCases.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="activos" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              {activeCases.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No tienes casos activos</p>
                  <Link href="/perito/solicitudes">
                    <Button className="mt-4">Ver Solicitudes Disponibles</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeCases.map((caso) => (
                    <CaseCard key={caso.id} caso={caso} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completados" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              {completedCases.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No tienes casos completados</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {completedCases.map((caso) => (
                    <CaseCard key={caso.id} caso={caso} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="otros" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              {otherCases.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No hay otros casos</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {otherCases.map((caso) => (
                    <CaseCard key={caso.id} caso={caso} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CaseCard({ caso }: { caso: Case }) {
  return (
    <div className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-sm text-gray-500">{caso.case_number}</span>
            {getStatusBadge(caso.status)}
            {getUrgencyBadge(caso.urgency)}
            <Badge variant="outline">{caso.specialty}</Badge>
          </div>
          <h3 className="font-medium text-gray-900 mt-2">{caso.title}</h3>
          <p className="text-sm text-gray-500 line-clamp-2 mt-1">{caso.description}</p>
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {caso.client_profiles?.profiles?.full_name || 'Cliente'}
            </span>
            {caso.deadline && (
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(caso.deadline).toLocaleDateString('es-CO')}
              </span>
            )}
            {caso.total_amount && (
              <span className="flex items-center gap-1 text-green-600 font-medium">
                <DollarSign className="h-4 w-4" />
                {formatCurrency(caso.total_amount)}
              </span>
            )}
          </div>
        </div>
        <Link href={`/perito/casos/${caso.id}`}>
          <Button variant="outline" size="sm">
            Ver <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Plus, Filter, Search, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatRelativeTime, formatCurrency, STATUS_LABELS, SPECIALTY_LABELS, URGENCY_LABELS } from '@/lib/utils';

interface CaseData {
  id: string;
  case_number: string;
  title: string;
  description: string;
  specialty: string;
  urgency: string;
  status: string;
  payment_status: string;
  agreed_price: number | null;
  total_amount: number | null;
  deadline: string | null;
  created_at: string;
  expert_profiles: {
    id: string;
    profile_id: string;
    profiles: { full_name: string; avatar_url: string | null } | null;
  } | null;
}

async function getClientCases(userId: string): Promise<CaseData[]> {
  const supabase = await createClient();

  const { data: clientProfile } = await supabase
    .from('client_profiles')
    .select('id')
    .eq('profile_id', userId)
    .single();

  const typedClientProfile = clientProfile as { id: string } | null;
  if (!typedClientProfile) return [];

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
    .eq('client_id', typedClientProfile.id)
    .order('created_at', { ascending: false });

  return (cases || []) as CaseData[];
}

export default async function ClientCasesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const cases = await getClientCases(user.id);

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

  const getUrgencyBadge = (urgency: string) => {
    const variants: Record<string, 'default' | 'warning' | 'destructive'> = {
      normal: 'default',
      urgent: 'warning',
      critical: 'destructive',
    };
    return <Badge variant={variants[urgency] || 'default'}>{URGENCY_LABELS[urgency] || urgency}</Badge>;
  };

  const activeCases = cases.filter((c) => !['completed', 'cancelled'].includes(c.status));
  const completedCases = cases.filter((c) => c.status === 'completed');
  const cancelledCases = cases.filter((c) => c.status === 'cancelled');

  const CaseList = ({ cases: caseList }: { cases: typeof cases }) => {
    if (caseList.length === 0) {
      return (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No hay casos en esta categoría</p>
          <Link href="/cliente/casos/nuevo">
            <Button>Crear nuevo caso</Button>
          </Link>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {caseList.map((caso) => (
          <Link key={caso.id} href={`/cliente/casos/${caso.id}`}>
            <Card className="hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="font-mono text-sm text-gray-500">
                        {caso.case_number}
                      </span>
                      {getStatusBadge(caso.status)}
                      {getUrgencyBadge(caso.urgency)}
                      <Badge variant="outline">
                        {SPECIALTY_LABELS[caso.specialty] || caso.specialty}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {caso.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {caso.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                      <span>Creado {formatRelativeTime(caso.created_at)}</span>
                      {caso.deadline && (
                        <span className="text-amber-600">
                          Vence {formatRelativeTime(caso.deadline)}
                        </span>
                      )}
                      {caso.expert_profiles && (
                        <span>
                          Perito: {(caso.expert_profiles as { profiles: { full_name: string } }).profiles?.full_name}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {caso.total_amount && (
                      <div className="text-xl font-bold text-gray-900">
                        {formatCurrency(caso.total_amount)}
                      </div>
                    )}
                    <Button variant="outline" size="sm">
                      Ver detalles
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis Casos</h1>
          <p className="text-gray-500 mt-1">
            Gestiona todos tus casos periciales
          </p>
        </div>
        <Link href="/cliente/casos/nuevo">
          <Button size="lg" className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Caso
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Buscar por título, número de caso..."
            icon={<Search className="h-4 w-4" />}
            className="max-w-md"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filtros
        </Button>
      </div>

      {/* Cases Tabs */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">
            Activos ({activeCases.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completados ({completedCases.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelados ({cancelledCases.length})
          </TabsTrigger>
          <TabsTrigger value="all">
            Todos ({cases.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6">
          <CaseList cases={activeCases} />
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <CaseList cases={completedCases} />
        </TabsContent>

        <TabsContent value="cancelled" className="mt-6">
          <CaseList cases={cancelledCases} />
        </TabsContent>

        <TabsContent value="all" className="mt-6">
          <CaseList cases={cases} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

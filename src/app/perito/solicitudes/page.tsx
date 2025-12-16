import { createClient } from '@/lib/supabase/server';
import {
  FileText,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  AlertCircle,
  CheckCircle,
  User,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';

interface PendingCase {
  id: string;
  case_number: string;
  title: string;
  description: string;
  specialty: string;
  urgency: string;
  deadline: string | null;
  estimated_hours: number | null;
  total_amount: number | null;
  created_at: string;
  client_profiles: {
    city: string;
    department: string;
    profiles: { full_name: string } | null;
  } | null;
}

async function getPendingCases() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  // Get expert profile to check specialties
  const { data: expertProfileData } = await supabase
    .from('expert_profiles')
    .select('specialties, city, verification_status')
    .eq('profile_id', user.id)
    .single();

  const expertProfile = expertProfileData as { specialties: string[]; city: string; verification_status: string } | null;
  if (!expertProfile || expertProfile.verification_status !== 'verified') {
    return [];
  }

  // Get cases pending assignment that match expert's specialties
  const { data } = await supabase
    .from('cases')
    .select(`
      *,
      client_profiles (
        city,
        department,
        profiles (full_name)
      )
    `)
    .eq('status', 'pending_assignment')
    .is('expert_id', null)
    .in('specialty', expertProfile.specialties)
    .order('urgency', { ascending: false })
    .order('created_at', { ascending: false });

  return (data || []) as PendingCase[];
}

interface ExpertStatus {
  verification_status: string;
  specialties: string[];
  city: string;
}

async function getExpertStatus(): Promise<ExpertStatus | null> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from('expert_profiles')
    .select('verification_status, specialties, city')
    .eq('profile_id', user.id)
    .single();

  return data as ExpertStatus | null;
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

export default async function SolicitudesPage() {
  const [cases, expertStatus] = await Promise.all([
    getPendingCases(),
    getExpertStatus(),
  ]);

  const isVerified = expertStatus?.verification_status === 'verified';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Solicitudes de Casos</h1>
        <p className="text-gray-500 mt-1">
          Casos disponibles que coinciden con tus especialidades
        </p>
      </div>

      {!isVerified && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-amber-500 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-amber-800">Verificación Pendiente</h3>
                <p className="text-amber-700 mt-1">
                  Tu perfil aún no está verificado. Completa el proceso de verificación para
                  recibir solicitudes de casos.
                </p>
                <Button className="mt-3" variant="outline">
                  Completar Verificación
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {isVerified && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Disponibles</p>
                    <p className="text-xl font-bold">{cases.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="text-sm text-gray-500">Urgentes</p>
                    <p className="text-xl font-bold">
                      {cases.filter((c) => c.urgency !== 'normal').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-500">Tu Ciudad</p>
                    <p className="text-xl font-bold">
                      {cases.filter((c) => c.client_profiles?.city === expertStatus?.city).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Casos Disponibles</CardTitle>
              <CardDescription>
                Casos que coinciden con tus especialidades: {expertStatus?.specialties?.join(', ')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {cases.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-gray-500">No hay casos disponibles en este momento</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Te notificaremos cuando haya nuevos casos
                  </p>
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
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-sm text-gray-500">
                              {caso.case_number}
                            </span>
                            {getUrgencyBadge(caso.urgency)}
                            <Badge variant="outline">{caso.specialty}</Badge>
                          </div>
                          <h3 className="font-medium text-gray-900 mt-2">{caso.title}</h3>
                          <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                            {caso.description}
                          </p>
                          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500 flex-wrap">
                            <span className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {caso.client_profiles?.profiles?.full_name}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {caso.client_profiles?.city}, {caso.client_profiles?.department}
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
                            <span className="text-gray-400">
                              {formatRelativeTime(caso.created_at)}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 ml-4">
                          <Button size="sm">Postularme</Button>
                          <Button variant="outline" size="sm">Ver Detalles</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

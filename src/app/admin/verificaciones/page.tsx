import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import {
  UserCheck,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Eye,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatRelativeTime } from '@/lib/utils';

interface ExpertProfile {
  id: string;
  profile_id: string;
  specialties: string[];
  bio: string;
  experience_years: number;
  city: string;
  department: string;
  verification_status: string;
  created_at: string;
  profiles: {
    full_name: string;
    email: string;
    phone: string | null;
  } | null;
}

async function getPendingVerifications() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('expert_profiles')
    .select(`
      *,
      profiles (full_name, email, phone)
    `)
    .in('verification_status', ['pending', 'documents_submitted', 'under_review'])
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching verifications:', error);
    return [];
  }

  return data as ExpertProfile[];
}

async function getVerificationStats() {
  const supabase = await createClient();

  const { count: pending } = await supabase
    .from('expert_profiles')
    .select('*', { count: 'exact', head: true })
    .eq('verification_status', 'pending');

  const { count: documentsSubmitted } = await supabase
    .from('expert_profiles')
    .select('*', { count: 'exact', head: true })
    .eq('verification_status', 'documents_submitted');

  const { count: underReview } = await supabase
    .from('expert_profiles')
    .select('*', { count: 'exact', head: true })
    .eq('verification_status', 'under_review');

  const { count: verified } = await supabase
    .from('expert_profiles')
    .select('*', { count: 'exact', head: true })
    .eq('verification_status', 'verified');

  const { count: rejected } = await supabase
    .from('expert_profiles')
    .select('*', { count: 'exact', head: true })
    .eq('verification_status', 'rejected');

  return {
    pending: pending || 0,
    documentsSubmitted: documentsSubmitted || 0,
    underReview: underReview || 0,
    verified: verified || 0,
    rejected: rejected || 0,
  };
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'pending':
      return <Badge variant="secondary">Pendiente</Badge>;
    case 'documents_submitted':
      return <Badge variant="warning">Docs. Enviados</Badge>;
    case 'under_review':
      return <Badge variant="default">En Revisión</Badge>;
    case 'verified':
      return <Badge variant="success">Verificado</Badge>;
    case 'rejected':
      return <Badge variant="destructive">Rechazado</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export default async function VerificacionesPage() {
  const [pendingExperts, stats] = await Promise.all([
    getPendingVerifications(),
    getVerificationStats(),
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Verificaciones de Peritos</h1>
        <p className="text-gray-500 mt-1">
          Revisa y aprueba las solicitudes de verificación de peritos
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-5">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-gray-500" />
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
              <FileText className="h-5 w-5 text-amber-500" />
              <div>
                <p className="text-sm text-gray-500">Docs. Enviados</p>
                <p className="text-xl font-bold">{stats.documentsSubmitted}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Eye className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">En Revisión</p>
                <p className="text-xl font-bold">{stats.underReview}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-500">Verificados</p>
                <p className="text-xl font-bold">{stats.verified}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <XCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-gray-500">Rechazados</p>
                <p className="text-xl font-bold">{stats.rejected}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending List */}
      <Card>
        <CardHeader>
          <CardTitle>Solicitudes Pendientes</CardTitle>
          <CardDescription>
            Peritos que esperan revisión de sus documentos
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingExperts.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-gray-500">No hay verificaciones pendientes</p>
              <p className="text-sm text-gray-400 mt-1">
                Todas las solicitudes han sido procesadas
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingExperts.map((expert) => (
                <div
                  key={expert.id}
                  className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <UserCheck className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {expert.profiles?.full_name}
                          </h3>
                          <p className="text-sm text-gray-500">{expert.profiles?.email}</p>
                        </div>
                        {getStatusBadge(expert.verification_status)}
                      </div>
                      <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Especialidades:</span>
                          <p className="font-medium">
                            {expert.specialties.length > 0
                              ? expert.specialties.join(', ')
                              : 'No especificadas'}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Experiencia:</span>
                          <p className="font-medium">{expert.experience_years} años</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Ubicación:</span>
                          <p className="font-medium">
                            {expert.city}, {expert.department}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Solicitud:</span>
                          <p className="font-medium">{formatRelativeTime(expert.created_at)}</p>
                        </div>
                      </div>
                    </div>
                    <Link href={`/admin/verificaciones/${expert.id}`}>
                      <Button>Revisar</Button>
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

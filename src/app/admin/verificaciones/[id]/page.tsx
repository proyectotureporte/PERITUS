'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  ExternalLink,
  AlertCircle,
  GraduationCap,
  Briefcase,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { SPECIALTY_LABELS, formatRelativeTime } from '@/lib/utils';

interface ExpertVerification {
  id: string;
  profile_id: string;
  specialties: string[];
  bio: string;
  experience_years: number;
  hourly_rate: number | null;
  base_rate: number | null;
  city: string;
  department: string;
  verification_status: string;
  certifications: Array<{ name: string; issuer: string; year: number }>;
  education: Array<{ degree: string; institution: string; year: number }>;
  documents: Array<{ type: string; name: string; url: string; uploaded_at: string }>;
  created_at: string;
  profiles: {
    id: string;
    full_name: string;
    email: string;
    phone: string | null;
  } | null;
}

const documentTypeLabels: Record<string, string> = {
  cedula: 'Cédula de Ciudadanía',
  titulo: 'Título Profesional',
  certificacion: 'Certificación',
  tarjeta_profesional: 'Tarjeta Profesional',
  otro: 'Otro Documento',
};

export default function VerificationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [expert, setExpert] = useState<ExpertVerification | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  const expertId = params.id as string;

  useEffect(() => {
    if (expertId) loadExpert();
  }, [expertId]);

  const loadExpert = async () => {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('expert_profiles')
      .select(`
        *,
        profiles (id, full_name, email, phone)
      `)
      .eq('id', expertId)
      .single();

    if (error || !data) {
      toast({
        title: 'Error',
        description: 'No se encontró el perito',
        variant: 'destructive',
      });
      router.push('/admin/verificaciones');
      return;
    }

    setExpert(data as ExpertVerification);
    setLoading(false);
  };

  const handleApprove = async () => {
    if (!expert) return;

    setProcessing(true);
    const supabase = createClient();

    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from('expert_profiles')
        .update({
          verification_status: 'verified' as const,
          verification_date: new Date().toISOString(),
          verified_by: user?.id,
        } as never)
        .eq('id', expert.id);

      if (error) throw error;

      // Send email notification
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: expert.profiles?.email,
          template: 'verification_approved',
          data: { name: expert.profiles?.full_name },
        }),
      });

      toast({
        title: 'Verificación Aprobada',
        description: `${expert.profiles?.full_name} ha sido verificado exitosamente.`,
      });

      router.push('/admin/verificaciones');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo aprobar la verificación',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!expert || !rejectionReason.trim()) return;

    setProcessing(true);
    const supabase = createClient();

    try {
      const { error } = await supabase
        .from('expert_profiles')
        .update({
          verification_status: 'rejected' as const,
        } as never)
        .eq('id', expert.id);

      if (error) throw error;

      // Send email notification
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: expert.profiles?.email,
          template: 'verification_rejected',
          data: {
            name: expert.profiles?.full_name,
            reason: rejectionReason,
          },
        }),
      });

      toast({
        title: 'Verificación Rechazada',
        description: 'Se ha notificado al perito.',
      });

      router.push('/admin/verificaciones');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo rechazar la verificación',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!expert) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/verificaciones">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Verificación de Perito</h1>
            <p className="text-gray-500 mt-1">{expert.profiles?.full_name}</p>
          </div>
        </div>
        <Badge
          variant={
            expert.verification_status === 'verified' ? 'success' :
            expert.verification_status === 'rejected' ? 'destructive' : 'warning'
          }
          className="text-sm px-3 py-1"
        >
          {expert.verification_status === 'pending' && 'Pendiente'}
          {expert.verification_status === 'documents_submitted' && 'Docs. Enviados'}
          {expert.verification_status === 'under_review' && 'En Revisión'}
          {expert.verification_status === 'verified' && 'Verificado'}
          {expert.verification_status === 'rejected' && 'Rechazado'}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Información Personal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-500">Nombre Completo</Label>
                  <p className="font-medium">{expert.profiles?.full_name}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Email</Label>
                  <p className="font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {expert.profiles?.email}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-500">Teléfono</Label>
                  <p className="font-medium flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {expert.profiles?.phone || 'No especificado'}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-500">Ubicación</Label>
                  <p className="font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {expert.city}, {expert.department}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Información Profesional
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-500">Especialidades</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {expert.specialties.map((spec) => (
                    <Badge key={spec} variant="secondary">
                      {SPECIALTY_LABELS[spec] || spec}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-gray-500">Años de Experiencia</Label>
                <p className="font-medium">{expert.experience_years} años</p>
              </div>
              <div>
                <Label className="text-gray-500">Biografía</Label>
                <p className="mt-1 text-gray-700">{expert.bio || 'No especificada'}</p>
              </div>
              {expert.hourly_rate && (
                <div>
                  <Label className="text-gray-500">Tarifa por Hora</Label>
                  <p className="font-medium">${expert.hourly_rate.toLocaleString()} COP</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Education */}
          {expert.education && expert.education.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Educación
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {expert.education.map((edu, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium">{edu.degree}</p>
                      <p className="text-sm text-gray-500">{edu.institution} • {edu.year}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Documentos Subidos
              </CardTitle>
              <CardDescription>
                Revisa cuidadosamente cada documento antes de aprobar
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!expert.documents || expert.documents.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                  <p className="text-gray-500">No hay documentos subidos</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {expert.documents.map((doc, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-gray-400" />
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-sm text-gray-500">
                            {documentTypeLabels[doc.type] || doc.type}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <a href={doc.url} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Ver
                          </Button>
                        </a>
                        <a href={doc.url} download>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Acciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {expert.verification_status !== 'verified' && expert.verification_status !== 'rejected' && (
                <>
                  <Button
                    className="w-full"
                    onClick={handleApprove}
                    disabled={processing}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {processing ? 'Procesando...' : 'Aprobar Verificación'}
                  </Button>

                  {!showRejectForm ? (
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={() => setShowRejectForm(true)}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Rechazar
                    </Button>
                  ) : (
                    <div className="space-y-3 p-4 border border-red-200 rounded-lg bg-red-50">
                      <Label>Motivo del Rechazo</Label>
                      <Textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Explica el motivo del rechazo..."
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={handleReject}
                          disabled={processing || !rejectionReason.trim()}
                        >
                          Confirmar Rechazo
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setShowRejectForm(false);
                            setRejectionReason('');
                          }}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {expert.verification_status === 'verified' && (
                <div className="text-center py-4">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                  <p className="font-medium text-green-600">Perito Verificado</p>
                </div>
              )}

              {expert.verification_status === 'rejected' && (
                <div className="text-center py-4">
                  <XCircle className="h-12 w-12 text-red-500 mx-auto mb-2" />
                  <p className="font-medium text-red-600">Verificación Rechazada</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Historial
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                  <div>
                    <p className="text-sm">Solicitud recibida</p>
                    <p className="text-xs text-gray-500">{formatRelativeTime(expert.created_at)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

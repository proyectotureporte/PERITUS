import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  CheckCircle,
  Briefcase,
  GraduationCap,
  Award,
  MessageSquare,
  Calendar,
  DollarSign,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SPECIALTY_LABELS, formatCurrency } from '@/lib/utils';

interface ExpertDetail {
  id: string;
  profile_id: string;
  verification_status: string;
  rating_average: number;
  rating_count: number;
  specialties: string[];
  bio: string;
  city: string;
  department: string;
  experience_years: number;
  response_time_hours: number;
  base_rate: number | null;
  hourly_rate: number | null;
  total_cases: number;
  completed_cases: number;
  certifications: Array<{ name: string; issuer: string; year: number }>;
  education: Array<{ degree: string; institution: string; year: number }>;
  profiles: {
    id: string;
    full_name: string;
    email: string;
    avatar_url: string | null;
  } | null;
}

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  professionalism_rating: number | null;
  communication_rating: number | null;
  quality_rating: number | null;
  timeliness_rating: number | null;
  created_at: string;
  profiles: { full_name: string } | null;
}

async function getExpert(id: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from('expert_profiles')
    .select(`
      *,
      profiles (id, full_name, email, avatar_url)
    `)
    .eq('id', id)
    .eq('verification_status', 'verified')
    .single();

  return data as ExpertDetail | null;
}

async function getExpertReviews(expertProfileId: string) {
  const supabase = await createClient();

  // Get the user id from expert profile
  const { data: expertProfileData } = await supabase
    .from('expert_profiles')
    .select('profile_id')
    .eq('id', expertProfileId)
    .single();

  const expertProfile = expertProfileData as { profile_id: string } | null;
  if (!expertProfile) return [];

  const { data } = await supabase
    .from('reviews')
    .select(`
      *,
      profiles:reviewer_id (full_name)
    `)
    .eq('reviewed_id', expertProfile.profile_id)
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(10);

  return (data || []) as Review[];
}

export default async function ExpertDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [expert, reviews] = await Promise.all([
    getExpert(id),
    getExpertReviews(id),
  ]);

  if (!expert) {
    notFound();
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/cliente/buscar">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Profile */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-6">
                <Avatar className="h-32 w-32 mx-auto sm:mx-0">
                  <AvatarImage src={expert.profiles?.avatar_url || undefined} />
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-3xl">
                    {expert.profiles?.full_name ? getInitials(expert.profiles.full_name) : 'P'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {expert.profiles?.full_name}
                    </h1>
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                    <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                    <span className="font-semibold text-lg">{expert.rating_average?.toFixed(1) || '0.0'}</span>
                    <span className="text-gray-500">({expert.rating_count} reseñas)</span>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start mt-4">
                    {expert.specialties.map((specialty) => (
                      <Badge key={specialty} variant="secondary">
                        {SPECIALTY_LABELS[specialty] || specialty}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-4 justify-center sm:justify-start mt-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {expert.city}, {expert.department}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      {expert.experience_years} años
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      ~{expert.response_time_hours}h respuesta
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bio */}
          <Card>
            <CardHeader>
              <CardTitle>Sobre el Perito</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap">{expert.bio || 'Sin descripción disponible'}</p>
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
                <div className="space-y-4">
                  {expert.education.map((edu, idx) => (
                    <div key={idx} className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{edu.degree}</p>
                        <p className="text-sm text-gray-500">{edu.institution}</p>
                      </div>
                      <span className="text-sm text-gray-400">{edu.year}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Certifications */}
          {expert.certifications && expert.certifications.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Certificaciones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {expert.certifications.map((cert, idx) => (
                    <div key={idx} className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{cert.name}</p>
                        <p className="text-sm text-gray-500">{cert.issuer}</p>
                      </div>
                      <span className="text-sm text-gray-400">{cert.year}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reviews */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Reseñas ({reviews.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {reviews.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No hay reseñas todavía</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{review.profiles?.full_name || 'Cliente'}</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                          <span>{review.rating}</span>
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-gray-700">{review.comment}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(review.created_at).toLocaleDateString('es-CO')}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Rates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Tarifas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {expert.base_rate && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Tarifa Base</span>
                  <span className="font-semibold text-lg">{formatCurrency(expert.base_rate)}</span>
                </div>
              )}
              {expert.hourly_rate && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Por Hora</span>
                  <span className="font-semibold">{formatCurrency(expert.hourly_rate)}/h</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Estadísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Casos Totales</span>
                <span className="font-medium">{expert.total_cases}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Completados</span>
                <span className="font-medium">{expert.completed_cases}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tasa de Éxito</span>
                <span className="font-medium">
                  {expert.total_cases > 0
                    ? Math.round((expert.completed_cases / expert.total_cases) * 100)
                    : 0}%
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent className="pt-6 space-y-3">
              <Link href={`/cliente/casos/nuevo?expert=${expert.id}`} className="block">
                <Button className="w-full" size="lg">
                  <Calendar className="h-4 w-4 mr-2" />
                  Solicitar para Caso
                </Button>
              </Link>
              <Button variant="outline" className="w-full">
                <MessageSquare className="h-4 w-4 mr-2" />
                Enviar Mensaje
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

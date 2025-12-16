import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Search, Filter, Star, MapPin, Clock, CheckCircle, Briefcase } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SPECIALTY_LABELS, formatCurrency } from '@/lib/utils';

interface ExpertData {
  id: string;
  verification_status: string;
  rating_average: number | null;
  rating_count: number;
  specialties: string[];
  bio: string | null;
  city: string | null;
  department: string | null;
  experience_years: number | null;
  response_time_hours: number;
  base_rate: number | null;
  profiles: { id: string; full_name: string; avatar_url: string | null } | null;
}

async function getVerifiedExperts(): Promise<ExpertData[]> {
  const supabase = await createClient();

  const { data: experts } = await supabase
    .from('expert_profiles')
    .select(`
      *,
      profiles (id, full_name, email, avatar_url)
    `)
    .eq('verification_status', 'verified')
    .eq('is_available', true)
    .order('rating_average', { ascending: false });

  return (experts || []) as ExpertData[];
}

export default async function SearchExpertsPage() {
  const experts = await getVerifiedExperts();

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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Buscar Perito</h1>
        <p className="text-gray-500 mt-1">
          Encuentra al experto ideal para tu caso
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Buscar por nombre, especialidad..."
            icon={<Search className="h-4 w-4" />}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
        </div>
      </div>

      {/* Specialty Quick Filters */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(SPECIALTY_LABELS).slice(0, 8).map(([value, label]) => (
          <Button key={value} variant="outline" size="sm">
            {label}
          </Button>
        ))}
      </div>

      {/* Results */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {experts.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              No se encontraron peritos disponibles en este momento
            </p>
          </div>
        ) : (
          experts.map((expert) => (
              <Card key={expert.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={expert.profiles?.avatar_url || undefined} />
                      <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                        {expert.profiles?.full_name ? getInitials(expert.profiles.full_name) : 'P'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {expert.profiles?.full_name}
                        </h3>
                        {expert.verification_status === 'verified' && (
                          <CheckCircle className="h-4 w-4 text-blue-600 flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                        <span className="font-medium text-gray-900">
                          {expert.rating_average?.toFixed(1) || '0.0'}
                        </span>
                        <span className="text-gray-500 text-sm">
                          ({expert.rating_count || 0} reseñas)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {(expert.specialties as string[])?.slice(0, 3).map((specialty) => (
                      <Badge key={specialty} variant="secondary">
                        {SPECIALTY_LABELS[specialty] || specialty}
                      </Badge>
                    ))}
                    {(expert.specialties as string[])?.length > 3 && (
                      <Badge variant="outline">
                        +{(expert.specialties as string[]).length - 3}
                      </Badge>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mt-4 line-clamp-2">
                    {expert.bio || 'Sin descripción disponible'}
                  </p>

                  <div className="mt-4 space-y-2 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{expert.city}, {expert.department}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      <span>{expert.experience_years} años de experiencia</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Responde en ~{expert.response_time_hours}h</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      {expert.base_rate && (
                        <div className="text-lg font-semibold text-gray-900">
                          {formatCurrency(expert.base_rate)}
                          <span className="text-sm font-normal text-gray-500">/caso</span>
                        </div>
                      )}
                    </div>
                    <Link href={`/cliente/peritos/${expert.id}`}>
                      <Button>Ver Perfil</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
          ))
        )}
      </div>
    </div>
  );
}

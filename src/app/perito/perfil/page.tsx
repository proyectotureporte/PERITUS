'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Star,
  Save,
  Camera,
  Shield,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  avatar_url: string | null;
  role: string;
  is_active: boolean;
}

interface ExpertProfile {
  id: string;
  specialties: string[];
  bio: string;
  experience_years: number;
  hourly_rate: number | null;
  base_rate: number | null;
  city: string;
  department: string;
  is_available: boolean;
  verification_status: string;
  rating_average: number;
  rating_count: number;
  total_cases: number;
  completed_cases: number;
}

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

function getVerificationBadge(status: string) {
  switch (status) {
    case 'verified':
      return (
        <Badge variant="success" className="flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          Verificado
        </Badge>
      );
    case 'under_review':
      return (
        <Badge variant="default" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          En Revisión
        </Badge>
      );
    case 'documents_submitted':
      return (
        <Badge variant="warning" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Docs. Enviados
        </Badge>
      );
    case 'rejected':
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          Rechazado
        </Badge>
      );
    default:
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          Pendiente
        </Badge>
      );
  }
}

export default function PerfilPeritoPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [expertProfile, setExpertProfile] = useState<ExpertProfile | null>(null);

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    bio: '',
    experience_years: 0,
    hourly_rate: '',
    base_rate: '',
    city: '',
    department: '',
    is_available: true,
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push('/auth/login');
      return;
    }

    const { data: profileDataRaw } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    const { data: expertDataRaw } = await supabase
      .from('expert_profiles')
      .select('*')
      .eq('profile_id', user.id)
      .single();

    const profileData = profileDataRaw as Profile | null;
    const expertData = expertDataRaw as ExpertProfile | null;

    if (profileData) {
      setProfile(profileData);
      setFormData((prev) => ({
        ...prev,
        full_name: profileData.full_name || '',
        phone: profileData.phone || '',
      }));
    }

    if (expertData) {
      setExpertProfile(expertData);
      setFormData((prev) => ({
        ...prev,
        bio: expertData.bio || '',
        experience_years: expertData.experience_years || 0,
        hourly_rate: expertData.hourly_rate?.toString() || '',
        base_rate: expertData.base_rate?.toString() || '',
        city: expertData.city || '',
        department: expertData.department || '',
        is_available: expertData.is_available,
      }));
    }

    setLoading(false);
  };

  const handleSave = async () => {
    if (!profile) return;

    setSaving(true);
    const supabase = createClient();

    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
        } as never)
        .eq('id', profile.id);

      if (profileError) throw profileError;

      if (expertProfile) {
        const { error: expertError } = await supabase
          .from('expert_profiles')
          .update({
            bio: formData.bio,
            experience_years: formData.experience_years,
            hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : null,
            base_rate: formData.base_rate ? parseFloat(formData.base_rate) : null,
            city: formData.city,
            department: formData.department,
            is_available: formData.is_available,
          } as never)
          .eq('id', expertProfile.id);

        if (expertError) throw expertError;
      }

      toast({
        title: 'Perfil actualizado',
        description: 'Tus datos han sido guardados correctamente.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo guardar el perfil. Intenta de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>
          <p className="text-gray-500 mt-1">Administra tu información profesional</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
                  <User className="h-12 w-12 text-blue-600" />
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border">
                  <Camera className="h-4 w-4 text-gray-600" />
                </button>
              </div>
              <h2 className="mt-4 text-xl font-semibold">{profile?.full_name}</h2>
              <p className="text-gray-500">{profile?.email}</p>
              <div className="flex items-center justify-center gap-2 mt-3">
                {getVerificationBadge(expertProfile?.verification_status || 'pending')}
              </div>
              {expertProfile && (
                <div className="mt-4 flex items-center justify-center gap-1">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="font-semibold">{expertProfile.rating_average.toFixed(1)}</span>
                  <span className="text-gray-500">({expertProfile.rating_count} reviews)</span>
                </div>
              )}
            </div>

            {expertProfile?.verification_status !== 'verified' && (
              <div className="mt-6 p-4 bg-amber-50 rounded-lg">
                <p className="text-sm text-amber-700">
                  Completa tu verificación para recibir casos.
                </p>
                <Link href="/perito/verificacion">
                  <Button size="sm" className="mt-2 w-full">
                    Completar Verificación
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Estadísticas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{expertProfile?.total_cases || 0}</p>
                <p className="text-sm text-gray-500">Casos Totales</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{expertProfile?.completed_cases || 0}</p>
                <p className="text-sm text-gray-500">Completados</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{expertProfile?.experience_years || 0}</p>
                <p className="text-sm text-gray-500">Años Exp.</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-yellow-600">{expertProfile?.rating_average?.toFixed(1) || '0.0'}</p>
                <p className="text-sm text-gray-500">Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Info */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Información Personal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="full_name">Nombre Completo</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="city">Ciudad</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Departamento</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Specialties */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Especialidades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {expertProfile?.specialties.map((spec) => (
                <Badge key={spec} variant="outline">
                  {specialtyLabels[spec] || spec}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Para cambiar especialidades, contacta a soporte
            </p>
          </CardContent>
        </Card>

        {/* Professional Info */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Información Profesional</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bio">Biografía Profesional</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={4}
                placeholder="Describe tu experiencia y especialización..."
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="experience_years">Años de Experiencia</Label>
                <Input
                  id="experience_years"
                  type="number"
                  value={formData.experience_years}
                  onChange={(e) => setFormData({ ...formData, experience_years: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hourly_rate">Tarifa por Hora (COP)</Label>
                <Input
                  id="hourly_rate"
                  type="number"
                  value={formData.hourly_rate}
                  onChange={(e) => setFormData({ ...formData, hourly_rate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="base_rate">Tarifa Base (COP)</Label>
                <Input
                  id="base_rate"
                  type="number"
                  value={formData.base_rate}
                  onChange={(e) => setFormData({ ...formData, base_rate: e.target.value })}
                />
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Disponibilidad</p>
                <p className="text-sm text-gray-500">¿Estás disponible para recibir casos?</p>
              </div>
              <Button
                variant={formData.is_available ? 'default' : 'outline'}
                onClick={() => setFormData({ ...formData, is_available: !formData.is_available })}
              >
                {formData.is_available ? 'Disponible' : 'No Disponible'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Seguridad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Cambiar Contraseña</p>
                <p className="text-sm text-gray-500">Actualiza tu contraseña de acceso</p>
              </div>
              <Button variant="outline">Cambiar</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

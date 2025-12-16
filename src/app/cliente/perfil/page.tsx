'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Mail,
  Phone,
  Building,
  MapPin,
  Save,
  Camera,
  Shield,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  email_verified: boolean;
}

interface ClientProfile {
  id: string;
  company_name: string | null;
  company_type: string | null;
  bar_number: string | null;
  city: string;
  department: string;
  address: string | null;
}

export default function PerfilPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [clientProfile, setClientProfile] = useState<ClientProfile | null>(null);

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    company_name: '',
    company_type: '',
    bar_number: '',
    city: '',
    department: '',
    address: '',
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

    // Get profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    // Get client profile
    const { data: clientData } = await supabase
      .from('client_profiles')
      .select('*')
      .eq('profile_id', user.id)
      .single();

    const typedProfileData = profileData as Profile | null;
    const typedClientData = clientData as ClientProfile | null;

    if (typedProfileData) {
      setProfile(typedProfileData);
      setFormData((prev) => ({
        ...prev,
        full_name: typedProfileData.full_name || '',
        phone: typedProfileData.phone || '',
      }));
    }

    if (typedClientData) {
      setClientProfile(typedClientData);
      setFormData((prev) => ({
        ...prev,
        company_name: typedClientData.company_name || '',
        company_type: typedClientData.company_type || '',
        bar_number: typedClientData.bar_number || '',
        city: typedClientData.city || '',
        department: typedClientData.department || '',
        address: typedClientData.address || '',
      }));
    }

    setLoading(false);
  };

  const handleSave = async () => {
    if (!profile) return;

    setSaving(true);
    const supabase = createClient();

    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
        } as never)
        .eq('id', profile.id);

      if (profileError) throw profileError;

      // Update or create client profile
      if (clientProfile) {
        const { error: clientError } = await supabase
          .from('client_profiles')
          .update({
            company_name: formData.company_name,
            company_type: formData.company_type || null,
            bar_number: formData.bar_number,
            city: formData.city,
            department: formData.department,
            address: formData.address,
          } as never)
          .eq('id', clientProfile.id);

        if (clientError) throw clientError;
      } else {
        const { error: clientError } = await supabase
          .from('client_profiles')
          .insert({
            profile_id: profile.id,
            company_name: formData.company_name,
            company_type: formData.company_type || null,
            bar_number: formData.bar_number,
            city: formData.city,
            department: formData.department,
            address: formData.address,
          } as never);

        if (clientError) throw clientError;
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
          <p className="text-gray-500 mt-1">Administra tu información personal</p>
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
                <Badge variant={profile?.is_active ? 'success' : 'secondary'}>
                  {profile?.is_active ? 'Activo' : 'Inactivo'}
                </Badge>
                <Badge variant="outline">Cliente</Badge>
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
                  placeholder="Tu nombre completo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+57 300 000 0000"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={profile?.email || ''}
                disabled
                className="bg-gray-50"
              />
              <p className="text-xs text-gray-500">El email no puede ser modificado</p>
            </div>
          </CardContent>
        </Card>

        {/* Company Info */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Información Profesional
            </CardTitle>
            <CardDescription>
              Datos de tu empresa o práctica profesional
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="company_name">Nombre de Empresa/Firma</Label>
                <Input
                  id="company_name"
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  placeholder="Mi Firma Legal S.A.S."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bar_number">Tarjeta Profesional</Label>
                <Input
                  id="bar_number"
                  value={formData.bar_number}
                  onChange={(e) => setFormData({ ...formData, bar_number: e.target.value })}
                  placeholder="Número de tarjeta"
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
                  placeholder="Bogotá"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Departamento</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="Cundinamarca"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Dirección</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Calle 100 # 10-20, Oficina 501"
              />
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

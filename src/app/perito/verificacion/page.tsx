'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  CheckCircle,
  Upload,
  User,
  GraduationCap,
  Briefcase,
  FileText,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/client';
import { SPECIALTY_LABELS } from '@/lib/utils';

interface ExpertProfileVerification {
  id: string;
  profile_id: string;
  specialties: string[];
  bio: string | null;
  experience_years: number | null;
  city: string | null;
  department: string | null;
  base_rate: number | null;
  hourly_rate: number | null;
  verification_status: string;
}

const profileSchema = z.object({
  bio: z.string().min(100, 'La biografía debe tener al menos 100 caracteres'),
  experience_years: z.number().min(1, 'Ingresa tus años de experiencia'),
  city: z.string().min(2, 'Ingresa tu ciudad'),
  department: z.string().min(2, 'Ingresa tu departamento'),
  base_rate: z.number().min(100000, 'La tarifa mínima es $100,000'),
  hourly_rate: z.number().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const colombianDepartments = [
  'Amazonas', 'Antioquia', 'Arauca', 'Atlántico', 'Bogotá D.C.', 'Bolívar',
  'Boyacá', 'Caldas', 'Caquetá', 'Casanare', 'Cauca', 'Cesar', 'Chocó',
  'Córdoba', 'Cundinamarca', 'Guainía', 'Guaviare', 'Huila', 'La Guajira',
  'Magdalena', 'Meta', 'Nariño', 'Norte de Santander', 'Putumayo', 'Quindío',
  'Risaralda', 'San Andrés y Providencia', 'Santander', 'Sucre', 'Tolima',
  'Valle del Cauca', 'Vaupés', 'Vichada',
];

export default function VerificationPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [expertProfile, setExpertProfile] = useState<ExpertProfileVerification | null>(null);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [documents, setDocuments] = useState<{ type: string; file: File }[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  const watchedDepartment = watch('department');

  useEffect(() => {
    const loadProfile = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/auth/login');
        return;
      }

      const { data: expert } = await supabase
        .from('expert_profiles')
        .select('*')
        .eq('profile_id', user.id)
        .single();

      const typedExpert = expert as ExpertProfileVerification | null;
      if (typedExpert) {
        setExpertProfile(typedExpert);
        setSelectedSpecialties(typedExpert.specialties || []);
        setValue('bio', typedExpert.bio || '');
        setValue('experience_years', typedExpert.experience_years || 0);
        setValue('city', typedExpert.city || '');
        setValue('department', typedExpert.department || '');
        setValue('base_rate', typedExpert.base_rate || 0);
        setValue('hourly_rate', typedExpert.hourly_rate || undefined);
      }

      setLoading(false);
    };

    loadProfile();
  }, [router, setValue]);

  const toggleSpecialty = (specialty: string) => {
    setSelectedSpecialties((prev) =>
      prev.includes(specialty)
        ? prev.filter((s) => s !== specialty)
        : [...prev, specialty]
    );
  };

  const handleDocumentUpload = (type: string, file: File) => {
    setDocuments((prev) => {
      const filtered = prev.filter((d) => d.type !== type);
      return [...filtered, { type, file }];
    });
  };

  const onSubmit = async (data: ProfileFormData) => {
    setError(null);

    if (selectedSpecialties.length === 0) {
      setError('Selecciona al menos una especialidad');
      return;
    }

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) throw new Error('No autenticado');

      // Check if profile exists
      const { data: existing } = await supabase
        .from('expert_profiles')
        .select('id')
        .eq('profile_id', user.id)
        .single();

      const profileData = {
        profile_id: user.id,
        bio: data.bio,
        experience_years: data.experience_years,
        city: data.city,
        department: data.department,
        base_rate: data.base_rate,
        hourly_rate: data.hourly_rate || null,
        specialties: selectedSpecialties,
        verification_status: 'documents_submitted' as const,
      };

      if (existing) {
        const { error: updateError } = await supabase
          .from('expert_profiles')
          .update(profileData as never)
          .eq('profile_id', user.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('expert_profiles')
          .insert(profileData as never);

        if (insertError) throw insertError;
      }

      // Upload documents
      for (const doc of documents) {
        const fileExt = doc.file.name.split('.').pop();
        const fileName = `${user.id}/${doc.type}-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(fileName, doc.file);

        if (uploadError) {
          console.error('Error uploading document:', uploadError);
        }
      }

      router.push('/perito');
      router.refresh();
    } catch (err) {
      console.error(err);
      setError('Ha ocurrido un error. Por favor intenta de nuevo.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  // If already verified
  if (expertProfile?.verification_status === 'verified') {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Perfil Verificado
              </h2>
              <p className="text-gray-600">
                Tu perfil ha sido verificado exitosamente. Ya puedes recibir casos.
              </p>
              <Button onClick={() => router.push('/perito')}>
                Ir al Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If under review
  if (expertProfile?.verification_status === 'under_review') {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                <Clock className="h-8 w-8 text-amber-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">
                En Revisión
              </h2>
              <p className="text-gray-600">
                Tu solicitud está siendo revisada por nuestro equipo.
                Te notificaremos cuando el proceso esté completo.
              </p>
              <Button variant="outline" onClick={() => router.push('/perito')}>
                Volver al Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Verificación de Perito</h1>
        <p className="text-gray-500 mt-1">
          Completa tu perfil para comenzar a recibir casos
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {[
          { num: 1, label: 'Información', icon: User },
          { num: 2, label: 'Especialidades', icon: GraduationCap },
          { num: 3, label: 'Experiencia', icon: Briefcase },
          { num: 4, label: 'Documentos', icon: FileText },
        ].map((s, i) => (
          <div key={s.num} className="flex items-center">
            <button
              onClick={() => setStep(s.num)}
              className={`flex flex-col items-center ${
                step >= s.num ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  step >= s.num
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                <s.icon className="h-5 w-5" />
              </div>
              <span className="text-sm hidden sm:block">{s.label}</span>
            </button>
            {i < 3 && (
              <div
                className={`h-1 w-16 mx-2 ${
                  step > s.num ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
              <CardDescription>
                Cuéntanos sobre ti y tu práctica profesional
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="bio">Biografía Profesional *</Label>
                <Textarea
                  id="bio"
                  placeholder="Describe tu trayectoria profesional, áreas de especialización, y experiencia relevante..."
                  rows={6}
                  error={!!errors.bio}
                  {...register('bio')}
                />
                {errors.bio && (
                  <p className="text-red-500 text-sm">{errors.bio.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Departamento *</Label>
                  <Select
                    value={watchedDepartment}
                    onValueChange={(value) => setValue('department', value)}
                  >
                    <SelectTrigger error={!!errors.department}>
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      {colombianDepartments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">Ciudad *</Label>
                  <Input
                    id="city"
                    placeholder="Tu ciudad"
                    error={!!errors.city}
                    {...register('city')}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="button" onClick={() => setStep(2)}>
                  Siguiente
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Specialties */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Especialidades</CardTitle>
              <CardDescription>
                Selecciona las áreas en las que puedes emitir dictámenes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Object.entries(SPECIALTY_LABELS).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => toggleSpecialty(value)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      selectedSpecialties.includes(value)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span
                      className={`font-medium ${
                        selectedSpecialties.includes(value)
                          ? 'text-blue-700'
                          : 'text-gray-700'
                      }`}
                    >
                      {label}
                    </span>
                  </button>
                ))}
              </div>

              {selectedSpecialties.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedSpecialties.map((s) => (
                    <Badge key={s} variant="default">
                      {SPECIALTY_LABELS[s]}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>
                  Anterior
                </Button>
                <Button type="button" onClick={() => setStep(3)}>
                  Siguiente
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Experience & Rates */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Experiencia y Tarifas</CardTitle>
              <CardDescription>
                Define tu experiencia y tarifas base
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="experience_years">Años de Experiencia *</Label>
                <Input
                  id="experience_years"
                  type="number"
                  min={1}
                  placeholder="10"
                  error={!!errors.experience_years}
                  {...register('experience_years', { valueAsNumber: true })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="base_rate">Tarifa Base por Caso (COP) *</Label>
                  <Input
                    id="base_rate"
                    type="number"
                    min={100000}
                    step={50000}
                    placeholder="500000"
                    error={!!errors.base_rate}
                    {...register('base_rate', { valueAsNumber: true })}
                  />
                  <p className="text-sm text-gray-500">
                    Tarifa mínima por dictamen
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hourly_rate">Tarifa por Hora (COP)</Label>
                  <Input
                    id="hourly_rate"
                    type="number"
                    min={0}
                    step={10000}
                    placeholder="150000"
                    {...register('hourly_rate', { valueAsNumber: true })}
                  />
                  <p className="text-sm text-gray-500">
                    Opcional, para casos por hora
                  </p>
                </div>
              </div>

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setStep(2)}>
                  Anterior
                </Button>
                <Button type="button" onClick={() => setStep(4)}>
                  Siguiente
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Documents */}
        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Documentos de Verificación</CardTitle>
              <CardDescription>
                Sube los documentos necesarios para verificar tu perfil
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { type: 'cedula', label: 'Cédula de Ciudadanía', required: true },
                { type: 'titulo', label: 'Título Profesional', required: true },
                { type: 'tarjeta_profesional', label: 'Tarjeta Profesional', required: false },
                { type: 'certificacion', label: 'Certificaciones (opcional)', required: false },
              ].map((doc) => (
                <div key={doc.type} className="space-y-2">
                  <Label>
                    {doc.label} {doc.required && '*'}
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <input
                      type="file"
                      id={doc.type}
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleDocumentUpload(doc.type, e.target.files[0]);
                        }
                      }}
                      className="hidden"
                    />
                    <label
                      htmlFor={doc.type}
                      className="flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {documents.find((d) => d.type === doc.type) ? (
                        <>
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="text-green-600">
                            {documents.find((d) => d.type === doc.type)?.file.name}
                          </span>
                        </>
                      ) : (
                        <>
                          <Upload className="h-5 w-5 text-gray-400" />
                          <span className="text-gray-500">Subir archivo</span>
                        </>
                      )}
                    </label>
                  </div>
                </div>
              ))}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Nota:</strong> Tus documentos serán revisados por nuestro
                  equipo en un plazo de 24-48 horas hábiles. Recibirás una
                  notificación cuando tu perfil sea verificado.
                </p>
              </div>

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setStep(3)}>
                  Anterior
                </Button>
                <Button type="submit" loading={isSubmitting}>
                  Enviar para Verificación
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </form>
    </div>
  );
}

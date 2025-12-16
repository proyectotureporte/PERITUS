'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  FileText,
  Upload,
  CheckCircle,
  AlertCircle,
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
import { createClient } from '@/lib/supabase/client';
import { SPECIALTY_LABELS } from '@/lib/utils';

const caseSchema = z.object({
  title: z.string().min(10, 'El título debe tener al menos 10 caracteres'),
  description: z.string().min(50, 'La descripción debe tener al menos 50 caracteres'),
  specialty: z.string().min(1, 'Selecciona una especialidad'),
  urgency: z.enum(['normal', 'urgent', 'critical']),
  court_name: z.string().optional(),
  court_case_number: z.string().optional(),
  deadline: z.string().optional(),
  client_notes: z.string().optional(),
});

type CaseFormData = z.infer<typeof caseSchema>;

export default function NewCasePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CaseFormData>({
    resolver: zodResolver(caseSchema),
    defaultValues: {
      urgency: 'normal',
    },
  });

  const watchedSpecialty = watch('specialty');
  const watchedUrgency = watch('urgency');

  const onSubmit = async (data: CaseFormData) => {
    setError(null);

    try {
      const supabase = createClient();

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No autenticado');

      // Get client profile
      const { data: clientProfile, error: profileError } = await supabase
        .from('client_profiles')
        .select('id')
        .eq('profile_id', user.id)
        .single();

      if (profileError || !clientProfile) {
        // Create client profile if doesn't exist
        const clientProfileData = {
          profile_id: user.id,
          city: 'Por definir',
          department: 'Por definir',
        };
        const { data: newProfile, error: createError } = await supabase
          .from('client_profiles')
          .insert(clientProfileData as never)
          .select('id')
          .single();

        if (createError) throw createError;
        if (!newProfile) throw new Error('Error al crear perfil');

        // Create case with new profile
        const newProfileTyped = newProfile as { id: string };
        const caseData = {
          client_id: newProfileTyped.id,
          title: data.title,
          description: data.description,
          specialty: data.specialty,
          urgency: data.urgency,
          court_name: data.court_name || null,
          court_case_number: data.court_case_number || null,
          deadline: data.deadline || null,
          client_notes: data.client_notes || null,
          status: 'pending_assignment',
          payment_status: 'pending',
        };
        const { data: newCase, error: caseError } = await supabase
          .from('cases')
          .insert(caseData as never)
          .select('id')
          .single();

        if (caseError) throw caseError;

        const createdCase = newCase as { id: string } | null;
        router.push(`/cliente/casos/${createdCase?.id}`);
        return;
      }

      // Create case
      const clientProfileTyped = clientProfile as { id: string };
      const mainCaseData = {
        client_id: clientProfileTyped.id,
        title: data.title,
        description: data.description,
        specialty: data.specialty,
        urgency: data.urgency,
        court_name: data.court_name || null,
        court_case_number: data.court_case_number || null,
        deadline: data.deadline || null,
        client_notes: data.client_notes || null,
        status: 'pending_assignment',
        payment_status: 'pending',
      };
      const { data: newCase, error: caseError } = await supabase
        .from('cases')
        .insert(mainCaseData as never)
        .select('id')
        .single();

      if (caseError) throw caseError;

      const mainCreatedCase = newCase as { id: string } | null;

      // Upload files if any
      if (files.length > 0 && mainCreatedCase) {
        for (const file of files) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${mainCreatedCase.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from('documents')
            .upload(fileName, file);

          if (uploadError) {
            console.error('Error uploading file:', uploadError);
            continue;
          }

          const { data: { publicUrl } } = supabase.storage
            .from('documents')
            .getPublicUrl(fileName);

          // Create document record
          const documentData = {
            case_id: mainCreatedCase.id,
            uploaded_by: user.id,
            name: file.name,
            file_url: publicUrl,
            file_type: file.type,
            file_size: file.size,
            document_hash: '', // In production, calculate actual hash
          };
          await supabase.from('case_documents').insert(documentData as never);
        }
      }

      router.push(`/cliente/casos/${mainCreatedCase?.id}`);
    } catch (err) {
      console.error(err);
      setError('Ha ocurrido un error al crear el caso. Por favor intenta de nuevo.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/cliente/casos"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a mis casos
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Crear Nuevo Caso</h1>
        <p className="text-gray-500 mt-1">
          Completa la información para solicitar un dictamen pericial
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step >= s
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step > s ? <CheckCircle className="h-5 w-5" /> : s}
              </div>
              {s < 3 && (
                <div
                  className={`w-full h-1 mx-2 ${
                    step > s ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                  style={{ width: '100px' }}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-sm">
          <span className={step >= 1 ? 'text-blue-600' : 'text-gray-500'}>
            Información básica
          </span>
          <span className={step >= 2 ? 'text-blue-600' : 'text-gray-500'}>
            Detalles del caso
          </span>
          <span className={step >= 3 ? 'text-blue-600' : 'text-gray-500'}>
            Documentos
          </span>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Información Básica</CardTitle>
              <CardDescription>
                Describe el caso que necesitas resolver
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Título del Caso *</Label>
                <Input
                  id="title"
                  placeholder="Ej: Dictamen pericial financiero para proceso de divorcio"
                  error={!!errors.title}
                  {...register('title')}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción Detallada *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe con detalle la situación, qué necesitas que el perito analice, y cualquier contexto relevante..."
                  rows={6}
                  error={!!errors.description}
                  {...register('description')}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm">{errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Especialidad Requerida *</Label>
                  <Select
                    value={watchedSpecialty}
                    onValueChange={(value) => setValue('specialty', value)}
                  >
                    <SelectTrigger error={!!errors.specialty}>
                      <SelectValue placeholder="Selecciona una especialidad" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(SPECIALTY_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.specialty && (
                    <p className="text-red-500 text-sm">{errors.specialty.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Urgencia</Label>
                  <Select
                    value={watchedUrgency}
                    onValueChange={(value: 'normal' | 'urgent' | 'critical') =>
                      setValue('urgency', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal (2-4 semanas)</SelectItem>
                      <SelectItem value="urgent">Urgente (1 semana)</SelectItem>
                      <SelectItem value="critical">Crítico (48-72 horas)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="button" onClick={() => setStep(2)} className="gap-2">
                  Siguiente
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Case Details */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Detalles del Caso</CardTitle>
              <CardDescription>
                Información adicional sobre el proceso judicial
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="court_name">Juzgado (opcional)</Label>
                  <Input
                    id="court_name"
                    placeholder="Ej: Juzgado 5 Civil del Circuito"
                    {...register('court_name')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="court_case_number">Radicado (opcional)</Label>
                  <Input
                    id="court_case_number"
                    placeholder="Ej: 2024-00123"
                    {...register('court_case_number')}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">Fecha Límite (opcional)</Label>
                <Input
                  id="deadline"
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  {...register('deadline')}
                />
                <p className="text-sm text-gray-500">
                  Indica si hay una fecha límite para la entrega del dictamen
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="client_notes">Notas Adicionales (opcional)</Label>
                <Textarea
                  id="client_notes"
                  placeholder="Cualquier información adicional que consideres relevante..."
                  rows={4}
                  {...register('client_notes')}
                />
              </div>

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Anterior
                </Button>
                <Button type="button" onClick={() => setStep(3)} className="gap-2">
                  Siguiente
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Documents */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Documentos</CardTitle>
              <CardDescription>
                Adjunta los documentos relevantes para el caso
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  id="files"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                />
                <label htmlFor="files" className="cursor-pointer">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">
                    Haz clic para seleccionar archivos
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    PDF, Word, Excel, imágenes (máx. 10MB por archivo)
                  </p>
                </label>
              </div>

              {files.length > 0 && (
                <div className="space-y-2">
                  <Label>Archivos seleccionados</Label>
                  <div className="space-y-2">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          Eliminar
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Importante:</strong> Los documentos que adjuntes serán
                  tratados con confidencialidad y solo serán visibles para ti y el
                  perito asignado al caso.
                </p>
              </div>

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setStep(2)}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Anterior
                </Button>
                <Button type="submit" loading={isSubmitting} className="gap-2">
                  Crear Caso
                  <CheckCircle className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </form>
    </div>
  );
}

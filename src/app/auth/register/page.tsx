'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { registerSchema, type RegisterFormData } from '@/lib/validations/auth';
import { createClient } from '@/lib/supabase/client';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'cliente',
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterFormData) => {
    setError(null);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            role: data.role,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
          setError('Este correo ya está registrado. Intenta iniciar sesión.');
        } else {
          setError(authError.message);
        }
        return;
      }

      setSuccess(true);
    } catch (err) {
      setError('Ha ocurrido un error. Por favor intenta de nuevo.');
      console.error(err);
    }
  };

  if (success) {
    return (
      <Card className="border-0 shadow-xl">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">¡Registro Exitoso!</h2>
            <p className="text-gray-600">
              Hemos enviado un correo de verificación a tu dirección de email.
              Por favor revisa tu bandeja de entrada y haz clic en el enlace para activar tu cuenta.
            </p>
            <Button onClick={() => router.push('/auth/login')} className="w-full">
              Ir a Iniciar Sesión
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Crear Cuenta</CardTitle>
        <CardDescription className="text-center">
          Únete a PERITUS y accede a los mejores peritos del país
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Role Selection */}
          <div className="space-y-2">
            <Label>Tipo de Cuenta</Label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  selectedRole === 'cliente'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  value="cliente"
                  {...register('role')}
                  className="sr-only"
                />
                <User className={`h-6 w-6 mb-2 ${selectedRole === 'cliente' ? 'text-blue-600' : 'text-gray-400'}`} />
                <span className={`font-medium ${selectedRole === 'cliente' ? 'text-blue-700' : 'text-gray-700'}`}>
                  Cliente
                </span>
                <span className="text-xs text-gray-500 mt-1 text-center">
                  Abogado, Firma, Empresa
                </span>
              </label>

              <label
                className={`flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  selectedRole === 'perito'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  value="perito"
                  {...register('role')}
                  className="sr-only"
                />
                <svg
                  className={`h-6 w-6 mb-2 ${selectedRole === 'perito' ? 'text-blue-600' : 'text-gray-400'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className={`font-medium ${selectedRole === 'perito' ? 'text-blue-700' : 'text-gray-700'}`}>
                  Perito
                </span>
                <span className="text-xs text-gray-500 mt-1 text-center">
                  Experto Certificado
                </span>
              </label>
            </div>
            {errors.role && (
              <p className="text-red-500 text-sm">{errors.role.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName">Nombre Completo</Label>
            <Input
              id="fullName"
              placeholder="Juan Pérez García"
              icon={<User className="h-4 w-4" />}
              error={!!errors.fullName}
              {...register('fullName')}
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm">{errors.fullName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@correo.com"
              icon={<Mail className="h-4 w-4" />}
              error={!!errors.email}
              {...register('email')}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                icon={<Lock className="h-4 w-4" />}
                error={!!errors.password}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              icon={<Lock className="h-4 w-4" />}
              error={!!errors.confirmPassword}
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
            )}
          </div>

          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              id="acceptTerms"
              className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              {...register('acceptTerms')}
            />
            <Label htmlFor="acceptTerms" className="text-sm font-normal leading-relaxed">
              Acepto los{' '}
              <Link href="/terminos" className="text-blue-600 hover:underline">
                Términos y Condiciones
              </Link>{' '}
              y la{' '}
              <Link href="/privacidad" className="text-blue-600 hover:underline">
                Política de Privacidad
              </Link>
            </Label>
          </div>
          {errors.acceptTerms && (
            <p className="text-red-500 text-sm">{errors.acceptTerms.message}</p>
          )}

          <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
            Crear Cuenta
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="relative w-full">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">¿Ya tienes cuenta?</span>
          </div>
        </div>
        <Link href="/auth/login" className="w-full">
          <Button variant="outline" className="w-full">
            Iniciar Sesión
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

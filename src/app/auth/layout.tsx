import Link from 'next/link';
import { Scale } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="flex min-h-screen">
        {/* Left side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 p-12 flex-col justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-lg">
              <Scale className="h-8 w-8 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-white">PERITUS</span>
          </Link>

          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-white leading-tight">
              Centro Nacional de<br />Pruebas Periciales
            </h1>
            <p className="text-blue-100 text-lg max-w-md">
              La plataforma más confiable para conectar abogados con peritos expertos certificados.
              Dictámenes profesionales con trazabilidad completa.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-8">
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="text-3xl font-bold text-white">500+</div>
                <div className="text-blue-100 text-sm">Peritos Verificados</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="text-3xl font-bold text-white">2,500+</div>
                <div className="text-blue-100 text-sm">Casos Completados</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="text-3xl font-bold text-white">98%</div>
                <div className="text-blue-100 text-sm">Satisfacción</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="text-3xl font-bold text-white">24h</div>
                <div className="text-blue-100 text-sm">Tiempo Respuesta</div>
              </div>
            </div>
          </div>

          <p className="text-blue-200 text-sm">
            &copy; {new Date().getFullYear()} PERITUS. Todos los derechos reservados.
          </p>
        </div>

        {/* Right side - Auth form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="lg:hidden mb-8 flex justify-center">
              <Link href="/" className="flex items-center gap-3">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Scale className="h-8 w-8 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900">PERITUS</span>
              </Link>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

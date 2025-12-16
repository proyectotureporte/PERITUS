import Link from 'next/link';
import {
  Scale,
  Search,
  Shield,
  Clock,
  Users,
  FileCheck,
  Star,
  ArrowRight,
  CheckCircle,
  ChevronRight,
  Building,
  Briefcase,
  GraduationCap,
  HeartPulse,
  Code,
  Calculator,
  FileText,
  Leaf,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const specialties = [
  { name: 'Finanzas', icon: Calculator, cases: '450+' },
  { name: 'Psicología', icon: HeartPulse, cases: '320+' },
  { name: 'Ingeniería', icon: Building, cases: '280+' },
  { name: 'Medicina', icon: HeartPulse, cases: '210+' },
  { name: 'Informática', icon: Code, cases: '180+' },
  { name: 'Documentología', icon: FileText, cases: '150+' },
  { name: 'Contabilidad', icon: Calculator, cases: '200+' },
  { name: 'Ambiental', icon: Leaf, cases: '90+' },
];

const stats = [
  { value: '500+', label: 'Peritos Verificados' },
  { value: '2,500+', label: 'Casos Completados' },
  { value: '98%', label: 'Satisfacción' },
  { value: '24h', label: 'Tiempo Respuesta' },
];

const features = [
  {
    icon: Shield,
    title: 'Peritos Verificados',
    description:
      'Cada perito pasa por un riguroso proceso de verificación de credenciales y experiencia.',
  },
  {
    icon: Clock,
    title: 'Respuesta Rápida',
    description:
      'Encuentra al perito ideal en menos de 24 horas con nuestro sistema de matching inteligente.',
  },
  {
    icon: FileCheck,
    title: 'Trazabilidad Total',
    description:
      'Cada acción queda registrada con validez probatoria para tu tranquilidad jurídica.',
  },
  {
    icon: Users,
    title: 'Comunicación Segura',
    description:
      'Chat encriptado y documentos protegidos para una comunicación confidencial.',
  },
];

const steps = [
  {
    num: '01',
    title: 'Crea tu caso',
    description: 'Describe tu necesidad pericial y los documentos relevantes.',
  },
  {
    num: '02',
    title: 'Encuentra tu perito',
    description: 'Nuestro algoritmo te recomienda los mejores expertos para tu caso.',
  },
  {
    num: '03',
    title: 'Colabora de forma segura',
    description: 'Comunícate y comparte documentos en un entorno protegido.',
  },
  {
    num: '04',
    title: 'Recibe tu dictamen',
    description: 'Obtén un dictamen profesional con validez probatoria completa.',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <Scale className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">PERITUS</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link href="#especialidades" className="text-gray-600 hover:text-gray-900">
                Especialidades
              </Link>
              <Link href="#como-funciona" className="text-gray-600 hover:text-gray-900">
                Cómo Funciona
              </Link>
              <Link href="#peritos" className="text-gray-600 hover:text-gray-900">
                Para Peritos
              </Link>
              <Link href="/auth/login">
                <Button variant="ghost">Iniciar Sesión</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Comenzar Gratis</Button>
              </Link>
            </div>

            <div className="md:hidden">
              <Link href="/auth/login">
                <Button size="sm">Iniciar</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4" variant="secondary">
                Centro Nacional de Pruebas Periciales
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Conectamos{' '}
                <span className="text-blue-600">abogados</span> con{' '}
                <span className="text-blue-600">peritos expertos</span>
              </h1>
              <p className="mt-6 text-xl text-gray-600 leading-relaxed">
                La plataforma más confiable de Colombia para obtener dictámenes periciales
                profesionales con trazabilidad completa y validez probatoria.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link href="/auth/register">
                  <Button size="lg" className="w-full sm:w-auto gap-2">
                    Comenzar Ahora
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="#como-funciona">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Ver Cómo Funciona
                  </Button>
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="mt-12 flex items-center gap-6">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-sm font-medium text-gray-600"
                    >
                      {['JP', 'MC', 'LA', 'RG', 'SM'][i - 1]}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">
                    <strong>4.9/5</strong> de más de 1,000 clientes
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <Card key={stat.label} className="bg-white/80 backdrop-blur">
                  <CardContent className="p-6 text-center">
                    <p className="text-4xl font-bold text-blue-600">{stat.value}</p>
                    <p className="text-gray-600 mt-2">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-600 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              ¿Necesitas un perito experto?
            </h2>
            <p className="text-blue-100 mb-6">
              Encuentra al profesional ideal para tu caso en minutos
            </p>
            <Link href="/auth/register?role=cliente">
              <Button size="lg" variant="secondary" className="gap-2">
                <Search className="h-5 w-5" />
                Buscar Perito
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section id="especialidades" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Especialidades Periciales
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Contamos con expertos verificados en todas las áreas
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {specialties.map((specialty) => (
              <Card key={specialty.name} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 transition-colors">
                    <specialty.icon className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{specialty.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{specialty.cases} casos</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/especialidades">
              <Button variant="outline" className="gap-2">
                Ver todas las especialidades
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              ¿Por qué elegir PERITUS?
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              La plataforma diseñada para profesionales del derecho
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-7 w-7 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="como-funciona" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Cómo Funciona</h2>
            <p className="mt-4 text-xl text-gray-600">
              Obtén tu dictamen pericial en 4 simples pasos
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={step.num} className="relative">
                <div className="bg-white rounded-xl p-6 shadow-sm h-full">
                  <span className="text-5xl font-bold text-blue-100">{step.num}</span>
                  <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="h-6 w-6 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Experts CTA */}
      <section id="peritos" className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="secondary" className="mb-4">
                Para Peritos
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold text-white">
                Únete como Perito Certificado
              </h2>
              <p className="mt-4 text-xl text-blue-100">
                Expande tu práctica profesional, recibe casos de toda Colombia y
                cobra de forma segura a través de nuestra plataforma.
              </p>

              <ul className="mt-8 space-y-4">
                {[
                  'Recibe casos afines a tu especialidad',
                  'Cobra de forma segura con pago garantizado',
                  'Accede a recursos y formatos profesionales',
                  'Construye tu reputación con reseñas verificadas',
                ].map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3 text-white">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    {benefit}
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Link href="/auth/register?role=perito">
                  <Button size="lg" variant="secondary" className="gap-2">
                    <Briefcase className="h-5 w-5" />
                    Registrarme como Perito
                  </Button>
                </Link>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-white">$0</p>
                  <p className="text-blue-100 mt-1">Costo de registro</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-white">15%</p>
                  <p className="text-blue-100 mt-1">Comisión por caso</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-white">24h</p>
                  <p className="text-blue-100 mt-1">Liberación de pago</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-white">100%</p>
                  <p className="text-blue-100 mt-1">Pago garantizado</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Comienza hoy con PERITUS
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Únete a más de 500 profesionales que ya confían en nuestra plataforma
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register?role=cliente">
              <Button size="lg" className="gap-2">
                <GraduationCap className="h-5 w-5" />
                Soy Abogado / Cliente
              </Button>
            </Link>
            <Link href="/auth/register?role=perito">
              <Button size="lg" variant="outline" className="gap-2">
                <Shield className="h-5 w-5" />
                Soy Perito
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Link href="/" className="flex items-center gap-2">
                <div className="bg-blue-600 p-1.5 rounded-lg">
                  <Scale className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">PERITUS</span>
              </Link>
              <p className="mt-4 text-gray-400">
                Centro Nacional de Pruebas Periciales. La plataforma más confiable
                de Colombia para servicios periciales profesionales.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Plataforma</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/especialidades" className="hover:text-white">Especialidades</Link></li>
                <li><Link href="/como-funciona" className="hover:text-white">Cómo Funciona</Link></li>
                <li><Link href="/precios" className="hover:text-white">Precios</Link></li>
                <li><Link href="/recursos" className="hover:text-white">Recursos</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/nosotros" className="hover:text-white">Nosotros</Link></li>
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
                <li><Link href="/contacto" className="hover:text-white">Contacto</Link></li>
                <li><Link href="/carreras" className="hover:text-white">Trabaja con nosotros</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/terminos" className="hover:text-white">Términos de Servicio</Link></li>
                <li><Link href="/privacidad" className="hover:text-white">Privacidad</Link></li>
                <li><Link href="/cookies" className="hover:text-white">Cookies</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} PERITUS - Centro Nacional de Pruebas. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

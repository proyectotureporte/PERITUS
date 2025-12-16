import Link from 'next/link';
import {
  HelpCircle,
  MessageSquare,
  FileText,
  Phone,
  Mail,
  ChevronRight,
  Search,
  BookOpen,
  Shield,
  CreditCard,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const faqCategories = [
  {
    title: 'Casos',
    icon: FileText,
    questions: [
      '¿Cómo creo un nuevo caso?',
      '¿Cuánto tiempo toma la asignación de un perito?',
      '¿Puedo cancelar un caso?',
    ],
  },
  {
    title: 'Pagos',
    icon: CreditCard,
    questions: [
      '¿Qué métodos de pago aceptan?',
      '¿Cómo funciona el sistema de custodia (escrow)?',
      '¿Cuándo se libera el pago al perito?',
    ],
  },
  {
    title: 'Seguridad',
    icon: Shield,
    questions: [
      '¿Mis documentos están protegidos?',
      '¿Quién tiene acceso a mi información?',
      '¿Cómo verifican a los peritos?',
    ],
  },
];

export default function AyudaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Centro de Ayuda</h1>
        <p className="text-gray-500 mt-1">
          Encuentra respuestas a tus preguntas o contacta a nuestro equipo
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="max-w-xl mx-auto text-center">
            <HelpCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              ¿En qué podemos ayudarte?
            </h2>
            <p className="text-gray-500 mb-4">
              Busca en nuestra base de conocimientos o explora las categorías
            </p>
            <Input
              placeholder="Buscar artículos de ayuda..."
              icon={<Search className="h-4 w-4" />}
              className="max-w-md mx-auto"
            />
          </div>
        </CardContent>
      </Card>

      {/* FAQ Categories */}
      <div className="grid gap-6 md:grid-cols-3">
        {faqCategories.map((category) => {
          const Icon = category.icon;
          return (
            <Card key={category.title}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-blue-600" />
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {category.questions.map((question, idx) => (
                    <li key={idx}>
                      <button className="w-full text-left text-sm text-gray-600 hover:text-blue-600 flex items-center justify-between group">
                        <span>{question}</span>
                        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
                      </button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Recursos Útiles
          </CardTitle>
          <CardDescription>
            Guías y documentación para aprovechar al máximo PERITUS
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              href="#"
              className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-colors"
            >
              <h3 className="font-medium text-gray-900">Guía de inicio rápido</h3>
              <p className="text-sm text-gray-500 mt-1">
                Aprende a usar PERITUS en 5 minutos
              </p>
            </Link>
            <Link
              href="#"
              className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-colors"
            >
              <h3 className="font-medium text-gray-900">Términos y condiciones</h3>
              <p className="text-sm text-gray-500 mt-1">
                Conoce nuestras políticas de uso
              </p>
            </Link>
            <Link
              href="#"
              className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-colors"
            >
              <h3 className="font-medium text-gray-900">Política de privacidad</h3>
              <p className="text-sm text-gray-500 mt-1">
                Cómo protegemos tu información
              </p>
            </Link>
            <Link
              href="#"
              className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-colors"
            >
              <h3 className="font-medium text-gray-900">Video tutoriales</h3>
              <p className="text-sm text-gray-500 mt-1">
                Aprende con ejemplos prácticos
              </p>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card>
        <CardHeader>
          <CardTitle>¿Necesitas más ayuda?</CardTitle>
          <CardDescription>
            Nuestro equipo de soporte está disponible para asistirte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-medium text-gray-900">Chat en vivo</h4>
              <p className="text-sm text-gray-500 mt-1">Respuesta inmediata</p>
              <Button variant="outline" size="sm" className="mt-3">
                Iniciar chat
              </Button>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Phone className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-medium text-gray-900">Teléfono</h4>
              <p className="text-sm text-gray-500 mt-1">+57 1 234 5678</p>
              <Button variant="outline" size="sm" className="mt-3">
                Llamar ahora
              </Button>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Mail className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-medium text-gray-900">Email</h4>
              <p className="text-sm text-gray-500 mt-1">soporte@peritus.co</p>
              <Button variant="outline" size="sm" className="mt-3">
                Enviar email
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

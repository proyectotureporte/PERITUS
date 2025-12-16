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
  Award,
  Scale,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const faqCategories = [
  {
    title: 'Casos y Solicitudes',
    icon: FileText,
    questions: [
      '¿Cómo acepto una solicitud de caso?',
      '¿Cuánto tiempo tengo para responder?',
      '¿Puedo rechazar un caso asignado?',
    ],
  },
  {
    title: 'Pagos e Ingresos',
    icon: CreditCard,
    questions: [
      '¿Cuándo recibo el pago por un caso?',
      '¿Cómo funciona el sistema de escrow?',
      '¿Qué comisión cobra PERITUS?',
    ],
  },
  {
    title: 'Verificación',
    icon: Shield,
    questions: [
      '¿Qué documentos necesito para verificarme?',
      '¿Cuánto tarda el proceso de verificación?',
      '¿Puedo actualizar mis credenciales?',
    ],
  },
  {
    title: 'Dictámenes',
    icon: Scale,
    questions: [
      '¿Qué formato debe tener el dictamen?',
      '¿Cómo subo el informe final?',
      '¿Qué pasa si el cliente solicita revisión?',
    ],
  },
];

const guides = [
  {
    title: 'Guía del Perito',
    description: 'Todo lo que necesitas saber para ser exitoso en PERITUS',
    icon: BookOpen,
    color: 'blue',
  },
  {
    title: 'Mejores Prácticas',
    description: 'Consejos para elaborar dictámenes de calidad',
    icon: Award,
    color: 'green',
  },
  {
    title: 'Políticas de la Plataforma',
    description: 'Normas y reglamentos que debes conocer',
    icon: Shield,
    color: 'purple',
  },
];

export default function AyudaPeritoPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Centro de Ayuda</h1>
        <p className="text-gray-500 mt-1">
          Encuentra respuestas y recursos para tu actividad pericial
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
              Busca en nuestra base de conocimientos
            </p>
            <Input
              placeholder="Buscar artículos de ayuda..."
              icon={<Search className="h-4 w-4" />}
              className="max-w-md mx-auto"
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Guides */}
      <div className="grid gap-4 sm:grid-cols-3">
        {guides.map((guide) => {
          const Icon = guide.icon;
          const bgColor = {
            blue: 'bg-blue-100',
            green: 'bg-green-100',
            purple: 'bg-purple-100',
          }[guide.color];
          const textColor = {
            blue: 'text-blue-600',
            green: 'text-green-600',
            purple: 'text-purple-600',
          }[guide.color];

          return (
            <Card key={guide.title} className="hover:border-blue-300 transition-colors cursor-pointer">
              <CardContent className="pt-6">
                <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className={`h-6 w-6 ${textColor}`} />
                </div>
                <h3 className="font-semibold text-gray-900">{guide.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{guide.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* FAQ Categories */}
      <div className="grid gap-6 md:grid-cols-2">
        {faqCategories.map((category) => {
          const Icon = category.icon;
          return (
            <Card key={category.title}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Icon className="h-5 w-5 text-blue-600" />
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {category.questions.map((question, idx) => (
                    <li key={idx}>
                      <button className="w-full text-left text-sm text-gray-600 hover:text-blue-600 flex items-center justify-between group p-2 rounded-lg hover:bg-gray-50">
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

      {/* Resources Link */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Centro de Recursos</h3>
                <p className="text-sm text-gray-600">
                  Accede a plantillas, guías y material de formación
                </p>
              </div>
            </div>
            <Link href="/perito/recursos">
              <Button>
                Ver recursos
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
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
                Llamar
              </Button>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Mail className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-medium text-gray-900">Email</h4>
              <p className="text-sm text-gray-500 mt-1">peritos@peritus.co</p>
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

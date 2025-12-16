import Link from 'next/link';
import {
  BookOpen,
  FileText,
  Video,
  Download,
  ExternalLink,
  GraduationCap,
  Scale,
  ClipboardList,
  Award,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const resources = [
  {
    category: 'Guías y Plantillas',
    icon: FileText,
    items: [
      {
        title: 'Plantilla de Dictamen Pericial',
        description: 'Formato estándar para la elaboración de dictámenes',
        type: 'DOCX',
        size: '245 KB',
      },
      {
        title: 'Guía de Mejores Prácticas',
        description: 'Recomendaciones para la elaboración de informes',
        type: 'PDF',
        size: '1.2 MB',
      },
      {
        title: 'Lista de Verificación Pre-entrega',
        description: 'Checklist antes de enviar el dictamen',
        type: 'PDF',
        size: '120 KB',
      },
    ],
  },
  {
    category: 'Normatividad',
    icon: Scale,
    items: [
      {
        title: 'Código General del Proceso',
        description: 'Artículos relacionados con prueba pericial',
        type: 'PDF',
        size: '3.5 MB',
      },
      {
        title: 'Ley 906 de 2004',
        description: 'Código de Procedimiento Penal',
        type: 'PDF',
        size: '2.8 MB',
      },
      {
        title: 'Reglamento PERITUS',
        description: 'Normas y condiciones de la plataforma',
        type: 'PDF',
        size: '890 KB',
      },
    ],
  },
];

const courses = [
  {
    title: 'Fundamentos del Peritaje',
    duration: '4 horas',
    modules: 8,
    level: 'Básico',
  },
  {
    title: 'Redacción de Dictámenes',
    duration: '6 horas',
    modules: 12,
    level: 'Intermedio',
  },
  {
    title: 'Ética Profesional',
    duration: '2 horas',
    modules: 4,
    level: 'Básico',
  },
  {
    title: 'Presentación en Audiencia',
    duration: '5 horas',
    modules: 10,
    level: 'Avanzado',
  },
];

export default function RecursosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Centro de Recursos</h1>
        <p className="text-gray-500 mt-1">
          Material de apoyo para tu actividad pericial
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">15</p>
                <p className="text-xs text-gray-500">Documentos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Video className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">8</p>
                <p className="text-xs text-gray-500">Videos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <GraduationCap className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">4</p>
                <p className="text-xs text-gray-500">Cursos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <ClipboardList className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">6</p>
                <p className="text-xs text-gray-500">Plantillas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Documents & Templates */}
      {resources.map((section) => {
        const Icon = section.icon;
        return (
          <Card key={section.category}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon className="h-5 w-5 text-blue-600" />
                {section.category}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {section.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <FileText className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{item.title}</h4>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">{item.type}</Badge>
                      <span className="text-sm text-gray-500">{item.size}</span>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Training Courses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-blue-600" />
            Cursos de Formación
          </CardTitle>
          <CardDescription>
            Mejora tus habilidades con nuestros cursos especializados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {courses.map((course, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{course.title}</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {course.duration} • {course.modules} módulos
                    </p>
                  </div>
                  <Badge
                    variant={
                      course.level === 'Básico'
                        ? 'secondary'
                        : course.level === 'Intermedio'
                        ? 'default'
                        : 'warning'
                    }
                  >
                    {course.level}
                  </Badge>
                </div>
                <Button variant="outline" size="sm" className="mt-4 w-full">
                  Comenzar curso
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* External Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            Recursos Externos
          </CardTitle>
          <CardDescription>
            Enlaces útiles a entidades y recursos oficiales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <Link
              href="https://www.ramajudicial.gov.co"
              target="_blank"
              className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <Award className="h-8 w-8 text-gray-400 group-hover:text-blue-600" />
                <ExternalLink className="h-4 w-4 text-gray-400" />
              </div>
              <h4 className="font-medium text-gray-900 mt-3">Rama Judicial</h4>
              <p className="text-sm text-gray-500 mt-1">
                Portal oficial de la Rama Judicial
              </p>
            </Link>
            <Link
              href="https://www.fiscalia.gov.co"
              target="_blank"
              className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <Scale className="h-8 w-8 text-gray-400 group-hover:text-blue-600" />
                <ExternalLink className="h-4 w-4 text-gray-400" />
              </div>
              <h4 className="font-medium text-gray-900 mt-3">Fiscalía General</h4>
              <p className="text-sm text-gray-500 mt-1">
                Fiscalía General de la Nación
              </p>
            </Link>
            <Link
              href="https://www.supervigilancia.gov.co"
              target="_blank"
              className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <ClipboardList className="h-8 w-8 text-gray-400 group-hover:text-blue-600" />
                <ExternalLink className="h-4 w-4 text-gray-400" />
              </div>
              <h4 className="font-medium text-gray-900 mt-3">Superintendencias</h4>
              <p className="text-sm text-gray-500 mt-1">
                Entidades de control y vigilancia
              </p>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import type { SeccionLanding } from '../tipos'

export const NOMBRE = 'Home peritus.com.co (landing principal)'
export const URL_PUBLICA = '/'

export const DEFAULTS = {
  estilos: {
    fuente: 'var(--font-inter), Arial, sans-serif',
    colorDorado: '#d4a843',
  },
  hero: {
    kicker: 'Peritos expertos para abogados, jueces y litigantes',
    titulo: 'EL ALIADO IDEAL PARA SUS LITIGIOS',
    parrafo: 'Somos especialistas en conectar abogados y clientes con peritos altamente calificados en distintas áreas, facilitando el acceso a dictámenes periciales confiables, técnicos y con validez legal para respaldar cada etapa del proceso judicial.',
    botonTexto: 'Asesor especialista',
    imagenFondo: '/fondo.png',
  },
  audiencia: {
    titulo: '¿Quién eres?',
    overlayTexto: 'Haga clic en Ver más para conocer nuestros servicios',
    botonTexto: 'Ver más',
    t1Label: 'Soy perito', t1Imagen: '/dictamen-pericial.jpg', t1Href: '/perito',
    t2Label: 'Soy abogado', t2Imagen: '/lawyers-office.jpg', t2Href: '/abogado',
    t3Label: 'Soy juez', t3Imagen: '/gavel.jpg', t3Href: '/juez',
    t4Label: 'Soy empresa', t4Imagen: '/office-meeting.jpg', t4Href: '/empresa',
  },
  peritos: {
    titulo: 'Peritos especializados',
    subtitulo: 'Contamos con expertos certificados en las principales áreas del conocimiento pericial',
    area1: 'Medicina', area2: 'Ingenieria', area3: 'Finanzas',
    area4: 'Informática', area5: 'Grafología', area6: 'Industria',
  },
  quienesSomos: {
    titulo: '¿Quiénes somos?',
    parrafo: 'Peritus es una plataforma que conecta profesionales del derecho y clientes con peritos especializados en diversas áreas técnicas y científicas, facilitando el acceso a dictámenes periciales claros, rigurosos y con plena validez legal, y brindando soporte técnico que fortalece los procesos judiciales a través de una red de expertos que aporta análisis confiables y contribuye a la solidez de cada caso.',
    imagen: '/fondo.png',
  },
  beneficios: {
    titulo: 'Beneficios de nuestro servicio',
    subtitulo: 'Soluciones periciales integrales que marcan la diferencia en cada proceso',
    b1: 'Precisión en pretensiones y liquidaciones, clave para fortalecer su caso.',
    b2: 'Dictámenes con estándares técnicos y validez legal en cualquier jurisdicción.',
    b3: 'Equipo multidisciplinario que cubre todas las áreas periciales.',
    b4: 'Tiempos de respuesta optimizados para cumplir con plazos procesales.',
    b5: 'Acompañamiento durante todo el proceso judicial',
    b6: 'Confidencialidad y manejo seguro de la información de cada caso.',
  },
  valores: {
    eyebrow: 'Lo que nos define',
    titulo: 'Nuestros valores',
    v1Titulo: 'Precisión',
    v1Texto: 'Precisión en pretensiones y liquidaciones, clave para fortalecer su caso.',
    v2Titulo: 'Confianza',
    v2Texto: 'Tiempos de respuesta eficientes que se ajustan a los plazos procesales de cada caso.',
    v3Titulo: 'Rigor',
    v3Texto: 'Análisis exhaustivo con sustento técnico que respalda cada conclusión del dictamen.',
  },
  clientes: { titulo: 'Confían en nosotros' },
  operacion: {
    titulo: 'Operación nacional',
    parrafo: 'En Peritus trabajamos en todo el territorio Colombiano, ofreciendo un servicio de calidad sin restricción por la ubicación de nuestros clientes.',
  },
}

const t = (path: string, label: string): { path: string; label: string; tipo: 'texto' } => ({ path, label, tipo: 'texto' })
const p = (path: string, label: string): { path: string; label: string; tipo: 'parrafo' } => ({ path, label, tipo: 'parrafo' })
const img = (path: string, label: string): { path: string; label: string; tipo: 'imagen' } => ({ path, label, tipo: 'imagen' })
const lnk = (path: string, label: string): { path: string; label: string; tipo: 'enlace' } => ({ path, label, tipo: 'enlace' })

export const SECCIONES: SeccionLanding[] = [
  { id: 'estilos', titulo: 'Estilos generales', campos: [
    { path: 'estilos.fuente', label: 'Fuente de la página', tipo: 'fuente' },
    { path: 'estilos.colorDorado', label: 'Color dorado (acentos y botones)', tipo: 'color' },
  ]},
  { id: 'hero', titulo: 'Hero (cabecera)', campos: [
    t('hero.kicker', 'Texto superior (kicker)'), t('hero.titulo', 'Título H1'),
    p('hero.parrafo', 'Párrafo'), t('hero.botonTexto', 'Texto del botón'),
    img('hero.imagenFondo', 'Imagen de fondo'),
  ]},
  { id: 'audiencia', titulo: '¿Quién eres? (4 tarjetas)', campos: [
    t('audiencia.titulo', 'Título de sección'), t('audiencia.overlayTexto', 'Texto del overlay'),
    t('audiencia.botonTexto', 'Texto del botón de tarjeta'),
    t('audiencia.t1Label', 'Tarjeta 1 — texto'), img('audiencia.t1Imagen', 'Tarjeta 1 — imagen'), lnk('audiencia.t1Href', 'Tarjeta 1 — enlace'),
    t('audiencia.t2Label', 'Tarjeta 2 — texto'), img('audiencia.t2Imagen', 'Tarjeta 2 — imagen'), lnk('audiencia.t2Href', 'Tarjeta 2 — enlace'),
    t('audiencia.t3Label', 'Tarjeta 3 — texto'), img('audiencia.t3Imagen', 'Tarjeta 3 — imagen'), lnk('audiencia.t3Href', 'Tarjeta 3 — enlace'),
    t('audiencia.t4Label', 'Tarjeta 4 — texto'), img('audiencia.t4Imagen', 'Tarjeta 4 — imagen'), lnk('audiencia.t4Href', 'Tarjeta 4 — enlace'),
  ]},
  { id: 'peritos', titulo: 'Peritos especializados', campos: [
    t('peritos.titulo', 'Título'), p('peritos.subtitulo', 'Subtítulo'),
    t('peritos.area1', 'Área 1'), t('peritos.area2', 'Área 2'), t('peritos.area3', 'Área 3'),
    t('peritos.area4', 'Área 4'), t('peritos.area5', 'Área 5'), t('peritos.area6', 'Área 6'),
  ]},
  { id: 'quienesSomos', titulo: '¿Quiénes somos?', campos: [
    t('quienesSomos.titulo', 'Título'), p('quienesSomos.parrafo', 'Párrafo'),
    img('quienesSomos.imagen', 'Imagen'),
  ]},
  { id: 'beneficios', titulo: 'Beneficios (6 ítems)', campos: [
    t('beneficios.titulo', 'Título'), p('beneficios.subtitulo', 'Subtítulo'),
    p('beneficios.b1', 'Beneficio 1'), p('beneficios.b2', 'Beneficio 2'), p('beneficios.b3', 'Beneficio 3'),
    p('beneficios.b4', 'Beneficio 4'), p('beneficios.b5', 'Beneficio 5'), p('beneficios.b6', 'Beneficio 6'),
  ]},
  { id: 'valores', titulo: 'Nuestros valores (3 tarjetas)', campos: [
    t('valores.eyebrow', 'Texto superior'), t('valores.titulo', 'Título'),
    t('valores.v1Titulo', 'Valor 1 — título'), p('valores.v1Texto', 'Valor 1 — texto'),
    t('valores.v2Titulo', 'Valor 2 — título'), p('valores.v2Texto', 'Valor 2 — texto'),
    t('valores.v3Titulo', 'Valor 3 — título'), p('valores.v3Texto', 'Valor 3 — texto'),
  ]},
  { id: 'clientes', titulo: 'Confían en nosotros', campos: [t('clientes.titulo', 'Título de sección')] },
  { id: 'operacion', titulo: 'Operación nacional', campos: [
    t('operacion.titulo', 'Título'), p('operacion.parrafo', 'Párrafo'),
  ]},
]

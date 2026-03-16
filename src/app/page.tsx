import Image from 'next/image';
import {
  HeartPulse,
  Scale,
  TrendingUp,
  Monitor,
  Home,
  Factory,
  CheckCircle2,
  Target,
  Clock,
  SearchCheck,
  Play,
  Phone,
  Mail,
  MapPinned,
} from 'lucide-react';
import Header from '@/components/landing/Header';
import CotizacionForm from '@/components/landing/CotizacionForm';
import {
  FadeUp,
  FadeLeft,
  FadeRight,
  FadeIn,
  ScaleUp,
  StaggerGrid,
  StaggerItem,
  HeroFadeUp,
  GrowLine,
} from '@/components/landing/Animations';

const peritosEspecializados = [
  { nombre: 'Medicina', icon: HeartPulse },
  { nombre: 'Legal', icon: Scale },
  { nombre: 'Finanzas', icon: TrendingUp },
  { nombre: 'Informática', icon: Monitor },
  { nombre: 'Vivienda', icon: Home },
  { nombre: 'Industria', icon: Factory },
];

const beneficios = [
  'Precisión en pretensiones y liquidaciones, clave para fortalecer su caso.',
  'Dictámenes con estándares técnicos y validez legal en cualquier jurisdicción.',
  'Equipo multidisciplinario que cubre todas las áreas periciales.',
  'Tiempos de respuesta optimizados para cumplir con plazos procesales.',
  'Asesoría personalizada durante todo el proceso judicial.',
  'Confidencialidad y manejo seguro de la información de cada caso.',
];

const valores = [
  {
    icon: Target,
    titulo: 'Precisión',
    texto:
      'Precisión en pretensiones y liquidaciones, clave para fortalecer su caso.',
  },
  {
    icon: Clock,
    titulo: 'Oportunidad',
    texto:
      'Tiempos de respuesta eficientes que se ajustan a los plazos procesales de cada caso.',
  },
  {
    icon: SearchCheck,
    titulo: 'Rigor',
    texto:
      'Análisis exhaustivo con sustento técnico que respalda cada conclusión del dictamen.',
  },
];

const faqs = [
  '¿Qué es un dictamen pericial?',
  'REQUISITOS',
  'MODELO DE NEGOCIO',
];

const clientes = [
  { nombre: 'EMCALI', logo: '/EMCALI.png' },
  { nombre: 'RUTA N MEDELLÍN', logo: '/RUTANMEDELLIN.png' },
  { nombre: 'BANCOLOMBIA', logo: '/bancolombia.png' },
  { nombre: 'METROVIA', logo: '/METROVIA.png' },
  { nombre: 'DAVIVIENDA', logo: '/davivienda.png' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Header />

      {/* ============================================ */}
      {/* SECTION 1 — HERO                            */}
      {/* ============================================ */}
      <section
        id="inicio"
        className="relative min-h-screen flex items-center bg-navy-dark"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('/fondo.webp')`,
            backgroundSize: 'auto 100%',
            backgroundPosition: 'right center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-dark via-navy-dark/85 to-navy-dark/40" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full">
          <div className="max-w-2xl">
            <HeroFadeUp delay={0.2}>
              <p className="text-white/80 text-sm sm:text-base font-medium tracking-wide uppercase mb-4">
                Peritos expertos para abogados, jueces y litigantes
              </p>
            </HeroFadeUp>
            <HeroFadeUp delay={0.4}>
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white uppercase leading-tight">
                EL ALIADO IDEAL PARA SUS LITIGIOS
              </h1>
            </HeroFadeUp>
            <HeroFadeUp delay={0.6}>
              <p className="mt-6 text-base sm:text-lg text-white/85 leading-relaxed max-w-xl">
                Somos especialistas en conectar abogados y clientes con peritos
                altamente calificados en distintas áreas, facilitando el acceso a
                dictámenes periciales confiables, técnicos y con validez legal para
                respaldar cada etapa del proceso judicial.
              </p>
            </HeroFadeUp>
            <HeroFadeUp delay={0.8}>
              <div className="mt-8">
                <a
                  href="#contacto"
                  className="inline-block px-8 py-3 bg-white text-navy-dark font-bold rounded-lg hover:bg-white/90 transition-colors text-sm sm:text-base"
                >
                  Asesor especialista
                </a>
              </div>
            </HeroFadeUp>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION 2 — PERITOS ESPECIALIZADOS          */}
      {/* ============================================ */}
      <section id="servicios" className="bg-blue-mid py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white text-center mb-4">
              Peritos especializados
            </h2>
          </FadeUp>
          <FadeUp delay={0.15}>
            <p className="text-white/70 text-center text-lg mb-16 max-w-2xl mx-auto">
              Contamos con expertos certificados en las principales áreas del conocimiento pericial
            </p>
          </FadeUp>
          <StaggerGrid className="grid grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {peritosEspecializados.map((perito) => (
              <StaggerItem key={perito.nombre}>
                <div className="group flex flex-col items-center gap-4 p-6 sm:p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/15 hover:border-gold/40 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-gold/10">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-gold transition-colors duration-300 shadow-lg">
                    <perito.icon className="h-8 w-8 sm:h-10 sm:w-10 text-blue-mid group-hover:text-navy-dark transition-colors duration-300" />
                  </div>
                  <span className="text-white font-bold text-lg sm:text-xl text-center">
                    {perito.nombre}
                  </span>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION 3 — QUIÉNES SOMOS                   */}
      {/* ============================================ */}
      <section id="equipo" className="bg-gray-50 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <FadeLeft>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-navy-dark mb-6">
                  ¿Quiénes somos?
                </h2>
                <p className="text-gray-700 leading-relaxed mb-8">
                  CNP es una entidad de carácter privado con más de 10 años de
                  experiencia en la elaboración de dictámenes, así como en la
                  asesoría técnica a abogados, jueces, magistrados y empresas del
                  sector real en temas probatorios de carácter contable, tributario
                  y económico. Contamos con un equipo altamente calificado en
                  auditoría, análisis financiero y valoración de pruebas, que apoya
                  la toma de decisiones en controversias judiciales con sustento
                  técnico y precisión profesional.
                </p>
                <a
                  href="#equipo"
                  className="inline-block px-6 py-3 border-2 border-navy-dark text-navy-dark font-bold rounded-lg hover:bg-navy-dark hover:text-white transition-colors"
                >
                  Conozca el equipo
                </a>
              </div>
            </FadeLeft>

            <FadeRight>
              <div className="flex flex-col items-center">
                <div className="w-64 h-72 bg-gray-200 rounded-xl flex items-center justify-center overflow-hidden">
                  <div className="text-center text-gray-400">
                    <svg
                      className="w-24 h-24 mx-auto mb-2"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                </div>
                <h3 className="mt-4 text-lg font-bold text-navy-dark">
                  Mg. Freddy Oliveros
                </h3>
                <p className="text-gray-500">Director general</p>
              </div>
            </FadeRight>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION 4 — BENEFICIOS                      */}
      {/* ============================================ */}
      <section id="trayectoria" className="bg-navy py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white text-center mb-4">
              Beneficios de nuestro servicio
            </h2>
          </FadeUp>
          <FadeUp delay={0.15}>
            <p className="text-white/60 text-center text-lg mb-16 max-w-2xl mx-auto">
              Soluciones periciales integrales que marcan la diferencia en cada proceso
            </p>
          </FadeUp>
          <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {beneficios.map((beneficio, i) => (
              <StaggerItem key={i}>
                <div className="flex gap-5 p-6 rounded-xl bg-white/5 border border-white/10 hover:border-gold/30 transition-all duration-300">
                  <div className="flex-shrink-0 w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-gold" />
                  </div>
                  <p className="text-white/90 leading-relaxed text-base">{beneficio}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION 5 — NUESTROS VALORES                */}
      {/* ============================================ */}
      <section className="bg-navy-dark py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-16 text-center">
              Nuestros valores
            </h2>
          </FadeUp>
          <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {valores.map((valor) => (
              <StaggerItem key={valor.titulo}>
                <div className="flex flex-col items-center text-center">
                  <ScaleUp>
                    <div className="w-16 h-16 border-2 border-white/40 rounded-full flex items-center justify-center mb-4">
                      <valor.icon className="h-8 w-8 text-white" />
                    </div>
                  </ScaleUp>
                  <h3 className="text-white font-bold text-lg mb-2">{valor.titulo}</h3>
                  <p className="text-white/75 leading-relaxed">{valor.texto}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION 6 — PREGUNTAS FRECUENTES            */}
      {/* ============================================ */}
      <section className="bg-blue-mid py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-12">
              Preguntas Frecuentes
            </h2>
          </FadeUp>
          <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {faqs.map((faq) => (
              <StaggerItem key={faq}>
                <div className="bg-navy/60 border border-white/10 rounded-xl p-5 backdrop-blur-sm">
                  <h3 className="text-white font-bold text-sm uppercase tracking-wide mb-4 text-center">
                    {faq}
                  </h3>
                  <div className="aspect-video bg-navy-dark/80 rounded-lg flex items-center justify-center cursor-pointer hover:bg-navy-dark/60 transition-colors">
                    <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                      <Play className="h-7 w-7 text-white ml-1" fill="white" />
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>

          <FadeUp delay={0.3}>
            <div className="flex justify-center mt-10">
              <a
                href="/registro"
                className="inline-block px-10 py-4 bg-white text-navy-dark font-bold rounded-lg hover:bg-white/90 transition-colors text-base sm:text-lg uppercase tracking-wide"
              >
                ÚNETE A NOSOTROS
              </a>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION 7 — FORMULARIO COTIZACIÓN            */}
      {/* ============================================ */}
      <section id="contacto" className="bg-blue-light py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-12">
              Formulario cotización
            </h2>
          </FadeUp>
          <ScaleUp delay={0.2}>
            <div className="bg-navy/40 backdrop-blur-sm rounded-2xl p-6 sm:p-10 max-w-2xl mx-auto border border-white/10">
              <CotizacionForm />
            </div>
          </ScaleUp>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION 8 — CLIENTES / MARCAS (GALERÍA)     */}
      {/* ============================================ */}
      <section className="bg-blue-mid py-16 sm:py-20 overflow-hidden">
        <FadeUp>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white text-center">
              Confían en nosotros
            </h2>
          </div>
        </FadeUp>
        <FadeIn delay={0.3}>
          <div className="relative w-full overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-blue-mid to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-blue-mid to-transparent z-10" />

            <div className="flex animate-marquee w-max">
              {[...clientes, ...clientes].map((cliente, i) => (
                <div
                  key={`${cliente.nombre}-${i}`}
                  className="flex items-center justify-center px-10 sm:px-14"
                >
                  <div className="w-36 h-20 sm:w-44 sm:h-24 flex items-center justify-center">
                    <Image
                      src={cliente.logo}
                      alt={cliente.nombre}
                      width={180}
                      height={100}
                      className="max-w-full max-h-full object-contain opacity-80 hover:opacity-100 transition-opacity"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ============================================ */}
      {/* SECTION 9 — OPERACIÓN NACIONAL              */}
      {/* ============================================ */}
      <section className="bg-navy py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <GrowLine className="h-1 bg-gold rounded mb-12" />

          <FadeUp>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8">
              Operación nacional
            </h2>
          </FadeUp>

          <div className="flex flex-col items-center text-center">
            <ScaleUp delay={0.2}>
              <div className="w-full max-w-4xl mx-auto rounded-xl overflow-hidden border border-white/10 mb-6">
                <iframe
                  src="https://maps.google.com/maps?q=Carrera+101+%2317-53,+Cali,+Colombia&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación Peritus - Carrera 101 #17-53, Cali"
                />
              </div>
            </ScaleUp>
            <FadeUp delay={0.4}>
              <p className="text-white/85 leading-relaxed max-w-2xl text-base sm:text-lg">
                En Peritus trabajamos en todo el territorio Colombiano, ofreciendo un
                servicio de calidad sin restricción por la ubicación de nuestros
                clientes.
              </p>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* FOOTER                                      */}
      {/* ============================================ */}
      <footer className="bg-navy-dark py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <GrowLine className="h-1 bg-gold rounded mb-10" />

          <FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
              <div>
                <Image
                  src="/LOGO.png"
                  alt="Peritus"
                  width={200}
                  height={67}
                  className="h-14 w-auto brightness-0 invert"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-white/80">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span>3128462934</span>
                </div>
                <div className="flex items-center gap-3 text-white/80">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <span>contacto@cnp.com.co</span>
                </div>
                <div className="flex items-center gap-3 text-white/80">
                  <MapPinned className="h-4 w-4 flex-shrink-0" />
                  <span>Carrera 101 17-53, Cali.</span>
                </div>
              </div>

              <div className="flex items-center gap-3 md:justify-end">
                {[
                  { label: 'Fb', href: '#' },
                  { label: 'Ig', href: '#' },
                  { label: 'Lin', href: '#' },
                  { label: 'X', href: '#' },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white text-xs font-bold hover:bg-white/20 transition-colors"
                    aria-label={social.label}
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            </div>
          </FadeIn>

          <div className="mt-10 pt-6 border-t border-white/10 text-center text-white/50 text-sm">
            <p>
              &copy; {new Date().getFullYear()} PERITUS - Centro Nacional de
              Pruebas. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

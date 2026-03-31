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
  Phone,
  Mail,
  MapPinned,
} from 'lucide-react';
import Header from '@/components/landing/Header';
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
  { nombre: 'Ingenieria', icon: Scale },
  { nombre: 'Finanzas', icon: TrendingUp },
  { nombre: 'Informática', icon: Monitor },
  { nombre: 'Grafología', icon: Home },
  { nombre: 'Industria', icon: Factory },
];

const beneficios = [
  'Precisión en pretensiones y liquidaciones, clave para fortalecer su caso.',
  'Dictámenes con estándares técnicos y validez legal en cualquier jurisdicción.',
  'Equipo multidisciplinario que cubre todas las áreas periciales.',
  'Tiempos de respuesta optimizados para cumplir con plazos procesales.',
  'Acompañamiento durante todo el proceso judicial',
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
    titulo: 'Confianza',
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

const audienceCards = [
  {
    label: 'Soy perito',
    image: '/dictamen-pericial.jpg',
    href: '/perito',
  },
  {
    label: 'Soy abogado',
    image: '/lawyers-office.jpg',
    href: '/abogado',
  },
  {
    label: 'Soy juez',
    image: '/gavel.jpg',
    href: '/juez',
  },
  {
    label: 'Soy empresa',
    image: '/office-meeting.jpg',
    href: '/empresa',
  },
];

const clientes = [
  { nombre: 'EMCALI', logo: '/EMCALI.png' },
  { nombre: 'RUTA N MEDELLÍN', logo: '/RUTANMEDELLIN.png' },
  { nombre: 'BANCOLOMBIA', logo: '/bancolombia.png' },
  { nombre: 'METROVIA', logo: '/METROVIA.png' },
  { nombre: 'DAVIVIENDA', logo: '/davivienda.png', w: 288, h: 160 },
  { nombre: 'LOGON', logo: '/LOGON.png' },
  { nombre: 'LOGON1', logo: '/LOGON1.png' },
  { nombre: 'LOGON2', logo: '/LOGON2.png', w: 288, h: 160 },
  { nombre: 'LOGON3', logo: '/LOGON3.png', w: 288, h: 160 },
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
            backgroundImage: `url('/fondo.png')`,
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
                  href="#audiencia"
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
      {/* SECTION 2 — ¿QUIÉN ERES? (AUDIENCE CARDS)  */}
      {/* ============================================ */}
      <section id="audiencia" style={{ backgroundColor: '#07152e', padding: '80px 0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <h2
              className="text-center mb-12"
              style={{ fontSize: 'clamp(28px, 4vw, 38px)', fontWeight: 800, color: '#ffffff' }}
            >
              ¿Quién eres?
            </h2>
          </FadeUp>
          <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {audienceCards.map((card) => (
              <StaggerItem key={card.label}>
                <div
                  style={{
                    borderRadius: '14px',
                    overflow: 'hidden',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {/* Image area */}
                  <a href={card.href} className="audience-img-wrap" style={{ position: 'relative', flex: '0 0 auto', display: 'block' }}>
                    <div style={{ paddingTop: '120%' }} />
                    <Image
                      src={card.image}
                      alt={card.label}
                      fill
                      style={{ objectFit: 'cover', objectPosition: 'center' }}
                    />
                    <div className="audience-overlay">
                      <span
                        style={{
                          fontSize: '13px',
                          color: 'rgba(255,255,255,0.85)',
                          textAlign: 'center',
                          letterSpacing: '0.5px',
                        }}
                      >
                        Haga clic en Ver más para conocer nuestros servicios
                      </span>
                    </div>
                  </a>

                  {/* Label + button */}
                  <div
                    style={{
                      backgroundColor: '#0f3b85',
                      padding: '22px 20px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '14px',
                    }}
                  >
                    <h3
                      style={{
                        fontSize: '18px',
                        fontWeight: 800,
                        color: '#ffffff',
                        textAlign: 'center',
                        letterSpacing: '0.3px',
                      }}
                    >
                      {card.label}
                    </h3>
                    <a
                      href={card.href}
                      style={{
                        display: 'inline-block',
                        fontSize: '13px',
                        fontWeight: 800,
                        backgroundColor: '#d4a843',
                        color: '#0a2a6e',
                        borderRadius: '8px',
                        padding: '10px 28px',
                        textDecoration: 'none',
                        letterSpacing: '0.8px',
                        textTransform: 'uppercase',
                      }}
                    >
                      Ver m&aacute;s
                    </a>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION 3 — PERITOS ESPECIALIZADOS          */}
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
      {/* SECTION 4 — QUIÉNES SOMOS                   */}
      {/* ============================================ */}
      <section id="equipo" className="bg-gray-50 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <FadeLeft>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-navy-dark mb-6">
                  ¿Quiénes somos?
                </h2>
                <p className="text-gray-700 leading-relaxed mb-8 text-justify">
                  <strong>Peritus</strong> es una plataforma que conecta profesionales del derecho y clientes con peritos especializados en diversas áreas técnicas y científicas, facilitando el acceso a dictámenes periciales claros, rigurosos y con plena validez legal, y brindando soporte técnico que fortalece los procesos judiciales a través de una red de expertos que aporta análisis confiables y contribuye a la solidez de cada caso.
                </p>
              </div>
            </FadeLeft>

            <FadeRight>
              <div className="flex flex-col items-center">
                <div className="w-full max-w-md rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src="/fondo.png"
                    alt="Equipo Peritus"
                    width={500}
                    height={400}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            </FadeRight>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION 5 — BENEFICIOS                      */}
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
      {/* SECTION 6 — NUESTROS VALORES (FLIP CARDS)   */}
      {/* ============================================ */}
      <section style={{ backgroundColor: '#dce8f5', padding: '100px 0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <p
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#d4a843',
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                  marginBottom: '12px',
                }}
              >
                Lo que nos define
              </p>
              <h2
                style={{
                  fontSize: 'clamp(28px, 4vw, 38px)',
                  fontWeight: 800,
                  color: '#0a2a6e',
                }}
              >
                Nuestros valores
              </h2>
              <div
                style={{
                  width: '60px',
                  height: '4px',
                  background: 'linear-gradient(90deg, #0a2a6e, #1565c0)',
                  borderRadius: '2px',
                  margin: '20px auto 0',
                }}
              />
            </div>
          </FadeUp>

          <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {valores.map((valor) => (
              <StaggerItem key={valor.titulo}>
                <div className="value-card">
                  <div className="value-card-inner">
                    {/* Front */}
                    <div className="value-card-front">
                      <div
                        style={{
                          width: '88px',
                          height: '88px',
                          borderRadius: '50%',
                          backgroundColor: '#e8f0fb',
                          border: '2px solid #c0d4ec',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <valor.icon style={{ width: '40px', height: '40px', color: '#0a2a6e' }} />
                      </div>
                      <p style={{ fontSize: '18px', fontWeight: 800, color: '#0a2a6e', letterSpacing: '0.5px' }}>
                        {valor.titulo}
                      </p>
                      <p style={{ fontSize: '12px', color: '#0a2a6e', letterSpacing: '1px', textTransform: 'uppercase' }}>
                        Pase el cursor →
                      </p>
                    </div>

                    {/* Back */}
                    <div className="value-card-back">
                      <valor.icon style={{ width: '36px', height: '36px', color: '#7eb8f7' }} />
                      <p style={{ fontSize: '17px', fontWeight: 800, color: '#d4a843', letterSpacing: '0.5px' }}>
                        {valor.titulo}
                      </p>
                      <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.92)', lineHeight: 1.8, textAlign: 'center' }}>
                        {valor.texto}
                      </p>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION 7 — CLIENTES / MARCAS (GALERÍA)     */}
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
                  <div className="flex items-center justify-center" style={{ width: cliente.w ?? 288, height: cliente.h ?? 160 }}>
                    <Image
                      src={cliente.logo}
                      alt={cliente.nombre}
                      width={180}
                      height={100}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ============================================ */}
      {/* SECTION 8 — OPERACIÓN NACIONAL              */}
      {/* ============================================ */}
      <section className="bg-navy py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <GrowLine className="h-1 bg-gold rounded mb-12" />

          <FadeUp>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">
              Operación nacional
            </h2>
          </FadeUp>

          <div className="flex flex-col items-center text-center">
            <ScaleUp delay={0.2}>
              <div className="w-[80vw] max-w-7xl mx-auto rounded-xl overflow-hidden border border-white/10 mb-6">
                <iframe
                  src="https://maps.google.com/maps?q=Carrera+101+%2317-36,+Cali,+Colombia&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación Peritus - Carrera 101 #17-36, Cali"
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
      <footer id="contacto" className="bg-navy-dark py-12">
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

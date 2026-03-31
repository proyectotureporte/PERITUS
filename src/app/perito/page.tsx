import Image from 'next/image';
import { Phone, Mail, MapPinned, Play, Atom, Award, Wrench } from 'lucide-react';
import Header from '@/components/landing/Header';
import VideoPlayer from '@/components/landing/VideoPlayer';
import CotizacionForm from '@/components/landing/CotizacionForm';
import {
  FadeUp,
  FadeIn,
  ScaleUp,
  StaggerGrid,
  StaggerItem,
  HeroFadeUp,
  GrowLine,
} from '@/components/landing/Animations';

const faqs = [
  { label: '¿Qué es un dictamen pericial?', video: '/1.mp4' },
  { label: 'REQUISITOS',                    video: '/2.mp4' },
  { label: 'MODELO DE NEGOCIO',             video: '/3.mp4' },
];

export default function PeritoPage() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Header navLinks={[
        { href: '#inicio', label: 'Inicio' },
        { href: '#beneficios', label: 'Beneficios' },
        { href: '#preguntas', label: 'Preguntas Frecuentes' },
        { href: '#contacto', label: 'Contacto' },
      ]} />

      {/* ============================================ */}
      {/* HERO                                        */}
      {/* ============================================ */}
      <section id="inicio" className="relative min-h-screen overflow-hidden bg-navy-dark">
        {/* Image below fixed header */}
        <div className="absolute top-20 left-0 right-0 bottom-0">
          <Image
            src="/peri.jpg"
            alt="Experto perito"
            fill
            className="object-cover object-top -translate-x-[5%]"
            priority
          />
        </div>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-l from-navy-dark from-[10%] to-transparent" />

        {/* Text — right side, left-aligned */}
        <div className="relative z-10 flex items-center justify-end min-h-screen">
          <div className="px-8 sm:px-12 lg:px-20 pt-28 pb-16 w-full lg:w-[70%]">
            <HeroFadeUp delay={0.2}>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-none mb-0 whitespace-nowrap">
                Rentabilice su conocimiento técnico:
              </h1>
            </HeroFadeUp>
            <HeroFadeUp delay={0.35}>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight mb-8">
                Únase a la red de <span className="text-gold">expertos líder</span> en Colombia.
              </h1>
            </HeroFadeUp>
            <HeroFadeUp delay={0.5}>
              <h2 className="text-[1.8rem] font-bold text-white leading-none mb-0 whitespace-nowrap">
                Conviérta su trayectoria en una nueva fuente de ingresos.
              </h2>
            </HeroFadeUp>
            <HeroFadeUp delay={0.57}>
              <p className="text-[1.8rem] font-bold text-white leading-tight mb-12 whitespace-nowrap">
                Nosotros le conectamos con los clientes; usted aporta el rigor<br />científico.
              </p>
            </HeroFadeUp>
            <HeroFadeUp delay={0.65}>
              <a
                href="/registro"
                className="inline-block px-10 py-4 bg-gold text-navy-dark font-bold rounded-lg hover:opacity-90 transition-opacity text-base sm:text-lg uppercase tracking-widest"
              >
                ÚNETE
              </a>
            </HeroFadeUp>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* BENEFICIOS + STATS                          */}
      {/* ============================================ */}
      <section id="beneficios" className="bg-navy-dark py-[7.5rem]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Tarjetas */}
          <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              {
                icon: <Atom className="h-10 w-10 text-navy-dark" />,
                title: 'Flujo Constante de Casos',
                text: 'Acceso directo a solicitudes de abogados e instituciones que necesitan tu experiencia.',
              },
              {
                icon: <Award className="h-10 w-10 text-navy-dark" />,
                title: 'Prestigio y Respaldo Institucional',
                text: 'Opera bajo la marca Peritus by CNP, líder en la resolución de casos financieros y periciales.',
              },
              {
                icon: <Wrench className="h-10 w-10 text-navy-dark" />,
                title: 'Gestión Digital Centralizada',
                text: 'Infraestructura de última generación para gestionar y cotizar tus análisis.',
              },
            ].map((card) => (
              <StaggerItem key={card.title}>
                <div className="bg-white rounded-2xl shadow-lg px-8 py-[2.2rem] h-full flex flex-col gap-4">
                  {card.icon}
                  <h3 className="text-navy-dark font-bold text-lg leading-snug">{card.title}</h3>
                  <p className="text-gray-600 text-[0.86rem] font-bold leading-relaxed">{card.text}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>

          {/* Stats */}
          <FadeUp>
            <div className="flex flex-col sm:flex-row gap-10 sm:gap-16 mb-10">
              {/* Stat 1 */}
              <div className="flex-1">
                <p className="text-white font-bold text-2xl mb-2">+500 Casos Resueltos</p>
                <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-gold rounded-full animate-fill-line" />
                </div>
              </div>
              {/* Stat 2 */}
              <div className="flex-1">
                <p className="text-white font-bold text-2xl mb-2">+30 Áreas de Especialización</p>
                <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-gold rounded-full animate-fill-line" />
                </div>
                <p className="text-white/50 text-sm mt-1">(Medicina, IT, Industria, Vivienda)</p>
              </div>
            </div>
          </FadeUp>

          {/* Frase destacada */}
          <FadeUp delay={0.2}>
            <p className="text-white font-bold text-3xl sm:text-4xl leading-tight">
              Excelencia y rigor técnico en la evaluación de pruebas.
            </p>
          </FadeUp>

        </div>
      </section>

      {/* ============================================ */}
      {/* PREGUNTAS FRECUENTES                        */}
      {/* ============================================ */}
      <section id="preguntas" className="bg-blue-mid py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-12">
              Preguntas Frecuentes
            </h2>
          </FadeUp>
          <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {faqs.map((faq) => (
              <StaggerItem key={faq.label}>
                <div className="bg-navy/60 border border-white/10 rounded-xl p-5 backdrop-blur-sm">
                  <h3 className="text-white font-bold text-sm uppercase tracking-wide mb-4 text-center">
                    {faq.label}
                  </h3>
                  <VideoPlayer src={faq.video} />
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>

          <FadeUp delay={0.3}>
            <div className="flex justify-center gap-4 mt-10">
              <a
                href="/registro"
                className="inline-block px-10 py-4 bg-white text-navy-dark font-bold rounded-lg hover:bg-white/90 transition-colors text-base sm:text-lg uppercase tracking-wide"
              >
                ÚNETE A NOSOTROS
              </a>
              <a
                href="/portal/login"
                className="inline-block px-10 py-4 bg-gold text-white font-bold rounded-lg hover:opacity-90 transition-opacity text-base sm:text-lg uppercase tracking-wide"
              >
                Inicia sesión
              </a>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ============================================ */}
      {/* FORMULARIO COTIZACIÓN                       */}
      {/* ============================================ */}
      <section id="contacto" className="bg-blue-light py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-4">
              Contáctanos
            </h2>
            <p className="text-white/70 text-center mb-12 max-w-xl mx-auto">
              ¿Tienes alguna consulta? Déjanos tus datos y uno de nuestros asesores se pondrá en contacto contigo.
            </p>
          </FadeUp>
          <ScaleUp delay={0.2}>
            <div className="bg-navy/40 backdrop-blur-sm rounded-2xl p-6 sm:p-10 max-w-2xl mx-auto border border-white/10">
              <CotizacionForm />
            </div>
          </ScaleUp>
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

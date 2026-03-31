import Image from 'next/image';
import {
  Phone, Mail, MapPinned,
  Watch, Zap, Scale, Hammer,
  Heart, HardHat, Monitor, DollarSign,
} from 'lucide-react';
import Header from '@/components/landing/Header';
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

export default function AbogadoPage() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Header navLinks={[
        { href: '#inicio', label: 'Inicio' },
        { href: '#soluciones', label: 'Soluciones' },
        { href: '#contacto', label: 'Contacto' },
      ]} />

      {/* ============================================ */}
      {/* HERO                                        */}
      {/* ============================================ */}
      <section id="inicio" className="relative min-h-screen overflow-hidden bg-navy-dark">
        <div className="absolute top-20 left-0 right-0 bottom-0">
          <Image
            src="/ABOGADO.jpg"
            alt="Abogado"
            fill
            className="object-cover object-top"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-l from-navy-dark from-[10%] to-transparent" />

        <div className="relative z-10 flex items-center justify-end min-h-screen">
          <div className="pl-[15%] pr-8 sm:pr-12 lg:pr-16 pt-28 pb-16 w-full lg:w-[70%]">
            <HeroFadeUp delay={0.2}>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight mb-0">
                Encuentre al experto exacto para{' '}
                <span className="text-gold">fortalecer su teoría del caso,</span>{' '}
                a tiempo
              </h1>
            </HeroFadeUp>
            <HeroFadeUp delay={0.45}>
              <p className="text-[1.4rem] font-bold text-white/80 leading-relaxed mt-6 mb-10 max-w-2xl">
                No improvise la prueba técnica. Un dictamen mal planteado debilita el caso.
                Ofrecemos un equipo multidisciplinario que cubre todas las áreas periciales
                para respaldar cada etapa del proceso judicial.
              </p>
            </HeroFadeUp>
            <HeroFadeUp delay={0.65}>
              <a
                href="/registro"
                className="inline-block px-10 py-4 bg-gold text-white font-bold rounded-lg hover:opacity-90 transition-opacity text-base sm:text-lg uppercase tracking-widest"
              >
                ÚNETE
              </a>
            </HeroFadeUp>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* TARJETAS                                    */}
      {/* ============================================ */}
      <section id="soluciones" className="bg-navy-dark py-[7.5rem]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Tarjeta 1 — Soluciones al riesgo procesal */}
            <StaggerItem>
              <div className="bg-white rounded-2xl shadow-lg px-8 py-[2.2rem] h-full flex flex-col gap-6">
                <span className="text-xs font-bold uppercase tracking-widest text-blue-mid border border-blue-mid rounded-full px-3 py-1 w-fit">
                  Soluciones al Riesgo Procesal
                </span>

                <div className="flex gap-6 flex-1">
                  {/* Item A */}
                  <div className="flex-1 flex flex-col gap-2">
                    <p className="text-navy-dark font-black text-xl">A</p>
                    <div className="flex items-center justify-center gap-1">
                      <Watch className="h-9 w-9 text-navy-dark" />
                      <Zap className="h-5 w-5 text-gold" />
                    </div>
                    <h3 className="text-navy-dark font-bold text-lg leading-snug">
                      Velocidad y Entrega Oportuna.
                    </h3>
                    <p className="text-gray-600 text-[0.86rem] font-bold leading-relaxed text-justify">
                      Tiempos de respuesta eficientes que cumplen con los estrictos plazos procesales de cada caso.
                    </p>
                  </div>

                  <div className="w-px bg-gray-100" />

                  {/* Item B */}
                  <div className="flex-1 flex flex-col gap-2">
                    <p className="text-navy-dark font-black text-xl">B</p>
                    <div className="flex items-center justify-center gap-2">
                      <Scale className="h-9 w-9 text-navy-dark" />
                      <Hammer className="h-9 w-9 text-navy-dark" />
                    </div>
                    <h3 className="text-navy-dark font-bold text-lg leading-snug">
                      Soporte Integral.
                    </h3>
                    <p className="text-gray-600 text-[0.86rem] font-bold leading-relaxed text-justify">
                      El perito no solo entrega el documento; brinda apoyo durante todo el proceso
                      y está preparado para presentar su caso ante el tribunal.
                    </p>
                  </div>
                </div>
              </div>
            </StaggerItem>

            {/* Tarjeta 2 — Módulo Multidisciplinario */}
            <StaggerItem>
              <div className="bg-white rounded-2xl shadow-lg px-8 py-[2.2rem] h-full flex flex-col gap-6">
                <span className="text-xs font-bold uppercase tracking-widest text-blue-mid border border-blue-mid rounded-full px-3 py-1 w-fit">
                  Soluciones al Riesgo Procesal
                </span>

                <div className="flex flex-col gap-2">
                  <h3 className="text-navy-dark font-bold text-xl leading-snug">
                    Módulo Multidisciplinario
                  </h3>
                  <p className="text-navy-dark/60 text-sm font-bold uppercase tracking-wide">
                    Soporte Institucional
                  </p>
                  <p className="text-gray-600 text-[0.86rem] font-bold leading-relaxed mt-1">
                    Un equipo interdisciplinario que cubre todas las áreas periciales
                    (Medicina, Ingeniería, TI, Contabilidad) para apoyar su estrategia.
                  </p>
                </div>

                {/* Íconos de áreas */}
                <div>
                  <p className="text-navy-dark font-bold text-sm mb-3 uppercase tracking-wide">Áreas cubiertas</p>
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { icon: <Heart className="h-6 w-6" />,    label: 'Salud' },
                      { icon: <HardHat className="h-6 w-6" />,  label: 'Ingeniería' },
                      { icon: <Monitor className="h-6 w-6" />,  label: 'Informática' },
                      { icon: <DollarSign className="h-6 w-6" />, label: 'Finanzas' },
                    ].map((area) => (
                      <div key={area.label} className="flex flex-col items-center gap-1 bg-navy-dark/5 rounded-xl p-3">
                        <span className="text-navy-dark">{area.icon}</span>
                        <span className="text-[0.7rem] font-bold text-navy-dark text-center">{area.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </StaggerItem>

          </StaggerGrid>
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

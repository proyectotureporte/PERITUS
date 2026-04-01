import Image from 'next/image';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import CotizacionForm from '@/components/landing/CotizacionForm';
import {
  FadeUp,
  ScaleUp,
  StaggerGrid,
  StaggerItem,
  HeroFadeUp,
} from '@/components/landing/Animations';

export default function JuezPage() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Header navLinks={[
        { href: '#inicio', label: 'Inicio' },
        { href: '#pilares', label: 'Pilares' },
        { href: '#autoridad', label: 'Autoridad en Litigio' },
        { href: '#contacto', label: 'Contacto' },
      ]} />

      {/* ============================================ */}
      {/* HERO                                        */}
      {/* ============================================ */}
      <section id="inicio" className="relative min-h-screen overflow-hidden bg-navy-dark">
        {/* Image below fixed header */}
        <div className="absolute top-20 left-0 right-0 bottom-0">
          <Image
            src="/JUEZ.jpg"
            alt="Juez"
            fill
            className="object-cover object-top"
            priority
          />
        </div>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-l from-navy-dark from-[10%] to-transparent" />

        {/* Text — right side, left-aligned */}
        <div className="relative z-10 flex items-center justify-end min-h-screen">
          <div className="pl-[15%] pr-8 sm:pr-12 lg:pr-16 pt-28 pb-16 w-full lg:w-[70%]">
            <HeroFadeUp delay={0.2}>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
                Análisis exhaustivo con sustento técnico que{' '}
                <span className="text-gold">respalda</span> cada{' '}
                <span className="text-gold">conclusión</span>
              </h1>
            </HeroFadeUp>
            <HeroFadeUp delay={0.45}>
              <p className="text-[1.4rem] font-bold text-white/80 leading-relaxed mb-10 w-full">
                Dictámenes claros, rigurosos y con plena validez legal, elaborados por expertos certificados.
              </p>
            </HeroFadeUp>
            <HeroFadeUp delay={0.65}>
              <a
                href="#contacto"
                className="inline-block px-10 py-4 bg-gold text-white font-bold rounded-lg hover:opacity-90 transition-opacity text-base sm:text-lg uppercase tracking-widest"
              >
                SOLICITAR ORIENTACIÓN TÉCNICA
              </a>
            </HeroFadeUp>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* PILARES                                     */}
      {/* ============================================ */}
      <section id="pilares" className="bg-navy-dark py-[7.5rem]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <FadeUp>
            <h2 className="text-white font-bold text-4xl sm:text-5xl text-center mb-14">
              Pilares de Integridad y Rigor
            </h2>
          </FadeUp>

          <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-16 w-16">
                    {/* Columna central */}
                    <line x1="32" y1="10" x2="32" y2="52" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                    {/* Base */}
                    <line x1="22" y1="52" x2="42" y2="52" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                    {/* Pivot top */}
                    <circle cx="32" cy="10" r="2" fill="currentColor"/>
                    {/* Barra horizontal */}
                    <line x1="10" y1="16" x2="54" y2="16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                    {/* Cadenas izquierda */}
                    <line x1="14" y1="16" x2="11" y2="28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <line x1="18" y1="16" x2="21" y2="28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    {/* Platillo izquierdo */}
                    <path d="M8 28 h16 Q24 35 16 35 Q8 35 8 28 Z" fill="currentColor" opacity="0.15"/>
                    <path d="M8 28 h16 Q24 35 16 35 Q8 35 8 28 Z" stroke="currentColor" strokeWidth="1.8"/>
                    {/* Cadenas derecha */}
                    <line x1="46" y1="16" x2="43" y2="28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <line x1="50" y1="16" x2="53" y2="28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    {/* Platillo derecho */}
                    <path d="M40 28 h16 Q56 35 48 35 Q40 35 40 28 Z" fill="currentColor" opacity="0.15"/>
                    <path d="M40 28 h16 Q56 35 48 35 Q40 35 40 28 Z" stroke="currentColor" strokeWidth="1.8"/>
                    {/* Lupa dorada */}
                    <circle cx="47" cy="30" r="7" stroke="#d4a843" strokeWidth="2.5"/>
                    <line x1="52.5" y1="35.5" x2="57" y2="40" stroke="#d4a843" strokeWidth="2.8" strokeLinecap="round"/>
                  </svg>
                ),
                title: '100% Hechos, Cero Valoraciones Jurídicas',
                text: 'Nuestros expertos se enfocan exclusivamente en hallazgos técnicos y científicos, garantizando total independencia de las teorías jurídicas de las partes.',
              },
              {
                icon: (
                  <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-16 w-16">
                    {/* Burbuja de chat */}
                    <rect x="6" y="8" width="42" height="32" rx="6" stroke="currentColor" strokeWidth="2.2"/>
                    {/* Cola del chat */}
                    <path d="M14 40 L10 52 L24 44" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="none"/>
                    {/* Líneas de texto dentro */}
                    <line x1="14" y1="20" x2="40" y2="20" stroke="#d4a843" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="14" y1="28" x2="32" y2="28" stroke="#d4a843" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                ),
                title: 'Lenguaje Empático y Claro',
                text: 'Evitamos ambigüedades mediante una comunicación técnica pero comprensible, diseñada para facilitar la valoración de la prueba en sede judicial.',
              },
              {
                icon: (
                  <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-16 w-16">
                    {/* Documento */}
                    <path d="M12 6h24l12 12v36H12V6z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round"/>
                    {/* Doblez esquina */}
                    <path d="M36 6v12h12" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                    {/* Líneas de contenido */}
                    <line x1="20" y1="28" x2="40" y2="28" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    <line x1="20" y1="35" x2="36" y2="35" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    {/* Check */}
                    <circle cx="30" cy="47" r="8" fill="#d4a843"/>
                    <path d="M26 47 L29 50 L34 44" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ),
                title: 'Metodología Estructurada',
                text: 'Cada informe incluye identificación de idoneidad, descripción de la materia, métodos de investigación y una declaración jurada de independencia.',
              },
            ].map((card) => (
              <StaggerItem key={card.title}>
                <div className="bg-white rounded-2xl shadow-lg px-8 py-[2.2rem] h-full flex flex-col gap-4 items-center">
                  <div className="text-navy-dark [&_svg]:h-32 [&_svg]:w-32">{card.icon}</div>
                  <h3 className="text-navy-dark font-bold text-[2.25rem] leading-snug text-center">{card.title}</h3>
                  <p className="text-gray-600 text-[1.29rem] font-bold leading-relaxed text-center">{card.text}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>

        </div>
      </section>

      {/* ============================================ */}
      {/* EXPERIENCIA                                 */}
      {/* ============================================ */}
      <section id="autoridad" className="bg-blue-mid py-[7.5rem]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <h2 className="text-white font-bold text-4xl sm:text-5xl text-center mb-14">
              Autoridad en Litigio
            </h2>
          </FadeUp>
          <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: (
                  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-16 w-16">
                    {/* Edificio tribunal — columnas */}
                    <rect x="8" y="28" width="48" height="24" stroke="currentColor" strokeWidth="2.2"/>
                    {/* Techo triangular */}
                    <polygon points="4,28 32,10 60,28" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" fill="currentColor" fillOpacity="0.1"/>
                    {/* Columnas */}
                    <line x1="16" y1="28" x2="16" y2="52" stroke="currentColor" strokeWidth="2"/>
                    <line x1="25" y1="28" x2="25" y2="52" stroke="currentColor" strokeWidth="2"/>
                    <line x1="39" y1="28" x2="39" y2="52" stroke="currentColor" strokeWidth="2"/>
                    <line x1="48" y1="28" x2="48" y2="52" stroke="currentColor" strokeWidth="2"/>
                    {/* Base */}
                    <line x1="5" y1="52" x2="59" y2="52" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                    {/* Martillo dorado — encima a la derecha */}
                    {/* Cabeza del martillo */}
                    <rect x="38" y="6" width="14" height="7" rx="1.5" transform="rotate(-40 38 6)" fill="#d4a843"/>
                    {/* Mango */}
                    <line x1="44" y1="14" x2="52" y2="24" stroke="#d4a843" strokeWidth="3" strokeLinecap="round"/>
                    {/* Bloque de madera */}
                    <rect x="44" y="22" width="14" height="4" rx="1" fill="#d4a843" opacity="0.5"/>
                    <rect x="44" y="22" width="14" height="4" rx="1" stroke="#d4a843" strokeWidth="1.5"/>
                  </svg>
                ),
                title: 'Tribunales de Arbitraje',
                text: 'Amplia experiencia brindando claridad técnica en Cámaras de Comercio y escenarios procesales de alta complejidad.',
              },
              {
                icon: (
                  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-16 w-16">
                    {/* Pizarra */}
                    <rect x="4" y="6" width="40" height="28" rx="2" stroke="currentColor" strokeWidth="2.2"/>
                    <rect x="4" y="6" width="40" height="28" rx="2" fill="currentColor" fillOpacity="0.07"/>
                    {/* Soporte pizarra */}
                    <line x1="12" y1="34" x2="8" y2="42" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="36" y1="34" x2="40" y2="42" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    {/* Líneas en la pizarra */}
                    <line x1="10" y1="16" x2="38" y2="16" stroke="#d4a843" strokeWidth="1.8" strokeLinecap="round"/>
                    <line x1="10" y1="22" x2="30" y2="22" stroke="#d4a843" strokeWidth="1.8" strokeLinecap="round"/>
                    {/* Profesor */}
                    <circle cx="54" cy="14" r="4" stroke="currentColor" strokeWidth="2"/>
                    <path d="M50 22 Q54 20 58 22 L58 34 L50 34 Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="currentColor" fillOpacity="0.1"/>
                    {/* Alumnos sentados */}
                    <circle cx="10" cy="50" r="3" stroke="currentColor" strokeWidth="1.8"/>
                    <line x1="10" y1="53" x2="10" y2="60" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    <line x1="7" y1="58" x2="13" y2="58" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    <circle cx="24" cy="50" r="3" stroke="currentColor" strokeWidth="1.8"/>
                    <line x1="24" y1="53" x2="24" y2="60" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    <line x1="21" y1="58" x2="27" y2="58" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    <circle cx="38" cy="50" r="3" stroke="currentColor" strokeWidth="1.8"/>
                    <line x1="38" y1="53" x2="38" y2="60" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    <line x1="35" y1="58" x2="41" y2="58" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                ),
                title: 'Formación Judicial',
                text: 'Líderes en capacitación técnica para jueces y magistrados sobre la valoración de la prueba pericial financiera y contable.',
              },
            ].map((card) => (
              <StaggerItem key={card.title}>
                <div className="bg-white rounded-2xl shadow-lg px-8 py-[2.2rem] h-full flex flex-col gap-4 items-center">
                  <div className="text-navy-dark [&_svg]:h-32 [&_svg]:w-32">{card.icon}</div>
                  <h3 className="text-navy-dark font-bold text-[2.25rem] leading-snug text-center">{card.title}</h3>
                  <p className="text-gray-600 text-[1.29rem] font-bold leading-relaxed text-center">{card.text}</p>
                </div>
              </StaggerItem>
            ))}
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

      <Footer />
    </div>
  );
}

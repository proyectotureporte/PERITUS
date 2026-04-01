import Image from 'next/image';
import { Calculator, Database, User, Users, Building2, Briefcase, Share2, GitBranch } from 'lucide-react';
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


export default function EmpresaPage() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Header navLinks={[
        { href: '#inicio', label: 'Inicio' },
        { href: '#estrategias', label: 'Soluciones' },
        { href: '#infraestructura', label: 'Infraestructura' },
        { href: '#contacto', label: 'Contacto' },
      ]} />

      {/* ============================================ */}
      {/* HERO                                        */}
      {/* ============================================ */}
      <section id="inicio" className="relative min-h-screen overflow-hidden bg-navy-dark">
        {/* Image below fixed header */}
        <div className="absolute top-20 left-0 right-0 bottom-0">
          <Image
            src="/REUNION.jpg"
            alt="Reunión empresarial"
            fill
            className="object-cover object-top -translate-x-[5%]"
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
                Soporte técnico integral para la{' '}
                <span className="text-gold">defensa</span> de su{' '}
                <span className="text-gold">patrimonio</span>
              </h1>
            </HeroFadeUp>
            <HeroFadeUp delay={0.45}>
              <p className="text-[1.4rem] font-bold text-white/80 leading-relaxed mb-10 w-full">
                Tercerización confiable para litigios, reclamaciones y controversias.
                Peritus es la plataforma que le conecta con el perito especializado exacto,
                evitando la fricción de buscar expertos individuales.
              </p>
            </HeroFadeUp>
            <HeroFadeUp delay={0.65}>
              <a
                href="#contacto"
                className="inline-block px-10 py-4 bg-gold text-white font-bold rounded-lg hover:opacity-90 transition-opacity text-base sm:text-lg uppercase tracking-widest"
              >
                SOLICITAR EVALUACIÓN EMPRESARIAL
              </a>
            </HeroFadeUp>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* BENEFICIOS + STATS                          */}
      {/* ============================================ */}
      <section id="estrategias" className="bg-white pt-[4rem] pb-[7.5rem]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Título sección */}
          <FadeUp>
            <h2 className="text-navy-dark font-bold text-4xl sm:text-5xl mt-[4rem] mb-[4rem] text-center">Soluciones Estratégicas</h2>
          </FadeUp>

          {/* Tarjetas */}
          <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-20 w-20 text-navy-dark">
                    {/* Lupa */}
                    <circle cx="10" cy="10" r="7" />
                    <line x1="15.5" y1="15.5" x2="21" y2="21" />
                    {/* Triángulo de alerta dentro de la lupa */}
                    <path d="M10 6.5v3.5" stroke="#d4a843" strokeWidth="1.8" />
                    <circle cx="10" cy="12" r="0.6" fill="#d4a843" stroke="#d4a843" />
                    <path d="M7 13.5l3-6 3 6H7z" stroke="#d4a843" strokeWidth="1.4" />
                  </svg>
                ),
                title: 'Diagnóstico de Riesgo',
                text: 'Análisis preventivo del impacto económico de litigios complejos antes de la demanda.',
              },
              {
                icon: (
                  <div className="flex items-end gap-1">
                    <Calculator className="h-20 w-20 text-navy-dark" />
                    <Database className="h-12 w-12 text-navy-dark/60" />
                  </div>
                ),
                title: 'Cuantificación de Contingencias',
                text: 'Determinación técnica de provisiones para la protección de activos.',
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-20 w-20 text-navy-dark">
                    {/* Cabeza del martillo */}
                    <rect x="2" y="6" width="9" height="5" rx="1" transform="rotate(-45 6.5 8.5)" />
                    {/* Mango */}
                    <line x1="11" y1="13" x2="18.5" y2="20.5" strokeWidth="2.5" strokeLinecap="round" />
                    {/* Bloque de resonancia */}
                    <rect x="2" y="20" width="14" height="3" rx="0.8" fill="currentColor" opacity="0.15" />
                    <rect x="2" y="20" width="14" height="3" rx="0.8" />
                  </svg>
                ),
                title: 'Soporte en Arbitraje',
                text: 'Apoyo experto en Tribunales de Arbitramento y Cámaras de Comercio.',
              },
            ].map((card) => (
              <StaggerItem key={card.title}>
                <div className="bg-white rounded-2xl border-2 border-navy-dark px-8 py-[2.2rem] aspect-[3/4] flex flex-col items-center gap-4">
                  {card.icon}
                  <h3 className="text-navy-dark font-bold text-[2.30rem] leading-snug text-center">{card.title}</h3>
                  <p className="text-black text-[1.72rem] font-bold leading-relaxed text-center">{card.text}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>


        </div>
      </section>


      {/* ============================================ */}
      {/* INFRAESTRUCTURA                             */}
      {/* ============================================ */}
      <section id="infraestructura" className="bg-navy-dark py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <h2 className="text-white font-bold text-3xl sm:text-4xl text-center mb-16 leading-snug">
              Infraestructura robusta para grandes desafíos corporativos.
            </h2>
          </FadeUp>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

            {/* Bloque 1 — Red humana */}
            <FadeUp delay={0.1}>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-10 flex flex-col items-center gap-8">
                {/* Visualización hub-and-spoke */}
                <div className="relative w-56 h-56 flex items-center justify-center">
                  {/* Líneas de conexión */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 224 224">
                    {[0,1,2,3,4].map((i) => {
                      const angle = (i * 72 - 90) * (Math.PI / 180);
                      const x2 = 112 + 88 * Math.cos(angle);
                      const y2 = 112 + 88 * Math.sin(angle);
                      return <line key={i} x1="112" y1="112" x2={x2} y2={y2} stroke="white" strokeOpacity="0.2" strokeWidth="1.5" strokeDasharray="4 3" />;
                    })}
                  </svg>
                  {/* Icono central */}
                  <div className="relative z-10 w-16 h-16 bg-gold rounded-full flex items-center justify-center shadow-lg">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  {/* 5 iconos alrededor */}
                  {[
                    { icon: <Users className="h-5 w-5 text-navy-dark" />,    label: 'Equipos'     },
                    { icon: <Building2 className="h-5 w-5 text-navy-dark" />, label: 'Organización' },
                    { icon: <Briefcase className="h-5 w-5 text-navy-dark" />, label: 'Gestión'      },
                    { icon: <Share2 className="h-5 w-5 text-navy-dark" />,    label: 'Redes'        },
                    { icon: <GitBranch className="h-5 w-5 text-navy-dark" />, label: 'Flujos'       },
                  ].map((item, i) => {
                    const angle = (i * 72 - 90) * (Math.PI / 180);
                    const x = 50 + 39 * Math.cos(angle);
                    const y = 50 + 39 * Math.sin(angle);
                    return (
                      <div key={i} className="absolute w-12 h-12 bg-white rounded-full flex flex-col items-center justify-center shadow-md" style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%,-50%)' }}>
                        {item.icon}
                      </div>
                    );
                  })}
                </div>
                <p className="text-white font-bold text-xl text-center leading-relaxed">
                  +30 áreas técnicas (Medicina, Ingeniería, TI, Contabilidad) trabajando bajo la misma metodología.
                </p>
              </div>
            </FadeUp>

            {/* Bloque 2 — Gráfico de barras con tendencia alcista */}
            <FadeUp delay={0.2}>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-10 flex flex-col items-center gap-8">
                <svg viewBox="0 0 320 200" className="w-full max-w-sm" xmlns="http://www.w3.org/2000/svg">
                  {/* Grid lines */}
                  {[0,1,2,3,4].map(i => (
                    <line key={i} x1="30" y1={160 - i*35} x2="310" y2={160 - i*35} stroke="white" strokeOpacity="0.1" strokeWidth="1" />
                  ))}
                  {/* Barras (tendencia alcista con variación) */}
                  {[
                    { x: 45,  h: 50  },
                    { x: 85,  h: 90  },
                    { x: 125, h: 65  },
                    { x: 165, h: 110 },
                    { x: 205, h: 80  },
                    { x: 245, h: 130 },
                    { x: 285, h: 115 },
                  ].map((b, i) => (
                    <rect key={i} x={b.x - 14} y={160 - b.h} width="28" height={b.h} rx="4" fill="#d4a843" opacity="0.85" />
                  ))}
                  {/* Línea de tendencia alcista */}
                  <polyline
                    points="45,110 85,70 125,95 165,50 205,80 245,30 285,45"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Puntos en la línea */}
                  {[[45,110],[85,70],[125,95],[165,50],[205,80],[245,30],[285,45]].map(([cx,cy],i) => (
                    <circle key={i} cx={cx} cy={cy} r="4" fill="white" />
                  ))}
                  {/* Eje X */}
                  <line x1="30" y1="160" x2="310" y2="160" stroke="white" strokeOpacity="0.3" strokeWidth="1.5" />
                </svg>
                <p className="text-white font-bold text-xl text-center leading-relaxed">
                  Capacidad operativa para gestionar volúmenes masivos (ej., +1800 liquidaciones mensuales).
                </p>
              </div>
            </FadeUp>

          </div>

          {/* Tarjeta completa — Seguridad */}
          <FadeUp delay={0.3}>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-10 flex flex-row items-center gap-10 mt-10">
              {/* Escudo con candado */}
              <div className="flex-shrink-0">
                <svg viewBox="0 0 80 90" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-20 h-20">
                  {/* Escudo */}
                  <path
                    d="M40 4L8 18v24c0 20 14 36 32 44 18-8 32-24 32-44V18L40 4z"
                    fill="#d4a843"
                    fillOpacity="0.15"
                    stroke="#d4a843"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />
                  {/* Candado — cuerpo */}
                  <rect x="28" y="44" width="24" height="18" rx="3" fill="#d4a843" />
                  {/* Candado — arco */}
                  <path
                    d="M31 44v-6a9 9 0 0 1 18 0v6"
                    stroke="#d4a843"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                  />
                  {/* Ojo del candado */}
                  <circle cx="40" cy="53" r="3" fill="white" />
                  <rect x="39" y="53" width="2" height="5" rx="1" fill="white" />
                </svg>
              </div>
              {/* Texto */}
              <div className="flex flex-col gap-3">
                <h3 className="text-white font-bold text-2xl">Seguridad de nivel bancario</h3>
                <p className="text-white/70 font-bold text-lg leading-relaxed">
                  Protocolos estrictos de confidencialidad y manejo seguro de información corporativa sensible.
                  Confidencialidad absoluta en cada expediente.
                </p>
              </div>
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

      <Footer />
    </div>
  );
}

import Image from 'next/image';
import { Phone, Mail, MapPinned } from 'lucide-react';
import { GrowLine, FadeIn } from '@/components/landing/Animations';

const socials = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/profile.php?id=61573058169651',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/perituscol/',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/perituscol/',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
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
                <span>3171021253</span>
              </div>
              <div className="flex items-center gap-3 text-white/80">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span>contacto@peritus.com.co</span>
              </div>
              <div className="flex items-center gap-3 text-white/80">
                <MapPinned className="h-4 w-4 flex-shrink-0" />
                <span>Cra 101 #17-36, Cali.</span>
              </div>
            </div>

            <div className="flex items-center gap-3 md:justify-end">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                  aria-label={s.label}
                >
                  {s.icon}
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
  );
}

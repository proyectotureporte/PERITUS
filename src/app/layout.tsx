import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PERITUS - Centro Nacional de Pruebas Periciales',
  description:
    'La plataforma más confiable de Colombia para obtener dictámenes periciales profesionales. Conectamos abogados con peritos expertos certificados.',
  keywords: [
    'peritaje',
    'dictamen pericial',
    'perito',
    'abogado',
    'prueba pericial',
    'colombia',
    'legal tech',
  ],
  authors: [{ name: 'PERITUS' }],
  openGraph: {
    title: 'PERITUS - Centro Nacional de Pruebas Periciales',
    description:
      'La plataforma más confiable de Colombia para obtener dictámenes periciales profesionales.',
    type: 'website',
    locale: 'es_CO',
    siteName: 'PERITUS',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}

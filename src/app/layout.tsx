import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PERITUS - Centro Nacional de Pruebas Periciales',
  description:
    'Peritos expertos para abogados, jueces y litigantes. Conectamos profesionales con peritos altamente calificados en distintas áreas.',
  keywords: [
    'peritaje',
    'dictamen pericial',
    'perito',
    'abogado',
    'prueba pericial',
    'colombia',
  ],
  authors: [{ name: 'PERITUS' }],
  openGraph: {
    title: 'PERITUS - Centro Nacional de Pruebas Periciales',
    description:
      'Peritos expertos para abogados, jueces y litigantes.',
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
      </body>
    </html>
  );
}

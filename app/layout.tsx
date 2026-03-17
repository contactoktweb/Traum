import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Traum | Próximamente',
  description: 'Descubre la intersección entre diseño, cultura y narrativa. Algo grande se está gestando.',
  generator: 'v0.app',
  keywords: ['Traum', 'diseño', 'cultura', 'narrativa', 'gorras', 'moda urbana', 'accesorios', 'coming soon'],
  authors: [{ name: 'Traum' }],
  creator: 'Traum',
  publisher: 'Traum',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://traum.vercel.app',
    siteName: 'Traum',
    title: 'Traum | Próximamente',
    description: 'Descubre la intersección entre diseño, cultura y narrativa. Algo grande se está gestando.',
    images: [
      {
        url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-D2ZSSanp8mUfBxIIZVsBDayjRMqOt3.png',
        width: 800,
        height: 800,
        alt: 'Traum - Próximamente',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Traum | Próximamente',
    description: 'Descubre la intersección entre diseño, cultura y narrativa. Algo grande se está gestando.',
    images: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-D2ZSSanp8mUfBxIIZVsBDayjRMqOt3.png'],
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#354523',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}

import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { client } from '@/sanity/lib/client'

const geist = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
})

export async function generateMetadata(): Promise<Metadata> {
  const config = await client.fetch(`*[_type == "globalConfig"][0]{
    siteTitle,
    siteDescription,
    seoKeywords,
    "faviconUrl": favicon.asset->url,
    "ogImageUrl": ogImage.asset->url
  }`)

  const title = config?.siteTitle || 'Traum Shop'
  const description = config?.siteDescription || 'Descubre la intersección entre diseño, cultura y narrativa.'
  const keywords = config?.seoKeywords || ['Traum', 'diseño', 'cultura', 'narrativa', 'gorras', 'moda urbana']
  const ogImage = config?.ogImageUrl || 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-D2ZSSanp8mUfBxIIZVsBDayjRMqOt3.png'
  const favicon = config?.faviconUrl || '/favicon.ico'

  return {
    title,
    description,
    keywords,
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
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    icons: {
      icon: [
        {
          url: favicon,
          type: 'image/png',
        },
      ]
    },
  }
}

export const viewport: Viewport = {
  themeColor: '#354523',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

import { CartProvider } from '@/components/CartProvider'
import { CartSidebar } from "@/components/CartSidebar"
import { CustomCursor } from "@/components/CustomCursor"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${geist.variable} ${geistMono.variable} font-sans antialiased`}>
        <CartProvider>
          <CustomCursor />
          {children}
          <CartSidebar />
        </CartProvider>
        <Analytics />
      </body>
    </html>
  )
}

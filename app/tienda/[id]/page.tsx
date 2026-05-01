import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Header } from '@/components/Header'
import { AddToCartButton } from './AddToCartButton'
import { client } from "@/sanity/lib/client"
import { PRODUCT_BY_ID_QUERY, PRODUCTS_QUERY, GLOBAL_CONFIG_QUERY } from "@/sanity/lib/queries"
import { SocialLinks } from "@/components/SocialLinks"

const colors = {
  dark: "#354523",
  cream: "#EBD69F",
  leaf: "#557A2B",
  moss: "#869D3D",
  sand: "#D5B87E",
}

export async function generateStaticParams() {
  const products = await client.fetch(PRODUCTS_QUERY)
  return products.map((product: any) => ({
    id: product.id,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const product = await client.fetch(PRODUCT_BY_ID_QUERY, { id })

  if (!product) {
    return {
      title: 'Producto No Encontrado | Traum',
    }
  }

  return {
    title: `${product.name} | Tienda Oficial Traum`,
    description: product.description,
  }
}

export const dynamic = "force-dynamic"

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await client.fetch(PRODUCT_BY_ID_QUERY, { id })
  const globalConfig = await client.fetch(GLOBAL_CONFIG_QUERY)

  if (!product) {
    notFound()
  }

  return (
    <main className="min-h-screen relative bg-[#EBD69F]">
      <Header />

      {/* Background elements */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{
          backgroundImage: `radial-gradient(${colors.dark} 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Main Product Section */}
      <article className="relative z-10 pt-32 pb-24 px-6 min-h-screen flex items-center justify-center">
        <div className="max-w-7xl mx-auto w-full">
          
          {/* Breadcrumb / Back Link */}
          <div className="mb-8">
            <Link 
              href="/tienda" 
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] transition-colors hover:opacity-70"
              style={{ color: colors.dark }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Volver a la tienda
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
            {/* Gallery Section */}
            <section className="w-full lg:w-1/2 flex flex-col gap-4 sm:gap-6">
              {/* Main Image Container */}
              <div className="w-full relative aspect-square rounded-2xl overflow-hidden">
                  <Image 
                    src={product.image} 
                    alt={product.name} 
                    fill 
                    className="object-cover" 
                    priority
                  />
              </div>
              
              {/* Thumbnails Gallery */}
              {product.gallery && product.gallery.length > 0 && (
                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                  {product.gallery.map((galleryImg, idx) => (
                    <div 
                      key={idx}
                      className="relative aspect-square rounded-xl overflow-hidden cursor-pointer transition-opacity duration-300 hover:opacity-80"
                    >
                      <Image 
                        src={galleryImg} 
                        alt={`${product.name} thumbnail ${idx + 1}`} 
                        fill 
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Details Section */}
            <section className="w-full lg:w-1/2 flex flex-col justify-center lg:pl-4">
               {/* Edition Badge — minimal pill */}
               <div className="mb-8">
                  <span 
                    className="text-[10px] font-bold uppercase tracking-[0.35em] opacity-50"
                    style={{ color: colors.dark }}
                  >
                     {product.edition}
                  </span>
               </div>

               {/* Product Title */}
               <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 tracking-tight leading-[1.1]" style={{ color: colors.dark }}>
                 {product.name}
               </h1>

               {/* Thin separator */}
               <div className="w-12 h-[2px] mb-6" style={{ background: colors.moss }} />
               
               {/* Price */}
               <p className="text-xl font-semibold mb-8 tracking-wide" style={{ color: colors.dark }}>
                 $ {product.price.toLocaleString('es-MX')} <span className="text-sm font-normal opacity-50">MXN</span>
               </p>
               
               {/* Description */}
               <p className="text-base leading-[1.8] mb-10 opacity-70" style={{ color: colors.dark }}>
                 {product.description}
               </p>

               {/* Thin separator */}
               <div className="w-full h-[1px] bg-black/10 mb-8" />
               
               {/* Features */}
               <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] mb-5 opacity-40" style={{ color: colors.dark }}>
                 Detalles
               </h2>
               
               <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-10">
                 {product.features.map((feature, i) => (
                   <div key={i} className="flex items-center gap-2.5">
                     <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: colors.moss }} />
                     <span className="text-sm opacity-70" style={{ color: colors.dark }}>{feature}</span>
                   </div>
                 ))}
               </div>

               {/* Thin separator */}
               <div className="w-full h-[1px] bg-black/10 mb-8" />

               {/* Client Component for Add to Cart */}
               <AddToCartButton product={product} colors={colors} />
            </section>
          </div>
        </div>
      </article>

      {/* Global Footer Implementation with dynamic year and mandatory branding */}
      <footer className="py-12 border-t border-black/5 mx-6 md:mx-12 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-[10px] uppercase tracking-[0.3em] font-medium" style={{ color: colors.dark }}>
            © {new Date().getFullYear()} TRAUM STUDIO. ALL RIGHTS RESERVED.
          </div>
                    <SocialLinks config={globalConfig} iconColor={colors.dark} />
          <a
            href="https://www.kytcode.lat"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 text-xs font-bold transition-all duration-300 hover:opacity-70"
            style={{ color: colors.dark }}
          >
            <span>Desarrollado por K&T</span>
            <svg 
              className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </a>
        </div>
      </footer>
    </main>
  )
}

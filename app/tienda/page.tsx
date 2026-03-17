"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/Header"
import { useCart } from "@/components/CartProvider"
import { products } from "@/lib/products"

const colors = {
  dark: "#354523",
  cream: "#EBD69F",
  leaf: "#557A2B",
  moss: "#869D3D",
  sand: "#D5B87E",
}

export default function TiendaPage() {
  const { addToCart } = useCart()

  return (
    <main className="min-h-screen relative bg-[#EBD69F]"> {/* Using cream background for the store */}
      <Header />
      
      {/* Background elements */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{
          backgroundImage: `radial-gradient(${colors.dark} 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />
      
      {/* Store Header */}
      <section className="relative pt-40 pb-20 px-6 z-10">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-sm font-bold tracking-[0.4em] uppercase mb-4" style={{ color: colors.moss }}>
            Drop 01
          </h1>
          <h2 className="text-6xl md:text-8xl font-black tracking-tighter" style={{ color: colors.dark }}>
            THE ORIGIN
          </h2>
          <p className="mt-6 text-lg max-w-xl mx-auto opacity-70" style={{ color: colors.dark }}>
            Nuestra primera colección conceptual. Piezas limitadas, creadas con precisión y narrativa. Una vez agotadas, no volverán.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="relative z-10 pb-32 px-6">
        <div className="max-w-7xl mx-auto space-y-32">
          {products.map((product, index) => (
            <div 
              key={product.id}
              className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 lg:gap-24 items-center`}
            >
              {/* Image Container */}
              <Link href={`/tienda/${product.id}`} className="w-full lg:w-1/2 relative group cursor-pointer pt-6 pl-6 block">
                {/* Decorative Offset Background Frame */}
                <div 
                  className="absolute inset-x-6 inset-y-6 sm:inset-x-8 sm:inset-y-8 rounded-3xl transition-all duration-700 shadow-xl"
                  style={{ 
                    background: index % 2 === 0 
                      ? `linear-gradient(145deg, ${colors.dark}, #253118)` 
                      : `linear-gradient(145deg, #ffffff, #F5E8C7)`,
                    borderColor: index % 2 === 0 ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                    borderWidth: '1px'
                  }}
                >
                  {/* Subtle inner border within the offset frame */}
                  <div className="absolute inset-4 sm:inset-5 border rounded-2xl pointer-events-none opacity-50" 
                       style={{ borderColor: index % 2 === 0 ? 'rgba(235, 214, 159, 0.2)' : 'rgba(53, 69, 35, 0.15)' }} 
                  />
                  
                  {/* Badge (Attached to the frame) */}
                  <div className="absolute top-6 left-6 sm:top-8 sm:left-8 z-20">
                    <span 
                      className="px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.3em] rounded-full border backdrop-blur-md inline-block shadow-sm"
                      style={{ 
                        background: index % 2 === 0 ? "rgba(235, 214, 159, 0.05)" : "rgba(255, 255, 255, 0.5)",
                        borderColor: index % 2 === 0 ? "rgba(235, 214, 159, 0.2)" : "rgba(53, 69, 35, 0.15)",
                        color: index % 2 === 0 ? colors.cream : colors.dark,
                      }}
                    >
                      {product.edition}
                    </span>
                  </div>
                </div>
                
                {/* Main Image (Floats over the offset frame) */}
                <div className="relative aspect-square w-full z-10 transform -translate-x-4 -translate-y-4 sm:-translate-x-6 sm:-translate-y-6">
                  {/* Expand Icon */}
                  <div className="absolute top-12 right-2 sm:top-14 sm:right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                     <span className="p-3 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full text-white inline-flex transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                     </span>
                  </div>
                  
                  <div className="relative w-full h-full transform group-hover:scale-[1.08] transition-transform duration-[1.5s] ease-out">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain drop-shadow-[10px_20px_30px_rgba(0,0,0,0.5)] transition-all duration-[1.5s] group-hover:drop-shadow-[15px_30px_40px_rgba(0,0,0,0.6)]"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </div>
              </Link>

              {/* Product Info */}
              <div className="w-full lg:w-1/2 flex flex-col justify-center">
                <div className="mb-4">
                  <span className="text-sm font-black italic opacity-20" style={{ color: colors.dark }}>
                    0{index + 1}
                  </span>
                </div>
                
                <h3 className="text-4xl md:text-5xl font-black tracking-tight mb-4" style={{ color: colors.dark }}>
                  {product.name}
                </h3>
                
                <div className="text-2xl font-light mb-8" style={{ color: colors.leaf }}>
                  $ {product.price.toLocaleString('es-CO')} COP
                </div>
                
                <p className="text-lg leading-relaxed mb-8 opacity-80" style={{ color: colors.dark }}>
                  {product.description}
                </p>
                
                {/* Details List */}
                <ul className="mb-10 space-y-3">
                  {product.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: colors.moss }} />
                      <span className="text-sm font-medium opacity-80" style={{ color: colors.dark }}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col sm:flex-row gap-4 items-stretch mb-6">
                  {/* Details Button */}
                  <Link
                    href={`/tienda/${product.id}`}
                    className="w-full sm:w-1/3 flex items-center justify-center gap-2 rounded-full px-4 py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 hover:bg-[#354523] hover:text-[#EBD69F] border-2"
                    style={{ borderColor: colors.dark, color: colors.dark }}
                  >
                    Ver Detalles
                  </Link>
                  
                  {/* Add to Cart Button */}
                  <button
                    onClick={() => addToCart({ ...product, size: "Talla Única" })}
                    className="w-full sm:w-2/3 flex items-center justify-center gap-3 rounded-full px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    style={{ background: colors.dark, color: colors.cream }}
                  >
                    <span>Añadir al Carrito</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-black/5 mx-6 md:mx-12 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-[10px] uppercase tracking-[0.3em] font-medium" style={{ color: colors.dark }}>
            © {new Date().getFullYear()} TRAUM STUDIO. ALL RIGHTS RESERVED.
          </div>
          
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

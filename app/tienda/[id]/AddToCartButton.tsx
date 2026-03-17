'use client'

import { useCart } from "@/components/CartProvider"

interface Product {
  id: string
  name: string
  price: number
  image: string
  edition: string
  // Add other necessary properties if needed by useCart
}

interface AddToCartButtonProps {
  product: Product
  colors: {
    dark: string
    cream: string
  }
}

export function AddToCartButton({ product, colors }: AddToCartButtonProps) {
  const { addToCart } = useCart()

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={() => addToCart({ ...product, size: "Talla Única" })}
        className="group relative w-full flex items-center justify-center gap-3 rounded-2xl px-8 py-5 text-[13px] font-bold uppercase tracking-[0.25em] transition-all duration-500 hover:shadow-[0_10px_40px_rgba(53,69,35,0.35)] overflow-hidden"
        style={{ background: colors.dark, color: colors.cream }}
      >
        {/* Hover shine effect */}
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700 ease-in-out" />
        
        <span className="relative z-10">Añadir al Carrito</span>
        <svg className="relative z-10 w-[18px] h-[18px] transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      </button>
      <p className="text-center text-[10px] uppercase tracking-[0.3em] opacity-30" style={{ color: colors.dark }}>
        Talla Única · Envío Nacional
      </p>
    </div>
  )
}

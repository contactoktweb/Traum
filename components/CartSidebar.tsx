"use client"

import { useCart } from "./CartProvider"
import Image from "next/image"
import { useEffect } from "react"

const colors = {
  dark: "#354523",
  cream: "#EBD69F",
  leaf: "#557A2B",
  moss: "#869D3D",
  sand: "#D5B87E",
}

export function CartSidebar() {
  const { isCartOpen, toggleCart, cartItems, updateQuantity, removeFromCart, cartTotal } = useCart()

  // Prevent background scrolling when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => { document.body.style.overflow = "unset" }
  }, [isCartOpen])

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 z-[1010] bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleCart}
      />

      {/* Sidebar Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[500px] z-[1020] bg-[#EBD69F] transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col shadow-2xl ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 sm:p-8 border-b border-[#354523]/10">
          <h2 className="text-xl font-black uppercase tracking-widest text-[#354523]">Tu Orden</h2>
          <button 
            onClick={toggleCart}
            className="p-2 rounded-full hover:bg-[#354523]/5 transition-colors text-[#354523]"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-50 space-y-4 text-[#354523]">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p className="font-bold uppercase tracking-widest text-sm">El carrito está vacío</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={`${item.id}-${item.size}`} className="flex gap-4 p-4 rounded-2xl bg-white/40 border border-white/20 shadow-sm relative group">
                {/* Remove button */}
                <button 
                  onClick={() => removeFromCart(item.id, item.size)}
                  className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#354523] text-[#EBD69F] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                {/* Prod Image */}
                <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-white/50 border border-black/5 flex items-center justify-center p-2">
                  <Image src={item.image} alt={item.name} fill className="object-contain drop-shadow-md" />
                </div>

                {/* Prod Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-[#354523] leading-tight pr-4">{item.name}</h3>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#557A2B] mt-1">{item.edition}</p>
                    <p className="text-xs text-[#354523]/60 mt-0.5">Talla: {item.size}</p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-sm font-bold text-[#354523]">
                      $ {item.price.toLocaleString('es-CO')}
                    </p>
                    
                    {/* Quantity controls */}
                    <div className="flex items-center gap-3 bg-[#354523]/5 rounded-full px-3 py-1 border border-[#354523]/10">
                      <button 
                        onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                        className="text-[#354523] hover:opacity-50 transition-opacity"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold text-[#354523] w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                        className="text-[#354523] hover:opacity-50 transition-opacity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Checkout */}
        {cartItems.length > 0 && (
          <div className="p-6 sm:p-8 bg-[#354523] text-[#EBD69F] rounded-t-[2rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm opacity-80">
                <span>Subtotal</span>
                <span>$ {cartTotal.toLocaleString('es-CO')}</span>
              </div>
              <div className="flex justify-between text-sm opacity-80">
                <span>Envío</span>
                <span>Calculado en el checkout</span>
              </div>
              <div className="flex justify-between text-xl font-black pt-3 border-t border-[#EBD69F]/20">
                <span>Total (COP)</span>
                <span>$ {cartTotal.toLocaleString('es-CO')}</span>
              </div>
            </div>

            {/* Wompi Checkout Button */}
            <button className="w-full relative group overflow-hidden rounded-full p-[2px]">
              <span className="absolute inset-0 bg-gradient-to-r from-[#0047FF] via-[#000000] to-[#0047FF] rounded-full animate-wompi-gradient bg-[length:200%_auto]" />
              <div className="relative bg-black w-full h-full rounded-full flex items-center justify-center gap-3 px-8 py-4 transition-all duration-300 group-hover:bg-opacity-90">
                <span className="font-bold uppercase tracking-[0.2em] text-white">Pagar con</span>
                {/* Wompi Logo (Text representation for now, or SVG if available) */}
                <span className="font-black text-xl text-white tracking-widest italic" style={{ textShadow: "0 0 10px rgba(0,71,255,0.5)"}}>
                  Wompi.
                </span>
                <svg className="w-4 h-4 text-white ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </div>
            </button>
            <p className="text-center text-[10px] mt-4 opacity-50 uppercase tracking-widest flex items-center justify-center gap-2">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              Pagos seguros procesados por Bancolombia
            </p>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes wompiGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-wompi-gradient {
          animation: wompiGradient 3s linear infinite;
        }
      `}</style>
    </>
  )
}

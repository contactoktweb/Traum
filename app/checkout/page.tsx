"use client"

import { Header } from "@/components/Header"
import { useCart } from "@/components/CartProvider"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const inputClassName =
  "h-12 w-full rounded-xl border border-black/15 bg-white px-4 text-sm text-[#354523] outline-none transition focus:border-[#354523]"

function CheckoutFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="py-12 border-t border-black/5 mx-6 md:mx-12 relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-[10px] uppercase tracking-[0.3em] font-medium text-[#354523]">
          {`© ${currentYear} TRAUM STUDIO. ALL RIGHTS RESERVED.`}
        </div>
        <a
          href="https://www.kytcode.lat"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 text-xs font-bold transition-all duration-300 hover:opacity-70 text-[#354523]"
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
  )
}

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    setTimeout(() => {
      clearCart()
      router.push("/gracias")
    }, 1400)
  }

  if (!mounted) return null

  if (cartItems.length === 0) {
    return (
      <>
        <Header />
        <main className="min-h-[72vh] px-6 md:px-12 pt-36 pb-10">
          <div className="mx-auto flex max-w-xl flex-col items-center rounded-3xl border border-black/10 bg-white p-10 text-center shadow-[0_20px_80px_-35px_rgba(0,0,0,0.35)]">
            <p className="mb-3 rounded-full border border-black/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-[#354523]/70">
              Checkout
            </p>
            <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-[#354523]">Tu carrito esta vacio</h1>
            <p className="mb-8 max-w-md text-sm text-[#354523]/70">
              No encontramos productos para finalizar el pago. Regresa a la tienda y selecciona las prendas que deseas comprar.
            </p>
            <button
              onClick={() => router.push("/tienda")}
              className="h-12 rounded-xl bg-[#354523] px-8 text-xs font-bold uppercase tracking-[0.2em] text-[#EBD69F] hover:opacity-90"
            >
              Explorar Tienda
            </button>
          </div>
        </main>
        <CheckoutFooter />
      </>
    )
  }

  return (
    <>
      <Header />

      <main className="min-h-screen pt-32 pb-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-3 inline-flex rounded-full border border-black/15 bg-white px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#354523]/70">
                Pago Seguro
              </p>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#354523]">Finalizar Pedido</h1>
              <p className="mt-3 max-w-2xl text-sm md:text-base text-[#354523]/75">
                Completa tus datos y confirma tu compra. Proceso rapido, claro y protegido.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-2xl border border-black/15 bg-white px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#354523]/70">
              <span className="rounded-full bg-[#354523] px-2 py-1 text-[10px] text-[#EBD69F]">
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
              Productos
            </div>
          </div>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.35fr_0.9fr]">
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
              <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="mb-6 flex items-center gap-3 border-b border-black/10 pb-4 text-xl font-bold text-[#354523]">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#354523] text-xs font-semibold text-[#EBD69F]">
                    1
                  </span>
                  Informacion de Contacto
                </h2>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-[0.15em] text-[#354523]/70">Nombre</label>
                    <input required name="firstName" type="text" className={inputClassName} placeholder="Juan" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-[0.15em] text-[#354523]/70">Apellidos</label>
                    <input required name="lastName" type="text" className={inputClassName} placeholder="Perez" />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.15em] text-[#354523]/70">Correo Electronico</label>
                    <input required name="email" type="email" className={inputClassName} placeholder="juan@email.com" />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.15em] text-[#354523]/70">Telefono Movil</label>
                    <input required name="phone" type="tel" className={inputClassName} placeholder="+57 300 000 0000" />
                  </div>
                </div>
              </section>

              <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="mb-6 flex items-center gap-3 border-b border-black/10 pb-4 text-xl font-bold text-[#354523]">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#354523] text-xs font-semibold text-[#EBD69F]">
                    2
                  </span>
                  Direccion de Envio
                </h2>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.15em] text-[#354523]/70">Direccion</label>
                    <input required name="address" type="text" className={inputClassName} placeholder="Calle 123 #45-67, Apto 101" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-[0.15em] text-[#354523]/70">Ciudad</label>
                    <input required name="city" type="text" className={inputClassName} placeholder="Bogota" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-[0.15em] text-[#354523]/70">Departamento</label>
                    <input required name="department" type="text" className={inputClassName} placeholder="Cundinamarca" />
                  </div>
                </div>
              </section>

              <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="mb-6 flex items-center gap-3 border-b border-black/10 pb-4 text-xl font-bold text-[#354523]">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#354523] text-xs font-semibold text-[#EBD69F]">
                    3
                  </span>
                  Metodo de Pago
                </h2>

                <div className="rounded-2xl border-2 border-[#354523] bg-[#EBD69F]/15 p-4 sm:p-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#354523]">
                      <div className="h-2.5 w-2.5 rounded-full bg-[#EBD69F]"></div>
                    </div>
                    <div>
                      <h3 className="text-[15px] font-bold text-[#354523]">PayPal (Modo Prueba)</h3>
                      <p className="mt-1 text-xs text-[#354523]/70">Simulacion de pago para pruebas, no se realiza ningun cobro real.</p>
                    </div>
                  </div>
                </div>
              </section>
            </form>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="mb-6 border-b border-black/10 pb-4 text-xl font-bold text-[#354523]">Resumen de Compra</h2>

                <div className="mb-8 max-h-[46vh] space-y-4 overflow-y-auto pr-1">
                  {cartItems.map((item) => (
                    <div key={`${item.id}-${item.size}`} className="group flex items-center gap-4 rounded-2xl border border-transparent p-1 transition-colors hover:border-black/10">
                      <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-black/10 bg-white">
                        {item.image && (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="64px"
                          />
                        )}
                        <span className="absolute right-1 top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#354523] px-1 text-[10px] font-bold text-[#EBD69F]">
                          {item.quantity}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="truncate text-sm font-bold text-[#354523]">{item.name}</h4>
                        <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#354523]/60">
                          Talla: {item.size || "Unica"}
                        </p>
                      </div>

                      <div className="text-sm font-bold text-[#354523]">
                        ${(item.price * item.quantity).toLocaleString("es-CO")}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 border-t border-black/10 pt-4">
                  <div className="flex justify-between text-sm text-[#354523]/70">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#354523]">${cartTotal.toLocaleString("es-CO")}</span>
                  </div>
                  <div className="flex justify-between text-sm text-[#354523]/70">
                    <span>Envio</span>
                    <span className="font-semibold text-[#557A2B]">Gratis</span>
                  </div>
                  <div className="mt-2 flex justify-between border-t border-black/10 pt-4 text-xl font-black text-[#354523]">
                    <span>Total</span>
                    <span>${cartTotal.toLocaleString("es-CO")}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  form="checkout-form"
                  className={`mt-8 h-14 w-full rounded-2xl text-sm font-extrabold uppercase tracking-[0.2em] transition-all ${
                    isSubmitting
                      ? "cursor-not-allowed bg-black/35 text-white"
                      : "bg-[#354523] text-[#EBD69F] hover:opacity-90"
                  }`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                      </svg>
                      Procesando...
                    </span>
                  ) : (
                    "Finalizar Pedido"
                  )}
                </button>

                <p className="mt-5 flex items-center justify-center gap-2 border-t border-dashed border-black/10 pt-4 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-[#354523]/55">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0110 0v4"></path>
                  </svg>
                  Seguridad Garantizada 
                </p>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <CheckoutFooter />
    </>
  )
}

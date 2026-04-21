"use client"

import { Header } from "@/components/Header"
import { useCart } from "@/components/CartProvider"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"

const inputClassName =
  "h-12 w-full rounded-xl border border-black/15 bg-white px-4 text-sm text-[#354523] outline-none transition focus:border-[#354523]"

/** Estados del flujo de checkout */
type CheckoutStep = "form" | "payment" | "processing" | "success" | "error"

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
  const [step, setStep] = useState<CheckoutStep>("form")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [brickReady, setBrickReady] = useState(false)
  const brickControllerRef = useRef<any>(null)
  const brickMountedRef = useRef(false)

  // Form state
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("+52 ")
  const [address, setAddress] = useState("")
  const [numExt, setNumExt] = useState("")
  const [numInt, setNumInt] = useState("")
  const [colonia, setColonia] = useState("")
  const [city, setCity] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [department, setDepartment] = useState("")
  const [notes, setNotes] = useState("")

  useEffect(() => {
    setMounted(true)
  }, [])

  /** Inicializa el Payment Brick de MercadoPago embebido */
  const initPaymentBrick = useCallback(async () => {
    // Evitar montaje duplicado
    if (brickMountedRef.current) return
    brickMountedRef.current = true

    // Espera breve para asegurar que el contenedor exista en el DOM
    await new Promise((resolve) => setTimeout(resolve, 200))

    const container = document.getElementById("paymentBrick_container")
    if (!container) {
      brickMountedRef.current = false
      return
    }

    if (!(window as any).MercadoPago) {
      setErrorMsg("Error: SDK de Mercado Pago no cargado. Recarga la página.")
      brickMountedRef.current = false
      return
    }

    try {
      const mp = new (window as any).MercadoPago(
        process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY,
        { locale: "es-MX" }
      )
      const bricksBuilder = mp.bricks()

      const controller = await bricksBuilder.create("payment", "paymentBrick_container", {
        initialization: {
          amount: cartTotal,
          payer: {
            email: email,
            firstName: firstName,
            lastName: lastName,
          },
        },
        customization: {
          visual: {
            style: {
              theme: "default",
              customVariables: {
                formBackgroundColor: "#ffffff",
                baseColor: "#354523",
              },
            },
            hideFormTitle: true,
            hidePaymentButton: false,
          },
          paymentMethods: {
            creditCard: "all",
            debitCard: "all",
            ticket: "all",
          },
        },
        callbacks: {
          onReady: () => {
            setBrickReady(true)
          },
          onSubmit: async ({ selectedPaymentMethod, formData }: any) => {
            setStep("processing")
            setErrorMsg(null)

            try {
              const res = await fetch("/api/process-payment", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "X-Idempotency-Key": crypto.randomUUID(),
                },
                body: JSON.stringify({
                  formData,
                  orderData: {
                    customer: {
                      firstName,
                      lastName,
                      email,
                      phone,
                    },
                    shippingAddress: {
                      street: address,
                      numExt,
                      numInt,
                      colonia,
                      city,
                      postalCode,
                      state: department,
                    },
                    items: cartItems.map((item) => ({
                      id: item.id,
                      name: item.name,
                      price: item.price,
                      quantity: item.quantity,
                      size: item.size,
                      image: item.image,
                    })),
                    subtotal: cartTotal,
                    total: cartTotal,
                    notes: notes,
                  },
                }),
              })

              const data = await res.json()

              if (!res.ok) {
                console.error("Error al procesar pago:", data)
                setErrorMsg(data.error || "No se pudo procesar el pago.")
                setStep("payment")
                return
              }

              // Manejar resultado del pago
              if (data.status === "approved") {
                clearCart()
                router.push(`/compra-exitosa?status=approved&payment_id=${data.id}`)
              } else if (data.status === "in_process" || data.status === "pending") {
                router.push(`/compra-exitosa?status=pending&payment_id=${data.id}`)
              } else {
                setErrorMsg(
                  `El pago fue rechazado (${data.status_detail || data.status}). Intenta con otro método de pago.`
                )
                setStep("payment")
              }
            } catch (err) {
              console.error("Error de conexión:", err)
              setErrorMsg("Error de conexión. Intenta nuevamente.")
              setStep("payment")
            }
          },
          onError: (error: any) => {
            // Solo mostrar errores críticos al usuario, ignorar non_critical
            if (error?.type === "non_critical") {
              console.warn("Brick non-critical:", error.message)
              return
            }
            console.error("Brick Error:", error)
            setErrorMsg("Error al cargar el formulario de pago. Recarga la página.")
          },
        },
      })

      brickControllerRef.current = controller
    } catch (err) {
      console.error("Error creando brick:", err)
      setErrorMsg("No se pudo inicializar el formulario de pago.")
      brickMountedRef.current = false
    }
  }, [
    cartTotal,
    cartItems,
    firstName,
    lastName,
    email,
    phone,
    address,
    numExt,
    numInt,
    colonia,
    city,
    postalCode,
    department,
    notes,
    clearCart,
    router,
  ])

  /** Valida y avanza del formulario de datos al formulario de pago embebido */
  const handleContinueToPayment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMsg(null)
    setStep("payment")

    // Destruir brick anterior si existe
    if (brickControllerRef.current) {
      try {
        brickControllerRef.current.unmount()
      } catch {
        // ignore
      }
      brickControllerRef.current = null
      brickMountedRef.current = false
    }

    setBrickReady(false)

    // Inicializar el brick después de que el DOM se actualice
    requestAnimationFrame(() => {
      initPaymentBrick()
    })
  }

  /** Volver al formulario de datos */
  const handleBackToForm = () => {
    if (brickControllerRef.current) {
      try {
        brickControllerRef.current.unmount()
      } catch {
        // ignore
      }
      brickControllerRef.current = null
      brickMountedRef.current = false
    }
    setBrickReady(false)
    setStep("form")
    setErrorMsg(null)
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
            <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-[#354523]">Tu carrito está vacío</h1>
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
                {step === "form"
                  ? "Completa tus datos de contacto y envío para continuar al pago."
                  : "Completa los datos de tu tarjeta o elige tu método de pago preferido."}
              </p>
            </div>

            {/* Indicador de pasos */}
            <div className="flex items-center gap-3">
              <div
                className={`flex items-center gap-2 rounded-2xl border px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] transition-all duration-300 ${
                  step === "form"
                    ? "border-[#354523] bg-[#354523] text-[#EBD69F]"
                    : "border-black/15 bg-white text-[#354523]/70"
                }`}
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-current/10 text-[10px]">
                  {step !== "form" ? "✓" : "1"}
                </span>
                Datos
              </div>
              <div className="h-px w-4 bg-black/20" />
              <div
                className={`flex items-center gap-2 rounded-2xl border px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] transition-all duration-300 ${
                  step === "payment" || step === "processing"
                    ? "border-[#354523] bg-[#354523] text-[#EBD69F]"
                    : "border-black/15 bg-white text-[#354523]/40"
                }`}
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-current/10 text-[10px]">
                  2
                </span>
                Pago
              </div>
            </div>
          </div>

          {/* Error message */}
          {errorMsg && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700 animate-in fade-in slide-in-from-top-2">
              ⚠️ {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.35fr_0.9fr]">
            {/* Columna izquierda: formulario o brick de pago */}
            <div className="space-y-6">
              {/* PASO 1: Formulario de contacto y dirección */}
              {step === "form" && (
                <form id="checkout-form" onSubmit={handleContinueToPayment} className="space-y-6">
                  {/* Sección 1: Contacto */}
                  <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
                    <h2 className="mb-6 flex items-center gap-3 border-b border-black/10 pb-4 text-xl font-bold text-[#354523]">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#354523] text-xs font-semibold text-[#EBD69F]">
                        1
                      </span>
                      Información de Contacto
                    </h2>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <label htmlFor="firstName" className="text-xs font-semibold uppercase tracking-[0.15em] text-[#354523]/70">Nombre</label>
                        <input
                          id="firstName"
                          required
                          name="firstName"
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className={inputClassName}
                          placeholder="Juan"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="lastName" className="text-xs font-semibold uppercase tracking-[0.15em] text-[#354523]/70">Apellidos</label>
                        <input
                          id="lastName"
                          required
                          name="lastName"
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className={inputClassName}
                          placeholder="Pérez"
                        />
                      </div>

                      <div className="space-y-1.5 sm:col-span-2">
                        <label htmlFor="email" className="text-xs font-semibold uppercase tracking-[0.15em] text-[#354523]/70">Correo Electrónico</label>
                        <input
                          id="email"
                          required
                          name="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className={inputClassName}
                          placeholder="juan@email.com"
                        />
                      </div>

                      <div className="space-y-1.5 sm:col-span-2">
                        <label htmlFor="phone" className="text-xs font-semibold uppercase tracking-[0.15em] text-[#354523]/70">Teléfono Móvil</label>
                        <input
                          id="phone"
                          required
                          name="phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => {
                            let val = e.target.value;
                            if (!val.startsWith("+52 ")) {
                              if (val.length < 4) val = "+52 ";
                              else if (val.startsWith("+52")) val = "+52 " + val.slice(3).trimStart();
                              else val = "+52 " + val.replace(/^\+?52?\s*/, "");
                            }
                            setPhone(val);
                          }}
                          className={inputClassName}
                          placeholder="+52 55 0000 0000"
                        />
                      </div>
                    </div>
                  </section>

                  {/* Sección 2: Dirección */}
                  <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
                    <h2 className="mb-6 flex items-center gap-3 border-b border-black/10 pb-4 text-xl font-bold text-[#354523]">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#354523] text-xs font-semibold text-[#EBD69F]">
                        2
                      </span>
                      Dirección de Envío
                    </h2>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div className="space-y-1.5 sm:col-span-2">
                        <label htmlFor="address" className="text-xs font-semibold uppercase tracking-[0.15em] text-[#354523]/70">Calle</label>
                        <input
                          id="address"
                          required
                          name="address"
                          type="text"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className={inputClassName}
                          placeholder="Av. Insurgentes Sur"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="numExt" className="text-xs font-semibold uppercase tracking-[0.15em] text-[#354523]/70">Número Exterior</label>
                        <input
                          id="numExt"
                          required
                          name="numExt"
                          type="text"
                          value={numExt}
                          onChange={(e) => setNumExt(e.target.value)}
                          className={inputClassName}
                          placeholder="123"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="numInt" className="text-xs font-semibold uppercase tracking-[0.15em] text-[#354523]/70">
                          Número Interior <span className="normal-case font-normal opacity-60">(opcional)</span>
                        </label>
                        <input
                          id="numInt"
                          name="numInt"
                          type="text"
                          value={numInt}
                          onChange={(e) => setNumInt(e.target.value)}
                          className={inputClassName}
                          placeholder="Depto. 4B"
                        />
                      </div>

                      <div className="space-y-1.5 sm:col-span-2">
                        <label htmlFor="colonia" className="text-xs font-semibold uppercase tracking-[0.15em] text-[#354523]/70">Colonia</label>
                        <input
                          id="colonia"
                          required
                          name="colonia"
                          type="text"
                          value={colonia}
                          onChange={(e) => setColonia(e.target.value)}
                          className={inputClassName}
                          placeholder="Del Valle"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="city" className="text-xs font-semibold uppercase tracking-[0.15em] text-[#354523]/70">Ciudad</label>
                        <input
                          id="city"
                          required
                          name="city"
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className={inputClassName}
                          placeholder="Ciudad de México"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="postalCode" className="text-xs font-semibold uppercase tracking-[0.15em] text-[#354523]/70">Código Postal</label>
                        <input
                          id="postalCode"
                          required
                          name="postalCode"
                          type="text"
                          inputMode="numeric"
                          maxLength={5}
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                          className={inputClassName}
                          placeholder="03100"
                        />
                      </div>

                      <div className="space-y-1.5 sm:col-span-2">
                        <label htmlFor="department" className="text-xs font-semibold uppercase tracking-[0.15em] text-[#354523]/70">Estado</label>
                        <input
                          id="department"
                          required
                          name="department"
                          type="text"
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                          className={inputClassName}
                          placeholder="Ciudad de México"
                        />
                      </div>
                      
                      <div className="space-y-1.5 sm:col-span-2 mt-2">
                        <label htmlFor="notes" className="text-xs font-semibold uppercase tracking-[0.15em] text-[#354523]/70">
                          Notas de interés <span className="normal-case font-normal opacity-60">(opcional)</span>
                        </label>
                        <textarea
                          id="notes"
                          name="notes"
                          rows={3}
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="w-full rounded-xl border border-black/15 bg-white p-4 text-sm text-[#354523] outline-none transition focus:border-[#354523] resize-none"
                          placeholder="Ej. Dejar el paquete en la recepción, portón color negro..."
                        />
                      </div>
                    </div>
                  </section>
                </form>
              )}

              {/* PASO 2: Payment Brick embebido */}
              {(step === "payment" || step === "processing") && (
                <section className="space-y-4">
                  {/* Botón volver */}
                  <button
                    type="button"
                    onClick={handleBackToForm}
                    className="flex items-center gap-2 text-sm font-semibold text-[#354523]/70 transition-colors hover:text-[#354523]"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 12H5" />
                      <path d="M12 19l-7-7 7-7" />
                    </svg>
                    Editar datos de contacto
                  </button>

                  {/* Resumen de datos del cliente */}
                  <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
                    <h2 className="mb-4 flex items-center gap-3 border-b border-black/10 pb-4 text-lg font-bold text-[#354523]">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                      Datos confirmados
                    </h2>
                    <div className="grid grid-cols-1 gap-3 text-sm text-[#354523]/80 sm:grid-cols-2">
                      <div>
                        <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#354523]/50">Nombre</span>
                        <p className="font-medium text-[#354523]">{firstName} {lastName}</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#354523]/50">Email</span>
                        <p className="font-medium text-[#354523]">{email}</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#354523]/50">Teléfono</span>
                        <p className="font-medium text-[#354523]">{phone}</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#354523]/50">Ciudad</span>
                        <p className="font-medium text-[#354523]">{city}, {department}</p>
                      </div>
                    </div>
                  </div>

                  {/* Contenedor del Payment Brick (aquí se pide la tarjeta) */}
                  <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
                    <h2 className="mb-6 flex items-center gap-3 border-b border-black/10 pb-4 text-xl font-bold text-[#354523]">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#354523] text-xs font-semibold text-[#EBD69F]">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                          <line x1="1" y1="10" x2="23" y2="10" />
                        </svg>
                      </span>
                      Método de Pago
                    </h2>

                    {/* Loader mientras carga el brick */}
                    {!brickReady && (
                      <div className="flex flex-col items-center justify-center py-12 gap-4">
                        <div className="relative h-10 w-10">
                          <div className="absolute inset-0 rounded-full border-2 border-[#354523]/20" />
                          <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-[#354523]" />
                        </div>
                        <p className="text-sm font-medium text-[#354523]/60 animate-pulse">
                          Cargando formulario de pago...
                        </p>
                      </div>
                    )}

                    {/* Payment Brick se renderiza aquí */}
                    <div
                      id="paymentBrick_container"
                      className={`transition-opacity duration-500 ${brickReady ? "opacity-100" : "opacity-0"}`}
                    />

                    <p className="mt-4 flex items-center gap-2 text-[11px] text-[#354523]/55 font-medium">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0110 0v4"></path>
                      </svg>
                      Tu pago es 100% seguro. Los datos de tu tarjeta son procesados directamente por MercadoPago.
                    </p>
                  </div>

                  {/* Overlay de procesamiento */}
                  {step === "processing" && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                      <div className="flex flex-col items-center gap-6 rounded-3xl bg-white p-10 shadow-2xl">
                        <div className="relative h-14 w-14">
                          <div className="absolute inset-0 rounded-full border-3 border-[#354523]/20" />
                          <div className="absolute inset-0 animate-spin rounded-full border-3 border-transparent border-t-[#354523]" />
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-[#354523]">Procesando tu pago...</p>
                          <p className="mt-1 text-sm text-[#354523]/60">No cierres esta página</p>
                        </div>
                      </div>
                    </div>
                  )}
                </section>
              )}
            </div>

            {/* Sidebar – Resumen de compra */}
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
                        <h3 className="truncate text-sm font-bold text-[#354523]">{item.name}</h3>
                        <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#354523]/60">
                          Talla: {item.size || "Única"}
                        </p>
                      </div>

                      <div className="text-sm font-bold text-[#354523]">
                        ${(item.price * item.quantity).toLocaleString("es-MX")}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 border-t border-black/10 pt-4">
                  <div className="flex justify-between text-sm text-[#354523]/70">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#354523]">${cartTotal.toLocaleString("es-MX")}</span>
                  </div>
                  <div className="flex justify-between text-sm text-[#354523]/70">
                    <span>Envío</span>
                    <span className="font-semibold text-[#557A2B]">Gratis</span>
                  </div>
                  <div className="mt-2 flex justify-between border-t border-black/10 pt-4 text-xl font-black text-[#354523]">
                    <span>Total</span>
                    <span>${cartTotal.toLocaleString("es-MX")}</span>
                  </div>
                </div>

                {/* Botón solo visible en paso 1 (datos) */}
                {step === "form" && (
                  <button
                    type="submit"
                    form="checkout-form"
                    className="mt-8 h-14 w-full rounded-2xl bg-[#354523] text-sm font-extrabold uppercase tracking-[0.2em] text-[#EBD69F] transition-all hover:bg-[#2a3718] active:scale-[0.98]"
                  >
                    <span className="flex items-center justify-center gap-2">
                      Continuar al Pago
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14" />
                        <path d="M12 5l7 7-7 7" />
                      </svg>
                    </span>
                  </button>
                )}

                {/* Mensaje de seguridad en paso 2 */}
                {(step === "payment" || step === "processing") && (
                  <div className="mt-6 rounded-2xl border border-[#009EE3]/20 bg-[#009EE3]/5 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg">
                        <Image
                          src="/mercadopago.jpg"
                          alt="Pagos procesados por MercadoPago"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <p className="text-[11px] font-medium text-[#354523]/70">
                        Pago procesado de forma segura por <strong className="text-[#009EE3]">MercadoPago</strong>
                      </p>
                    </div>
                  </div>
                )}

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

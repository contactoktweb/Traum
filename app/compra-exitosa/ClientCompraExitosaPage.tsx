"use client"


import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/Header"
import { SocialLinks } from "@/components/SocialLinks"
import { getOptimizedSanityImage } from "@/sanity/lib/image-optimized"

const colors = {
  dark: "#354523",
  cream: "#EBD69F",
  leaf: "#557A2B",
  moss: "#869D3D",
  sand: "#D5B87E",
}

/** Mapeo de status de MercadoPago a contenido UI */
const PAYMENT_STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  approved: {
    label: "✅ ¡Pago aprobado! Tu pedido está en camino.",
    color: "#2d6a4f",
    bg: "#d8f3dc",
  },
  pending: {
    label: "⏳ Pago pendiente. Te avisaremos cuando se confirme.",
    color: "#7b4f12",
    bg: "#fef9c3",
  },
  failure: {
    label: "❌ El pago no se completó. Puedes intentarlo de nuevo.",
    color: "#7f1d1d",
    bg: "#fee2e2",
  },
}

export default function ClientCompraExitosaPage() {
  const searchParams = useSearchParams()
  const paymentStatus = searchParams.get("status") || "approved"
  const statusConfig = PAYMENT_STATUS_CONFIG[paymentStatus] ?? PAYMENT_STATUS_CONFIG["approved"]

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [currentYear, setCurrentYear] = useState("")
  const [isLoaded, setIsLoaded] = useState(false)
  const [orderItems, setOrderItems] = useState<any[]>([])

  // Limpiamos el carrito aquí, después de que MercadoPago redirige de vuelta
  useEffect(() => {
    if (paymentStatus === "approved") {
      try {
        const savedCart = localStorage.getItem("traum_cart")
        if (savedCart) {
          setOrderItems(JSON.parse(savedCart))
        }
        localStorage.removeItem("traum_cart")
      } catch {
        // no critical
      }
    }
  }, [paymentStatus])

  useEffect(() => {
    setCurrentYear(new Date().getFullYear().toString())
    setIsLoaded(true)
    
    const onMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY })
    window.addEventListener("mousemove", onMove, { passive: true })
    
    return () => {
      window.removeEventListener("mousemove", onMove)
    }
  }, [])

  // Imágenes de fondo estáticas (expandir en el futuro con datos de Sanity si se requiere)
  const desktopBg = '/fondo-acabado.png';
  const mobileBg = '/fondo-acabado-mobile.png';

  return (
    <main className="relative h-[100dvh] w-screen overflow-hidden bg-[#FAF6EE]">
      <style dangerouslySetInnerHTML={{ __html: `
        .gracias-bg-dynamic {
           background-image: url('${mobileBg}');
        }
        @media (min-width: 768px) {
           .gracias-bg-dynamic {
             background-image: url('${desktopBg}');
           }
        }
        

        .gracias-letter {
            font-family: 'Chewy', cursive;
            font-size: clamp(6rem, 18vw, 16rem);
            color: #ffb72b;
            line-height: 1.1;
            letter-spacing: 2px;
            padding-bottom: 0.5rem;
            text-shadow: 
                1px 1px 0px #fac14d,
                2px 2px 0px #d68710,
                3px 3px 0px #d68710,
                4px 4px 0px #d68710,
                5px 5px 0px #995c00,
                6px 6px 0px #995c00,
                7px 7px 0px #995c00,
                8px 8px 0px #995c00,
                12px 12px 15px rgba(0,0,0,0.3);
            display: inline-block;
            transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .gracias-letter:hover {
            transform: scale(1.1) rotate(4deg) !important;
        }

        .gracias-text {
            font-family: 'Chewy', cursive;
        }

        .tape-banner {
        margin-bottom: 0px !important;
            background-color: #e6dfcd;
            padding: 8px 30px;
            font-family: 'Chewy', cursive;
            font-size: 1.1rem;
            font-weight: normal;
            letter-spacing: 6px;
            text-indent: 6px;
            color: #37412a;
            position: relative;
            box-shadow: 2px 4px 8px rgba(0,0,0,0.08);
            clip-path: polygon(1% 0%, 99% 2%, 100% 100%, 0% 98%);
            transform: rotate(-2deg);
            animation: floatTape 4s ease-in-out infinite;
        }
  @media (max-width: 640px) {
    .tape-banner {
      font-size: 0.85rem;
      padding: 6px 20px;
      letter-spacing: 4px;
      text-indent: 4px;
    }
  }

        
        @keyframes floatTape {
            0%, 100% { transform: rotate(-2deg) translateY(0); }
            50% { transform: rotate(-1deg) translateY(-5px); }
        }

        .tape-banner::before, .tape-banner::after {
            content: '•';
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            font-size: 1.2rem;
            color: rgba(0,0,0,0.15);
        }
        .tape-banner::before { left: 8px; }
        .tape-banner::after { right: 8px; }

        @keyframes jumpLetter {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-15px); }
        }
      `}} />
      <Header />
      {/* Cursor */}
      <div
        className="fixed pointer-events-none z-[100] rounded-full mix-blend-difference hidden md:block"
        style={{
          left: mousePos.x,
          top: mousePos.y,
          width: 12,
          height: 12,
          transform: "translate(-50%, -50%)",
          background: colors.cream,
          transition: "width 0.25s, height 0.25s",
        }}
      />

      {/* Hero */}
      <section
        className="gracias-bg-dynamic relative h-[100dvh] w-full flex items-center justify-center overflow-hidden bg-[position:bottom_center] md:bg-[position:center]"
        style={{
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Main content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-12 flex flex-col items-center text-center pb-8 md:pb-16 ">
          {/* Eyebrow */}
          <div
            className="flex w-full items-center justify-center flex-col gap-3 mb-4 md:mb-10"
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.6s ease-out 0.2s",
            }}
          >
            <div className="tape-banner">
              COMPRA EXITOSA
            </div>
            {/* Banner de estado de pago MercadoPago */}
            <div
              style={{
                background: statusConfig.bg,
                color: statusConfig.color,
                borderRadius: "1rem",
                padding: "10px 24px",
                fontFamily: "'Chewy', cursive",
                fontSize: "1rem",
                letterSpacing: "2px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                border: `1.5px solid ${statusConfig.color}30`,
              }}
            >
              {statusConfig.label}
            </div>
          </div>

          {/* Main content */}
          <div className="flex flex-col items-center gap-y-0 md:gap-y-4 w-full">
            {/* Main title */}
            <h1 className="overflow-visible shrink-0 flex justify-center w-full flex-wrap gap-x-2 md:gap-x-4 py-0 md:py-4">
              {("GRACIAS").split("").map((char: string, i: number) => (
                <span
                  key={i}
                  className="gracias-letter drop-shadow-xl"
                  style={{
                    animation: isLoaded ? `jumpLetter 4s ease-in-out infinite ${i * 0.15}s` : 'none',
                    opacity: isLoaded ? 1 : 0,
                  }}
                >
                  {char}
                </span>
              ))}
            </h1>

            {/* Subtitle */}
            <div 
              className="gracias-text text-lg md:text-2xl lg:text-3xl font-normal mt-2 md:mt-4 max-w-2xl text-center"
              style={{
                opacity: isLoaded ? 1 : 0,
                transform: isLoaded ? "translateY(0)" : "translateY(20px)",
                transition: "all 0.6s ease-out 0.8s",
                color: "#37412a"
              }}
            >
              <span className="font-medium text-base md:text-xl opacity-80 mt-2 block">
                Toda la información de tu pedido llegará a tu correo electrónico.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer conform to GEMINI.md - Floating at bottom */}
      <footer className="absolute bottom-0 left-0 right-0 py-8 border-t border-black/5 mx-6 md:mx-12 z-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 pb-4 md:pb-0">
          <div className="text-[10px] uppercase tracking-[0.3em] font-medium text-center md:text-left" style={{ color: colors.dark }}>
            © {currentYear || new Date().getFullYear()} TRAUM STUDIO. ALL RIGHTS RESERVED.
          </div>
          
          <SocialLinks config={{}} iconColor={colors.dark} />

          <a
            href="https://www.kytcode.lat"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center gap-2 text-xs font-bold transition-all duration-300 hover:opacity-70"
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
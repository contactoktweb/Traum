"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Header } from "@/components/Header"

const colors = {
  dark: "#354523",
  cream: "#EBD69F",
  leaf: "#557A2B",
  moss: "#869D3D",
  sand: "#D5B87E",
}

export default function TraumLandingPage() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)
  const [revealVisible, setRevealVisible] = useState(false)
  const [hoverMascot, setHoverMascot] = useState(false)
  const mascotRef = useRef<HTMLDivElement>(null)
  const revealRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsLoaded(true)
    
    const onMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY })
    window.addEventListener("mousemove", onMove, { passive: true })
    
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setRevealVisible(true),
      { threshold: 0.15 }
    )
    if (revealRef.current) observer.observe(revealRef.current)
    
    return () => {
      window.removeEventListener("mousemove", onMove)
      observer.disconnect()
    }
  }, [])

  // Mascot parallax
  const getMascotOffset = () => {
    if (!mascotRef.current || typeof window === "undefined") return { x: 0, y: 0 }
    const rect = mascotRef.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    return { 
      x: (mousePos.x - cx) * 0.015, 
      y: (mousePos.y - cy) * 0.015 
    }
  }

  const offset = getMascotOffset()

  // Eye tracking
  const getEyeOffset = () => {
    if (!mascotRef.current || typeof window === "undefined") return { x: 0, y: 0 }
    const rect = mascotRef.current.getBoundingClientRect()
    const eyeX = rect.left + rect.width * 0.38
    const eyeY = rect.top + rect.height * 0.28
    return {
      x: Math.max(-3, Math.min(3, (mousePos.x - eyeX) * 0.01)),
      y: Math.max(-3, Math.min(3, (mousePos.y - eyeY) * 0.01)),
    }
  }

  const eye = getEyeOffset()

  return (
    <main className="relative overflow-x-hidden bg-[#354523]">
      <Header />
      {/* Cursor */}
      <div
        className="fixed pointer-events-none z-[100] rounded-full mix-blend-difference hidden md:block"
        style={{
          left: mousePos.x,
          top: mousePos.y,
          width: hoverMascot ? 60 : 12,
          height: hoverMascot ? 60 : 12,
          transform: "translate(-50%, -50%)",
          background: colors.cream,
          transition: "width 0.25s, height 0.25s",
        }}
      />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Diagonal split background */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0"
            style={{
              background: colors.dark,
            }}
          />
        </div>

        {/* Large decorative text background */}
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
          style={{
            opacity: isLoaded ? 0.03 : 0,
            transition: "opacity 1s ease-out 0.3s",
          }}
        >
          <span 
            className="text-[30vw] font-black tracking-tighter whitespace-nowrap"
            style={{ color: colors.cream }}
          >
            TRAUM
          </span>
        </div>

        {/* Floating geometric shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Circle */}
          <div
            className="absolute top-[15%] left-[10%] w-32 h-32 md:w-48 md:h-48 rounded-full border-2 animate-[spin_30s_linear_infinite]"
            style={{ 
              borderColor: `${colors.moss}20`,
              opacity: isLoaded ? 1 : 0,
              transition: "opacity 0.8s ease-out 0.5s",
            }}
          />
          {/* Small dots cluster */}
          <div
            className="absolute top-[20%] right-[15%] animate-[float_6s_ease-in-out_infinite]"
            style={{
              opacity: isLoaded ? 1 : 0,
              transition: "opacity 0.8s ease-out 0.6s",
            }}
          >
            <div className="w-2 h-2 rounded-full mb-3" style={{ background: colors.moss }} />
            <div className="w-1.5 h-1.5 rounded-full ml-4" style={{ background: colors.sand }} />
            <div className="w-1 h-1 rounded-full mt-2" style={{ background: colors.leaf }} />
          </div>
          {/* Line accent */}
          <div
            className="absolute bottom-[25%] left-[8%] w-px h-32 md:h-48"
            style={{
              background: `linear-gradient(to bottom, transparent, ${colors.moss}40, transparent)`,
              opacity: isLoaded ? 1 : 0,
              transition: "opacity 0.8s ease-out 0.7s",
            }}
          />
          {/* Corner accent */}
          <div
            className="absolute bottom-[20%] right-[10%] w-20 h-20 md:w-28 md:h-28 border-r-2 border-b-2"
            style={{
              borderColor: `${colors.sand}30`,
              opacity: isLoaded ? 1 : 0,
              transition: "opacity 0.8s ease-out 0.8s",
            }}
          />
        </div>

        {/* Main content - side by side layout */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-0">
          {/* Left side - Text */}
          <div className="flex-1 text-center lg:text-left order-2 lg:order-1">
            {/* Eyebrow */}
            <div
              className="flex items-center justify-center lg:justify-start gap-3 mb-6"
              style={{
                opacity: isLoaded ? 1 : 0,
                transform: isLoaded ? "translateY(0)" : "translateY(20px)",
                transition: "all 0.6s ease-out 0.2s",
              }}
            >
              <div className="w-8 h-px" style={{ background: colors.moss }} />
              <span className="text-xs tracking-[0.4em] uppercase" style={{ color: colors.moss }}>
                Coming Soon
              </span>
            </div>

            {/* Main title */}
            <h1 className="overflow-hidden mb-4">
              {"TRAUM".split("").map((char, i) => (
                <span
                  key={i}
                  className="inline-block text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] font-black tracking-tighter"
                  style={{
                    color: colors.cream,
                    transform: isLoaded ? "translateY(0) rotate(0deg)" : "translateY(100%) rotate(5deg)",
                    opacity: isLoaded ? 1 : 0,
                    transition: `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${0.3 + i * 0.06}s`,
                  }}
                >
                  {char}
                </span>
              ))}
            </h1>

            {/* Subtitle with styled words */}
            <div
              className="text-lg md:text-xl lg:text-2xl font-light mb-8"
              style={{
                opacity: isLoaded ? 1 : 0,
                transform: isLoaded ? "translateY(0)" : "translateY(20px)",
                transition: "all 0.6s ease-out 0.8s",
              }}
            >
              <span style={{ color: colors.cream }}>Donde el </span>
              <span className="font-semibold" style={{ color: colors.sand }}>diseño</span>
              <span style={{ color: colors.cream }}> encuentra la </span>
              <span className="font-semibold" style={{ color: colors.sand }}>cultura</span>
            </div>

            {/* Tagline */}
            <p
              className="text-sm md:text-base max-w-md mx-auto lg:mx-0"
              style={{
                color: `${colors.cream}CC`,
                opacity: isLoaded ? 1 : 0,
                transition: "opacity 0.6s ease-out 1s",
              }}
            >
              Cada pieza cuenta una historia. Cada objeto guarda un fragmento del viaje de sus creadores.
            </p>

            {/* CTA hint */}
            <div
              className="mt-10 flex items-center justify-center lg:justify-start gap-2"
              style={{
                opacity: isLoaded ? 1 : 0,
                transition: "opacity 0.6s ease-out 1.1s",
              }}
            >
              <div 
                className="w-10 h-10 rounded-full border-2 flex items-center justify-center animate-bounce"
                style={{ borderColor: `${colors.cream}60` }}
              >
                <svg 
                  className="w-4 h-4" 
                  fill="none" 
                  stroke={colors.cream} 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
              <span className="text-xs tracking-widest uppercase" style={{ color: `${colors.cream}CC` }}>
                Descubre más
              </span>
            </div>
          </div>

          {/* Right side - Mascot */}
          <div className="flex-1 flex justify-center lg:justify-end order-1 lg:order-2">
            <div
              ref={mascotRef}
              className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[28rem] lg:h-[28rem]"
              onMouseEnter={() => setHoverMascot(true)}
              onMouseLeave={() => setHoverMascot(false)}
              style={{
                transform: `translate(${offset.x}px, ${offset.y}px) scale(${hoverMascot ? 1.02 : 1})`,
                transition: "transform 0.15s ease-out",
              }}
            >
              {/* Glow layers */}
              <div
                className="absolute inset-[-20%] rounded-full"
                style={{ 
                  background: `radial-gradient(circle, ${colors.leaf}20 0%, transparent 60%)`,
                  animation: "pulse 4s ease-in-out infinite",
                }}
              />
              <div
                className="absolute inset-[-10%] rounded-full"
                style={{ 
                  background: `radial-gradient(circle, ${colors.moss}15 0%, transparent 50%)`,
                  animation: "pulse 3s ease-in-out infinite 0.5s",
                }}
              />

              {/* Orbiting elements */}
              <div
                className="absolute inset-[-15%] rounded-full border border-dashed animate-[spin_40s_linear_infinite]"
                style={{ borderColor: `${colors.moss}15` }}
              >
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                  <div className="w-3 h-3 rounded-full" style={{ background: colors.moss, boxShadow: `0 0 10px ${colors.moss}` }} />
                </div>
              </div>
              <div
                className="absolute inset-[-8%] rounded-full border animate-[spin_25s_linear_infinite_reverse]"
                style={{ borderColor: `${colors.sand}10` }}
              >
                <div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2"
                >
                  <div className="w-2 h-2 rounded-full" style={{ background: colors.sand }} />
                </div>
              </div>

              {/* Mascot image */}
              <div
                className="relative w-full h-full animate-[float_5s_ease-in-out_infinite]"
                style={{
                  opacity: isLoaded ? 1 : 0,
                  transform: isLoaded ? "scale(1)" : "scale(0.9)",
                  transition: "all 0.8s ease-out 0.4s",
                }}
              >
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-removebg-preview-3-O8EdCEPdcNg3jluUVpGOxva0zHUMld.png"
                  alt="Traum Mascota"
                  fill
                  className="object-contain drop-shadow-[0_0_60px_rgba(85,122,43,0.5)]"
                  priority
                />
              </div>

              {/* Eye highlight */}
              <div
                className="absolute w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-white pointer-events-none"
                style={{
                  top: "27%",
                  left: "37%",
                  transform: `translate(${eye.x}px, ${eye.y}px)`,
                  transition: "transform 0.08s linear",
                  boxShadow: "0 0 8px rgba(255,255,255,0.9)",
                }}
              />

              {/* Decorative badge */}
              <div
                className="absolute -bottom-2 -right-2 md:bottom-4 md:right-0 px-4 py-2 rounded-full"
                style={{
                  background: colors.sand,
                  opacity: isLoaded ? 1 : 0,
                  transform: isLoaded ? "scale(1) rotate(-3deg)" : "scale(0)",
                  transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 1s",
                }}
              >
                <span className="text-xs font-bold tracking-wide" style={{ color: colors.dark }}>2025</span>
              </div>
            </div>
          </div>
        </div>

        
      </section>

      {/* Reveal Section (Quienes somos) */}
      <section 
        id="about" 
        ref={revealRef} 
        className="relative min-h-screen py-24 md:py-32 overflow-hidden" 
        style={{ background: colors.cream }}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full pointer-events-none opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M100 0 L100 100 L0 100 Z" fill={colors.dark} />
          </svg>
        </div>

        {/* Diagonal top transition */}
        <div
          className="absolute -top-1 z-10 left-0 w-full h-24 md:h-32"
          style={{ 
            background: colors.dark, 
            clipPath: "polygon(0 0, 100% 0, 100% 0, 0 100%)" 
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-black/10 pb-12">
            <div>
              <div 
                className="inline-flex items-center gap-3 mb-6"
                style={{
                  opacity: revealVisible ? 1 : 0,
                  transition: "opacity 0.6s ease-out",
                }}
              >
                <div className="w-12 h-px" style={{ background: colors.leaf }} />
                <span className="text-xs tracking-[0.3em] uppercase font-bold" style={{ color: colors.leaf }}>
                  Esencia Traum
                </span>
              </div>
              <h2
                className="text-5xl md:text-7xl font-black tracking-tighter leading-tight max-w-2xl"
                style={{
                  color: colors.dark,
                  opacity: revealVisible ? 1 : 0,
                  transform: revealVisible ? "translateY(0)" : "translateY(30px)",
                  transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s",
                }}
              >
                Más que una marca, un manifiesto visual.
              </h2>
            </div>
            
            <p 
              className="text-lg font-light max-w-sm"
              style={{ 
                color: colors.dark,
                opacity: revealVisible ? 1 : 0,
                transition: "opacity 0.8s ease-out 0.3s"
              }}
            >
              Cada pieza guarda un fragmento del viaje, una historia esperando ser contada por quien la porta.
            </p>
          </div>

          {/* Grid Layout for Content */}
          <div className="grid md:grid-cols-2 gap-12 md:gap-24">
            {/* El Concepto */}
            <div
              className="relative"
              style={{
                opacity: revealVisible ? 1 : 0,
                transform: revealVisible ? "translateY(0)" : "translateY(40px)",
                transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
              }}
            >
              <div className="flex items-center gap-6 mb-8">
                <span className="text-4xl md:text-5xl font-light opacity-30" style={{ color: colors.dark }}>01</span>
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ color: colors.dark }}>
                  El Concepto
                </h3>
              </div>
              <div className="prose prose-lg" style={{ color: `${colors.dark}CC` }}>
                <p className="text-lg leading-relaxed">
                  Nacemos en la intersección donde el diseño contemporáneo, la riqueza cultural y la narrativa personal convergen para crear algo único. No hacemos simplemente ropa o accesorios; diseñamos objetos con propósito y significado.
                </p>
              </div>
            </div>

            {/* El Origen */}
            <div
              className="relative"
              style={{
                opacity: revealVisible ? 1 : 0,
                transform: revealVisible ? "translateY(0)" : "translateY(40px)",
                transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s",
              }}
            >
              <div className="flex items-center gap-6 mb-8">
                <span className="text-4xl md:text-5xl font-light opacity-30" style={{ color: colors.dark }}>02</span>
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ color: colors.dark }}>
                  El Origen
                </h3>
              </div>
              <div className="prose prose-lg" style={{ color: `${colors.dark}CC` }}>
                <p className="text-lg leading-relaxed">
                  Somos la unión de dos mentes creativas impulsadas por la pasión. Lo que comenzó como una amistad se transformó en un <span className="font-semibold" style={{ color: colors.sand }}>laboratorio de ideas</span>. Durante más de cuatro años, hemos desafiado lo convencional buscando la excelencia en cada detalle.
                </p>
              </div>
            </div>
          </div>

          {/* Vision/Banner */}
          <div
            className="mt-24 p-8 md:p-12 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-8"
            style={{
              background: colors.dark,
              opacity: revealVisible ? 1 : 0,
              transform: revealVisible ? "scale(1)" : "scale(0.98)",
              transition: "all 1s ease-out 0.6s",
            }}
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.3em] block mb-4" style={{ color: colors.sand }}>
                El Futuro
              </span>
              <p className="text-2xl md:text-3xl font-light" style={{ color: colors.cream }}>
                "Algo grande se está gestando en nuestro taller."
              </p>
            </div>
            <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center shrink-0">
               <svg className="w-5 h-5" fill="none" stroke={colors.cream} viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
               </svg>
            </div>
          </div>
        </div>

        {/* Footer conform to GEMINI.md */}
        <footer className="mt-32 pt-12 pb-8 border-t border-black/5 mx-6 md:mx-12">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-[10px] uppercase tracking-[0.3em] font-medium" style={{ color: colors.dark }}>
              © {new Date().getFullYear()} TRAUM STUDIO. ALL RIGHTS RESERVED.
            </div>
            
            <a
              href="https://www.kytcode.lat"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-xs font-bold transition-all duration-300 hover:scale-105"
              style={{ color: colors.dark }}
            >
              <span className="opacity-60 group-hover:opacity-100 transition-opacity">Desarrollado por K&T</span>
              <svg 
                className="w-4 h-4 transition-transform duration-300 group-hover:scale-125" 
                fill="currentColor" 
                viewBox="0 0 24 24"
                style={{ color: colors.dark }} // Black heart as background is light (cream)
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </a>
          </div>
        </footer>
      </section>

      <style jsx global>{`
        @media (min-width: 768px) {
          * { cursor: none; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
        ::selection {
          background: ${colors.moss};
          color: ${colors.cream};
        }
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </main>
  )
}

"use client"

import { useEffect, useRef, useState } from "react"

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
    <main className="relative overflow-x-hidden bg-[#FAF6EE]">
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
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden pb-24 bg-[position:30%_center] md:bg-[position:center]"
        style={{
          backgroundImage: "url('/fondo.png')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 90%)",
        }}
      >

        {/* Main content - horizontal distribution */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-2 md:pl-2 md:pr-12 flex flex-col items-center text-center md:items-start md:text-left md:translate-y-12">
          {/* Eyebrow */}
          <div
            className="flex items-center justify-center md:justify-start gap-3 mb-2"
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.6s ease-out 0.2s",
            }}
          >
            <div className="w-8 h-px" style={{ background: colors.moss }} />
            <span className="text-[10px] tracking-[0.4em] uppercase" style={{ color: colors.moss }}>
              Coming Soon
            </span>
          </div>

          {/* Main content - vertical stack layout */}
          <div className="flex flex-col items-center md:items-start gap-y-2 w-full">
            {/* Main title */}
            <h1 className="overflow-hidden shrink-0 flex justify-center w-full">
              {"TRAUM".split("").map((char, i) => (
                <span
                  key={i}
                  className="inline-block text-[6.5rem] leading-[0.85] sm:text-[8rem] md:text-[9rem] lg:text-[10rem] font-black tracking-tighter"
                  style={{
                    color: colors.dark,
                    transform: isLoaded ? "translateY(0) rotate(0deg)" : "translateY(100%) rotate(5deg)",
                    opacity: isLoaded ? 1 : 0,
                    transition: `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${0.3 + i * 0.06}s`,
                  }}
                >
                  {char}
                </span>
              ))}
            </h1>

            {/* Subtitle */}
            <div 
              className="text-sm md:text-base lg:text-lg font-light"
              style={{
                opacity: isLoaded ? 1 : 0,
                transform: isLoaded ? "translateY(0)" : "translateY(10px)",
                transition: "all 0.6s ease-out 0.8s",
              }}
            >
              <span style={{ color: colors.moss }}>Donde el </span>
              <span className="font-semibold" style={{ color: colors.dark }}>diseño</span>
              <span style={{ color: colors.moss }}> encuentra la </span>
              <span className="font-semibold" style={{ color: colors.dark }}>cultura</span>
            </div>
          </div>
        </div>

        
      </section>

      {/* Reveal Section (Quienes somos) */}
      <section 
        id="about" 
        ref={revealRef} 
        className="relative pt-24 md:pt-32 pb-6 overflow-hidden" 
        style={{ background: '#FAF6EE' }}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full pointer-events-none opacity-[0.07]">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M100 0 L100 100 L0 100 Z" fill={colors.moss} />
          </svg>
        </div>



        <div className="relative z-10 max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b pb-12" style={{ borderColor: `${colors.moss}30` }}>
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
                color: `${colors.dark}99`,
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
                <span className="text-4xl md:text-5xl font-light opacity-30" style={{ color: colors.leaf }}>01</span>
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ color: colors.dark }}>
                  El Concepto
                </h3>
              </div>
              <div className="prose prose-lg" style={{ color: `${colors.dark}AA` }}>
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
                <span className="text-4xl md:text-5xl font-light opacity-30" style={{ color: colors.leaf }}>02</span>
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ color: colors.dark }}>
                  El Origen
                </h3>
              </div>
              <div className="prose prose-lg" style={{ color: `${colors.dark}AA` }}>
                <p className="text-lg leading-relaxed">
                  Somos la unión de dos mentes creativas impulsadas por la pasión. Lo que comenzó como una amistad se transformó en un <span className="font-semibold" style={{ color: colors.leaf }}>laboratorio de ideas</span>. Durante más de cuatro años, hemos desafiado lo convencional buscando la excelencia en cada detalle.
                </p>
              </div>
            </div>
          </div>

          {/* Vision/Banner */}
          <div
            className="mt-24 p-8 md:p-12 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-[#557A2B20]"
            style={{
              background: `${colors.dark}E6`, // #354523 at 90% opacity
              backdropFilter: 'blur(12px)',
              border: `1px solid ${colors.moss}40`,
              opacity: revealVisible ? 1 : 0,
              transform: revealVisible ? "scale(1)" : "scale(0.98)",
              transition: "all 1s ease-out 0.6s",
            }}
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.3em] block mb-4" style={{ color: colors.cream }}>
                El Futuro
              </span>
              <p className="text-2xl md:text-3xl font-light" style={{ color: '#FAF6EE' }}>
                &quot;Algo grande se está gestando en nuestro taller.&quot;
              </p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 hover:scale-110" style={{ background: '#FAF6EE' }}>
               <svg className="w-5 h-5" fill="none" stroke={colors.dark} viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
               </svg>
            </div>
          </div>
        </div>

        {/* Footer conform to GEMINI.md */}
        <footer className="mt-24 pt-12 pb-6 mx-6 md:mx-12" style={{ borderTop: `1px solid ${colors.moss}20` }}>
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-[10px] uppercase tracking-[0.3em] font-medium" style={{ color: `${colors.dark}99` }}>
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
                style={{ color: '#000000' }}
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

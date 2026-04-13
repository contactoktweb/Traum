"use client"

import { useEffect, useRef } from "react"

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Solo mostramos/trackeamos en PC (dispositivos con puntero fino)
    const mediaQuery = window.matchMedia("(pointer: fine)")
    
    let animationFrameId: number
    
    const onMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        // Movemos el cursor con translate3d para máximo rendimiento
        // Y añadimos un translate(-50%, -50%) para centrarlo exactamente en la punta de la flecha
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`
      }
    }

    if (mediaQuery.matches) {
      window.addEventListener("mousemove", onMove, { passive: true })
    }

    const onMediaChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        window.addEventListener("mousemove", onMove, { passive: true })
      } else {
        window.removeEventListener("mousemove", onMove)
      }
    }
    
    mediaQuery.addEventListener("change", onMediaChange)

    return () => {
      window.removeEventListener("mousemove", onMove)
      mediaQuery.removeEventListener("change", onMediaChange)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full mix-blend-difference hidden md:block"
      style={{
        width: 14,
        height: 14,
        background: "#EBD69F", // colors.cream
        willChange: "transform",
        transform: "translate3d(-100px, -100px, 0)" // Empieza fuera de la pantalla
      }}
    />
  )
}

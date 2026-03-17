"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

export function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const colors = {
    dark: "#354523",
    cream: "#EBD69F",
    leaf: "#557A2B",
    moss: "#869D3D",
    sand: "#D5B87E",
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-500 px-6 md:px-12 py-4 ${
        scrolled 
          ? "bg-[#354523]/80 backdrop-blur-md border-b border-white/10 py-3" 
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo/Brand Image */}
        <a href="#" className="flex items-center group transition-transform duration-300 hover:scale-105">
          <div className="relative w-32 h-12 md:w-44 md:h-16">
            <Image
              src="/logo.png"
              alt="Traum Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </a>

        {/* Navigation */}
        <nav>
          <button
            onClick={() => {
              const element = document.getElementById("about")
              element?.scrollIntoView({ behavior: "smooth" })
            }}
            className="relative px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 overflow-hidden group"
            style={{
              backgroundColor: scrolled ? colors.sand : "transparent",
              color: scrolled ? colors.dark : colors.cream,
              border: scrolled ? `1px solid ${colors.sand}` : `1px solid ${colors.cream}30`,
            }}
          >
            <span className="relative z-10">Quienes Somos</span>
            <div 
              className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"
              style={{ 
                backgroundColor: scrolled ? colors.dark : colors.sand,
                opacity: 0.1
              }}
            />
          </button>
        </nav>
      </div>
    </header>
  )
}

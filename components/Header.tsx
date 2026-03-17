"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCart } from "./CartProvider"

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === "/"
  const isTienda = pathname.startsWith("/tienda")
  const { cartCount, toggleCart } = useCart()

  // On home (not scrolled): dark text on transparent bg
  // On home (scrolled): cream text on dark bg
  // On tienda (not scrolled): dark text on cream page bg
  // On tienda (scrolled): cream text on dark bg
  const useLight = scrolled // cream/white elements only when scrolled (dark header bg)

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
          ? "bg-[#354523]/90 backdrop-blur-md border-b border-white/10 py-3 shadow-lg shadow-black/5" 
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo/Brand Image */}
        <Link href="/" className="flex items-center group transition-transform duration-300 hover:scale-105">
          <div className="relative w-32 h-12 md:w-36 md:h-14">
            <Image
              src="/logo.png"
              alt="Traum Logo"
              fill
              className="object-contain drop-shadow-sm transition-all duration-300"
              style={{
                filter: scrolled ? "brightness(0) invert(1)" : isTienda ? "brightness(0)" : "none"
              }}
              priority
            />
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-4 md:gap-8">
          <Link 
            href="/tienda" 
            className="text-xs font-bold uppercase tracking-[0.2em] transition-colors duration-300"
            style={{ 
              color: useLight ? colors.cream : colors.dark,
              opacity: pathname === "/tienda" ? 1 : 0.6 
            }}
          >
            Tienda
          </Link>

          {isHome ? (
            <button
              onClick={() => {
                const element = document.getElementById("about")
                element?.scrollIntoView({ behavior: "smooth" })
              }}
              className="relative hidden sm:block px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 overflow-hidden group"
              style={{
                backgroundColor: scrolled ? colors.sand : "transparent",
                color: scrolled ? colors.dark : colors.dark,
                border: scrolled ? `1px solid ${colors.sand}` : `1px solid ${colors.dark}30`,
              }}
            >
              <span className="relative z-10">Quienes Somos</span>
              <div 
                className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"
                style={{ 
                  backgroundColor: scrolled ? colors.dark : colors.dark,
                  opacity: 0.1
                }}
              />
            </button>
          ) : (
            <Link
              href="/#about"
              className="relative hidden sm:block px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 overflow-hidden group"
              style={{
                backgroundColor: colors.sand,
                color: colors.dark,
                border: `1px solid ${colors.sand}`,
              }}
            >
              <span className="relative z-10">Quienes Somos</span>
              <div 
                className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"
                style={{ 
                  backgroundColor: colors.dark,
                  opacity: 0.1
                }}
              />
            </Link>
          )}

          {/* Cart Toggle Button */}
          <button 
            onClick={toggleCart}
            className="relative p-2 ml-2 transition-transform duration-300 hover:scale-110"
            style={{ color: useLight ? colors.cream : colors.dark }}
            aria-label="Toggle Shopping Cart"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#EBD69F] text-[10px] font-black text-[#354523] border border-[#354523]/10">
                {cartCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  )
}

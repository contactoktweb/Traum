"use client"

import { useCart } from "@/components/CartProvider"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import "../app/cart.css"

export function CartSidebar() {
  const { isCartOpen, toggleCart, cartItems, updateQuantity, removeFromCart, cartTotal } = useCart()
  const router = useRouter()
  
  const [animClass, setAnimClass] = useState("")
  const [isVisible, setIsVisible] = useState(false)
  const [isOpenVisual, setIsOpenVisual] = useState(false)
  const [isEntering, setIsEntering] = useState(false)
  const [isRetracting, setIsRetracting] = useState(false)

  useEffect(() => {
    if (isCartOpen) {
      setIsVisible(true)
      setIsOpenVisual(false)
      setIsEntering(true)
      setIsRetracting(false)
      setAnimClass("anim-print-in")
      document.body.style.overflow = "hidden"

      const rafId = requestAnimationFrame(() => {
        setIsOpenVisual(true)
      })

      const enterTimer = setTimeout(() => {
        setIsEntering(false)
      }, 900)

      return () => {
        cancelAnimationFrame(rafId)
        clearTimeout(enterTimer)
      }
    } else {
      setIsOpenVisual(false)
      setIsEntering(false)
      if (animClass !== "anim-print-drop") {
        setIsRetracting(true)
        setAnimClass("anim-print-out-up")
      } else {
        setIsRetracting(false)
      }
      
      document.body.style.overflow = "unset"
      
      const timer = setTimeout(() => {
        setIsVisible(false)
        setAnimClass("")
        setIsRetracting(false)
      }, 1500) // Ensure enough time for fade out or drop
      return () => clearTimeout(timer)
    }
  }, [isCartOpen])

  const handleBuy = () => {
    setAnimClass("anim-print-drop")
    setIsRetracting(false)
    
    // Keep the drop visible before route transition to avoid a cut-off effect.
    setTimeout(() => {
      router.push('/checkout')
      // Actually flag the cart logic as closed right as we redirect
      toggleCart()
    }, 1450)
  }

  const handleClose = () => {
    toggleCart()
  }

  if (!isVisible && !isCartOpen) return null;

  return (
    <>
      <div 
        className={`cart-overlay ${isOpenVisual ? 'open' : 'closed'}`}
        onClick={handleClose}
      />

      <div className="cart-container">
        <div className={`machine-wrapper ${isOpenVisual ? 'visible' : 'hidden'}`}>
          
          <div className="machine-slot-top">
            <div className="machine-lip" onClick={handleClose} style={{cursor: 'pointer'}} title="Cerrar el recibo">
            </div>
            <div className="machine-hole"></div>
          </div>

                    <div className={`receipt-clip ${(isEntering || isRetracting) ? 'clip-slot-active' : ''}`}>
            <div id="receipt" className={`paper-bg sawtooth ${animClass}`}>
              
              <div className="receipt-logo">
                <span>------</span>
                <div className="logo-image">
                  <Image 
                      src="/logo.png" 
                      alt="Traum" 
                      fill
                      style={{ objectFit: 'contain', filter: 'grayscale(100%) brightness(0.2) contrast(1.2)' }} 
                  />
                </div>
              </div>

              <div className="dash-line"></div>

              {cartItems.length === 0 ? (
                <div style={{ textAlign: "center", fontSize: "14px", margin: "20px 0" }}>
                  <p>El carrito está vacío</p>
                  <button onClick={handleClose} style={{ marginTop: '16px', padding: '10px 20px', backgroundColor: '#111', color: 'white', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', borderRadius: '4px', cursor: 'pointer' }}>
                    Volver a la tienda
                  </button>
                </div>
              ) : (
                cartItems.map(item => (
                  <div key={item.id}>
                    <div className="receipt-product">
                      <div className="rp-row">
                        <span className="rp-title">{item.name}</span>
                        <span className="rp-price">${item.price.toLocaleString("es-CO")}</span>
                      </div>
                      <p className="rp-meta">CANT. {item.quantity}</p>
                      {item.size && <p className="rp-size">Talla: {item.size}</p>}
                      <div className="rp-qty-row">
                        <span className="rp-qty">{item.quantity}x</span>
                        <span className="rp-total">${(item.price * item.quantity).toLocaleString("es-CO")}</span>
                        <div className="rp-controls">
                          <button onClick={() => updateQuantity(item.id, item.size || "", Math.max(1, item.quantity - 1))} className="rp-btn">-</button>
                          <button onClick={() => updateQuantity(item.id, item.size || "", item.quantity + 1)} className="rp-btn">+</button>
                          <button onClick={() => removeFromCart(item.id, item.size || "")} className="rp-remove">Quitar</button>
                        </div>
                      </div>
                    </div>
                    <div className="dash-line"></div>
                  </div>
                ))
              )}

              <div className="r-totals-wrap">
                <div className="r-sub-row">
                  <span>Subtotal</span>
                  <span className="r-sub-val">${cartTotal.toLocaleString("es-CO")}</span>
                </div>
                <div className="r-sub-row">
                  <span>Envío</span>
                  <span>Calculado en el checkout</span>
                </div>
              </div>

              <div className="r-grand-total">
                <span className="r-gt-label">Total (COP)</span>
                <span className="r-gt-val">$ {cartTotal.toLocaleString("es-CO")}</span>
              </div>

              <button id="btn-buy" onClick={handleBuy} disabled={cartItems.length === 0} className="r-btn-buy">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                Pagar y Finalizar
              </button>

              <div className="r-barcode-wrap">
                <div className="r-barcode-bars">
                  <div className="b-w2"></div><div className="b-w1"></div>
                  <div className="b-w3"></div><div className="b-w1"></div>
                  <div className="b-w2"></div><div className="b-w1"></div>
                  <div className="b-w4"></div><div className="b-w1"></div>
                  <div className="b-w2"></div><div className="b-w2"></div>
                  <div className="b-w1"></div><div className="b-w3"></div>
                  <div className="b-w1"></div><div className="b-w2"></div>
                  <div className="b-w1"></div><div className="b-w3"></div>
                  <div className="b-w2"></div><div className="b-w1"></div>
                  <div className="b-w1"></div><div className="b-w4"></div>
                  <div className="b-w2"></div><div className="b-w1"></div>
                  <div className="b-w3"></div><div className="b-w1"></div>
                  <div className="b-w1"></div><div className="b-w2"></div>
                  <div className="b-w3"></div><div className="b-w1"></div>
                  <div className="b-w2"></div><div className="b-w2"></div>
                  <div className="b-w1"></div><div className="b-w4"></div>
                  <div className="b-w1"></div><div className="b-w2"></div>
                  <div className="b-w1"></div>
                </div>
                <div className="r-barcode-text">#A3019P34865</div>
              </div>

              <div className="dash-line"></div>

              <div className="r-footer">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1L14.5 9.5L23 12L14.5 14.5L12 23L9.5 14.5L1 12L9.5 9.5L12 1Z"/>
                </svg>
                PAGOS SEGUROS PROCESADOS POR BANCOLOMBIA
              </div>
            </div>
          </div>

          <div className="machine-slot-bottom"></div>
        </div>
      </div>
    </>
  )
}

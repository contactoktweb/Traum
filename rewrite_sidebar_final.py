import os

css_content = """@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600&family=Inter:wght@400;500;600;700;800&display=swap');

/* Base Reset for Cart */
.cart-overlay {
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background-color: rgba(0,0,0,0.6);
    backdrop-filter: blur(4px);
    z-index: 1010;
    transition: opacity 0.5s;
}
.cart-overlay.open { opacity: 1; pointer-events: auto; }
.cart-overlay.closed { opacity: 0; pointer-events: none; }

.cart-container {
    position: fixed; top: 0; right: 0;
    height: 100%; width: 100%;
    z-index: 1020;
    display: flex; flex-direction: column; align-items: center;
    pointer-events: none;
    font-family: 'Inter', sans-serif;
}

/* Machine & Slot */
.machine-wrapper {
    position: relative; width: 380px;
    display: flex; justify-content: center;
    margin-top: 40px; pointer-events: auto;
}
.machine-slot-top {
    position: absolute; top: 0; left: 50%; transform: translateX(-50%);
    width: 380px; z-index: 30;
    display: flex; flex-direction: column; align-items: center;
    filter: drop-shadow(0 20px 13px rgba(0,0,0,0.03)) drop-shadow(0 8px 5px rgba(0,0,0,0.08));
}
.machine-lip {
    width: 100%; height: 22px;
    background: linear-gradient(to bottom, #FAFAFA, #D1D5DB);
    border-radius: 6px 6px 0 0;
    border-top: 1px solid #fff; border-left: 1px solid #fff; border-right: 1px solid #fff;
    box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05);
}
.machine-hole {
    width: 340px; height: 10px;
    background-color: #0A0A0A;
    box-shadow: inset 0 4px 6px rgba(0,0,0,1);
    border-radius: 9999px; margin-top: -5px;
}
.machine-slot-bottom {
    position: absolute; top: 27px; left: 50%; transform: translateX(-50%);
    width: 380px; height: 16px;
    background: linear-gradient(to bottom, #9CA3AF, #6B7280);
    border-radius: 0 0 6px 6px;
    box-shadow: 0 15px 20px rgba(0,0,0,0.15);
    z-index: 10;
    border-top: 1px solid #4B5563;
}

/* Receipt Display */
.receipt-clip {
    position: relative; margin-top: 17px; z-index: 20;
    width: 330px; clip-path: inset(0px -50px -50px -50px);
}

.paper-bg {
    background-color: #F4EFE6;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
    width: 100%; box-sizing: border-box;
    padding: 40px 28px 32px 28px;
    color: #1A1A1A;
    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.3);
    /* For animation we hide it by default */
    transform: translateY(-100%);
}
.sawtooth { position: relative; }
.sawtooth::after {
    content: ''; position: absolute; display: block;
    left: 0; bottom: -12px; width: 100%; height: 12px;
    background-image: url("data:image/svg+xml,%3Csvg width='8' height='12' viewBox='0 0 8 12' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolygon points='0,0 8,0 4,12' fill='%23F4EFE6'/%3E%3C/svg%3E");
    background-size: 8px 12px; background-repeat: repeat-x; background-position: left top;
    filter: drop-shadow(0 3px 2px rgba(0,0,0,0.18));
}
.dash-line {
    height: 1.5px; width: 100%;
    background-image: linear-gradient(to right, #A0A0A0 50%, transparent 50%);
    background-size: 12px 1.5px; background-repeat: repeat-x;
    margin: 20px 0;
}

/* Animations */
@keyframes printIn {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(0); }
}
@keyframes printOutUp {
    0% { transform: translateY(0); }
    100% { transform: translateY(-100%); }
}
@keyframes printDrop {
    0% { transform: translateY(0); opacity: 1; }
    10% { transform: translateY(4px) rotate(1deg); opacity: 1; }
    20% { transform: translateY(-1px) rotate(-0.5deg); opacity: 1; }
    30% { transform: translateY(0) rotate(0deg); opacity: 1; }
    100% { transform: translateY(120vh); opacity: 0; }
}
.anim-print-in { animation: printIn 1.5s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
.anim-print-out-up { animation: printOutUp 1s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
.anim-print-drop { animation: printDrop 1.8s cubic-bezier(0.25, 1, 0.5, 1) forwards; }

.receipt-logo {
    display: flex; justify-content: center;
    color: #213023; margin-bottom: 20px;
    letter-spacing: -2px; color: #9CA3AF; font-weight: normal;
}
.receipt-product {
    display: flex; flex-direction: column; margin-bottom: 16px; width: 100%;
}
.rp-row {
    display: flex; justify-content: space-between; align-items: flex-start;
    font-size: 14px;
}
.rp-title { font-weight: 700; color: #2A2A2A; margin: 0; }
.rp-price { font-weight: 500; color: #2A2A2A; margin: 0; }
.rp-meta {
    font-weight: 700; font-size: 10px; color: #555;
    letter-spacing: 0.1em; margin-top: 6px; margin-bottom: 0;
}
.rp-size { font-size: 12px; color: #555; margin-top: 2px; margin-bottom: 0; }
.rp-qty-row {
    display: flex; gap: 8px; font-size: 14px; margin-top: 8px;
    align-items: center;
}
.rp-qty { font-weight: 500; }
.rp-total { font-weight: 700; color: #111; }

.rp-controls {
    display: flex; margin-left: auto; gap: 8px;
}
.rp-btn {
    width: 20px; height: 20px; background: #e5e5e5; border: none; border-radius: 4px;
    cursor: pointer; font-weight: bold; display: flex; align-items: center; justify-content: center;
}
.rp-remove {
    font-size: 10px; text-transform: uppercase; color: #e53e3e;
    background: none; border: none; cursor: pointer; text-decoration: underline;
}

.r-totals-wrap {
    display: flex; flex-direction: column; gap: 10px;
    font-size: 14px; color: #444; margin-bottom: 16px; margin-top: 8px; width: 100%;
}
.r-sub-row { display: flex; justify-content: space-between; }
.r-sub-val { font-weight: 700; color: #111; }

.r-grand-total {
    width: 100%; border-top: 1.5px dashed #A0A0A0; border-bottom: 1.5px dashed #A0A0A0;
    padding: 12px 0; margin-top: 16px; margin-bottom: 20px;
    display: flex; justify-content: space-between; align-items: center;
    font-size: 15px; color: #111;
}
.r-gt-label { font-weight: 700; }
.r-gt-val { font-weight: 800; font-size: 16px; }

.r-btn-buy {
    width: 100%; padding: 12px; margin-bottom: 20px;
    background-color: #111; color: white; border: none; border-radius: 8px;
    font-weight: 700; cursor: pointer; transition: background-color 0.2s;
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
    display: flex; align-items: center; justify-content: center; gap: 8px;
}
.r-btn-buy:hover { background-color: #333; }
.r-btn-buy:disabled { opacity: 0.5; cursor: not-allowed; }

.r-barcode-wrap {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    margin-bottom: 20px; margin-top: 8px; width: 100%;
}
.r-barcode-bars {
    display: flex; align-items: stretch; height: 32px; width: 95%; margin: 0 auto;
    justify-content: space-between; gap: 1px; background: transparent;
}
.b-w1 { width: 1px; background-color: #222; }
.b-w2 { width: 2px; background-color: #222; }
.b-w3 { width: 3px; background-color: #222; }
.b-w4 { width: 4px; background-color: #222; }

.r-barcode-text {
    font-size: 11px; font-weight: 600; color: #333; margin-top: 8px; letter-spacing: 0.05em;
}

.r-footer {
    display: flex; align-items: center; justify-content: center; gap: 6px;
    font-size: 7px; font-weight: 700; color: #555; letter-spacing: 0.1em;
    text-align: center; margin-top: 8px;
}

.external-actions {
    margin-top: 48px; display: flex; justify-content: center; z-index: 40; position: relative;
    pointer-events: auto;
}
.btn-cancel {
    padding: 10px 24px; background-color: #D1D5DB; color: #1F2937;
    border-radius: 8px; font-weight: 600; border: none; cursor: pointer;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05); transition: background-color 0.2s;
}
.btn-cancel:hover { background-color: #9CA3AF; }
"""

tsx_content = """"use client"

import { useCart } from "@/components/CartProvider"
import Image from "next/image"
import { useEffect, useState } from "react"
import "../app/cart.css"

export function CartSidebar() {
  const { isCartOpen, toggleCart, cartItems, updateQuantity, removeFromCart, cartTotal } = useCart()
  
  const [animClass, setAnimClass] = useState("")
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isCartOpen) {
      setIsVisible(true)
      setAnimClass("anim-print-in")
      document.body.style.overflow = "hidden"
    } else {
      if (animClass !== "anim-print-drop") {
        setAnimClass("anim-print-out-up")
      }
      document.body.style.overflow = "unset"
      
      const timer = setTimeout(() => {
        setIsVisible(false)
        setAnimClass("")
      }, 1500) 
      return () => clearTimeout(timer)
    }
  }, [isCartOpen])

  const handleBuy = () => {
    setAnimClass("anim-print-drop")
    setTimeout(() => {
      toggleCart()
    }, 1800)
  }

  const handleClose = () => {
    setAnimClass("anim-print-out-up")
    setTimeout(() => {
      toggleCart()
    }, 1000)
  }

  if (!isVisible && !isCartOpen) return null;

  return (
    <>
      <div 
        className={`cart-overlay ${isCartOpen ? 'open' : 'closed'}`}
        onClick={handleClose}
      />

      <div className="cart-container">
        <div className="machine-wrapper">
          
          <div className="machine-slot-top">
            <div className="machine-lip"></div>
            <div className="machine-hole"></div>
          </div>

          <div className="receipt-clip">
            <div id="receipt" className={`paper-bg sawtooth ${animClass}`}>
              
              <div className="receipt-logo">
                <span>------</span>
              </div>

              <div className="dash-line"></div>

              {cartItems.length === 0 ? (
                <div style={{ textAlign: "center", fontSize: "14px", margin: "20px 0" }}>
                  <p>El carrito está vacío</p>
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
                          <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="rp-btn">-</button>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="rp-btn">+</button>
                          <button onClick={() => removeFromCart(item.id)} className="rp-remove">Quitar</button>
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
                PAGOS SEGUROS 
              </div>
            </div>
          </div>

          <div className="machine-slot-bottom"></div>
        </div>

        <div className="external-actions">
          <button id="btn-cancel" onClick={handleClose} className="btn-cancel">
            Cancelar / Devolver
          </button>
        </div>

      </div>
    </>
  )
}
"""

with open("app/cart.css", "w") as f:
    f.write(css_content)

with open("components/CartSidebar.tsx", "w") as f:
    f.write(tsx_content)

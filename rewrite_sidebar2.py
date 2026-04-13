import re

with open("components/CartSidebar.tsx", "r") as f:
    content = f.read()

# find exact return match for main component
match = re.search(r"\n  return \(\n\s*<\>\n", content)
prefix = content[:match.start() + 1]

new_return = """  return (
    <>
      <div 
        className={`cart-overlay ${isCartOpen ? 'open' : 'closed'}`}
        onClick={handleClose}
      />

      <div className="cart-container">
        
        <div className="cart-machine">

            <div className="machine-top">
                <div className="machine-header">
                    <button onClick={handleClose} className="close-btn">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="machine-slot"></div>
            </div>

            <div className="machine-bottom"></div>

            <div className="receipt-wrapper">

                <div id="receipt" className={`paper-bg sawtooth ${animClass}`}>
                    
                    <div className="logo-container">
                        <span>------</span>
                        <div className="logo-image">
                            <Image src="/logo.png" alt="Traum Logo" fill className="object-contain" />
                        </div>
                    </div>

                    <div className="dash-line" style={{ marginTop: '20px', marginBottom: '20px' }}></div>
                    
                    <div className="ticket-meta">
                      <p>ORDEN: #{orderNumber}</p>
                      <p>FECHA: {currentDate}</p>
                      <p>TER: 01   OP: 12   CAJA: 01</p>
                    </div>

                    <div className="dash-line" style={{ marginTop: '20px', marginBottom: '20px' }}></div>

                    <div className="cart-items">
                      {cartItems.length === 0 ? (
                        <div className="empty-cart flex flex-col items-center gap-2">
                           <p style={{ marginTop: '10px' }}>Tu carrito está vacío</p>
                           <button onClick={handleClose} style={{ marginTop: '16px', padding: '8px 16px', backgroundColor: 'black', color: 'white', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', borderRadius: '4px', cursor: 'pointer' }}>Volver a la tienda</button>
                        </div>
                      ) : (
                        cartItems.map((item) => (
                          <div key={item.id} className="cart-item">
                            <div style={{ display: 'flex' }}>
                                <div className="item-image">
                                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                                </div>
                                <div className="item-info">
                                    <div className="item-details">
                                        <p className="item-name">{item.name}</p>
                                        <p className="item-price">${item.price.toLocaleString("es-CO")}</p>
                                        
                                        <div className="item-controls" style={{ marginTop: '8px' }}>
                                            <div className="item-qty">
                                                <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="qty-btn">-</button>
                                                <span className="qty-val">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="qty-btn">+</button>
                                            </div>
                                            <button onClick={() => removeFromCart(item.id)} className="remove-btn">Quitar</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="dash-line" style={{ marginBottom: '16px' }}></div>

                    <div className="totals-row">
                      <span>SUBTOTAL</span>
                      <span>${cartTotal.toLocaleString("es-CO")}</span>
                    </div>
                    <div className="totals-row">
                      <span>IVA (19%)</span>
                      <span>INCLUIDO</span>
                    </div>
                    <div className="total-final">
                      <span>TOTAL</span>
                      <span>${cartTotal.toLocaleString("es-CO")}</span>
                    </div>

                    <div className="action-buttons">
                        <button onClick={handleClose} className="btn-cancel">
                            CANCELAR
                        </button>
                        <button onClick={handleBuy} disabled={cartItems.length === 0} className="btn-buy">
                            COMPRAR AHORA
                        </button>
                    </div>

                    <div className="barcode-container">
                        <svg viewBox="0 0 100 40" preserveAspectRatio="none">
                            <g fill="#1A1A1A">
                                <rect x="0" y="0" width="3" height="40"/>
                                <rect x="5" y="0" width="1" height="40"/>
                                <rect x="8" y="0" width="4" height="40"/>
                                <rect x="14" y="0" width="2" height="40"/>
                                <rect x="18" y="0" width="1" height="40"/>
                                <rect x="21" y="0" width="5" height="40"/>
                                <rect x="28" y="0" width="2" height="40"/>
                                <rect x="32" y="0" width="4" height="40"/>
                                <rect x="38" y="0" width="1" height="40"/>
                                <rect x="41" y="0" width="3" height="40"/>
                                <rect x="46" y="0" width="2" height="40"/>
                                <rect x="50" y="0" width="5" height="40"/>
                                <rect x="57" y="0" width="1" height="40"/>
                                <rect x="60" y="0" width="3" height="40"/>
                                <rect x="65" y="0" width="4" height="40"/>
                                <rect x="71" y="0" width="2" height="40"/>
                                <rect x="75" y="0" width="1" height="40"/>
                                <rect x="78" y="0" width="5" height="40"/>
                                <rect x="85" y="0" width="2" height="40"/>
                                <rect x="89" y="0" width="4" height="40"/>
                                <rect x="95" y="0" width="1" height="40"/>
                                <rect x="98" y="0" width="2" height="40"/>
                            </g>
                        </svg>
                    </div>
                    
                    <p className="thank-you">¡Gracias!</p>
                </div>
            </div>
        </div>
      </div>
    </>
  )
}
"""

with open("components/CartSidebar.tsx", "w") as f:
    f.write(prefix + new_return)

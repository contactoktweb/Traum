"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

export type CartItem = {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  edition: string
  size: string
}

type CartContextType = {
  cartItems: CartItem[]
  isCartOpen: boolean
  addToCart: (item: Omit<CartItem, 'quantity'>) => void
  removeFromCart: (id: string, size: string) => void
  updateQuantity: (id: string, size: string, quantity: number) => void
  toggleCart: () => void
  cartTotal: number
  cartCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    setIsMounted(true)
    const savedCart = localStorage.getItem('traum_cart')
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart))
      } catch (e) {
        console.error("Failed to parse cart", e)
      }
    }
  }, [])

  // Save to localStorage on change
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('traum_cart', JSON.stringify(cartItems))
    }
  }, [cartItems, isMounted])

  const addToCart = (newItem: Omit<CartItem, 'quantity'>) => {
    setCartItems(prev => {
      const existingProduct = prev.find(item => item.id === newItem.id && item.size === newItem.size)
      if (existingProduct) {
        return prev.map(item => 
          item.id === newItem.id && item.size === newItem.size
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        )
      }
      return [...prev, { ...newItem, quantity: 1 }]
    })
    setIsCartOpen(true) // Auto-open cart when adding
  }

  const removeFromCart = (id: string, size: string) => {
    setCartItems(prev => prev.filter(item => !(item.id === id && item.size === size)))
  }

  const updateQuantity = (id: string, size: string, quantity: number) => {
    if (quantity < 1) return removeFromCart(id, size)
    setCartItems(prev => 
      prev.map(item => 
        item.id === id && item.size === size ? { ...item, quantity } : item
      )
    )
  }

  const toggleCart = () => setIsCartOpen(prev => !prev)

  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0)

  return (
    <CartContext.Provider value={{
      cartItems,
      isCartOpen,
      addToCart,
      removeFromCart,
      updateQuantity,
      toggleCart,
      cartTotal,
      cartCount
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

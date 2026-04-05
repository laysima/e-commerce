import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Product, ProductVariant } from '@/types'

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (product: Product, variant?: ProductVariant, quantity?: number) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
  totalItems: () => number
  totalPrice: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, variant, quantity = 1) => {
        const items = get().items
        // Unique ID per product+variant combo
        const itemId = variant ? `${product.id}-${variant.id}` : product.id
        const existing = items.find(i => i.id === itemId)

        if (existing) {
          // If already in cart, just increase quantity
          set({
            items: items.map(i =>
              i.id === itemId
                ? { ...i, quantity: i.quantity + quantity }
                : i
            ),
          })
        } else {
          // Otherwise add as new item
          set({
            items: [...items, { id: itemId, product, variant, quantity }],
          })
        }
        get().openCart()
      },

      removeItem: (id) =>
        set({ items: get().items.filter(i => i.id !== id) }),

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }
        set({
          items: get().items.map(i =>
            i.id === id ? { ...i, quantity } : i
          ),
        })
      },

      clearCart: () => set({ items: [] }),

      toggleCart: () => set(state => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      // Total number of items in cart (accounts for quantities)
      totalItems: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),

      // Total price in cents (base price + any variant modifier)
      totalPrice: () =>
        get().items.reduce((sum, i) => {
          const base = i.product.price
          const modifier = i.variant?.price_modifier ?? 0
          return sum + (base + modifier) * i.quantity
        }, 0),
    }),
    { name: 'cart-storage' } // localStorage key
  )
)
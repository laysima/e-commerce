import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '@/types'

interface WishlistStore {
  items: Product[]
  addItem: (product: Product) => void
  removeItem: (id: string) => void
  hasItem: (id: string) => boolean
  toggleItem: (product: Product) => void
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        // Prevent duplicates
        if (!get().hasItem(product.id)) {
          set({ items: [...get().items, product] })
        }
      },

      removeItem: (id) =>
        set({ items: get().items.filter(i => i.id !== id) }),

      // Returns true/false — used to show filled/empty heart icon
      hasItem: (id) => get().items.some(i => i.id === id),

      // One function to add or remove depending on current state
      toggleItem: (product) => {
        if (get().hasItem(product.id)) {
          get().removeItem(product.id)
        } else {
          get().addItem(product)
        }
      },
    }),
    { name: 'wishlist-storage' } 
  )
)
import { create } from 'zustand'
import type { Product } from '@/types'

interface WishlistStore {
  items: Product[]
  addItem: (product: Product) => void
  removeItem: (id: string) => void
  hasItem: (id: string) => boolean
  toggleItem: (product: Product) => void
}

export const useWishlistStore = create<WishlistStore>()((set, get) => ({
  items: [],

  addItem: (product) => {
    if (!get().hasItem(product.id)) {
      set({ items: [...get().items, product] })
    }
  },

  removeItem: (id) =>
    set({ items: get().items.filter(i => i.id !== id) }),

  hasItem: (id) => get().items.some(i => i.id === id),

  toggleItem: (product) => {
    if (get().hasItem(product.id)) {
      get().removeItem(product.id)
    } else {
      get().addItem(product)
    }
  },
}))
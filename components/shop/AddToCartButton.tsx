'use client'

import { useState } from 'react'
import { useCartStore } from '@/store/cartStore'
import type { Product, ProductVariant } from '@/types'

export default function AddToCartButton({ product, variant }: { product: Product; variant?: ProductVariant }) {
  const [added, setAdded] = useState(false)
  const addItem = useCartStore(state => state.addItem)
  const outOfStock = product.inventory_count === 0 || variant?.inventory_count === 0

  const handleAdd = () => {
    if (outOfStock) return
    addItem(product, variant)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <button
      onClick={handleAdd}
      disabled={outOfStock}
      className="add-to-bag"
    >
      <span>{added ? 'Added to bag' : outOfStock ? 'Out of stock' : 'Add to bag'}</span>
    </button>
  )
}

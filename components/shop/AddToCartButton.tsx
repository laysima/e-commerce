'use client'

import { useState } from 'react'
import { useCartStore } from '@/store/cartStore'
import type { Product } from '@/types'

export default function AddToCartButton({ product }: { product: Product }) {
  const [added, setAdded] = useState(false)
  const addItem = useCartStore(state => state.addItem)

  const handleAdd = () => {
    if (product.inventory_count === 0) return
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const outOfStock = product.inventory_count === 0

  return (
    <button
      onClick={handleAdd}
      disabled={outOfStock}
      className="add-to-bag"
    >
      <span>{added ? 'Added to bag' : outOfStock ? 'Out of stock' : 'Add to bag'}</span>
      {!outOfStock && <span aria-hidden="true">{added ? 'Done' : '↗'}</span>}
    </button>
  )
}

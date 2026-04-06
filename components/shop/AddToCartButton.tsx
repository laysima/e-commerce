'use client'

import { useState } from 'react'
import { ShoppingBag, Check } from 'lucide-react'
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
      className="flex-1 flex items-center justify-center gap-3 transition-opacity"
      style={{
        backgroundColor: outOfStock ? 'var(--gray-100)' : 'var(--navy)',
        color: outOfStock ? 'var(--gray-400)' : 'var(--cream)',
        fontFamily: 'Jost, sans-serif',
        fontSize: '0.7rem',
        fontWeight: 500,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        padding: '16px 24px',
        cursor: outOfStock ? 'not-allowed' : 'pointer',
        opacity: outOfStock ? 0.6 : 1,
      }}
    >
      {added ? (
        <>
          <Check size={14} /> Added to Bag
        </>
      ) : outOfStock ? (
        'Out of Stock'
      ) : (
        <>
          <ShoppingBag size={14} /> Add to Bag
        </>
      )}
    </button>
  )
}
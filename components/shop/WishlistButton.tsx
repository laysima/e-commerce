'use client'

import { useWishlistStore } from '@/store/wishlistStore'
import type { Product } from '@/types'

export default function WishlistButton({ product }: { product: Product }) {
  const { hasItem, toggleItem } = useWishlistStore()
  const isWishlisted = hasItem(product.id)

  return (
    <button
      onClick={() => toggleItem(product)}
      className={`save-piece ${isWishlisted ? 'is-saved' : ''}`}
      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      {isWishlisted ? 'Saved' : 'Save for later'}
    </button>
  )
}

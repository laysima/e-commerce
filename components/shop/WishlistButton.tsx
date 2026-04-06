'use client'

import { Heart } from 'lucide-react'
import { useWishlistStore } from '@/store/wishlistStore'
import type { Product } from '@/types'

export default function WishlistButton({ product }: { product: Product }) {
  const { hasItem, toggleItem } = useWishlistStore()
  const isWishlisted = hasItem(product.id)

  return (
    <button
      onClick={() => toggleItem(product)}
      className="flex items-center justify-center transition-all hover:opacity-70"
      style={{
        width: '52px',
        border: '1px solid var(--gray-200)',
        color: isWishlisted ? 'var(--gold)' : 'var(--gray-400)',
        backgroundColor: 'var(--white)',
        flexShrink: 0,
      }}
      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart
        size={17}
        fill={isWishlisted ? 'var(--gold)' : 'none'}
      />
    </button>
  )
}
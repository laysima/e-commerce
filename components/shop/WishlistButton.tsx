'use client'

import { Heart } from 'lucide-react'
import { useWishlistStore } from '@/store/wishlistStore'
import type { Product } from '@/types'

export default function WishlistButton({ product, className = '' }: { product: Product; className?: string }) {
  const isWishlisted = useWishlistStore(state => state.hasItem(product.id))
  const toggleItem = useWishlistStore(state => state.toggleItem)

  return (
    <button
      type="button"
      onClick={() => toggleItem(product)}
      className={`save-heart ${isWishlisted ? 'is-saved' : ''} ${className}`}
      aria-label={isWishlisted ? `Remove ${product.name} from saved` : `Save ${product.name}`}
      aria-pressed={isWishlisted}
    >
      <Heart aria-hidden="true" size={18} strokeWidth={1.25} fill={isWishlisted ? 'currentColor' : 'none'} />
    </button>
  )
}

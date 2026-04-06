'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingBag, X } from 'lucide-react'
import { useWishlistStore } from '@/store/wishlistStore'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types'

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore()
  const addToCart = useCartStore(state => state.addItem)

  return (
    <div style={{ backgroundColor: 'var(--white)', minHeight: '100vh' }}>

      {/* Header */}
      <div
        style={{
          borderBottom: '1px solid var(--gray-100)',
          backgroundColor: 'var(--cream)',
          padding: '5rem 0 3.5rem',
        }}
      >
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-2 mb-6">
            <Link
              href="/"
              className="transition-opacity hover:opacity-60"
              style={{
                fontFamily: 'Jost, sans-serif',
                fontSize: '0.72rem',
                fontWeight: 300,
                color: 'var(--gray-400)',
              }}
            >
              Home
            </Link>
            <span style={{ color: 'var(--gray-200)' }}>/</span>
            <span
              style={{
                fontFamily: 'Jost, sans-serif',
                fontSize: '0.72rem',
                fontWeight: 400,
                color: 'var(--navy)',
              }}
            >
              Wishlist
            </span>
          </div>
          <p className="eyebrow mb-3">Saved</p>
          <h1
            style={{
              fontFamily: 'Playfair Display, serif',
              fontWeight: 400,
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              color: 'var(--navy)',
            }}
          >
            My Wishlist
          </h1>
          {items.length > 0 && (
            <p
              className="mt-2"
              style={{
                fontFamily: 'Jost, sans-serif',
                fontWeight: 300,
                fontSize: '0.82rem',
                color: 'var(--gray-400)',
                letterSpacing: '0.05em',
              }}
            >
              {items.length} {items.length === 1 ? 'piece' : 'pieces'} saved
            </p>
          )}
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 lg:px-12 py-14">

        {/* Empty State */}
        {items.length === 0 ? (
          <div className="text-center py-24">
            <Heart
              size={32}
              style={{ color: 'var(--gray-200)', margin: '0 auto 1.5rem' }}
            />
            <h3
              style={{
                fontFamily: 'Playfair Display, serif',
                fontWeight: 400,
                fontSize: '1.6rem',
                color: 'var(--navy)',
                marginBottom: '0.75rem',
              }}
            >
              Your wishlist is empty
            </h3>
            <p
              style={{
                fontFamily: 'Jost, sans-serif',
                fontWeight: 300,
                fontSize: '0.85rem',
                color: 'var(--gray-400)',
                marginBottom: '2.5rem',
              }}
            >
              Save pieces you love and come back to them anytime.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-3 transition-opacity hover:opacity-80"
              style={{
                backgroundColor: 'var(--navy)',
                color: 'var(--cream)',
                fontFamily: 'Jost, sans-serif',
                fontSize: '0.68rem',
                fontWeight: 500,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                padding: '13px 28px',
              }}
            >
              Browse Collection
            </Link>
          </div>
        ) : (
          <>
            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
              {(items as Product[]).map(product => (
                <div key={product.id} className="group relative">

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(product.id)}
                    className="absolute top-3 right-3 z-10 w-7 h-7 flex items-center justify-center transition-opacity hover:opacity-70"
                    style={{
                      backgroundColor: 'var(--white)',
                      border: '1px solid var(--gray-100)',
                      color: 'var(--gray-400)',
                    }}
                    aria-label="Remove from wishlist"
                  >
                    <X size={12} />
                  </button>

                  {/* Image */}
                  <Link href={`/products/${product.slug}`}>
                    <div
                      className="relative img-zoom mb-4"
                      style={{
                        aspectRatio: '3/4',
                        backgroundColor: 'var(--gray-50)',
                      }}
                    >
                      {product.images?.[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 50vw, 25vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag size={28} style={{ color: 'var(--gray-200)' }} />
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Info */}
                  <p className="eyebrow mb-1.5" style={{ fontSize: '0.58rem' }}>
                    {(product.category as { name: string } | null)?.name}
                  </p>
                  <Link href={`/products/${product.slug}`}>
                    <h3
                      className="line-clamp-1 transition-opacity group-hover:opacity-50 mb-2"
                      style={{
                        fontFamily: 'Playfair Display, serif',
                        fontWeight: 400,
                        fontSize: '1rem',
                        color: 'var(--navy)',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {product.name}
                    </h3>
                  </Link>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        style={{
                          fontFamily: 'Jost, sans-serif',
                          fontWeight: 400,
                          fontSize: '0.88rem',
                          color: 'var(--gray-900)',
                        }}
                      >
                        {formatPrice(product.price)}
                      </span>
                      {product.compare_at_price && (
                        <span
                          style={{
                            fontFamily: 'Jost, sans-serif',
                            fontWeight: 300,
                            fontSize: '0.82rem',
                            color: 'var(--gray-300)',
                            textDecoration: 'line-through',
                          }}
                        >
                          {formatPrice(product.compare_at_price)}
                        </span>
                      )}
                    </div>

                    {/* Add to Cart */}
                    <button
                      onClick={() => addToCart(product)}
                      disabled={product.inventory_count === 0}
                      className="transition-opacity hover:opacity-70 disabled:opacity-30"
                      style={{
                        color: 'var(--navy)',
                      }}
                      aria-label="Add to cart"
                    >
                      <ShoppingBag size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Move all to cart */}
            <div
              className="mt-14 pt-8 flex items-center justify-between"
              style={{ borderTop: '1px solid var(--gray-100)' }}
            >
              <p
                style={{
                  fontFamily: 'Jost, sans-serif',
                  fontWeight: 300,
                  fontSize: '0.85rem',
                  color: 'var(--gray-400)',
                }}
              >
                {items.length} {items.length === 1 ? 'piece' : 'pieces'} saved
              </p>
              <button
                onClick={() => {
                  items.forEach(product => {
                    if (product.inventory_count > 0) addToCart(product)
                  })
                }}
                className="transition-opacity hover:opacity-80"
                style={{
                  backgroundColor: 'var(--navy)',
                  color: 'var(--cream)',
                  fontFamily: 'Jost, sans-serif',
                  fontSize: '0.68rem',
                  fontWeight: 500,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  padding: '12px 24px',
                }}
              >
                Add All to Bag
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
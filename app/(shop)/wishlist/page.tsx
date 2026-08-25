'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useWishlistStore } from '@/store/wishlistStore'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'
import type { Category, Product } from '@/types'

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore()
  const addToCart = useCartStore(state => state.addItem)
  const products = items as Product[]

  return (
    <div className="saved-page">
      <header className="saved-page__header">
        <div>
          <p className="section-index">Personal edit</p>
          <h1>Saved pieces</h1>
        </div>
        <p>{String(products.length).padStart(2, '0')} {products.length === 1 ? 'piece' : 'pieces'}</p>
      </header>

      {products.length === 0 ? (
        <div className="saved-empty">
          <p>Nothing saved yet.</p>
          <span>Keep the pieces you want to revisit in one quiet place.</span>
          <Link href="/products" className="editorial-link editorial-link--dark">Browse the collection <span aria-hidden="true">↗</span></Link>
        </div>
      ) : (
        <>
          <div className="saved-grid">
            {products.map((product, index) => (
              <article className="saved-piece" key={product.id}>
                <div className="saved-piece__media">
                  <Link href={`/products/${product.slug}`}>
                    {product.images?.[0] ? (
                      <Image src={product.images[0]} alt={product.name} fill sizes="(max-width: 700px) 50vw, 25vw" />
                    ) : (
                      <span>Image forthcoming</span>
                    )}
                  </Link>
                  <small>{String(index + 1).padStart(2, '0')}</small>
                  <button type="button" onClick={() => removeItem(product.id)}>Remove</button>
                </div>
                <div className="saved-piece__info">
                  <div>
                    <p>{(product.category as Category | null)?.name ?? 'Cressida'}</p>
                    <Link href={`/products/${product.slug}`}>{product.name}</Link>
                  </div>
                  <div>
                    <p>{formatPrice(product.price)}</p>
                    <button
                      type="button"
                      disabled={product.inventory_count === 0}
                      onClick={() => addToCart(product)}
                    >
                      {product.inventory_count === 0 ? 'Unavailable' : 'Add to bag'}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <footer className="saved-page__footer">
            <p>{products.length} saved {products.length === 1 ? 'piece' : 'pieces'}</p>
            <button
              type="button"
              onClick={() => products.forEach(product => product.inventory_count > 0 && addToCart(product))}
            >
              Add available pieces to bag ↗
            </button>
          </footer>
        </>
      )}
    </div>
  )
}

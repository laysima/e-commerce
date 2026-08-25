'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'
import type { Category } from '@/types'

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice } = useCartStore()

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (event: KeyboardEvent) => event.key === 'Escape' && closeCart()
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [closeCart, isOpen])

  return (
    <>
      {isOpen && <button className="bag-backdrop" onClick={closeCart} aria-label="Close shopping bag" />}
      <aside className={`bag-drawer ${isOpen ? 'is-open' : ''}`} aria-hidden={!isOpen} aria-label="Shopping bag">
        <header className="bag-drawer__header">
          <div><span>Shopping bag</span><p>{String(items.length).padStart(2, '0')} items</p></div>
          <button type="button" onClick={closeCart}>Close</button>
        </header>

        {items.length === 0 ? (
          <div className="bag-empty">
            <p>Your bag is empty.</p>
            <span>Discover the collection and begin your personal edit.</span>
            <button type="button" onClick={closeCart}>Continue shopping ↗</button>
          </div>
        ) : (
          <>
            <div className="bag-items">
              {items.map((item, index) => (
                <article className="bag-item" key={item.id}>
                  <div className="bag-item__image">
                    {item.product.images?.[0] ? (
                      <Image src={item.product.images[0]} alt={item.product.name} fill sizes="100px" />
                    ) : <span>{String(index + 1).padStart(2, '0')}</span>}
                  </div>
                  <div className="bag-item__body">
                    <div className="bag-item__title">
                      <div>
                        <span>{(item.product.category as Category | null)?.name ?? 'Cressida'}</span>
                        <Link href={`/products/${item.product.slug}`} onClick={closeCart}>{item.product.name}</Link>
                        {item.variant && <small>{item.variant.name}: {item.variant.value}</small>}
                      </div>
                      <p>{formatPrice((item.product.price + (item.variant?.price_modifier ?? 0)) * item.quantity)}</p>
                    </div>
                    <div className="bag-item__controls">
                      <div>
                        <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label="Decrease quantity">−</button>
                        <span>{item.quantity}</span>
                        <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label="Increase quantity">+</button>
                      </div>
                      <button type="button" onClick={() => removeItem(item.id)}>Remove</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <footer className="bag-drawer__footer">
              <div><span>Subtotal</span><strong>{formatPrice(totalPrice())}</strong></div>
              <p>Shipping and duties are calculated at checkout.</p>
              <Link href="/checkout" onClick={closeCart}>Proceed to checkout <span aria-hidden="true">↗</span></Link>
              <button type="button" onClick={closeCart}>Continue shopping</button>
            </footer>
          </>
        )}
      </aside>
    </>
  )
}

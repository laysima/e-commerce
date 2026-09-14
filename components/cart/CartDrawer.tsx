'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'
import type { Category } from '@/types'

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice } = useCartStore()
  const dialog = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (!isOpen) {
      dialog.current?.close()
      return
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog.current?.showModal()
    return () => { document.body.style.overflow = previousOverflow }
  }, [isOpen])

  return (
      <dialog ref={dialog} className={`bag-drawer ${isOpen ? 'is-open' : ''}`} aria-label="Shopping bag" onCancel={closeCart} onClick={event => {
        if (event.target !== event.currentTarget) return
        const bounds = event.currentTarget.getBoundingClientRect()
        if (event.clientX < bounds.left || event.clientX > bounds.right) closeCart()
      }}>
        <header className="bag-drawer__header">
          <div><span>Shopping bag</span><p>{items.length} {items.length === 1 ? 'item' : 'items'}</p></div>
          <button type="button" onClick={closeCart}>Close</button>
        </header>

        {items.length === 0 ? (
          <div className="bag-empty">
            <p>Your bag is empty.</p>
            <span>Discover the collection and begin your personal edit.</span>
            <button type="button" onClick={closeCart}>Continue shopping</button>
          </div>
        ) : (
          <>
            <div className="bag-items">
              {items.map(item => (
                <article className="bag-item" key={item.id}>
                  <div className="bag-item__image">
                    {item.product.images?.[0] ? (
                      <Image src={item.product.images[0]} alt={item.product.name} fill sizes="100px" />
                    ) : <span>Image forthcoming</span>}
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
              <Link href="/checkout" onClick={closeCart}>Proceed to checkout</Link>
              <button type="button" onClick={closeCart}>Continue shopping</button>
            </footer>
          </>
        )}
      </dialog>
  )
}

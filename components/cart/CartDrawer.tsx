'use client'

import Link from 'next/link'
import Image from 'next/image'
import { X, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice } = useCartStore()

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          style={{ backgroundColor: 'rgba(12,19,34,0.4)', backdropFilter: 'blur(2px)' }}
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div
        className="fixed top-0 right-0 h-full z-50 flex flex-col"
        style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: 'var(--white)',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          boxShadow: '-20px 0 60px rgba(0,0,0,0.08)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-7 py-5"
          style={{ borderBottom: '1px solid var(--gray-100)' }}
        >
          <div>
            <p className="eyebrow">Your Bag</p>
            {items.length > 0 && (
              <p
                style={{
                  fontFamily: 'Jost, sans-serif',
                  fontSize: '0.75rem',
                  fontWeight: 300,
                  color: 'var(--gray-400)',
                  marginTop: '2px',
                }}
              >
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </p>
            )}
          </div>
          <button
            onClick={closeCart}
            className="transition-opacity hover:opacity-50"
            style={{ color: 'var(--navy)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
            <ShoppingBag size={32} style={{ color: 'var(--gray-200)', marginBottom: '1.5rem' }} />
            <h3
              style={{
                fontFamily: 'Playfair Display, serif',
                fontWeight: 400,
                fontSize: '1.4rem',
                color: 'var(--navy)',
                marginBottom: '0.75rem',
              }}
            >
              Your bag is empty
            </h3>
            <p
              style={{
                fontFamily: 'Jost, sans-serif',
                fontWeight: 300,
                fontSize: '0.85rem',
                color: 'var(--gray-400)',
                marginBottom: '2.5rem',
                lineHeight: 1.7,
              }}
            >
              Discover our curated collection and add your favourite pieces.
            </p>
            <button
              onClick={closeCart}
              className="transition-opacity hover:opacity-80"
              style={{
                backgroundColor: 'var(--navy)',
                color: 'var(--cream)',
                fontFamily: 'Jost, sans-serif',
                fontSize: '0.7rem',
                fontWeight: 500,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                padding: '13px 28px',
              }}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="flex-1 overflow-y-auto py-6 px-7 space-y-6 no-scrollbar">
              {items.map(item => (
                <div
                  key={item.id}
                  className="flex gap-4"
                  style={{ paddingBottom: '1.5rem', borderBottom: '1px solid var(--gray-100)' }}
                >
                  {/* Image */}
                  <div
                    className="relative shrink-0"
                    style={{ width: '80px', height: '100px', backgroundColor: 'var(--gray-50)' }}
                  >
                    {item.product.images?.[0] ? (
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag size={18} style={{ color: 'var(--gray-200)' }} />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p
                      className="eyebrow mb-1"
                      style={{ fontSize: '0.58rem' }}
                    >
                      {(item.product.category as { name: string } | null)?.name}
                    </p>
                    <p
                      className="line-clamp-1"
                      style={{
                        fontFamily: 'Playfair Display, serif',
                        fontWeight: 400,
                        fontSize: '0.95rem',
                        color: 'var(--navy)',
                        marginBottom: '4px',
                      }}
                    >
                      {item.product.name}
                    </p>
                    {item.variant && (
                      <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.72rem', fontWeight: 300, color: 'var(--gray-400)' }}>
                        {item.variant.name}: {item.variant.value}
                      </p>
                    )}
                    <p
                      style={{
                        fontFamily: 'Jost, sans-serif',
                        fontWeight: 400,
                        fontSize: '0.85rem',
                        color: 'var(--gold)',
                        marginTop: '6px',
                        marginBottom: '10px',
                      }}
                    >
                      {formatPrice((item.product.price + (item.variant?.price_modifier ?? 0)) * item.quantity)}
                    </p>

                    {/* Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="transition-opacity hover:opacity-50"
                          style={{
                            width: '24px',
                            height: '24px',
                            border: '1px solid var(--gray-200)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--gray-600)',
                          }}
                        >
                          <Minus size={10} />
                        </button>
                        <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.8rem', fontWeight: 400, color: 'var(--navy)', minWidth: '16px', textAlign: 'center' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="transition-opacity hover:opacity-50"
                          style={{
                            width: '24px',
                            height: '24px',
                            border: '1px solid var(--gray-200)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--gray-600)',
                          }}
                        >
                          <Plus size={10} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="transition-opacity hover:opacity-50"
                        style={{ color: 'var(--gray-300)' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div
              className="px-7 py-6"
              style={{ borderTop: '1px solid var(--gray-100)' }}
            >
              <div className="flex items-center justify-between mb-1">
                <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.7rem', fontWeight: 400, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gray-400)' }}>
                  Subtotal
                </span>
                <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: 500, fontSize: '1.1rem', color: 'var(--navy)' }}>
                  {formatPrice(totalPrice())}
                </span>
              </div>
              <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.72rem', fontWeight: 300, color: 'var(--gray-400)', marginBottom: '1.5rem' }}>
                Shipping and duties calculated at checkout
              </p>

              <Link
                href="/checkout"
                onClick={closeCart}
                className="block w-full text-center transition-opacity hover:opacity-80 mb-3"
                style={{
                  backgroundColor: 'var(--navy)',
                  color: 'var(--cream)',
                  fontFamily: 'Jost, sans-serif',
                  fontSize: '0.7rem',
                  fontWeight: 500,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  padding: '15px',
                }}
              >
                Proceed to Checkout
              </Link>
              <button
                onClick={closeCart}
                className="block w-full text-center transition-opacity hover:opacity-50"
                style={{
                  fontFamily: 'Jost, sans-serif',
                  fontSize: '0.72rem',
                  fontWeight: 300,
                  color: 'var(--gray-400)',
                  letterSpacing: '0.08em',
                  padding: '8px',
                }}
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )
}
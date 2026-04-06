import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { formatPrice, formatDate } from '@/lib/utils'
import { Package, ArrowRight, CheckCircle2 } from 'lucide-react'

type OrderItem = {
  id: string
  quantity: number
  unit_price: number
  product: {
    name: string
    images: string[]
    slug: string
  } | null
}

type Order = {
  id: string
  status: string
  total: number
  created_at: string
  shipping_address: {
    full_name: string
    line1: string
    city: string
    state: string
    postal_code: string
  } | null
  order_items: OrderItem[]
}

const statusColors: Record<string, string> = {
  pending: '#F59E0B',
  processing: '#3B82F6',
  shipped: '#8B5CF6',
  delivered: '#10B981',
  cancelled: '#EF4444',
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>
}) {
  const supabase = await createClient()
  const params = await searchParams

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: orders } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        product:products (name, images, slug)
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

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
              My Orders
            </span>
          </div>
          <p className="eyebrow mb-3">Account</p>
          <h1
            style={{
              fontFamily: 'Playfair Display, serif',
              fontWeight: 400,
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              color: 'var(--navy)',
            }}
          >
            My Orders
          </h1>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 lg:px-12 py-12">

        {/* Success Banner */}
        {params.success && (
          <div
            className="flex items-center gap-3 mb-8 px-5 py-4"
            style={{
              backgroundColor: 'rgba(16,185,129,0.06)',
              border: '1px solid rgba(16,185,129,0.2)',
            }}
          >
            <CheckCircle2 size={18} style={{ color: '#10B981', flexShrink: 0 }} />
            <div>
              <p
                style={{
                  fontFamily: 'Jost, sans-serif',
                  fontWeight: 500,
                  fontSize: '0.88rem',
                  color: 'var(--navy)',
                }}
              >
                Order placed successfully!
              </p>
              <p
                style={{
                  fontFamily: 'Jost, sans-serif',
                  fontWeight: 300,
                  fontSize: '0.8rem',
                  color: 'var(--gray-400)',
                  marginTop: '2px',
                }}
              >
                Thank you for your purchase. You will receive a confirmation email shortly.
              </p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {(!orders || orders.length === 0) ? (
          <div className="text-center py-24">
            <Package
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
              No orders yet
            </h3>
            <p
              style={{
                fontFamily: 'Jost, sans-serif',
                fontWeight: 300,
                fontSize: '0.85rem',
                color: 'var(--gray-400)',
                marginBottom: '2rem',
              }}
            >
              Your order history will appear here.
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
              Start Shopping <ArrowRight size={13} />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {(orders as Order[]).map((order) => (
              <div
                key={order.id}
                style={{
                  border: '1px solid var(--gray-100)',
                  backgroundColor: 'var(--white)',
                }}
              >
                {/* Order Header */}
                <div
                  className="flex flex-wrap items-center justify-between gap-4 px-6 py-4"
                  style={{
                    borderBottom: '1px solid var(--gray-100)',
                    backgroundColor: 'var(--cream)',
                  }}
                >
                  <div className="flex flex-wrap gap-8">
                    <div>
                      <p className="eyebrow mb-1" style={{ fontSize: '0.58rem' }}>
                        Order Number
                      </p>
                      <p
                        style={{
                          fontFamily: 'Jost, sans-serif',
                          fontSize: '0.8rem',
                          fontWeight: 400,
                          color: 'var(--navy)',
                          letterSpacing: '0.05em',
                        }}
                      >
                        #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                    </div>
                    <div>
                      <p className="eyebrow mb-1" style={{ fontSize: '0.58rem' }}>
                        Date
                      </p>
                      <p
                        style={{
                          fontFamily: 'Jost, sans-serif',
                          fontSize: '0.8rem',
                          fontWeight: 300,
                          color: 'var(--gray-600)',
                        }}
                      >
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                    <div>
                      <p className="eyebrow mb-1" style={{ fontSize: '0.58rem' }}>
                        Total
                      </p>
                      <p
                        style={{
                          fontFamily: 'Jost, sans-serif',
                          fontSize: '0.8rem',
                          fontWeight: 400,
                          color: 'var(--navy)',
                        }}
                      >
                        {formatPrice(order.total)}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div
                    className="flex items-center gap-2 px-3 py-1.5"
                    style={{
                      border: `1px solid ${statusColors[order.status]}30`,
                      backgroundColor: `${statusColors[order.status]}10`,
                    }}
                  >
                    <div
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: statusColors[order.status],
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: 'Jost, sans-serif',
                        fontSize: '0.68rem',
                        fontWeight: 500,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: statusColors[order.status],
                      }}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="px-6 py-5 space-y-4">
                  {order.order_items?.map((item: OrderItem) => (
                    <div key={item.id} className="flex items-center gap-4">
                      {/* Image */}
                      <div
                        style={{
                          width: '52px',
                          height: '64px',
                          backgroundColor: 'var(--gray-50)',
                          flexShrink: 0,
                          overflow: 'hidden',
                          position: 'relative',
                        }}
                      >
                        {item.product?.images?.[0] && (
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            fill
                            sizes="52px"
                            className="object-cover"
                          />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        {item.product?.slug ? (
                          <Link
                            href={`/products/${item.product.slug}`}
                            className="hover-line transition-opacity hover:opacity-60"
                          >
                            <p
                              style={{
                                fontFamily: 'Playfair Display, serif',
                                fontWeight: 400,
                                fontSize: '0.95rem',
                                color: 'var(--navy)',
                              }}
                            >
                              {item.product.name}
                            </p>
                          </Link>
                        ) : (
                          <p
                            style={{
                              fontFamily: 'Playfair Display, serif',
                              fontWeight: 400,
                              fontSize: '0.95rem',
                              color: 'var(--navy)',
                            }}
                          >
                            {item.product?.name ?? 'Product unavailable'}
                          </p>
                        )}
                        <p
                          style={{
                            fontFamily: 'Jost, sans-serif',
                            fontSize: '0.75rem',
                            fontWeight: 300,
                            color: 'var(--gray-400)',
                            marginTop: '3px',
                          }}
                        >
                          Qty: {item.quantity} · {formatPrice(item.unit_price)}
                        </p>
                      </div>

                      <p
                        style={{
                          fontFamily: 'Jost, sans-serif',
                          fontWeight: 400,
                          fontSize: '0.88rem',
                          color: 'var(--navy)',
                          flexShrink: 0,
                        }}
                      >
                        {formatPrice(item.unit_price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Shipping Address */}
                {order.shipping_address && (
                  <div
                    className="px-6 py-4"
                    style={{ borderTop: '1px solid var(--gray-100)' }}
                  >
                    <p className="eyebrow mb-2" style={{ fontSize: '0.58rem' }}>
                      Shipped To
                    </p>
                    <p
                      style={{
                        fontFamily: 'Jost, sans-serif',
                        fontSize: '0.8rem',
                        fontWeight: 300,
                        color: 'var(--gray-400)',
                        lineHeight: 1.6,
                      }}
                    >
                      {order.shipping_address.full_name} ·{' '}
                      {order.shipping_address.line1},{' '}
                      {order.shipping_address.city},{' '}
                      {order.shipping_address.state}{' '}
                      {order.shipping_address.postal_code}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
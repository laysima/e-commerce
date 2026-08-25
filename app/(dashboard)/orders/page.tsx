import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { formatDate, formatPrice } from '@/lib/utils'

type OrderItem = {
  id: string
  quantity: number
  unit_price: number
  product: { name: string; images: string[]; slug: string } | null
}

type Order = {
  id: string
  status: string
  total: number
  created_at: string
  shipping_address: { full_name: string; line1: string; city: string; state: string; postal_code: string } | null
  order_items: OrderItem[]
}

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ success?: string }> }) {
  const [params, supabase] = await Promise.all([searchParams, createClient()])
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data } = await supabase
    .from('orders')
    .select('*, order_items (*, product:products (name, images, slug))')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  const orders = (data ?? []) as Order[]

  return (
    <main className="orders-page">
      <header className="orders-page__header">
        <div><p className="section-index">Account archive</p><h1>Your orders.</h1></div>
        <p>{String(orders.length).padStart(2, '0')} recorded</p>
      </header>

      {params.success && (
        <div className="order-confirmation"><strong>Order received.</strong><span>A confirmation email will follow shortly.</span></div>
      )}

      {orders.length === 0 ? (
        <div className="orders-empty">
          <p>No orders yet.</p>
          <span>Your order history will collect here over time.</span>
          <Link href="/products" className="editorial-link editorial-link--dark">Start with the collection <span aria-hidden="true">↗</span></Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order, orderIndex) => (
            <article className="order-entry" key={order.id}>
              <header>
                <span>{String(orderIndex + 1).padStart(2, '0')}</span>
                <div><small>Order</small><strong>#{order.id.slice(0, 8).toUpperCase()}</strong></div>
                <div><small>Date</small><strong>{formatDate(order.created_at)}</strong></div>
                <div><small>Total</small><strong>{formatPrice(order.total)}</strong></div>
                <p data-status={order.status}>{order.status}</p>
              </header>

              <div className="order-entry__items">
                {order.order_items.map(item => (
                  <div className="order-line" key={item.id}>
                    <div className="order-line__image">
                      {item.product?.images?.[0] && <Image src={item.product.images[0]} alt={item.product.name} fill sizes="82px" />}
                    </div>
                    <div>
                      {item.product?.slug ? <Link href={`/products/${item.product.slug}`}>{item.product.name}</Link> : <p>{item.product?.name ?? 'Product unavailable'}</p>}
                      <span>Quantity {item.quantity} / {formatPrice(item.unit_price)} each</span>
                    </div>
                    <strong>{formatPrice(item.unit_price * item.quantity)}</strong>
                  </div>
                ))}
              </div>

              {order.shipping_address && (
                <footer><span>Delivered to</span><p>{order.shipping_address.full_name}, {order.shipping_address.line1}, {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}</p></footer>
              )}
            </article>
          ))}
        </div>
      )}
    </main>
  )
}

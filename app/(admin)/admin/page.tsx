import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'

type RecentOrder = {
  id: string
  status: string
  total: number
  profiles: {
    full_name: string | null
    email: string | null
  } | null
}

const LOW_STOCK_THRESHOLD = 15

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Fetch stats
  const [
    { count: totalOrders },
    { count: totalProducts },
    { count: totalUsers },
    { data: recentOrders },
    { data: revenue },
    { data: lowStockProducts },
  ] = await Promise.all([
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase
      .from('orders')
      .select('*, profiles(full_name, email)')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('orders')
      .select('total')
      .eq('status', 'delivered'),
    supabase
      .from('products')
      .select('id, name, slug, inventory_count')
      .eq('is_active', true)
      .lt('inventory_count', LOW_STOCK_THRESHOLD)
      .order('inventory_count', { ascending: true }),
  ])

  const totalRevenue = revenue?.reduce((sum, o) => sum + o.total, 0) ?? 0

  const stats = [
    {
      label: 'Total Revenue',
      value: formatPrice(totalRevenue),
      sub: 'From delivered orders',
    },
    {
      label: 'Total Orders',
      value: totalOrders ?? 0,
      sub: 'All time',
    },
    {
      label: 'Products',
      value: totalProducts ?? 0,
      sub: 'Active listings',
    },
    {
      label: 'Customers',
      value: totalUsers ?? 0,
      sub: 'Registered accounts',
    },
  ]

  const statusColors: Record<string, string> = {
    pending: '#F59E0B',
    processing: '#3B82F6',
    shipped: '#8B5CF6',
    delivered: '#10B981',
    cancelled: '#EF4444',
  }

  return (
    <div className="p-8">

      {/* Header */}
      <div className="mb-10">
        <p className="eyebrow mb-2">Overview</p>
        <h1
          style={{
            fontFamily: 'Playfair Display, serif',
            fontWeight: 400,
            fontSize: '2.2rem',
            color: 'var(--navy)',
          }}
        >
          Dashboard
        </h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 mb-12" style={{ borderTop: '1px solid var(--gray-200)', borderBottom: '1px solid var(--gray-200)' }}>
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className="p-6"
            style={{
              borderRight: index < stats.length - 1 ? '1px solid var(--gray-200)' : undefined,
            }}
          >
            <p
              style={{
                fontFamily: 'Playfair Display, serif',
                fontWeight: 500,
                fontSize: '1.8rem',
                color: 'var(--navy)',
                lineHeight: 1,
                marginBottom: '6px',
              }}
            >
              {stat.value}
            </p>
            <p
              style={{
                fontFamily: 'Jost, sans-serif',
                fontSize: '0.7rem',
                fontWeight: 500,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--gray-600)',
              }}
            >
              {stat.label}
            </p>
            <p
              style={{
                fontFamily: 'Jost, sans-serif',
                fontSize: '0.72rem',
                fontWeight: 300,
                color: 'var(--gray-400)',
                marginTop: '3px',
              }}
            >
              {stat.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Low Stock */}
      <div className="mb-12" style={{ borderTop: '1px solid var(--gray-200)', borderBottom: '1px solid var(--gray-200)' }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--gray-100)' }}>
          <p className="eyebrow" style={{ fontSize: '0.6rem' }}>Low Stock</p>
        </div>
        {lowStockProducts?.length ? (
          <div className="divide-y divide-gray-50">
            {lowStockProducts.map(product => (
              <Link
                key={product.id}
                href={`/admin/products/${product.id}`}
                className="flex items-center justify-between px-6 py-4 transition-opacity hover:opacity-70"
              >
                <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.82rem', fontWeight: 400, color: 'var(--navy)' }}>
                  {product.name}
                </p>
                <p
                  style={{
                    fontFamily: 'Jost, sans-serif',
                    fontSize: '0.72rem',
                    fontWeight: 500,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: product.inventory_count === 0 ? '#EF4444' : '#F59E0B',
                  }}
                >
                  {product.inventory_count === 0 ? 'Out of stock' : `${product.inventory_count} left`}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="px-6 py-6" style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.8rem', fontWeight: 300, color: 'var(--gray-400)' }}>
            Every listing is well stocked.
          </p>
        )}
      </div>

      {/* Recent Orders */}
      <div
        style={{
          borderTop: '1px solid var(--gray-200)',
          borderBottom: '1px solid var(--gray-200)',
        }}
      >
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid var(--gray-100)' }}
        >
          <p className="eyebrow" style={{ fontSize: '0.6rem' }}>
            Recent Orders
          </p>
        </div>

        <div className="divide-y divide-gray-50">
          {(recentOrders as RecentOrder[])?.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between px-6 py-4"
            >
              <div>
                <p
                  style={{
                    fontFamily: 'Jost, sans-serif',
                    fontSize: '0.82rem',
                    fontWeight: 400,
                    color: 'var(--navy)',
                  }}
                >
                  {order.profiles?.full_name ?? order.profiles?.email ?? 'Guest'}
                </p>
                <p
                  style={{
                    fontFamily: 'Jost, sans-serif',
                    fontSize: '0.72rem',
                    fontWeight: 300,
                    color: 'var(--gray-400)',
                    marginTop: '2px',
                  }}
                >
                  #{order.id.slice(0, 8).toUpperCase()}
                </p>
              </div>
              <div className="flex items-center gap-6">
                <p
                  style={{
                    fontFamily: 'Jost, sans-serif',
                    fontSize: '0.85rem',
                    fontWeight: 400,
                    color: 'var(--navy)',
                  }}
                >
                  {formatPrice(order.total)}
                </p>
                <div
                  className="flex items-center gap-1.5 px-2.5 py-1"
                  style={{
                    border: `1px solid ${statusColors[order.status]}30`,
                    backgroundColor: `${statusColors[order.status]}10`,
                  }}
                >
                  <div
                    style={{
                      width: '5px',
                      height: '5px',
                      borderRadius: '50%',
                      backgroundColor: statusColors[order.status],
                    }}
                  />
                  <span
                    style={{
                      fontFamily: 'Jost, sans-serif',
                      fontSize: '0.65rem',
                      fontWeight: 500,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: statusColors[order.status],
                    }}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'
import { ShoppingBag, Package, Users, TrendingUp } from 'lucide-react'

type RecentOrder = {
  id: string
  status: string
  total: number
  profiles: {
    full_name: string | null
    email: string | null
  } | null
}

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Fetch stats
  const [
    { count: totalOrders },
    { count: totalProducts },
    { count: totalUsers },
    { data: recentOrders },
    { data: revenue },
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
  ])

  const totalRevenue = revenue?.reduce((sum, o) => sum + o.total, 0) ?? 0

  const stats = [
    {
      label: 'Total Revenue',
      value: formatPrice(totalRevenue),
      icon: TrendingUp,
      sub: 'From delivered orders',
    },
    {
      label: 'Total Orders',
      value: totalOrders ?? 0,
      icon: ShoppingBag,
      sub: 'All time',
    },
    {
      label: 'Products',
      value: totalProducts ?? 0,
      icon: Package,
      sub: 'Active listings',
    },
    {
      label: 'Customers',
      value: totalUsers ?? 0,
      icon: Users,
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
        {stats.map(stat => (
          <div
            key={stat.label}
            className="p-6"
            style={{
              backgroundColor: 'var(--white)',
              border: '1px solid var(--gray-100)',
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-9 h-9 flex items-center justify-center rounded-sm"
                style={{ backgroundColor: 'rgba(184,149,74,0.1)' }}
              >
                <stat.icon size={15} style={{ color: 'var(--gold)' }} />
              </div>
            </div>
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

      {/* Recent Orders */}
      <div
        style={{
          backgroundColor: 'var(--white)',
          border: '1px solid var(--gray-100)',
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
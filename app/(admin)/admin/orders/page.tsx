import { createClient } from '@/lib/supabase/server'
import { formatPrice, formatDate } from '@/lib/utils'

type AdminOrder = {
  id: string
  status: string
  total: number
  created_at: string
  shipping_address: {
    full_name: string
    city: string
    country: string
  } | null
  profiles: {
    full_name: string | null
    email: string
  } | null
}

const statusColors: Record<string, string> = {
  pending: '#F59E0B',
  processing: '#3B82F6',
  shipped: '#8B5CF6',
  delivered: '#10B981',
  cancelled: '#EF4444',
}

export default async function AdminOrdersPage() {
  const supabase = await createClient()

  const { data: orders } = await supabase
    .from('orders')
    .select('*, profiles(full_name, email)')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8">

      {/* Header */}
      <div className="mb-10">
        <p className="eyebrow mb-2">Manage</p>
        <h1
          style={{
            fontFamily: 'Playfair Display, serif',
            fontWeight: 400,
            fontSize: '2.2rem',
            color: 'var(--navy)',
          }}
        >
          Orders
        </h1>
      </div>

      {/* Table */}
      <div
        style={{
          backgroundColor: 'var(--white)',
          border: '1px solid var(--gray-100)',
        }}
      >
        {/* Header */}
        <div
          className="grid px-6 py-3"
          style={{
            gridTemplateColumns: '1fr 2fr 1fr 1fr 100px',
            borderBottom: '1px solid var(--gray-100)',
            backgroundColor: 'var(--cream)',
          }}
        >
          {['Order', 'Customer', 'Date', 'Total', 'Status'].map(h => (
            <p key={h} className="eyebrow" style={{ fontSize: '0.58rem' }}>
              {h}
            </p>
          ))}
        </div>

        {/* Rows */}
        <div className="divide-y divide-gray-50">
          {(orders as AdminOrder[])?.map(order => (
            <div
              key={order.id}
              className="grid items-center px-6 py-4"
              style={{ gridTemplateColumns: '1fr 2fr 1fr 1fr 100px' }}
            >
              {/* Order ID */}
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

              {/* Customer */}
              <div>
                <p
                  style={{
                    fontFamily: 'Jost, sans-serif',
                    fontSize: '0.82rem',
                    fontWeight: 400,
                    color: 'var(--navy)',
                  }}
                >
                  {order.profiles?.full_name ?? 'Guest'}
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
                  {order.profiles?.email}
                </p>
              </div>

              {/* Date */}
              <p
                style={{
                  fontFamily: 'Jost, sans-serif',
                  fontSize: '0.78rem',
                  fontWeight: 300,
                  color: 'var(--gray-600)',
                }}
              >
                {formatDate(order.created_at)}
              </p>

              {/* Total */}
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

              {/* Status */}
              <div
                className="inline-flex items-center gap-1.5 px-2.5 py-1"
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
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: 'Jost, sans-serif',
                    fontSize: '0.62rem',
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
          ))}
        </div>
      </div>
    </div>
  )
}
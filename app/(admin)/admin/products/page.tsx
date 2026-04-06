import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'
import { Plus, ShoppingBag, Pencil } from 'lucide-react'
import DeleteProductButton from '@/components/admin/DeleteProductButton'

export default async function AdminProductsPage() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from('products')
    .select('*, category:categories(name)')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="eyebrow mb-2">Manage</p>
          <h1
            style={{
              fontFamily: 'Playfair Display, serif',
              fontWeight: 400,
              fontSize: '2.2rem',
              color: 'var(--navy)',
            }}
          >
            Products
          </h1>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
          style={{
            backgroundColor: 'var(--navy)',
            color: 'var(--cream)',
            fontFamily: 'Jost, sans-serif',
            fontSize: '0.68rem',
            fontWeight: 500,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            padding: '11px 20px',
          }}
        >
          <Plus size={13} /> Add Product
        </Link>
      </div>

      {/* Table */}
      <div
        style={{
          backgroundColor: 'var(--white)',
          border: '1px solid var(--gray-100)',
        }}
      >
        {/* Table Header */}
        <div
          className="grid px-6 py-3"
          style={{
            gridTemplateColumns: '2fr 1fr 1fr 1fr 90px 70px',
            borderBottom: '1px solid var(--gray-100)',
            backgroundColor: 'var(--cream)',
          }}
        >
          {['Product', 'Category', 'Price', 'Stock', 'Status', ''].map((h, i) => (
            <p key={i} className="eyebrow" style={{ fontSize: '0.58rem' }}>
              {h}
            </p>
          ))}
        </div>

        {/* Rows */}
        <div className="divide-y divide-gray-50">
          {products?.map(product => (
            <div
              key={product.id}
              className="grid items-center px-6 py-4"
              style={{ gridTemplateColumns: '2.5fr 1fr 1fr 1fr 80px 80px' }}
            >
              {/* Product */}
              <div className="flex items-center gap-3">
                <div
                  style={{
                    width: '44px',
                    height: '54px',
                    backgroundColor: 'var(--gray-50)',
                    position: 'relative',
                    flexShrink: 0,
                    overflow: 'hidden',
                  }}
                >
                  {product.images?.[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag size={14} style={{ color: 'var(--gray-200)' }} />
                    </div>
                  )}
                </div>
                <div>
                  <p
                    style={{
                      fontFamily: 'Playfair Display, serif',
                      fontWeight: 400,
                      fontSize: '0.9rem',
                      color: 'var(--navy)',
                    }}
                  >
                    {product.name}
                  </p>
                  <p
                    style={{
                      fontFamily: 'Jost, sans-serif',
                      fontSize: '0.7rem',
                      fontWeight: 300,
                      color: 'var(--gray-400)',
                      marginTop: '2px',
                    }}
                  >
                    {product.slug}
                  </p>
                </div>
              </div>

              {/* Category */}
              <p
                style={{
                  fontFamily: 'Jost, sans-serif',
                  fontSize: '0.78rem',
                  fontWeight: 300,
                  color: 'var(--gray-600)',
                }}
              >
                {(product.category as { name: string } | null)?.name ?? '—'}
              </p>

              {/* Price */}
              <p
                style={{
                  fontFamily: 'Jost, sans-serif',
                  fontSize: '0.82rem',
                  fontWeight: 400,
                  color: 'var(--navy)',
                }}
              >
                {formatPrice(product.price)}
              </p>

              {/* Stock */}
              <p
                style={{
                  fontFamily: 'Jost, sans-serif',
                  fontSize: '0.82rem',
                  fontWeight: product.inventory_count < 10 ? 500 : 300,
                  color: product.inventory_count === 0
                    ? '#EF4444'
                    : product.inventory_count < 10
                    ? '#F59E0B'
                    : 'var(--gray-600)',
                }}
              >
                {product.inventory_count}
              </p>

              {/* Status */}
              <div
                className="inline-flex items-center px-2 py-1"
                style={{
                  backgroundColor: product.is_active
                    ? 'rgba(16,185,129,0.08)'
                    : 'rgba(239,68,68,0.08)',
                  border: `1px solid ${product.is_active
                    ? 'rgba(16,185,129,0.2)'
                    : 'rgba(239,68,68,0.2)'}`,
                }}
              >
                <span
                  style={{
                    fontFamily: 'Jost, sans-serif',
                    fontSize: '0.62rem',
                    fontWeight: 500,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: product.is_active ? '#10B981' : '#EF4444',
                  }}
                >
                  {product.is_active ? 'Active' : 'Hidden'}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <Link
                  href={`/admin/products/${product.id}`}
                  className="transition-opacity hover:opacity-60"
                  style={{ color: 'var(--gray-400)' }}
                  aria-label="Edit product"
                >
                  <Pencil size={14} />
                </Link>
                <DeleteProductButton id={product.id} name={product.name} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
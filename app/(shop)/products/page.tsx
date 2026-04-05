import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'
import { ShoppingBag } from 'lucide-react'
import type { Product, Category } from '@/types'

interface PageProps {
  searchParams: Promise<{
    search?: string
    category?: string
    sort?: string
    min?: string
    max?: string
  }>
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  let query = supabase
    .from('products')
    .select('*, category:categories(name, slug)')
    .eq('is_active', true)

  if (params.search) query = query.ilike('name', `%${params.search}%`)
  if (params.category) {
    const cat = categories?.find(c => c.slug === params.category)
    if (cat) query = query.eq('category_id', cat.id)
  }
  if (params.min) query = query.gte('price', parseInt(params.min) * 100)
  if (params.max) query = query.lte('price', parseInt(params.max) * 100)

  switch (params.sort) {
    case 'price_asc': query = query.order('price', { ascending: true }); break
    case 'price_desc': query = query.order('price', { ascending: false }); break
    default: query = query.order('created_at', { ascending: false })
  }

  const { data: products } = await query
  const activeCategory = categories?.find(c => c.slug === params.category)

  return (
    <div style={{ backgroundColor: 'var(--white)', minHeight: '100vh' }}>

      {/* Page Header */}
      <div style={{ borderBottom: '1px solid var(--gray-100)', backgroundColor: 'var(--cream)', padding: '5rem 0 3.5rem' }}>
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
          <p className="eyebrow mb-3">
            {params.search ? 'Search Results' : 'Our Collection'}
          </p>
          <h1
            style={{
              fontFamily: 'Playfair Display, serif',
              fontWeight: 400,
              fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
              color: 'var(--navy)',
              letterSpacing: '-0.01em',
            }}
          >
            {params.search
              ? `"${params.search}"`
              : activeCategory?.name ?? 'All Pieces'}
          </h1>
          <p
            className="mt-3"
            style={{
              fontFamily: 'Jost, sans-serif',
              fontWeight: 300,
              fontSize: '0.82rem',
              color: 'var(--gray-400)',
              letterSpacing: '0.08em',
            }}
          >
            {products?.length ?? 0} pieces
          </p>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 lg:px-12 py-14">
        <div className="flex gap-14">

          {/* ── Sidebar ── */}
          <aside className="hidden lg:block w-44 shrink-0">

            {/* Categories */}
            <div className="mb-10">
              <p className="eyebrow mb-5">Category</p>
              <div className="space-y-0">
                <Link
                  href="/products"
                  style={{
                    display: 'block',
                    fontFamily: 'Jost, sans-serif',
                    fontSize: '0.82rem',
                    fontWeight: !params.category ? 400 : 300,
                    color: !params.category ? 'var(--navy)' : 'var(--gray-400)',
                    padding: '7px 0',
                    borderBottom: !params.category
                      ? '1px solid var(--gold)'
                      : '1px solid transparent',
                    transition: 'all 0.2s ease',
                    letterSpacing: '0.02em',
                  }}
                >
                  All Pieces
                </Link>
                {(categories as Category[])?.map(cat => (
                  <Link
                    key={cat.id}
                    href={`/products?category=${cat.slug}`}
                    style={{
                      display: 'block',
                      fontFamily: 'Jost, sans-serif',
                      fontSize: '0.82rem',
                      fontWeight: params.category === cat.slug ? 400 : 300,
                      color: params.category === cat.slug
                        ? 'var(--navy)'
                        : 'var(--gray-400)',
                      padding: '7px 0',
                      borderBottom: params.category === cat.slug
                        ? '1px solid var(--gold)'
                        : '1px solid transparent',
                      transition: 'all 0.2s ease',
                      letterSpacing: '0.02em',
                    }}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div className="mb-10">
              <p className="eyebrow mb-5">Sort By</p>
              <div className="space-y-0">
                {[
                  { label: 'Newest', value: '' },
                  { label: 'Price: Low to High', value: 'price_asc' },
                  { label: 'Price: High to Low', value: 'price_desc' },
                ].map(option => (
                  <Link
                    key={option.value}
                    href={`/products?${new URLSearchParams({
                      ...(params.category ? { category: params.category } : {}),
                      ...(params.search ? { search: params.search } : {}),
                      ...(option.value ? { sort: option.value } : {}),
                    }).toString()}`}
                    style={{
                      display: 'block',
                      fontFamily: 'Jost, sans-serif',
                      fontSize: '0.82rem',
                      fontWeight: (params.sort ?? '') === option.value ? 400 : 300,
                      color: (params.sort ?? '') === option.value
                        ? 'var(--navy)'
                        : 'var(--gray-400)',
                      padding: '7px 0',
                      transition: 'all 0.2s ease',
                      letterSpacing: '0.02em',
                    }}
                  >
                    {option.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Price */}
            <div>
              <p className="eyebrow mb-5">Price</p>
              <div className="space-y-0">
                {[
                  { label: 'Under $50', min: '', max: '50' },
                  { label: '$50 – $150', min: '50', max: '150' },
                  { label: '$150 – $300', min: '150', max: '300' },
                  { label: 'Over $300', min: '300', max: '' },
                ].map(range => (
                  <Link
                    key={range.label}
                    href={`/products?${new URLSearchParams({
                      ...(params.category ? { category: params.category } : {}),
                      ...(params.sort ? { sort: params.sort } : {}),
                      ...(range.min ? { min: range.min } : {}),
                      ...(range.max ? { max: range.max } : {}),
                    }).toString()}`}
                    style={{
                      display: 'block',
                      fontFamily: 'Jost, sans-serif',
                      fontSize: '0.82rem',
                      fontWeight: 300,
                      color: 'var(--gray-400)',
                      padding: '7px 0',
                      transition: 'all 0.2s ease',
                      letterSpacing: '0.02em',
                    }}
                  >
                    {range.label}
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          {/* ── Product Grid ── */}
          <div className="flex-1">
            {!products || products.length === 0 ? (
              <div className="text-center py-28">
                <ShoppingBag
                  size={28}
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
                  No pieces found
                </h3>
                <p
                  style={{
                    fontFamily: 'Jost, sans-serif',
                    fontWeight: 300,
                    fontSize: '0.85rem',
                    color: 'var(--gray-400)',
                  }}
                >
                  Try adjusting your filters
                </p>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-3 transition-opacity hover:opacity-80 mt-8"
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
                  Clear Filters
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
                {(products as Product[]).map(product => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="group"
                    style={{ display: 'block' }}
                  >
                    {/* Image */}
                    <div
                      className="relative img-zoom mb-4"
                      style={{
                        aspectRatio: '3/4',
                        backgroundColor: 'var(--gray-50)',
                      }}
                    >
                      {product.images?.[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag size={28} style={{ color: 'var(--gray-200)' }} />
                        </div>
                      )}

                      {/* Sale badge */}
                      {product.compare_at_price && (
                        <span
                          style={{
                            position: 'absolute',
                            top: '12px',
                            left: '12px',
                            backgroundColor: 'var(--navy)',
                            color: 'var(--gold-light)',
                            fontFamily: 'Jost, sans-serif',
                            fontSize: '0.58rem',
                            fontWeight: 500,
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            padding: '4px 10px',
                          }}
                        >
                          Sale
                        </span>
                      )}

                      {/* Sold Out badge */}
                      {product.inventory_count === 0 && (
                        <span
                          style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            backgroundColor: 'rgba(255,255,255,0.85)',
                            color: 'var(--gray-600)',
                            fontFamily: 'Jost, sans-serif',
                            fontSize: '0.58rem',
                            fontWeight: 500,
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            padding: '4px 10px',
                          }}
                        >
                          Sold Out
                        </span>
                      )}
                    </div>

                    {/* Product Info */}
                    <p className="eyebrow mb-1.5" style={{ fontSize: '0.58rem' }}>
                      {(product.category as { name: string } | null)?.name}
                    </p>
                    <h3
                      className="line-clamp-1 transition-opacity group-hover:opacity-50"
                      style={{
                        fontFamily: 'Playfair Display, serif',
                        fontWeight: 400,
                        fontSize: '1.05rem',
                        color: 'var(--navy)',
                        marginBottom: '8px',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-3">
                      <span
                        style={{
                          fontFamily: 'Jost, sans-serif',
                          fontWeight: 400,
                          fontSize: '0.9rem',
                          color: 'var(--gray-900)',
                          letterSpacing: '0.02em',
                        }}
                      >
                        {formatPrice(product.price)}
                      </span>
                      {product.compare_at_price && (
                        <span
                          style={{
                            fontFamily: 'Jost, sans-serif',
                            fontWeight: 300,
                            fontSize: '0.85rem',
                            color: 'var(--gray-300)',
                            textDecoration: 'line-through',
                          }}
                        >
                          {formatPrice(product.compare_at_price)}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
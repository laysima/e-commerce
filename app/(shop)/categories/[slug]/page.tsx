import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'
import { ShoppingBag } from 'lucide-react'
import type { Product } from '@/types'

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ sort?: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: category } = await supabase
    .from('categories')
    .select('name, description')
    .eq('slug', slug)
    .single()

  if (!category) return {}
  return {
    title: category.name,
    description: category.description,
  }
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const { sort } = await searchParams
  const supabase = await createClient()

  // Fetch this category
  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!category) notFound()

  // Fetch all categories for sidebar
  const { data: allCategories } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  // Fetch products in this category
  let query = supabase
    .from('products')
    .select('*, category:categories(name, slug)')
    .eq('category_id', category.id)
    .eq('is_active', true)

  switch (sort) {
    case 'price_asc': query = query.order('price', { ascending: true }); break
    case 'price_desc': query = query.order('price', { ascending: false }); break
    default: query = query.order('created_at', { ascending: false })
  }

  const { data: products } = await query

  return (
    <div style={{ backgroundColor: 'var(--white)', minHeight: '100vh' }}>

      {/* Page Header */}
      <div
        style={{
          borderBottom: '1px solid var(--gray-100)',
          backgroundColor: 'var(--cream)',
          padding: '5rem 0 3.5rem',
        }}
      >
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6">
            <Link
              href="/"
              className="transition-opacity hover:opacity-60"
              style={{
                fontFamily: 'Jost, sans-serif',
                fontSize: '0.72rem',
                fontWeight: 300,
                color: 'var(--gray-400)',
                letterSpacing: '0.05em',
              }}
            >
              Home
            </Link>
            <span style={{ color: 'var(--gray-200)', fontSize: '0.7rem' }}>/</span>
            <Link
              href="/products"
              className="transition-opacity hover:opacity-60"
              style={{
                fontFamily: 'Jost, sans-serif',
                fontSize: '0.72rem',
                fontWeight: 300,
                color: 'var(--gray-400)',
                letterSpacing: '0.05em',
              }}
            >
              All Pieces
            </Link>
            <span style={{ color: 'var(--gray-200)', fontSize: '0.7rem' }}>/</span>
            <span
              style={{
                fontFamily: 'Jost, sans-serif',
                fontSize: '0.72rem',
                fontWeight: 400,
                color: 'var(--navy)',
                letterSpacing: '0.05em',
              }}
            >
              {category.name}
            </span>
          </div>

          <p className="eyebrow mb-3">Collection</p>
          <h1
            style={{
              fontFamily: 'Playfair Display, serif',
              fontWeight: 400,
              fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
              color: 'var(--navy)',
              letterSpacing: '-0.01em',
            }}
          >
            {category.name}
          </h1>
          {category.description && (
            <p
              className="mt-3"
              style={{
                fontFamily: 'Jost, sans-serif',
                fontWeight: 300,
                fontSize: '0.88rem',
                color: 'var(--gray-400)',
                letterSpacing: '0.03em',
                maxWidth: '480px',
                lineHeight: 1.7,
              }}
            >
              {category.description}
            </p>
          )}
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

            {/* All Categories */}
            <div className="mb-10">
              <p className="eyebrow mb-5">Category</p>
              <div className="space-y-0">
                <Link
                  href="/products"
                  style={{
                    display: 'block',
                    fontFamily: 'Jost, sans-serif',
                    fontSize: '0.82rem',
                    fontWeight: 300,
                    color: 'var(--gray-400)',
                    padding: '7px 0',
                    borderBottom: '1px solid transparent',
                    transition: 'all 0.2s ease',
                    letterSpacing: '0.02em',
                  }}
                >
                  All Pieces
                </Link>
                {allCategories?.map(cat => (
                  <Link
                    key={cat.id}
                    href={`/categories/${cat.slug}`}
                    style={{
                      display: 'block',
                      fontFamily: 'Jost, sans-serif',
                      fontSize: '0.82rem',
                      fontWeight: cat.slug === slug ? 400 : 300,
                      color: cat.slug === slug ? 'var(--navy)' : 'var(--gray-400)',
                      padding: '7px 0',
                      borderBottom: cat.slug === slug
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
            <div>
              <p className="eyebrow mb-5">Sort By</p>
              <div className="space-y-0">
                {[
                  { label: 'Newest', value: '' },
                  { label: 'Price: Low to High', value: 'price_asc' },
                  { label: 'Price: High to Low', value: 'price_desc' },
                ].map(option => (
                  <Link
                    key={option.value}
                    href={`/categories/${slug}${option.value ? `?sort=${option.value}` : ''}`}
                    style={{
                      display: 'block',
                      fontFamily: 'Jost, sans-serif',
                      fontSize: '0.82rem',
                      fontWeight: (sort ?? '') === option.value ? 400 : 300,
                      color: (sort ?? '') === option.value
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
                  No pieces yet
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
                  Check back soon — new arrivals added regularly.
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
                  View All Pieces
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

                    {/* Info */}
                    <p className="eyebrow mb-1.5" style={{ fontSize: '0.58rem' }}>
                      {category.name}
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
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'
import AddToCartButton from '@/components/shop/AddToCartButton'
import WishlistButton from '@/components/shop/WishlistButton'
import type { Product, ProductVariant } from '@/types'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: product } = await supabase
    .from('products')
    .select('name, description')
    .eq('slug', slug)
    .single()

  if (!product) return {}
  return {
    title: product.name,
    description: product.description,
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select('*, category:categories(name, slug), variants:product_variants(*)')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!product) notFound()

  const p = product as Product & { variants: ProductVariant[] }

  return (
    <div style={{ backgroundColor: 'var(--white)', minHeight: '100vh' }}>
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12 py-12">

        {/* Breadcrumb */}
        {/* Breadcrumb */}
<nav className="flex items-center gap-2 mb-10">
  {[
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    {
      label: (p.category as { name: string } | null)?.name ?? '',
      href: `/categories/${(p.category as { slug: string } | null)?.slug}`,
    },
    { label: p.name, href: '#' },
  ].map((crumb, i, arr) => (
    <span key={crumb.label} className="flex items-center gap-2">
      {i < arr.length - 1 ? (
        <>
          <Link
            href={crumb.href}
            className="transition-opacity hover:opacity-60"
            style={{
              fontFamily: 'Jost, sans-serif',
              fontSize: '0.72rem',
              fontWeight: 300,
              color: 'var(--gray-400)',
              letterSpacing: '0.05em',
            }}
          >
            {crumb.label}
          </Link>
          <span style={{ color: 'var(--gray-200)', fontSize: '0.7rem' }}>/</span>
        </>
      ) : (
        <span
          style={{
            fontFamily: 'Jost, sans-serif',
            fontSize: '0.72rem',
            fontWeight: 400,
            color: 'var(--navy)',
            letterSpacing: '0.05em',
          }}
        >
          {crumb.label}
        </span>
      )}
    </span>
  ))}
</nav>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* ── Images ── */}
          <div className="space-y-3">
            {/* Main Image */}
            <div
              className="relative img-zoom"
              style={{ aspectRatio: '3/4', backgroundColor: 'var(--gray-50)' }}
            >
              {p.images?.[0] ? (
                <Image
                  src={p.images[0]}
                  alt={p.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span style={{ color: 'var(--gray-200)', fontFamily: 'Jost, sans-serif', fontSize: '0.8rem' }}>
                    No image
                  </span>
                </div>
              )}

              {/* Sale badge */}
              {p.compare_at_price && (
                <span
                  style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    backgroundColor: 'var(--navy)',
                    color: 'var(--gold-light)',
                    fontFamily: 'Jost, sans-serif',
                    fontSize: '0.6rem',
                    fontWeight: 500,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    padding: '5px 12px',
                  }}
                >
                  Sale
                </span>
              )}
            </div>

            {/* Thumbnail Row */}
            {p.images && p.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {p.images.slice(1).map((img, i) => (
                  <div
                    key={i}
                    className="relative"
                    style={{ aspectRatio: '1/1', backgroundColor: 'var(--gray-50)' }}
                  >
                    <Image
                      src={img}
                      alt={`${p.name} ${i + 2}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Product Info ── */}
          <div className="lg:py-4">

            {/* Category */}
            <p className="eyebrow mb-3">
              {(p.category as { name: string } | null)?.name}
            </p>

            {/* Name */}
            <h1
              style={{
                fontFamily: 'Playfair Display, serif',
                fontWeight: 400,
                fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
                color: 'var(--navy)',
                letterSpacing: '-0.01em',
                lineHeight: 1.15,
                marginBottom: '1.25rem',
              }}
            >
              {p.name}
            </h1>

            {/* Price */}
            <div className="flex items-center gap-4 mb-8">
              <span
                style={{
                  fontFamily: 'Jost, sans-serif',
                  fontWeight: 400,
                  fontSize: '1.4rem',
                  color: 'var(--navy)',
                  letterSpacing: '0.02em',
                }}
              >
                {formatPrice(p.price)}
              </span>
              {p.compare_at_price && (
                <span
                  style={{
                    fontFamily: 'Jost, sans-serif',
                    fontWeight: 300,
                    fontSize: '1.1rem',
                    color: 'var(--gray-300)',
                    textDecoration: 'line-through',
                  }}
                >
                  {formatPrice(p.compare_at_price)}
                </span>
              )}
              {p.compare_at_price && (
                <span
                  style={{
                    fontFamily: 'Jost, sans-serif',
                    fontSize: '0.72rem',
                    fontWeight: 500,
                    color: 'var(--gold)',
                    letterSpacing: '0.1em',
                  }}
                >
                  {Math.round(((p.compare_at_price - p.price) / p.compare_at_price) * 100)}% off
                </span>
              )}
            </div>

            {/* Divider */}
            <div className="gold-divider mb-8" />

            {/* Description */}
            <p
              style={{
                fontFamily: 'Jost, sans-serif',
                fontWeight: 300,
                fontSize: '0.92rem',
                color: 'var(--gray-600)',
                lineHeight: 1.85,
                marginBottom: '2rem',
              }}
            >
              {p.description}
            </p>

            {/* Variants */}
            {p.variants && p.variants.length > 0 && (
              <div className="mb-8">
                <p
                  style={{
                    fontFamily: 'Jost, sans-serif',
                    fontSize: '0.7rem',
                    fontWeight: 500,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'var(--gray-600)',
                    marginBottom: '12px',
                  }}
                >
                  {p.variants[0]?.name}
                </p>
                <div className="flex flex-wrap gap-2">
                  {p.variants.map(variant => (
                    <div
                      key={variant.id}
                      style={{
                        border: '1px solid var(--gray-200)',
                        padding: '8px 16px',
                        fontFamily: 'Jost, sans-serif',
                        fontSize: '0.8rem',
                        fontWeight: 300,
                        color: variant.inventory_count === 0
                          ? 'var(--gray-200)'
                          : 'var(--navy)',
                        cursor: variant.inventory_count === 0 ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s ease',
                        textDecoration: variant.inventory_count === 0
                          ? 'line-through'
                          : 'none',
                      }}
                    >
                      {variant.value}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stock indicator */}
            <div className="flex items-center gap-2 mb-8">
              <div
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: p.inventory_count > 0 ? '#4CAF50' : '#E57373',
                  flexShrink: 0,
                }}
              />
              <p
                style={{
                  fontFamily: 'Jost, sans-serif',
                  fontSize: '0.78rem',
                  fontWeight: 300,
                  color: 'var(--gray-400)',
                  letterSpacing: '0.03em',
                }}
              >
                {p.inventory_count > 10
                  ? 'In stock'
                  : p.inventory_count > 0
                  ? `Only ${p.inventory_count} left`
                  : 'Out of stock'}
              </p>
            </div>

            {/* Add to Cart + Wishlist */}
            <div className="flex gap-3 mb-10">
              <AddToCartButton product={p} />
              <WishlistButton product={p} />
            </div>

            {/* Divider */}
            <div className="gold-divider mb-8" />

            {/* Details */}
            <div className="space-y-4">
              {[
                { label: 'Complimentary Shipping', value: 'On all orders over $150' },
                { label: 'Free Returns', value: 'Within 30 days of purchase' },
                { label: 'Authenticity', value: 'All pieces are verified authentic' },
              ].map(detail => (
                <div key={detail.label} className="flex gap-4">
                  <p
                    style={{
                      fontFamily: 'Jost, sans-serif',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'var(--navy)',
                      minWidth: '160px',
                    }}
                  >
                    {detail.label}
                  </p>
                  <p
                    style={{
                      fontFamily: 'Jost, sans-serif',
                      fontSize: '0.82rem',
                      fontWeight: 300,
                      color: 'var(--gray-400)',
                    }}
                  >
                    {detail.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
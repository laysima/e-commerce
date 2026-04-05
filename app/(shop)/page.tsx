import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'
import { ArrowRight, ShoppingBag, Shield, RefreshCw, Headphones } from 'lucide-react'
import type { Product, Category } from '@/types'

const perks = [
  { icon: ShoppingBag, title: 'Complimentary Shipping', description: 'On orders over $150' },
  { icon: Shield, title: 'Secure Transactions', description: '256-bit SSL encryption' },
  { icon: RefreshCw, title: 'Easy Returns', description: '30-day return policy' },
  { icon: Headphones, title: 'Client Services', description: 'Available 7 days a week' },
]

export default async function HomePage() {
  const supabase = await createClient()

  const { data: featuredProducts } = await supabase
    .from('products')
    .select('*, category:categories(name, slug)')
    .eq('is_featured', true)
    .eq('is_active', true)
    .limit(4)

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .limit(5)

  return (
    <div style={{ backgroundColor: 'var(--white)' }}>

      {/* ── Hero ── */}
      <section
        style={{
          backgroundColor: 'var(--navy)',
          minHeight: '92vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle grain texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Subtle gold glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '10%',
            right: '5%',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(184,149,74,0.08) 0%, transparent 70%)',
          }}
        />

        <div className="max-w-screen-xl mx-auto px-6 lg:px-12 w-full py-24">
          <div className="max-w-2xl">

            {/* Eyebrow */}
            <div className="flex items-center gap-4 mb-10">
              <div style={{ height: '1px', width: '32px', backgroundColor: 'var(--gold)' }} />
              <p className="eyebrow">New Arrivals · Spring 2026</p>
            </div>

            {/* Headline */}
            <h1
              style={{
                fontFamily: 'Playfair Display, serif',
                fontWeight: 400,
                fontSize: 'clamp(3.2rem, 7vw, 6rem)',
                color: 'var(--cream)',
                lineHeight: 1.05,
                letterSpacing: '-0.02em',
                marginBottom: '2rem',
              }}
            >
              Dressed for
              <br />
              <em style={{ color: 'var(--gold-light)', fontStyle: 'italic' }}>every</em>
              <br />
              occasion.
            </h1>

            <p
              style={{
                fontFamily: 'Jost, sans-serif',
                fontWeight: 300,
                fontSize: '1rem',
                color: 'rgba(250,250,247,0.55)',
                lineHeight: 1.8,
                maxWidth: '380px',
                marginBottom: '3rem',
                letterSpacing: '0.02em',
              }}
            >
              A thoughtfully curated collection of clothing and footwear
              for those who value quality above all else.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-3 transition-opacity hover:opacity-80"
                style={{
                  backgroundColor: 'var(--gold)',
                  color: 'var(--navy)',
                  fontFamily: 'Jost, sans-serif',
                  fontSize: '0.7rem',
                  fontWeight: 500,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  padding: '14px 32px',
                }}
              >
                Explore Collection <ArrowRight size={13} />
              </Link>
              <Link
                href="/categories/womens-clothing"
                className="inline-flex items-center gap-3 transition-opacity hover:opacity-60"
                style={{
                  border: '1px solid rgba(184,149,74,0.3)',
                  color: 'rgba(250,250,247,0.7)',
                  fontFamily: 'Jost, sans-serif',
                  fontSize: '0.7rem',
                  fontWeight: 400,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  padding: '14px 32px',
                }}
              >
                Women&apos;s Edit
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Perks ── */}
      <section style={{ backgroundColor: 'var(--gray-50)', borderBottom: '1px solid var(--gray-100)' }}>
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {perks.map((perk, i) => (
              <div
                key={perk.title}
                className="flex items-center gap-4 py-8 px-4"
                style={{ borderRight: i < 3 ? '1px solid var(--gray-100)' : 'none' }}
              >
                <perk.icon size={15} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                <div>
                  <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.75rem', fontWeight: 500, color: 'var(--gray-900)', letterSpacing: '0.05em' }}>
                    {perk.title}
                  </p>
                  <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.72rem', fontWeight: 300, color: 'var(--gray-400)', marginTop: '2px' }}>
                    {perk.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="max-w-screen-xl mx-auto px-6 lg:px-12 py-24">
        <div className="flex items-end justify-between mb-14">
          <div>
            <p className="eyebrow mb-3">Shop by</p>
            <h2
              style={{
                fontFamily: 'Playfair Display, serif',
                fontWeight: 400,
                fontSize: 'clamp(2rem, 4vw, 2.8rem)',
                color: 'var(--navy)',
              }}
            >
              Category
            </h2>
          </div>
          <Link
            href="/products"
            className="hidden sm:flex items-center gap-2 hover-line"
            style={{
              fontFamily: 'Jost, sans-serif',
              fontSize: '0.7rem',
              fontWeight: 400,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--gray-400)',
            }}
          >
            All Products <ArrowRight size={12} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {(categories as Category[])?.map(category => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group relative overflow-hidden"
              style={{
                backgroundColor: 'var(--cream)',
                border: '1px solid var(--gray-100)',
                padding: '2.5rem 1.5rem',
                textAlign: 'center',
                transition: 'all 0.3s ease',
              }}
            >
              <p
                className="transition-all group-hover:opacity-60"
                style={{
                  fontFamily: 'Jost, sans-serif',
                  fontSize: '0.7rem',
                  fontWeight: 500,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'var(--navy)',
                }}
              >
                {category.name}
              </p>
              {/* Gold bottom line */}
              <div
                className="absolute bottom-0 left-0 right-0 h-px scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                style={{ backgroundColor: 'var(--gold)' }}
              />
            </Link>
          ))}
        </div>
      </section>

      {/* ── Gold Divider ── */}
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
        <div className="gold-divider" />
      </div>

      {/* ── Featured Products ── */}
      <section className="max-w-screen-xl mx-auto px-6 lg:px-12 py-24">
        <div className="flex items-end justify-between mb-14">
          <div>
            <p className="eyebrow mb-3">Handpicked</p>
            <h2
              style={{
                fontFamily: 'Playfair Display, serif',
                fontWeight: 400,
                fontSize: 'clamp(2rem, 4vw, 2.8rem)',
                color: 'var(--navy)',
              }}
            >
              Featured Pieces
            </h2>
          </div>
          <Link
            href="/products"
            className="hidden sm:flex items-center gap-2 hover-line"
            style={{
              fontFamily: 'Jost, sans-serif',
              fontSize: '0.7rem',
              fontWeight: 400,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--gray-400)',
            }}
          >
            View All <ArrowRight size={12} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(featuredProducts as Product[])?.map(product => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group"
              style={{ display: 'block' }}
            >
              {/* Image */}
              <div
                className="relative img-zoom mb-4"
                style={{ aspectRatio: '3/4', backgroundColor: 'var(--gray-50)' }}
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
                    <ShoppingBag size={32} style={{ color: 'var(--gray-200)' }} />
                  </div>
                )}
                {product.compare_at_price && (
                  <span
                    className="absolute top-3 left-3"
                    style={{
                      backgroundColor: 'var(--navy)',
                      color: 'var(--gold-light)',
                      fontFamily: 'Jost, sans-serif',
                      fontSize: '0.6rem',
                      fontWeight: 500,
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      padding: '4px 10px',
                    }}
                  >
                    Sale
                  </span>
                )}
              </div>

              {/* Info */}
              <div>
                <p
                  className="eyebrow mb-1.5"
                  style={{ fontSize: '0.6rem' }}
                >
                  {(product.category as { name: string } | null)?.name}
                </p>
                <h3
                  className="transition-opacity group-hover:opacity-60 line-clamp-1"
                  style={{
                    fontFamily: 'Playfair Display, serif',
                    fontWeight: 400,
                    fontSize: '1.05rem',
                    color: 'var(--navy)',
                    marginBottom: '8px',
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
                        color: 'var(--gray-400)',
                        textDecoration: 'line-through',
                      }}
                    >
                      {formatPrice(product.compare_at_price)}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Editorial Banner ── */}
      <section
        style={{ backgroundColor: 'var(--cream)', borderTop: '1px solid var(--gray-100)', borderBottom: '1px solid var(--gray-100)' }}
      >
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12 py-24">
          <div className="flex flex-col md:flex-row items-center gap-16">

            {/* Text */}
            <div className="flex-1">
              <p className="eyebrow mb-4">The Cressida Promise</p>
              <h2
                style={{
                  fontFamily: 'Playfair Display, serif',
                  fontWeight: 400,
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  color: 'var(--navy)',
                  lineHeight: 1.15,
                  marginBottom: '1.5rem',
                }}
              >
                Quality that
                <br />
                <em style={{ color: 'var(--gold)' }}>speaks</em> for itself.
              </h2>
              <p
                style={{
                  fontFamily: 'Jost, sans-serif',
                  fontWeight: 300,
                  fontSize: '0.95rem',
                  color: 'var(--gray-600)',
                  lineHeight: 1.9,
                  maxWidth: '400px',
                  marginBottom: '2.5rem',
                }}
              >
                Every piece in our collection is carefully selected for its craftsmanship,
                material quality, and enduring style. We believe in fewer, better things.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-3 hover-line hover-line-gold"
                style={{
                  fontFamily: 'Jost, sans-serif',
                  fontSize: '0.7rem',
                  fontWeight: 500,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'var(--navy)',
                  paddingBottom: '4px',
                }}
              >
                Discover the Collection <ArrowRight size={12} />
              </Link>
            </div>

            {/* Stats */}
            <div className="flex-1 grid grid-cols-2 gap-8">
              {[
                { number: '500+', label: 'Curated Pieces' },
                { number: '98%', label: 'Customer Satisfaction' },
                { number: '30', label: 'Day Free Returns' },
                { number: '2-3', label: 'Day Delivery' },
              ].map(stat => (
                <div
                  key={stat.label}
                  className="text-center py-8"
                  style={{ border: '1px solid var(--gray-100)' }}
                >
                  <p
                    style={{
                      fontFamily: 'Playfair Display, serif',
                      fontWeight: 500,
                      fontSize: '2.2rem',
                      color: 'var(--navy)',
                      marginBottom: '6px',
                    }}
                  >
                    {stat.number}
                  </p>
                  <p
                    style={{
                      fontFamily: 'Jost, sans-serif',
                      fontSize: '0.65rem',
                      fontWeight: 400,
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      color: 'var(--gray-400)',
                    }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
import Image from 'next/image'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import type { Category, Product } from '@/types'

type CatalogViewProps = {
  eyebrow: string
  title: string
  description?: string | null
  products: Product[]
  categories: Category[]
  activeCategorySlug?: string
  searchQuery?: string
  sort?: string
  categoryRoutes?: boolean
}

const sortOptions = [
  { label: 'Newest', value: '' },
  { label: 'Price, low to high', value: 'price_asc' },
  { label: 'Price, high to low', value: 'price_desc' },
]

export default function CatalogView({
  eyebrow,
  title,
  description,
  products,
  categories,
  activeCategorySlug,
  searchQuery,
  sort = '',
  categoryRoutes = false,
}: CatalogViewProps) {
  const sortHref = (value: string) => {
    if (categoryRoutes && activeCategorySlug) {
      return `/categories/${activeCategorySlug}${value ? `?sort=${value}` : ''}`
    }
    const query = new URLSearchParams()
    if (activeCategorySlug) query.set('category', activeCategorySlug)
    if (searchQuery) query.set('search', searchQuery)
    if (value) query.set('sort', value)
    return `/products${query.size ? `?${query.toString()}` : ''}`
  }

  return (
    <div className="catalog-page">
      <header className="catalog-hero">
        <div>
          <p className="section-index">{eyebrow}</p>
          <h1>{title}</h1>
        </div>
        <div className="catalog-hero__aside">
          {description && <p>{description}</p>}
          <span>{String(products.length).padStart(2, '0')} pieces</span>
        </div>
      </header>

      <div className="catalog-controls">
        <div className="catalog-controls__group">
          <span>Department</span>
          <Link href="/products" className={!activeCategorySlug ? 'is-active' : ''}>All</Link>
          {categories.map(category => (
            <Link
              key={category.id}
              href={categoryRoutes ? `/categories/${category.slug}` : `/products?category=${category.slug}`}
              className={activeCategorySlug === category.slug ? 'is-active' : ''}
            >
              {category.name}
            </Link>
          ))}
        </div>
        <div className="catalog-controls__group catalog-controls__group--sort">
          <span>Order</span>
          {sortOptions.map(option => (
            <Link href={sortHref(option.value)} className={sort === option.value ? 'is-active' : ''} key={option.value}>
              {option.label}
            </Link>
          ))}
        </div>
      </div>

      {products.length ? (
        <div className="catalog-grid">
          {products.map((product, index) => (
            <Link href={`/products/${product.slug}`} className="catalog-product" key={product.id}>
              <div className="catalog-product__media">
                {product.images?.[0] ? (
                  <Image src={product.images[0]} alt={product.name} fill sizes="(max-width: 700px) 50vw, 25vw" />
                ) : (
                  <span>Image forthcoming</span>
                )}
                <small>{String(index + 1).padStart(2, '0')}</small>
                {product.compare_at_price && <em>Reduced</em>}
              </div>
              <div className="catalog-product__info">
                <div>
                  <span>{(product.category as Category | null)?.name ?? 'Cressida'}</span>
                  <h2>{product.name}</h2>
                </div>
                <div className="catalog-product__price">
                  <p>{formatPrice(product.price)}</p>
                  {product.compare_at_price && <s>{formatPrice(product.compare_at_price)}</s>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="catalog-empty">
          <p>No pieces match this edit.</p>
          <span>Try another department or return to the full collection.</span>
          <Link href="/products" className="editorial-link editorial-link--dark">View all pieces <span aria-hidden="true">↗</span></Link>
        </div>
      )}
    </div>
  )
}

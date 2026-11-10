import Link from 'next/link'
import PageBand from '@/components/shop/PageBand'
import ProductCard from '@/components/shop/ProductCard'
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

const departmentCards: Record<string, { image: string; color: string }> = {
  'womens-clothing': { image: '/looks/look-12.webp', color: '#f7c23c' },
  'mens-clothing': { image: '/looks/look-09.webp', color: '#e8e3d7' },
  sneakers: { image: '/looks/look-14.webp', color: '#ff9c86' },
  'formal-shoes': { image: '/looks/look-07.webp', color: '#f7c23c' },
  accessories: { image: '/looks/look-13.webp', color: '#e8e3d7' },
}
const defaultCard = { image: '/looks/look-04.webp', color: '#f7c23c' }

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
    <div className="catalog">
      <PageBand title={title} card={(activeCategorySlug && departmentCards[activeCategorySlug]) || defaultCard}>
        <div className="page-band__meta">
          <p>{eyebrow}</p>
          <span>{products.length} {products.length === 1 ? 'piece' : 'pieces'}</span>
        </div>
        {description && <p className="page-band__lead">{description}</p>}
      </PageBand>

      <nav className="catalog-tabs" aria-label="Departments">
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
      </nav>

      <div className="catalog-sort">
        <span>Sort by</span>
        <div>
          {sortOptions.map(option => (
            <Link href={sortHref(option.value)} className={sort === option.value ? 'is-active' : ''} key={option.value}>
              {option.label}
            </Link>
          ))}
        </div>
      </div>

      {products.length ? (
        <div className="catalog-list">
          {products.map(product => <ProductCard product={product} key={product.id} />)}
        </div>
      ) : (
        <div className="catalog-none">
          <p>No pieces match this edit.</p>
          <span>Try another department or return to the full collection.</span>
          <Link href="/products" className="underline-link">View all pieces</Link>
        </div>
      )}
    </div>
  )
}

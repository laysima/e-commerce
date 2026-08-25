import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'
import AddToCartButton from '@/components/shop/AddToCartButton'
import WishlistButton from '@/components/shop/WishlistButton'
import type { Category, Product, ProductVariant } from '@/types'

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

  return product ? { title: product.name, description: product.description } : {}
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
  const item = product as Product & { variants: ProductVariant[] }
  const category = item.category as Category | null
  const inventoryCopy = item.inventory_count > 10
    ? 'In stock and ready to dispatch'
    : item.inventory_count > 0
      ? `Only ${item.inventory_count} remaining`
      : 'Currently unavailable'

  return (
    <div className="product-page">
      <nav className="product-breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link><span>/</span>
        <Link href="/products">Collection</Link><span>/</span>
        {category && <><Link href={`/categories/${category.slug}`}>{category.name}</Link><span>/</span></>}
        <p>{item.name}</p>
      </nav>

      <div className="product-layout">
        <div className="product-gallery">
          {item.images?.length ? item.images.map((image, index) => (
            <figure className={index === 0 ? 'product-gallery__lead' : ''} key={image}>
              <Image
                src={image}
                alt={`${item.name}${index ? `, view ${index + 1}` : ''}`}
                fill
                priority={index === 0}
                sizes={index === 0 ? '(max-width: 900px) 100vw, 62vw' : '(max-width: 900px) 50vw, 31vw'}
              />
              <figcaption>{String(index + 1).padStart(2, '0')} / {String(item.images.length).padStart(2, '0')}</figcaption>
            </figure>
          )) : (
            <div className="product-gallery__empty">Image forthcoming</div>
          )}
        </div>

        <aside className="product-information">
          <div className="product-information__topline">
            <p>{category?.name ?? 'Cressida collection'}</p>
            <span>{inventoryCopy}</span>
          </div>
          <h1>{item.name}</h1>

          <div className="product-price">
            <p>{formatPrice(item.price)}</p>
            {item.compare_at_price && <s>{formatPrice(item.compare_at_price)}</s>}
            {item.compare_at_price && (
              <span>{Math.round(((item.compare_at_price - item.price) / item.compare_at_price) * 100)}% reduction</span>
            )}
          </div>

          <p className="product-description">{item.description}</p>

          {item.variants?.length > 0 && (
            <div className="product-variants">
              <p>{item.variants[0]?.name}</p>
              <div>
                {item.variants.map(variant => (
                  <span className={variant.inventory_count === 0 ? 'is-unavailable' : ''} key={variant.id}>
                    {variant.value}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="product-actions">
            <AddToCartButton product={item} />
            <WishlistButton product={item} />
          </div>

          <dl className="product-service-notes">
            <div><dt>Delivery</dt><dd>Complimentary on orders over $150</dd></div>
            <div><dt>Returns</dt><dd>Free within 30 days of purchase</dd></div>
            <div><dt>Care</dt><dd>Product-specific guidance included</dd></div>
          </dl>
        </aside>
      </div>
    </div>
  )
}

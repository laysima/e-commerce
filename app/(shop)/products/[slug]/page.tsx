import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ProductBuyBox from '@/components/shop/ProductBuyBox'
import ProductCard from '@/components/shop/ProductCard'
import ProductGallery from '@/components/shop/ProductGallery'
import type { Product, ProductVariant } from '@/types'

interface PageProps {
  params: Promise<{ slug: string }>
}

const accessorySlugs = ['accessories', 'sneakers', 'formal-shoes']

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

  const { data: otherProducts } = await supabase
    .from('products')
    .select('*, category:categories(name, slug), variants:product_variants(*)')
    .eq('is_active', true)
    .neq('id', item.id)
    .order('created_at', { ascending: false })
    .limit(40)
  const others = (otherProducts ?? []) as Product[]

  const related = others.filter(other => other.category_id === item.category_id).slice(0, 4)
  const remaining = others.filter(other => !related.includes(other))
  const isAccessory = (other: Product) => accessorySlugs.includes(other.category?.slug ?? '')
  const completeTheLook = [...remaining.filter(isAccessory), ...remaining.filter(other => !isAccessory(other))].slice(0, 3)

  const inventoryCopy = item.inventory_count > 10
    ? 'In stock'
    : item.inventory_count > 0
      ? `Only ${item.inventory_count} remaining`
      : 'Currently unavailable'

  return (
    <div className="pdp">
      <div className="pdp__top">
        <ProductGallery images={item.images ?? []} name={item.name} />
        <ProductBuyBox product={item} inventoryCopy={inventoryCopy}>
          {completeTheLook.length > 0 && (
            <section className="pdp-buy__look" aria-labelledby="look-title">
              <h2 id="look-title">Complete the look</h2>
              <div className="pdp__look-products">
                {completeTheLook.map(other => <ProductCard product={other} sizes="(max-width: 860px) 30vw, 12vw" key={other.id} />)}
              </div>
            </section>
          )}
        </ProductBuyBox>
      </div>

      {related.length > 0 && (
        <section className="pdp__related" aria-labelledby="related-title">
          <header>
            <h2 id="related-title">See also</h2>
            <Link href="/products" className="underline-link">Go to the catalog</Link>
          </header>
          <div className="shop-grid">
            {related.map(other => <ProductCard product={other} key={other.id} />)}
          </div>
        </section>
      )}

      <section className="pdp__story" aria-label="How we choose our pieces">
        <div className="pdp__story-image">
          <Image src="/editorial/jacket.webp" alt="" fill sizes="(max-width: 860px) 100vw, 50vw" />
        </div>
        <div className="pdp__story-copy">
          <p>Every piece in the Cressida collection starts with texture, proportion and the way it feels to wear. We follow the cloth first and let the shape come from there.</p>
          <p>The rest is up to you. Good clothes should keep their form through regular wear and feel more like yours each season.</p>
        </div>
      </section>
    </div>
  )
}

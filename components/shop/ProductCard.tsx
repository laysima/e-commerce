import Image from 'next/image'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import WishlistButton from '@/components/shop/WishlistButton'
import type { Product } from '@/types'

type ProductCardProps = {
  product: Product
  sizes?: string
}

const defaultSizes = '(max-width: 760px) 45vw, 22vw'

function Swatches({ product }: { product: Product }) {
  const colors = product.variants?.filter(variant => /colou?r/i.test(variant.name)) ?? []
  if (colors.length === 0) return null

  return (
    <span className="shop-card__swatches" aria-label={`${colors.length} colours`}>
      {colors.slice(0, 2).map(color => (
        <i key={color.id} style={{ backgroundColor: color.value.toLowerCase().replace(/\s+/g, '') }} />
      ))}
      {colors.length > 2 && <small>+{colors.length - 2}</small>}
    </span>
  )
}

export default function ProductCard({ product, sizes = defaultSizes }: ProductCardProps) {
  const [image, alternate] = product.images ?? []

  return (
    <article className="shop-card">
      <Link href={`/products/${product.slug}`} className="shop-card__link">
        <div className="shop-card__media">
          {image ? <Image src={image} alt={product.name} fill sizes={sizes} /> : <span className="shop-card__pending">Image forthcoming</span>}
          {alternate && <Image src={alternate} alt="" fill sizes={sizes} className="shop-card__alternate" />}
        </div>
        <div className="shop-card__info">
          <h3>{product.name}</h3>
          <div>
            <p>
              {formatPrice(product.price)}
              {product.compare_at_price && <s>{formatPrice(product.compare_at_price)}</s>}
            </p>
            <Swatches product={product} />
          </div>
        </div>
      </Link>
      <WishlistButton product={product} className="shop-card__save" />
    </article>
  )
}

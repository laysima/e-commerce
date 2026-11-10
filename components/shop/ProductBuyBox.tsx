'use client'

import { useState, type CSSProperties, type ReactNode } from 'react'
import { formatPrice } from '@/lib/utils'
import AddToCartButton from '@/components/shop/AddToCartButton'
import WishlistButton from '@/components/shop/WishlistButton'
import type { Product, ProductVariant } from '@/types'

type ProductBuyBoxProps = {
  product: Product & { variants: ProductVariant[] }
  inventoryCopy: string
  children?: ReactNode
}

export default function ProductBuyBox({ product, inventoryCopy, children }: ProductBuyBoxProps) {
  const { variants } = product
  const [variantId, setVariantId] = useState(() => (variants.find(variant => variant.inventory_count > 0) ?? variants[0])?.id)
  const selected = variants.find(variant => variant.id === variantId)

  const details = [
    { label: 'Description', value: product.description },
    { label: 'Delivery', value: 'Complimentary on orders over $150.' },
    { label: 'Returns', value: 'Free within 30 days of purchase.' },
    { label: 'Care', value: 'Guidance for your piece included.' },
  ].filter(detail => detail.value)

  return (
    <aside className="pdp-buy">
      <div>
        <div className="pdp-buy__meta">
          <span>{product.category?.name ?? 'Cressida'}</span>
          <span>{inventoryCopy}</span>
        </div>
        <h1 style={{ '--title-chars': product.name.length } as CSSProperties}>{product.name}</h1>
        <p className="pdp-buy__price">
          {formatPrice(product.price + (selected?.price_modifier ?? 0))}
          {product.compare_at_price && <s>{formatPrice(product.compare_at_price)}</s>}
        </p>
      </div>

      {children}

      <div>
        {variants.length > 0 && (
          <fieldset className="pdp-buy__variants">
            <legend>{variants[0].name}: {selected?.value}</legend>
            <div>
              {variants.map(variant => (
                <button
                  type="button"
                  key={variant.id}
                  onClick={() => setVariantId(variant.id)}
                  disabled={variant.inventory_count === 0}
                  className={variant.id === variantId ? 'is-selected' : ''}
                  aria-pressed={variant.id === variantId}
                >
                  {variant.value}
                </button>
              ))}
            </div>
          </fieldset>
        )}

        <div className="pdp-buy__actions">
          <AddToCartButton product={product} variant={selected} />
          <WishlistButton product={product} />
        </div>

        <dl className="pdp-buy__details">
          {details.map(detail => (
            <div key={detail.label}>
              <dt>{detail.label}</dt>
              <dd>{detail.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </aside>
  )
}

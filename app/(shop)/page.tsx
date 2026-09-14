import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'
import { StudioMotion, MotionToggle } from '@/components/home/StudioMotion'
import LiquidImage from '@/components/home/LiquidImage'
import { CampaignStudy, DepartmentIndex, MagneticLink, ScrollManifesto } from '@/components/home/AtelierInteractions'
import styles from '@/components/home/Atelier.module.css'
import type { Category, Product } from '@/types'

const fallbackCategories = [
  { name: 'Women', slug: 'womens-clothing', description: 'An instinct for the unexpected.', image_url: null },
  { name: 'Men', slug: 'mens-clothing', description: 'Easy proportions. A different perspective.', image_url: null },
  { name: 'Sneakers', slug: 'sneakers', description: 'Made for wherever the day goes.', image_url: null },
  { name: 'Objects', slug: 'accessories', description: 'The details that make it yours.', image_url: null },
]
const departmentOrder = ['womens-clothing', 'mens-clothing', 'sneakers', 'formal-shoes', 'accessories']
const departmentNames: Record<string, string> = {
  'womens-clothing': 'Women', 'mens-clothing': 'Men', sneakers: 'Sneakers', 'formal-shoes': 'Shoes', accessories: 'Objects',
}
const departmentImages: Record<string, string> = {
  'womens-clothing': '/cressida-editorial-travertine.webp',
  'mens-clothing': '/cressida-editorial-concrete.webp',
  sneakers: '/cressida-editorial-concrete.webp',
  'formal-shoes': '/cressida-editorial-travertine.webp',
  accessories: '/cressida-editorial-copper.webp',
}

export default async function HomePage() {
  const supabase = await createClient()
  const [{ data: catalogProducts }, { data: categories }] = await Promise.all([
    supabase.from('products').select('*, category:categories(name, slug)').eq('is_active', true).order('created_at', { ascending: false }).limit(18),
    supabase.from('categories').select('*').order('name'),
  ])
  const catalog = (catalogProducts ?? []) as Product[]
  const products = [...catalog.filter(product => product.is_featured), ...catalog.filter(product => !product.is_featured)].slice(0, 3)
  const departments = [...(categories?.length ? categories as Category[] : fallbackCategories)]
    .sort((a, b) => {
      const rank = (slug: string) => departmentOrder.includes(slug) ? departmentOrder.indexOf(slug) : departmentOrder.length
      return rank(a.slug) - rank(b.slug)
    })
    .slice(0, 5)
    .map(category => ({
      name: departmentNames[category.slug] || category.name,
      slug: category.slug,
      description: category.description,
      image: category.image_url || departmentImages[category.slug] || '/cressida-editorial-copper.webp',
    }))

  return (
    <StudioMotion>
      <section className={styles.hero} aria-labelledby="campaign-title">
        <Image src="/cressida-editorial-travertine.webp" alt="A model in a sculptural tobacco coat standing in the afternoon light of a stone colonnade" fill preload unoptimized sizes="100vw" className={styles.heroImage} />
        <LiquidImage src="/cressida-editorial-travertine.webp" />
        <div className={styles.heroShade} />
        <div className={styles.heroTop}>
          <p>Independent spirit.<br />Considered clothing.</p>
          <span>The new collection</span>
        </div>
        <div className={styles.heroTitle}>
          <h1 id="campaign-title"><span>Dress like</span>{' '}<em>you mean it.</em></h1>
          <p>Good clothes. A little instinct.<br />An entirely different feeling.</p>
        </div>
        <div className={styles.heroBottom}>
          <a href="#the-edit" className={styles.discover}>A change of perspective</a>
          <MagneticLink href="/products" className={styles.shopOrb} label="Explore the new collection"><span>Explore<br />the collection</span></MagneticLink>
        </div>
        <span className={styles.heroSide}>Cressida, by instinct</span>
      </section>

      <section id="the-edit" className={styles.edit} aria-labelledby="edit-title">
        <header className={styles.editHeader}>
          <div><p className={styles.eyebrow}>The current obsession</p><h2 id="edit-title">A good place<br />to <em>begin.</em></h2></div>
          <div className={styles.editIntro}><p>Pieces with presence. Layers with a little attitude. Find the ones that feel like you.</p><Link href="/products" className={styles.textLink}>Shop the entire edit</Link></div>
        </header>
        {products.length > 0 ? (
          <div className={styles.productSpread}>
            {products.map(product => (
              <Link href={`/products/${product.slug}`} className={styles.piece} key={product.id}>
                <div className={styles.pieceImage}>
                  {product.images?.[0] ? <Image src={product.images[0]} alt={product.name} fill sizes="(max-width: 600px) 85vw, (max-width: 900px) 45vw, 33vw" /> : <span className={styles.imagePending}>A new favourite awaits</span>}
                  {product.images?.[1] && <Image src={product.images[1]} alt="" fill sizes="(max-width: 600px) 85vw, (max-width: 900px) 45vw, 33vw" className={styles.pieceAlternate} />}
                  <span className={styles.pieceAction}>Take a closer look</span>
                </div>
                <div className={styles.pieceInfo}><div><span>{(product.category as Category | null)?.name || 'The Cressida edit'}</span><h3>{product.name}</h3></div><p>{formatPrice(product.price)}</p></div>
              </Link>
            ))}
          </div>
        ) : (
          <div className={styles.emptyEdit}><Image src="/cressida-editorial-concrete.webp" alt="Relaxed tailoring in a sculptural concrete setting" width={1122} height={1402} /><div><p>Something worth waiting for.</p><Link href="/products" className={styles.textLink}>Discover the collection</Link></div></div>
        )}
        <div className={styles.editFoot}><span>Selected with feeling. Worn your way.</span><span>Clothing, footwear & everyday objects</span></div>
      </section>

      <section className={styles.manifesto} aria-label="Our point of view">
        <p className={styles.eyebrow}>Clothes are personal. Keep them that way.</p>
        <ScrollManifesto text="A wardrobe should feel like a point of view. Not a set of rules." />
        <div className={styles.manifestoBottom}><span className={styles.brandGlyph} aria-hidden="true">c.</span><p>We follow texture, shape and that hard to explain feeling. The rest is up to you.</p><span className={styles.signature}>With feeling,<br /><em>Cressida</em></span></div>
      </section>

      <DepartmentIndex departments={departments} />
      <CampaignStudy />

      <section className={styles.closing} aria-labelledby="closing-title">
        <p className={styles.eyebrow}>Trust your taste</p>
        <h2 id="closing-title">Wear it.<br /><em>Make it yours.</em></h2>
        <MagneticLink href="/products" className={styles.closingLink}>Find your next favourite</MagneticLink>
        <div className={styles.closingFoot}><span>From Thunder Bay, with feeling.</span><MotionToggle /></div>
      </section>
    </StudioMotion>
  )
}

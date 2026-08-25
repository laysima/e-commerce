import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'
import DriftWall, { type DriftWallItem } from '@/components/home/DriftWall'
import FoldText from '@/components/home/FoldText'
import MaskedHeading from '@/components/home/MaskedHeading'
import PixelSwap from '@/components/home/PixelSwap'
import ScrollExpand from '@/components/home/ScrollExpand'
import TextLoop from '@/components/home/TextLoop'
import TrueFocus from '@/components/home/TrueFocus'
import type { Category, Product } from '@/types'

const fallbackCategories = [
  { name: "Women's", slug: 'womens-clothing' },
  { name: "Men's", slug: 'mens-clothing' },
  { name: 'Shoes', slug: 'sneakers' },
  { name: 'Objects', slug: 'accessories' },
]

const editorialCampaign = [
  {
    src: '/cressida-editorial-travertine.png',
    alt: 'Model in tobacco tailoring beneath a travertine colonnade',
    title: 'Warm structure',
  },
  {
    src: '/cressida-editorial-copper.png',
    alt: 'Two models crossing an oxidized copper gallery',
    title: 'Quiet contrast',
  },
  {
    src: '/cressida-editorial-concrete.png',
    alt: 'Model in grey tailoring on a sculptural concrete stair',
    title: 'Soft geometry',
  },
]

export default async function HomePage() {
  const supabase = await createClient()

  const [{ data: catalogProducts }, { data: categories }] = await Promise.all([
    supabase
      .from('products')
      .select('*, category:categories(name, slug)')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(18),
    supabase
      .from('categories')
      .select('*')
      .limit(5),
  ])

  const catalog = (catalogProducts ?? []) as Product[]
  const featured = catalog.filter(product => product.is_featured)
  const products = [
    ...featured,
    ...catalog.filter(product => !product.is_featured),
  ].slice(0, 6)
  const categoryLinks = categories?.length ? (categories as Category[]) : fallbackCategories
  const imageEntries = catalog.flatMap(product =>
    (product.images ?? []).map((image, imageIndex) => ({ product, image, imageIndex }))
  )
  const driftItems: DriftWallItem[] = imageEntries.slice(0, 18).map(({ product, image }) => ({
      image,
      title: product.name,
      href: `/products/${product.slug}`,
  }))
  const heroCampaign = editorialCampaign[0]

  return (
    <div className="editorial-home">
      <section className="editorial-hero">
        <div className="editorial-hero__copy">
          <div className="editorial-kicker">
            <span>New collection</span>
            <span>Thunder Bay / Canada</span>
          </div>
          <FoldText
            text={'Form follows\nfeeling.'}
            splitBy="char"
            hinge="top"
            trigger="load"
            duration={0.72}
            stagger={0.035}
            perspective={900}
            creaseShading={0.28}
            fontSize="clamp(4.2rem, 9.4vw, 10.5rem)"
            fontWeight={500}
            color="var(--ink)"
          />
          <div className="editorial-hero__intro">
            <p>
              A considered wardrobe built around proportion, touch, and the quiet confidence
              of pieces that earn their place.
            </p>
            <Link href="/products" className="editorial-link editorial-link--dark">
              Shop the new edit
            </Link>
          </div>
        </div>

        <div className="editorial-hero__media">
          {heroCampaign ? (
            <Image
              src={heroCampaign.src}
              alt={heroCampaign.alt}
              fill
              priority
              sizes="(max-width: 760px) 100vw, 58vw"
              className="editorial-hero__image"
            />
          ) : (
            <div className="editorial-hero__placeholder" aria-hidden="true" />
          )}
          <div className="editorial-hero__caption">
            <span>Campaign</span>
            <span>{heroCampaign?.title ?? 'Collection in preparation'}</span>
          </div>
          <TextLoop
            text="Cressida Atelier"
            shape="circle"
            speed={72}
            separator="·"
            curviness={90}
            fontSize={25}
            fontWeight={500}
            letterSpacing={3}
            uppercase
            color="#f7f3eb"
            pauseOnHover
            className="editorial-hero__seal"
          />
        </div>
      </section>

      <section className="service-line" aria-label="Shopping services">
        <p>Complimentary delivery on qualifying orders</p>
        <p>Free returns within thirty days</p>
        <p>Personal client service, seven days</p>
      </section>

      <section className="department-index">
        <header className="department-index__heading">
          <p className="section-index">Departments</p>
          <h2>Find your place<br />in the collection.</h2>
          <p>A quieter route through the wardrobe, organised by how you want to wear it.</p>
        </header>
        <div className="department-index__links">
          {categoryLinks.slice(0, 5).map((category) => (
            <Link href={`/categories/${category.slug}`} key={category.slug}>
              <strong>{category.name}</strong>
              <small>View department</small>
            </Link>
          ))}
        </div>
      </section>

      <section className="featured-edit">
        <header className="section-heading">
          <div>
            <p className="section-index">The current edit</p>
            <h2>A considered selection.</h2>
          </div>
          <p className="section-heading__note">
            A compact edit of clothing and footwear chosen for proportion, texture, and everyday use.
          </p>
          <Link href="/products" className="editorial-link editorial-link--dark">
            View the complete collection
          </Link>
        </header>

        {products.length ? (
          <div className="product-editorial-grid">
            {products.map((product) => (
              <Link
                href={`/products/${product.slug}`}
                className="product-editorial"
                key={product.id}
              >
                <div className="product-editorial__image">
                  {product.images?.[0] ? (
                    <Image src={product.images[0]} alt={product.name} fill sizes="(max-width: 760px) 46vw, (max-width: 1200px) 30vw, 340px" />
                  ) : (
                    <span className="product-editorial__placeholder">Image forthcoming</span>
                  )}
                </div>
                <div className="product-editorial__meta">
                  <div>
                    <p>{(product.category as Category | null)?.name ?? 'Cressida edit'}</p>
                    <h3>{product.name}</h3>
                  </div>
                  <p>{formatPrice(product.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="collection-empty">
            <div>
              <p>The collection is being prepared.</p>
              <Link href="/products" className="editorial-link">Enter the archive</Link>
            </div>
          </div>
        )}
      </section>

      <section className="masked-statement">
          <p className="section-index">Our point of view</p>
          <MaskedHeading
            tag="h2"
            text="Designed in the details"
            src="/cressida-editorial-concrete.png"
            fillScale={1.28}
            parallax={28}
            drift={12}
            brightness={0.94}
            saturation={0.76}
            textScale={0.122}
            weight={600}
            tracking={-0.055}
            lineHeight={0.92}
            reveal="wipe"
            trigger="view"
          />
          <div className="masked-statement__note">
            <span>Fewer, better things.</span>
            <p>We choose pieces for the life they gain through wear, not the attention they ask for on day one.</p>
          </div>
      </section>

      <section className="interactive-editorial">
          <div className="interactive-editorial__copy">
            <p className="section-index">A private note</p>
            <h2>There is more<br />beneath the surface.</h2>
            <p>Click the image to uncover the timing of our next limited wardrobe release.</p>
          </div>
          <PixelSwap
            firstContent={
              <div className="pixel-campaign pixel-campaign--image">
                <Image src="/cressida-editorial-copper.png" alt="Models crossing an oxidized copper gallery" fill sizes="(max-width: 800px) 100vw, 55vw" />
                <span>Tap to reveal</span>
              </div>
            }
            secondContent={
              <div className="pixel-campaign pixel-campaign--message">
                <p>Private release</p>
                <strong>Late summer</strong>
                <span>For subscribers first</span>
              </div>
            }
            pixelSize={56}
            pixelScale={0.25}
            duration={1200}
            pixelDuration={420}
            pattern="diagonal"
            fade
            trigger="click"
          />
      </section>

      <ScrollExpand
          src="/cressida-editorial-travertine.png"
          alt="Model in tobacco tailoring beneath a travertine colonnade"
          title="The collection study"
          scrollHint="Scroll to enter"
          useWindowScroll
          mediaZoom={1.22}
        >
          <h2>Composed with intention.</h2>
          <p>Volume where you want it, restraint where you need it. Every piece begins with proportion and use.</p>
      </ScrollExpand>

      <section className="wardrobe-studies wardrobe-studies--flat">
        <div className="wardrobe-studies__copy">
          <p className="section-index section-index--light">Campaign studies</p>
          <h2>One season,<br /><em>three moods.</em></h2>
          <p>Pieces are selected to work together across days, weather, and ways of being.</p>
          <Link href="/products" className="editorial-link">Explore the edit</Link>
        </div>
        <div className="wardrobe-studies__looks">
          {editorialCampaign.map((image) => (
            <Link href="/products" key={image.src}>
              <figure>
                <Image src={image.src} alt={image.alt} fill sizes="(max-width: 760px) 46vw, 20vw" />
                <figcaption>{image.title}</figcaption>
              </figure>
            </Link>
          ))}
        </div>
      </section>

      {driftItems.length > 0 && <section className="moving-lookbook">
        <div className="moving-lookbook__wall">
          <DriftWall
            items={driftItems}
            columns={5}
            tileWidth={210}
            tileHeight={290}
            gap={18}
            tilt={12}
            turn={-8}
            perspective={1300}
            depth={80}
            speed={34}
            direction="up"
            variance={0.45}
            parallax={0.6}
            lift={64}
            fade={0.72}
            dim={0.42}
            overlayColor="#171714"
          />
        </div>
        <div className="moving-lookbook__copy">
          <p className="section-index section-index--light">Moving lookbook</p>
          <h2>The collection<br />in context.</h2>
          <Link href="/products" className="editorial-link">Discover every look</Link>
        </div>
      </section>}

      <section className="focus-statement">
        <p className="section-index">The Cressida principle</p>
        <TrueFocus
          sentence="Less. Better. Worn."
          manualMode={false}
          blurAmount={5}
          borderColor="#a44b36"
          animationDuration={1.4}
          pauseBetweenAnimations={0.65}
        />
        <p className="focus-statement__foot">Designed to become yours, not just to be new.</p>
      </section>
    </div>
  )
}

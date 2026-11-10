import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'

const departments = [
  { label: 'Women', href: '/categories/womens-clothing', letter: 'A', image: '/looks/look-12.webp', alt: 'A woman in a black tee, black denim shorts and bright sneakers' },
  { label: 'Men', href: '/categories/mens-clothing', letter: 'B', image: '/looks/look-09.webp', alt: 'A man in a black graphic tee and long black denim shorts' },
  { label: 'Sneakers', href: '/categories/sneakers', letter: 'C', image: '/looks/look-14.webp', alt: 'A man walking away in a white tee, faded denim shorts and bright sneakers' },
  { label: 'Accessories', href: '/categories/accessories', letter: 'D', image: '/looks/look-13.webp', alt: 'A man in a washed grey tee and green shorts carrying a canvas tote' },
]

const lookSlugs = [
  'chunky-runner-sneaker',
  'script-back-print-tee',
  'canvas-market-tote',
  'black-padded-boot',
  'boxy-emblem-tee',
  'washed-canvas-shoulder-tote',
  'tan-leather-work-boot',
  'flag-print-tee',
  'console-graphic-tee',
  'mask-graphic-tee',
  'wheat-laceup-boot',
  'lips-print-tee',
  'heavy-canvas-carryall',
  'court-low-sneaker',
  'black-shoulder-bag',
]

const looks = [
  'White tee with a lips print and washed purple denim shorts',
  'Black tee and long black denim shorts, seen from behind',
  'Cream graphic tee, green shorts and a canvas tote',
  'Black back print tee, black shorts and heavy boots',
  'White boxy tee and bleached white shorts',
  'Washed grey back print tee, bleached shorts and a canvas tote',
  'Black tee, frayed black shorts and tan boots',
  'White flag tee and heavily distressed wide jeans',
  'Black graphic tee and long black denim shorts',
  'White graphic tee and bleached white shorts',
  'White tee and long brown shorts with tan boots',
  'Black lips print tee, black denim shorts and bright sneakers',
  'Washed grey tee, green shorts and a canvas tote',
  'White tee, faded denim shorts and bright sneakers',
  'Black back print tee, black shorts and a black shoulder bag',
].map((alt, index) => ({ alt, slug: lookSlugs[index], src: `/looks/look-${String(index + 1).padStart(2, '0')}.webp` }))

function SectionLabel({ children, index }: { children: React.ReactNode; index: string }) {
  return (
    <div className="landing-label">
      <p>{children} <ChevronDown aria-hidden="true" size={13} strokeWidth={2} /></p>
      <span>__{index}</span>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="landing">
      <section className="landing-hero" aria-labelledby="hero-title">
        <h1 id="hero-title" aria-label="Dress like you mean it">
          <span aria-hidden="true">Dress</span>
          <span aria-hidden="true">Like</span>
          <span aria-hidden="true">You mean it</span>
        </h1>

        <div className="landing-hero__figure">
          <Image src="/editorial/hero-figure.webp" alt="A model in a cream cropped jacket, black polo and dark wide jeans, wearing sunglasses" fill preload unoptimized />
        </div>

        <div className="landing-hero__brief">
          <p>Pieces with presence. Layers with a little attitude. Find the ones that feel like you.</p>
          <strong>Find it in:</strong>
          <nav aria-label="Departments">
            <Link href="/categories/womens-clothing">Women</Link>
            <Link href="/categories/mens-clothing">Men</Link>
            <Link href="/categories/sneakers">Sneakers</Link>
            <Link href="/categories/formal-shoes">Formal shoes</Link>
            <Link href="/categories/accessories">Accessories</Link>
          </nav>
        </div>

        <p className="landing-hero__tag">Good clothes.<br />A little instinct.<br />An entirely different feeling.</p>

        <div className="landing-hero__notch">
          <div>
            <p>So what are you<br />wearing next?</p>
            <span>15 looks</span>
          </div>
          <Link href="/products">Shop the collection</Link>
        </div>

        <Link href="/products" className="landing-hero__inset" aria-label="See the new collection">
          <Image src="/editorial/inset.webp" alt="" fill sizes="(max-width: 760px) 30vw, 14vw" />
        </Link>
        <i className="landing-cross landing-cross--hero" aria-hidden="true" />
      </section>

      <SectionLabel index="001">Who we are</SectionLabel>
      <section className="landing-statement" aria-label="Our point of view">
        <h2>Clothes are personal. A wardrobe should feel like a point of view. <strong>Not a set of rules. We follow texture, shape and that hard to explain feeling.</strong></h2>
        <p>The rest is up to you. Trust your taste, wear it, and make it yours.</p>
      </section>

      <SectionLabel index="002">Find your way in</SectionLabel>
      <section className="landing-columns" aria-label="Shop by department">
        {departments.map(department => (
          <Link href={department.href} className="landing-column" key={department.label}>
            <div className="landing-column__card">
              <Image src={department.image} alt={department.alt} fill unoptimized />
            </div>
            <div className="landing-column__title">
              <span>{department.letter}</span>
              <h3>{department.label}</h3>
            </div>
          </Link>
        ))}
      </section>

      <SectionLabel index="003">The looks</SectionLabel>
      <section className="landing-looks" aria-label="The looks">
        {looks.map(look => (
          <Link href={`/products/${look.slug}`} key={look.src}>
            <Image src={look.src} alt={look.alt} fill unoptimized />
          </Link>
        ))}
      </section>
      <div className="landing-more"><Link href="/products" className="underline-link">Shop the collection</Link></div>
    </div>
  )
}

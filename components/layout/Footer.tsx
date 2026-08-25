'use client'

import Link from 'next/link'
import BorderGlow from '@/components/home/BorderGlow'

const footerLinks = {
  Collection: [
    { name: 'New arrivals', href: '/products' },
    { name: "Women's clothing", href: '/categories/womens-clothing' },
    { name: "Men's clothing", href: '/categories/mens-clothing' },
    { name: 'Shoes', href: '/categories/sneakers' },
    { name: 'Accessories', href: '/categories/accessories' },
  ],
  Services: [
    { name: 'My account', href: '/account' },
    { name: 'Orders', href: '/orders' },
    { name: 'Saved pieces', href: '/wishlist' },
    { name: 'Delivery & returns', href: '/returns' },
    { name: 'Client care', href: '/contact' },
  ],
}

export default function Footer() {
  return (
    <footer className="site-footer">
      <section className="site-footer__newsletter">
        <div>
          <p className="section-index section-index--light">Private correspondence</p>
          <h2>A quieter kind<br />of newsletter.</h2>
        </div>
        <div>
          <p>Seasonal notes, limited releases, and the stories behind the pieces. Sent with restraint.</p>
          <BorderGlow
            glowColor="210 128 103"
            backgroundColor="#171714"
            borderRadius={0}
            glowRadius={58}
            glowIntensity={0.9}
            colors={['#4e4c45', '#d58a74', '#f1eee7']}
            className="newsletter-glow"
          >
            <form onSubmit={event => event.preventDefault()} className="newsletter-form">
              <label htmlFor="footer-email">Email address</label>
              <input id="footer-email" type="email" placeholder="you@example.com" required />
              <button type="submit">Join ↗</button>
            </form>
          </BorderGlow>
        </div>
      </section>

      <section className="site-footer__links">
        <div className="site-footer__about">
          <p className="section-index section-index--light">Cressida / Est. 2026</p>
          <p>Contemporary clothing and footwear, selected for texture, proportion, and permanence.</p>
          <div className="site-footer__social">
            <Link href="#">Instagram</Link>
            <Link href="#">Pinterest</Link>
            <Link href="#">Journal</Link>
          </div>
        </div>
        {Object.entries(footerLinks).map(([title, links]) => (
          <div className="site-footer__column" key={title}>
            <p>{title}</p>
            {links.map(link => <Link href={link.href} key={link.name}>{link.name}</Link>)}
          </div>
        ))}
        <div className="site-footer__column">
          <p>Visit</p>
          <address>
            By appointment<br />
            Thunder Bay, Ontario<br />
            Canada
          </address>
        </div>
      </section>

      <p className="site-footer__wordmark">Cressida</p>

      <div className="site-footer__legal">
        <p>© {new Date().getFullYear()} Cressida</p>
        <div><Link href="#">Privacy</Link><Link href="#">Terms</Link><Link href="#">Accessibility</Link></div>
        <p>Canada / CAD</p>
      </div>
    </footer>
  )
}

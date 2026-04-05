'use client'

import Link from 'next/link'
import { Mail } from 'lucide-react'

const footerLinks = {
  Collection: [
    { name: "Men's Clothing", href: '/categories/mens-clothing' },
    { name: "Women's Clothing", href: '/categories/womens-clothing' },
    { name: 'Sneakers', href: '/categories/sneakers' },
    { name: 'Formal Shoes', href: '/categories/formal-shoes' },
    { name: 'Accessories', href: '/categories/accessories' },
  ],
  Account: [
    { name: 'My Account', href: '/account' },
    { name: 'My Orders', href: '/orders' },
    { name: 'Wishlist', href: '/wishlist' },
    { name: 'Sign In', href: '/login' },
    { name: 'Register', href: '/register' },
  ],
  Support: [
    { name: 'FAQ', href: '/faq' },
    { name: 'Shipping Policy', href: '/shipping' },
    { name: 'Returns & Refunds', href: '/returns' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Track Order', href: '/orders' },
  ],
}

const socialLinks = [
  { name: 'Instagram', href: '#', label: 'IG' },
  { name: 'Pinterest', href: '#', label: 'PT' },
  { name: 'Twitter', href: '#', label: 'TW' },
  { name: 'YouTube', href: '#', label: 'YT' },
]

function SocialBtn({ name, href, label }: { name: string; href: string; label: string }) {
  return (
    <Link
      href={href}
      aria-label={name}
      className="w-8 h-8 flex items-center justify-center rounded-full transition-all hover:opacity-70"
      style={{
        border: '1px solid rgba(184,149,74,0.35)',
        color: 'var(--gold-light)',
        fontFamily: 'Jost, sans-serif',
        fontSize: '0.6rem',
        fontWeight: 500,
        letterSpacing: '0.05em',
      }}
    >
      {label}
    </Link>
  )
}

export default function Footer() {
  return (
    <footer style={{ backgroundColor: 'var(--navy)', color: 'var(--gray-400)' }}>

      {/* Newsletter */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div
          className="max-w-screen-xl mx-auto px-6 lg:px-12 py-16"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
            <div>
              <p className="eyebrow mb-3">Newsletter</p>
              <h3
                className="text-3xl md:text-4xl"
                style={{ fontFamily: 'Playfair Display, serif', fontWeight: 400, color: 'var(--cream)', lineHeight: 1.2 }}
              >
                Stay in the Know
              </h3>
              <p
                className="mt-3 text-sm"
                style={{ fontFamily: 'Jost, sans-serif', fontWeight: 300, color: 'var(--gray-400)', maxWidth: '340px' }}
              >
                New arrivals, exclusive offers, and style inspiration — curated for you.
              </p>
            </div>
            <form
              onSubmit={e => e.preventDefault()}
              className="flex w-full md:w-auto"
              style={{ maxWidth: '420px' }}
            >
              <div className="relative flex-1">
                <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--gold)' }} />
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full pl-10 pr-4 py-3.5 text-sm outline-none transition-all"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRight: 'none',
                    color: 'var(--cream)',
                    fontFamily: 'Jost, sans-serif',
                    fontWeight: 300,
                    letterSpacing: '0.05em',
                  }}
                />
              </div>
              <button
                type="submit"
                className="px-7 py-3.5 text-xs font-medium tracking-widest uppercase transition-opacity hover:opacity-80 whitespace-nowrap"
                style={{
                  backgroundColor: 'var(--gold)',
                  color: 'var(--navy)',
                  fontFamily: 'Jost, sans-serif',
                  letterSpacing: '0.15em',
                }}
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-16">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '1.5rem',
                fontWeight: 500,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--cream)',
              }}
            >
              Cressida
            </Link>
            <p
              className="mt-5 text-sm leading-relaxed"
              style={{ fontFamily: 'Jost, sans-serif', fontWeight: 300, color: 'var(--gray-400)', maxWidth: '220px' }}
            >
              Timeless clothing and footwear, curated for the discerning individual.
            </p>
            <div className="flex items-center gap-2.5 mt-6">
              {socialLinks.map(s => (
                <SocialBtn key={s.name} name={s.name} href={s.href} label={s.label} />
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <p className="eyebrow mb-6">{title}</p>
              <ul className="space-y-3.5">
                {links.map(link => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="hover-line hover-line-gold text-sm transition-opacity hover:opacity-70"
                      style={{ fontFamily: 'Jost, sans-serif', fontWeight: 300, color: 'var(--gray-400)' }}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.7rem', fontWeight: 300, color: 'var(--gray-600)', letterSpacing: '0.08em' }}>
            © {new Date().getFullYear()} Cressida. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookies'].map(item => (
              <Link
                key={item}
                href="#"
                className="transition-opacity hover:opacity-60"
                style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.7rem', fontWeight: 300, color: 'var(--gray-600)', letterSpacing: '0.08em' }}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
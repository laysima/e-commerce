'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingBag, Heart, Search, Menu, X, User, LogOut, Package } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types'

const categories = [
  { name: "Men's", slug: 'mens-clothing' },
  { name: "Women's", slug: 'womens-clothing' },
  { name: 'Sneakers', slug: 'sneakers' },
  { name: 'Formal Shoes', slug: 'formal-shoes' },
  { name: 'Accessories', slug: 'accessories' },
]

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [mounted, setMounted] = useState(false)

  const router = useRouter()
  const supabase = createClient()
  const totalItems = useCartStore(state => state.totalItems())
  const wishlistItems = useWishlistStore(state => state.items)
  const openCart = useCartStore(state => state.openCart)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

 useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        setProfile(data)
      }
    }
    getProfile()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setIsSearchOpen(false)
      setSearchQuery('')
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setProfile(null)
    setIsUserMenuOpen(false)
    router.push('/')
    router.refresh()
  }

  return (
    <>
      {/* Announcement Bar */}
      <div
        className="text-center py-2.5"
        style={{
          backgroundColor: 'var(--navy)',
          color: 'var(--gold-light)',
          fontFamily: 'Jost, sans-serif',
          fontSize: '0.65rem',
          letterSpacing: '0.2em',
          fontWeight: 400,
        }}
      >
        COMPLIMENTARY SHIPPING ON ORDERS OVER $150 · FREE RETURNS
      </div>

      {/* Main Navbar */}
      <header
        className="sticky top-0 z-50 w-full"
        style={{
          backgroundColor: 'var(--white)',
          borderBottom: '1px solid var(--gray-100)',
          transition: 'box-shadow 0.3s ease',
          boxShadow: isScrolled ? '0 1px 20px rgba(0,0,0,0.06)' : 'none',
        }}
      >
        {/* Search Overlay */}
        {isSearchOpen && (
          <div
            className="absolute inset-0 z-20 flex items-center px-8 gap-6"
            style={{ backgroundColor: 'var(--white)' }}
          >
            <Search size={15} style={{ color: 'var(--gold)', flexShrink: 0 }} />
            <form onSubmit={handleSearch} className="flex-1">
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search Cressida..."
                className="w-full outline-none bg-transparent text-sm"
                style={{
                  fontFamily: 'Jost, sans-serif',
                  fontWeight: 300,
                  color: 'var(--gray-900)',
                  letterSpacing: '0.05em',
                  borderBottom: '1px solid var(--gray-200)',
                  paddingBottom: '4px',
                }}
              />
            </form>
            <button
              onClick={() => setIsSearchOpen(false)}
              style={{ color: 'var(--gray-400)' }}
              className="transition-opacity hover:opacity-50"
            >
              <X size={18} />
            </button>
          </div>
        )}

        <div
          className="max-w-screen-xl mx-auto px-6 lg:px-12"
          style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', height: '64px' }}
        >
          {/* Left — Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {categories.slice(0, 3).map(cat => (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="hover-line"
                style={{
                  fontFamily: 'Jost, sans-serif',
                  fontSize: '0.7rem',
                  fontWeight: 400,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'var(--gray-600)',
                }}
              >
                {cat.name}
              </Link>
            ))}
          </nav>

          {/* Center — Logo */}
          <Link href="/" className="text-center">
            <span
              style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '1.75rem',
                fontWeight: 500,
                letterSpacing: '0.12em',
                color: 'var(--navy)',
                textTransform: 'uppercase',
              }}
            >
              Cressida
            </span>
          </Link>

          {/* Right — Icons */}
          <div className="flex items-center justify-end gap-0.5">

            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 transition-opacity hover:opacity-50"
              style={{ color: 'var(--navy)' }}
            >
              <Search size={17} />
            </button>

            <Link
              href="/wishlist"
              className="relative p-2.5 transition-opacity hover:opacity-50"
              style={{ color: 'var(--navy)' }}
            >
              <Heart size={17} />
                {mounted && wishlistItems.length > 0 &&(
                  <span
                    suppressHydrationWarning
                    className="absolute top-1.5 right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: 'var(--gold)', fontSize: '8px', fontFamily: 'Jost, sans-serif' }}
                  >
                    {wishlistItems.length}
                  </span>
                )}
            </Link>

            <button
              onClick={openCart}
              className="relative p-2.5 transition-opacity hover:opacity-50"
              style={{ color: 'var(--navy)' }}
            >
              <ShoppingBag size={17} />
              {mounted && totalItems > 0 &&(
                <span
                  suppressHydrationWarning
                  className="absolute top-1.5 right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: 'var(--gold)', fontSize: '8px', fontFamily: 'Jost, sans-serif' }}
                >
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </button>

            {/* User */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="p-2.5 transition-opacity hover:opacity-50"
                style={{ color: 'var(--navy)' }}
              >
                <User size={17} />
              </button>

              {isUserMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-52 py-2 z-50"
                  style={{
                    backgroundColor: 'var(--white)',
                    border: '1px solid var(--gray-100)',
                    boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
                  }}
                >
                  {profile ? (
                    <>
                      <div className="px-5 py-3" style={{ borderBottom: '1px solid var(--gray-100)' }}>
                        <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.85rem', fontWeight: 500, color: 'var(--gray-900)' }}>
                          {profile.full_name || 'My Account'}
                        </p>
                        <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: '2px' }} className="truncate">
                          {profile.email}
                        </p>
                      </div>
                      {[
                        { href: '/account', icon: User, label: 'My Account' },
                        { href: '/orders', icon: Package, label: 'My Orders' },
                      ].map(item => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-5 py-2.5 transition-colors hover:bg-gray-50"
                          style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.8rem', fontWeight: 300, color: 'var(--gray-600)' }}
                        >
                          <item.icon size={13} /> {item.label}
                        </Link>
                      ))}
                      {profile.role === 'admin' && (
                        <Link
                          href="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-5 py-2.5 transition-colors hover:bg-gray-50"
                          style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.8rem', fontWeight: 400, color: 'var(--gold)' }}
                        >
                          <Package size={13} /> Admin Panel
                        </Link>
                      )}
                      <div style={{ borderTop: '1px solid var(--gray-100)', marginTop: '4px', paddingTop: '4px' }}>
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-3 w-full px-5 py-2.5 transition-colors hover:bg-red-50"
                          style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.8rem', fontWeight: 300, color: '#E57373' }}
                        >
                          <LogOut size={13} /> Sign Out
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center px-5 py-2.5 transition-colors hover:bg-gray-50"
                        style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.8rem', fontWeight: 300, color: 'var(--gray-600)' }}
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center px-5 py-2.5 transition-colors hover:bg-gray-50"
                        style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.8rem', fontWeight: 300, color: 'var(--gray-600)' }}
                      >
                        Create Account
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2.5 transition-opacity hover:opacity-50"
              style={{ color: 'var(--navy)' }}
            >
              {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div
            className="md:hidden px-6 pb-6"
            style={{ borderTop: '1px solid var(--gray-100)' }}
          >
            <nav className="flex flex-col pt-4 gap-1">
              {categories.map(cat => (
                <Link
                  key={cat.slug}
                  href={`/categories/${cat.slug}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="py-3 transition-colors"
                  style={{
                    fontFamily: 'Jost, sans-serif',
                    fontSize: '0.7rem',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    fontWeight: 400,
                    color: 'var(--gray-600)',
                    borderBottom: '1px solid var(--gray-100)',
                  }}
                >
                  {cat.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>
    </>
  )
}
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types'

const categories = [
  { name: "Women's", slug: 'womens-clothing' },
  { name: "Men's", slug: 'mens-clothing' },
  { name: 'Sneakers', slug: 'sneakers' },
  { name: 'Formal shoes', slug: 'formal-shoes' },
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
  const [supabase] = useState(() => createClient())

  const router = useRouter()
  const totalItems = useCartStore(state => state.totalItems())
  const wishlistItems = useWishlistStore(state => state.items)
  const openCart = useCartStore(state => state.openCart)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 0)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(data)
    }
    void getProfile()
  }, [supabase])

  useEffect(() => {
    document.body.style.overflow = isMenuOpen || isSearchOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isMenuOpen, isSearchOpen])

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault()
    if (!searchQuery.trim()) return
    router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
    setIsSearchOpen(false)
    setSearchQuery('')
  }

  const handleSignOut = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase
        .from('profiles')
        .update({ cart_data: useCartStore.getState().items, wishlist_data: useWishlistStore.getState().items })
        .eq('id', user.id)
    }
    await supabase.auth.signOut()
    setProfile(null)
    setIsUserMenuOpen(false)
    useCartStore.getState().clearCart()
    useWishlistStore.setState({ items: [] })
    localStorage.removeItem('cart-storage')
    localStorage.removeItem('wishlist-storage')
    router.push('/')
    router.refresh()
  }

  return (
    <header className={`site-header ${isScrolled ? 'site-header--scrolled' : ''}`}>
      <div className="site-header__bar">
        <nav className="site-header__nav site-header__nav--left" aria-label="Primary navigation">
          <Link href="/products">Shop all</Link>
          <Link href="/categories/womens-clothing">Women</Link>
          <Link href="/categories/mens-clothing">Men</Link>
        </nav>

        <Link href="/" className="site-wordmark" aria-label="Cressida home">Cressida</Link>

        <div className="site-header__nav site-header__nav--right">
          <button type="button" onClick={() => setIsSearchOpen(true)}>Search</button>
          <Link href="/wishlist">
            Saved{mounted && wishlistItems.length > 0 ? ` (${wishlistItems.length})` : ''}
          </Link>
          <button type="button" onClick={openCart}>
            Bag{mounted && totalItems > 0 ? ` (${totalItems > 99 ? '99+' : totalItems})` : ''}
          </button>
          <div className="account-menu">
            <button type="button" onClick={() => setIsUserMenuOpen(value => !value)} aria-expanded={isUserMenuOpen}>
              Account
            </button>
            {isUserMenuOpen && (
              <div className="account-menu__panel">
                {profile ? (
                  <>
                    <div className="account-menu__identity">
                      <strong>{profile.full_name || 'My account'}</strong>
                      <span>{profile.email}</span>
                    </div>
                    <Link href="/account" onClick={() => setIsUserMenuOpen(false)}>Profile</Link>
                    <Link href="/orders" onClick={() => setIsUserMenuOpen(false)}>Orders</Link>
                    {profile.role === 'admin' && <Link href="/admin">Administration</Link>}
                    <button type="button" onClick={handleSignOut}>Sign out</button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setIsUserMenuOpen(false)}>Sign in</Link>
                    <Link href="/register" onClick={() => setIsUserMenuOpen(false)}>Create account</Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="site-header__mobile-actions">
          <button type="button" onClick={() => setIsSearchOpen(true)}>Search</button>
          <button type="button" onClick={openCart}>Bag{mounted && totalItems > 0 ? ` (${totalItems})` : ''}</button>
          <button type="button" onClick={() => setIsMenuOpen(true)}>Menu</button>
        </div>
      </div>

      {isSearchOpen && (
        <div className="site-search">
          <div className="site-search__top">
            <span>Search the collection</span>
            <button type="button" onClick={() => setIsSearchOpen(false)}>Close</button>
          </div>
          <form onSubmit={handleSearch}>
            <label htmlFor="site-search-input">What are you looking for?</label>
            <div>
              <input
                id="site-search-input"
                autoFocus
                value={searchQuery}
                onChange={event => setSearchQuery(event.target.value)}
                placeholder="Coat, shoe, or collection"
              />
              <button type="submit">Search ↗</button>
            </div>
          </form>
          <div className="site-search__suggestions">
            <span>Suggested</span>
            <Link href="/products?sort=">New arrivals</Link>
            <Link href="/categories/formal-shoes">Leather shoes</Link>
            <Link href="/categories/accessories">Everyday objects</Link>
          </div>
        </div>
      )}

      {isMenuOpen && (
        <div className="site-menu">
          <div className="site-menu__top">
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="site-wordmark">Cressida</Link>
            <button type="button" onClick={() => setIsMenuOpen(false)}>Close</button>
          </div>
          <nav aria-label="Mobile navigation">
            <Link href="/products" onClick={() => setIsMenuOpen(false)}><span>00</span>Shop all</Link>
            {categories.map((category, index) => (
              <Link href={`/categories/${category.slug}`} onClick={() => setIsMenuOpen(false)} key={category.slug}>
                <span>{String(index + 1).padStart(2, '0')}</span>{category.name}
              </Link>
            ))}
          </nav>
          <div className="site-menu__utility">
            <Link href="/wishlist">Saved pieces</Link>
            <Link href={profile ? '/account' : '/login'}>{profile ? 'My account' : 'Sign in'}</Link>
          </div>
        </div>
      )}
    </header>
  )
}

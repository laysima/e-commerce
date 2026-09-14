import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CartDrawer from '@/components/cart/CartDrawer'
import AnnouncementBanner from '@/components/home/AnnouncementBanner'
import AnnouncementPopup from '@/components/home/AnnouncementPopup'
import CartSyncProvider from '@/components/layout/CartSyncProvider'
import { createClient } from '@/lib/supabase/server'
import localFont from 'next/font/local'
import './storefront.css'

const atelier = localFont({
  src: [
    { path: '../../public/fonts/manrope-regular.ttf', weight: '400', style: 'normal' },
    { path: '../../public/fonts/manrope-bold.ttf', weight: '700', style: 'normal' },
  ],
  variable: '--font-atelier',
  display: 'swap',
})
const cressidaSerif = localFont({
  src: '../../public/fonts/bodoni-moda-italic.ttf',
  weight: '500',
  style: 'italic',
  variable: '--font-cressida-serif',
  display: 'swap',
})

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: announcement } = await supabase
    .from('announcements')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  return (
    <div id="page-top" className={`storefront min-h-screen flex flex-col ${atelier.variable} ${cressidaSerif.variable}`}>
      <a className="skip-link" href="#main-content">Skip to content</a>
      {/* Top banner */}
      {announcement && (
        <AnnouncementBanner
          message={announcement.message}
          linkText={announcement.link_text}
          linkUrl={announcement.link_url}
        />
      )}
      <Navbar />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        {children}
      </main>
      <Footer />
      <CartDrawer />
      <CartSyncProvider userId={user?.id ?? null} />
      {/* Popup — shows once per session */}
      {announcement && (
        <AnnouncementPopup
          message={announcement.message}
          linkText={announcement.link_text}
          linkUrl={announcement.link_url}
        />
      )}
    </div>
  )
}

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
  src: '../../public/fonts/archivo-variable.woff2',
  weight: '100 900',
  variable: '--font-atelier',
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
    <div id="page-top" className={`storefront min-h-screen flex flex-col ${atelier.variable}`}>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="shop-sheet">
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
      </div>
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

import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CartDrawer from '@/components/cart/CartDrawer'
import AnnouncementBanner from '@/components/home/AnnouncementBanner'
import AnnouncementPopup from '@/components/home/AnnouncementPopup'
import CartSyncProvider from '@/components/layout/CartSyncProvider'
import { createClient } from '@/lib/supabase/server'

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
    <div className="min-h-screen flex flex-col">
      {/* Top banner */}
      {announcement && (
        <AnnouncementBanner
          message={announcement.message}
          linkText={announcement.link_text}
          linkUrl={announcement.link_url}
        />
      )}
      <Navbar />
      <main className="flex-1">
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
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CartDrawer from '@/components/cart/CartDrawer'
import AnnouncementBanner from '@/components/home/AnnouncementBanner'
import CartSyncProvider from '@/components/layout/CartSyncProvider'
import { createClient } from '@/lib/supabase/server'

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch active announcement
  const { data: announcement } = await supabase
    .from('announcements')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  return (
    <div className="min-h-screen flex flex-col">
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
      {/* Syncs cart + wishlist with DB for logged in users */}
      <CartSyncProvider userId={user?.id ?? null} />
    </div>
  )
}
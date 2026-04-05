import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar sits at the top of every shop page */}
      <Navbar />

      {/* Page content renders here */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer sits at the bottom of every shop page */}
      <Footer />
    </div>
  )
}
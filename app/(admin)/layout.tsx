import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { LayoutDashboard, Package, ShoppingBag, LogOut,Megaphone } from 'lucide-react'


export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name, email')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/')

const navLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/announcements', label: 'Announcements', icon: Megaphone },
]

  return (
    <div
      className="min-h-screen flex"
      style={{ backgroundColor: 'var(--gray-50)' }}
    >
      {/* Sidebar */}
      <aside
        className="hidden lg:flex flex-col w-60 shrink-0"
        style={{
          backgroundColor: 'var(--navy)',
          borderRight: '1px solid rgba(255,255,255,0.05)',
          position: 'sticky',
          top: 0,
          height: '100vh',
        }}
      >
        {/* Logo */}
        <div
          className="px-6 py-6"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <Link
            href="/"
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '1.3rem',
              fontWeight: 500,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--cream)',
            }}
          >
            Cressida
          </Link>
          <p
            className="mt-0.5"
            style={{
              fontFamily: 'Jost, sans-serif',
              fontSize: '0.62rem',
              fontWeight: 400,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
            }}
          >
            Admin Panel
          </p>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-6 space-y-1">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 px-4 py-3 rounded-sm transition-all hover:opacity-80"
              style={{
                fontFamily: 'Jost, sans-serif',
                fontSize: '0.8rem',
                fontWeight: 300,
                letterSpacing: '0.05em',
                color: 'rgba(250,250,247,0.7)',
              }}
            >
              <link.icon size={15} />
              {link.label}
            </Link>
          ))}
        </nav>

        {/* User Info */}
        <div
          className="px-6 py-5"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <p
            style={{
              fontFamily: 'Jost, sans-serif',
              fontSize: '0.8rem',
              fontWeight: 400,
              color: 'var(--cream)',
            }}
          >
            {profile?.full_name ?? 'Admin'}
          </p>
          <p
            style={{
              fontFamily: 'Jost, sans-serif',
              fontSize: '0.72rem',
              fontWeight: 300,
              color: 'rgba(250,250,247,0.4)',
              marginTop: '2px',
            }}
          >
            {profile?.email}
          </p>
          <Link
            href="/"
            className="flex items-center gap-2 mt-4 transition-opacity hover:opacity-60"
            style={{
              fontFamily: 'Jost, sans-serif',
              fontSize: '0.72rem',
              fontWeight: 300,
              color: 'rgba(250,250,247,0.4)',
              letterSpacing: '0.05em',
            }}
          >
            <LogOut size={12} /> Back to Store
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
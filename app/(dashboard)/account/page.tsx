import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import AccountForm from '@/components/account/AccountForm'

export default async function AccountPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: orderCount } = await supabase
    .from('orders')
    .select('id', { count: 'exact' })
    .eq('user_id', user.id)

  return (
    <div style={{ backgroundColor: 'var(--white)', minHeight: '100vh' }}>

      {/* Header */}
      <div
        style={{
          borderBottom: '1px solid var(--gray-100)',
          backgroundColor: 'var(--cream)',
          padding: '5rem 0 3.5rem',
        }}
      >
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-2 mb-6">
            <Link
              href="/"
              className="transition-opacity hover:opacity-60"
              style={{
                fontFamily: 'Jost, sans-serif',
                fontSize: '0.72rem',
                fontWeight: 300,
                color: 'var(--gray-400)',
              }}
            >
              Home
            </Link>
            <span style={{ color: 'var(--gray-200)' }}>/</span>
            <span
              style={{
                fontFamily: 'Jost, sans-serif',
                fontSize: '0.72rem',
                fontWeight: 400,
                color: 'var(--navy)',
              }}
            >
              My Account
            </span>
          </div>
          <p className="eyebrow mb-3">Dashboard</p>
          <h1
            style={{
              fontFamily: 'Playfair Display, serif',
              fontWeight: 400,
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              color: 'var(--navy)',
            }}
          >
            {profile?.full_name
              ? `Welcome, ${profile.full_name.split(' ')[0]}`
              : 'My Account'}
          </h1>
          <p
            className="mt-2"
            style={{
              fontFamily: 'Jost, sans-serif',
              fontWeight: 300,
              fontSize: '0.82rem',
              color: 'var(--gray-400)',
            }}
          >
            Member since {formatDate(profile?.created_at ?? '')}
          </p>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* ── Left Sidebar ── */}
          <div className="space-y-4">

            {/* Stats */}
            <div
              className="p-6"
              style={{ border: '1px solid var(--gray-100)', backgroundColor: 'var(--cream)' }}
            >
              <p className="eyebrow mb-5" style={{ fontSize: '0.6rem' }}>
                Account Overview
              </p>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span
                    style={{
                      fontFamily: 'Jost, sans-serif',
                      fontSize: '0.8rem',
                      fontWeight: 300,
                      color: 'var(--gray-400)',
                    }}
                  >
                    Total Orders
                  </span>
                  <span
                    style={{
                      fontFamily: 'Playfair Display, serif',
                      fontSize: '1.2rem',
                      fontWeight: 500,
                      color: 'var(--navy)',
                    }}
                  >
                    {orderCount?.length ?? 0}
                  </span>
                </div>
                <div className="gold-divider" />
                <div className="flex items-center justify-between">
                  <span
                    style={{
                      fontFamily: 'Jost, sans-serif',
                      fontSize: '0.8rem',
                      fontWeight: 300,
                      color: 'var(--gray-400)',
                    }}
                  >
                    Account Status
                  </span>
                  <span
                    style={{
                      fontFamily: 'Jost, sans-serif',
                      fontSize: '0.72rem',
                      fontWeight: 500,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'var(--gold)',
                    }}
                  >
                    {profile?.role === 'admin' ? 'Admin' : 'Member'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div
              className="p-6"
              style={{ border: '1px solid var(--gray-100)' }}
            >
              <p className="eyebrow mb-5" style={{ fontSize: '0.6rem' }}>
                Quick Links
              </p>
              <div className="space-y-1">
                {[
                  { label: 'My Orders', href: '/orders' },
                  { label: 'Wishlist', href: '/wishlist' },
                  { label: 'Browse Collection', href: '/products' },
                ].map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center justify-between py-2.5 hover-line transition-opacity hover:opacity-60 group"
                    style={{ borderBottom: '1px solid var(--gray-100)' }}
                  >
                    <span
                      style={{
                        fontFamily: 'Jost, sans-serif',
                        fontSize: '0.82rem',
                        fontWeight: 300,
                        color: 'var(--gray-600)',
                      }}
                    >
                      {link.label}
                    </span>
                    <span style={{ color: 'var(--gold)', fontSize: '0.7rem' }}>→</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right — Edit Profile ── */}
          <div className="lg:col-span-2">
            <p className="eyebrow mb-6">Profile Information</p>
            <AccountForm profile={profile} />
          </div>
        </div>
      </div>
    </div>
  )
}
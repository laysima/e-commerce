import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import AccountForm from '@/components/account/AccountForm'

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: profile }, { count: orderCount }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('orders').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
  ])

  const firstName = profile?.full_name?.split(' ')[0]

  return (
    <main className="account-page">
      <header className="account-page__header">
        <div><p className="section-index">Personal account</p><h1>{firstName ? `Welcome, ${firstName}.` : 'Your account.'}</h1></div>
        <p>Member since {formatDate(profile?.created_at ?? '')}</p>
      </header>

      <div className="account-page__layout">
        <aside className="account-summary">
          <div><span>Orders placed</span><strong>{String(orderCount ?? 0).padStart(2, '0')}</strong></div>
          <div><span>Account status</span><strong>{profile?.role === 'admin' ? 'Admin' : 'Member'}</strong></div>
          <nav>
            <Link href="/orders"><span>Orders</span><span>↗</span></Link>
            <Link href="/wishlist"><span>Saved pieces</span><span>↗</span></Link>
            <Link href="/products"><span>Browse collection</span><span>↗</span></Link>
          </nav>
        </aside>

        <section className="account-profile">
          <p className="section-index">Profile information</p>
          <h2>The details<br />behind your edit.</h2>
          <AccountForm profile={profile} />
        </section>
      </div>
    </main>
  )
}

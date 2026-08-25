'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'motion/react'
import { LayoutDashboard, Package, ClipboardList, Megaphone, ArrowLeft } from 'lucide-react'
import { Sidebar, SidebarBody, SidebarLink, useSidebar } from '@/components/ui/sidebar'

const navLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ClipboardList },
  { href: '/admin/announcements', label: 'Announcements', icon: Megaphone },
]

interface Props {
  profile: { full_name: string | null; email: string | null } | null
}

export default function AdminSidebar({ profile }: Props) {
  return (
    <Sidebar>
      <SidebarBody
        className="justify-between gap-10 bg-[var(--navy)]"
        style={{ borderRight: '1px solid rgba(255,255,255,0.05)', position: 'sticky', top: 0, height: '100vh' }}
      >
        <AdminSidebarContent profile={profile} />
      </SidebarBody>
    </Sidebar>
  )
}

function AdminSidebarContent({ profile }: Props) {
  const pathname = usePathname()
  const { open, animate } = useSidebar()
  const fade = {
    display: animate ? (open ? 'block' : 'none') : 'block',
    opacity: animate ? (open ? 1 : 0) : 1,
  } as const

  return (
    <>
      <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
        <div className="px-2 py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <motion.div animate={fade}>
            <Link
              href="/"
              className="block"
              style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '1.3rem',
                fontWeight: 500,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--cream)',
                whiteSpace: 'nowrap',
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
                whiteSpace: 'nowrap',
              }}
            >
              Admin Panel
            </p>
          </motion.div>
          {!open && (
            <Link
              href="/"
              aria-label="Cressida admin"
              className="flex items-center justify-center"
              style={{
                width: '28px',
                height: '28px',
                border: '1px solid var(--gold)',
                fontFamily: 'Playfair Display, serif',
                fontSize: '0.85rem',
                color: 'var(--gold)',
              }}
            >
              C
            </Link>
          )}
        </div>

        <div className="mt-8 flex flex-col gap-1">
          {navLinks.map(link => {
            const active = link.href === '/admin' ? pathname === '/admin' : pathname.startsWith(link.href)
            const Icon = link.icon
            return (
              <SidebarLink
                key={link.href}
                link={{
                  href: link.href,
                  label: link.label,
                  active,
                  icon: (
                    <Icon
                      className="h-5 w-5 shrink-0"
                      style={{ color: active ? 'var(--gold)' : 'rgba(250,250,247,0.7)' }}
                    />
                  ),
                }}
                style={{
                  fontFamily: 'Jost, sans-serif',
                  fontWeight: active ? 500 : 300,
                  color: active ? 'var(--gold)' : 'rgba(250,250,247,0.7)',
                }}
              />
            )
          })}
        </div>
      </div>

      <div className="px-2 py-5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center shrink-0"
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: 'rgba(250,250,247,0.08)',
              fontFamily: 'Jost, sans-serif',
              fontSize: '0.7rem',
              fontWeight: 500,
              color: 'var(--gold)',
            }}
          >
            {(profile?.full_name ?? profile?.email ?? 'A').charAt(0).toUpperCase()}
          </div>
          <motion.div animate={fade} className="min-w-0">
            <p
              style={{
                fontFamily: 'Jost, sans-serif',
                fontSize: '0.8rem',
                fontWeight: 400,
                color: 'var(--cream)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
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
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {profile?.email}
            </p>
          </motion.div>
        </div>
        <SidebarLink
          link={{ href: '/', label: 'Back to Store', icon: <ArrowLeft className="h-5 w-5 shrink-0" style={{ color: 'rgba(250,250,247,0.4)' }} /> }}
          className="mt-4 px-0"
          style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.72rem', fontWeight: 300, color: 'rgba(250,250,247,0.4)' }}
        />
      </div>
    </>
  )
}

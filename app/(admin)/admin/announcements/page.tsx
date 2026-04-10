import { createClient } from '@/lib/supabase/server'
import AnnouncementManager from '@/components/admin/AnnouncementManager'

export default async function AnnouncementsPage() {
  const supabase = await createClient()

  const { data: announcements } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8">
      <div className="mb-10">
        <p className="eyebrow mb-2">Manage</p>
        <h1
          style={{
            fontFamily: 'Playfair Display, serif',
            fontWeight: 400,
            fontSize: '2.2rem',
            color: 'var(--navy)',
          }}
        >
          Announcements
        </h1>
        <p
          style={{
            fontFamily: 'Jost, sans-serif',
            fontWeight: 300,
            fontSize: '0.85rem',
            color: 'var(--gray-400)',
            marginTop: '6px',
          }}
        >
          The active announcement appears as a banner across the top of the store.
        </p>
      </div>
      <AnnouncementManager announcements={announcements ?? []} />
    </div>
  )
}
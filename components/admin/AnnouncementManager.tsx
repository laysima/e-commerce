'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Plus, Trash2, Check, Loader2 } from 'lucide-react'

type Announcement = {
  id: string
  message: string
  link_text: string | null
  link_url: string | null
  is_active: boolean
  created_at: string
}

const inputStyle = {
  fontFamily: 'Jost, sans-serif',
  fontWeight: 300,
  fontSize: '0.88rem',
  color: 'var(--gray-900)',
  backgroundColor: 'var(--gray-50)',
  border: '1px solid var(--gray-200)',
  padding: '11px 14px',
  width: '100%',
  outline: 'none',
}

const labelStyle = {
  fontFamily: 'Jost, sans-serif',
  fontSize: '0.68rem',
  fontWeight: 500 as const,
  letterSpacing: '0.15em',
  textTransform: 'uppercase' as const,
  color: 'var(--gray-600)',
  display: 'block',
  marginBottom: '8px',
}

export default function AnnouncementManager({
  announcements,
}: {
  announcements: Announcement[]
}) {
  const router = useRouter()
  const supabase = createClient()

  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [linkText, setLinkText] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleCreate = async () => {
    if (!message.trim()) {
      setError('Message is required')
      return
    }
    setIsLoading(true)
    setError(null)

    // Deactivate all existing announcements first
    await supabase
      .from('announcements')
      .update({ is_active: false })
      .neq('id', '00000000-0000-0000-0000-000000000000')

    // Create new active one
    const { error } = await supabase
      .from('announcements')
      .insert({
        message: message.trim(),
        link_text: linkText.trim() || null,
        link_url: linkUrl.trim() || null,
        is_active: true,
      })

    if (error) {
      setError(error.message)
      setIsLoading(false)
      return
    }

    setMessage('')
    setLinkText('')
    setLinkUrl('')
    setIsLoading(false)
    router.refresh()
  }

  const handleSetActive = async (id: string) => {
    // Deactivate all
    await supabase
      .from('announcements')
      .update({ is_active: false })
      .neq('id', '00000000-0000-0000-0000-000000000000')

    // Activate selected
    await supabase
      .from('announcements')
      .update({ is_active: true })
      .eq('id', id)

    router.refresh()
  }

  const handleDelete = async (id: string) => {
    await supabase.from('announcements').delete().eq('id', id)
    router.refresh()
  }

  return (
    <div className="max-w-2xl space-y-8">

      {/* Create New */}
      <div
        className="p-8"
        style={{ backgroundColor: 'var(--white)', border: '1px solid var(--gray-100)' }}
      >
        <p className="eyebrow mb-6" style={{ fontSize: '0.6rem' }}>
          New Announcement
        </p>

        {error && (
          <div
            className="mb-5 px-4 py-3 text-sm"
            style={{
              backgroundColor: '#FEF2F2',
              border: '1px solid #FECACA',
              color: '#DC2626',
              fontFamily: 'Jost, sans-serif',
            }}
          >
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label style={labelStyle}>Message</label>
            <input
              style={inputStyle}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Summer Sale — Up to 40% off selected styles"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Link Text (optional)</label>
              <input
                style={inputStyle}
                value={linkText}
                onChange={e => setLinkText(e.target.value)}
                placeholder="Shop Now"
              />
            </div>
            <div>
              <label style={labelStyle}>Link URL (optional)</label>
              <input
                style={inputStyle}
                value={linkUrl}
                onChange={e => setLinkUrl(e.target.value)}
                placeholder="/products"
              />
            </div>
          </div>

          <button
            onClick={handleCreate}
            disabled={isLoading}
            className="flex items-center gap-2 transition-opacity hover:opacity-80 disabled:opacity-40"
            style={{
              backgroundColor: 'var(--navy)',
              color: 'var(--cream)',
              fontFamily: 'Jost, sans-serif',
              fontSize: '0.7rem',
              fontWeight: 500,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              padding: '12px 24px',
            }}
          >
            {isLoading
              ? <><Loader2 size={13} className="animate-spin" /> Creating...</>
              : <><Plus size={13} /> Create & Activate</>
            }
          </button>
        </div>
      </div>

      {/* Existing Announcements */}
      {announcements.length > 0 && (
        <div
          style={{ backgroundColor: 'var(--white)', border: '1px solid var(--gray-100)' }}
        >
          <div
            className="px-6 py-4"
            style={{ borderBottom: '1px solid var(--gray-100)', backgroundColor: 'var(--cream)' }}
          >
            <p className="eyebrow" style={{ fontSize: '0.6rem' }}>
              Previous Announcements
            </p>
          </div>

          <div className="divide-y divide-gray-50">
            {announcements.map(a => (
              <div
                key={a.id}
                className="flex items-center gap-4 px-6 py-4"
              >
                {/* Active indicator */}
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: a.is_active ? 'var(--gold)' : 'var(--gray-200)',
                    flexShrink: 0,
                  }}
                />

                {/* Message */}
                <div className="flex-1 min-w-0">
                  <p
                    style={{
                      fontFamily: 'Jost, sans-serif',
                      fontSize: '0.85rem',
                      fontWeight: a.is_active ? 400 : 300,
                      color: a.is_active ? 'var(--navy)' : 'var(--gray-400)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {a.message}
                  </p>
                  {a.link_text && (
                    <p
                      style={{
                        fontFamily: 'Jost, sans-serif',
                        fontSize: '0.72rem',
                        fontWeight: 300,
                        color: 'var(--gray-400)',
                        marginTop: '2px',
                      }}
                    >
                      Link: {a.link_text} → {a.link_url}
                    </p>
                  )}
                </div>

                {/* Active badge */}
                {a.is_active && (
                  <span
                    style={{
                      fontFamily: 'Jost, sans-serif',
                      fontSize: '0.6rem',
                      fontWeight: 500,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'var(--gold)',
                      border: '1px solid rgba(184,149,74,0.3)',
                      padding: '2px 8px',
                      flexShrink: 0,
                    }}
                  >
                    Active
                  </span>
                )}

                {/* Actions */}
                <div className="flex items-center gap-3 shrink-0">
                  {!a.is_active && (
                    <button
                      onClick={() => handleSetActive(a.id)}
                      className="transition-opacity hover:opacity-60"
                      style={{ color: 'var(--gray-400)' }}
                      aria-label="Set as active"
                      title="Set as active"
                    >
                      <Check size={14} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(a.id)}
                    className="transition-opacity hover:opacity-60"
                    style={{ color: 'var(--gray-300)' }}
                    aria-label="Delete announcement"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
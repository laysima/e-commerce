'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Loader2, CheckCircle2 } from 'lucide-react'

interface Props {
  profile: {
    id: string
    full_name: string | null
    email: string
  } | null
}

export default function AccountForm({ profile }: Props) {
  const [fullName, setFullName] = useState(profile?.full_name ?? '')
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  const handleSave = async () => {
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName })
      .eq('id', profile?.id)

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }

    setIsLoading(false)
  }

  const inputStyle = {
    fontFamily: 'Jost, sans-serif',
    fontWeight: 300,
    fontSize: '0.9rem',
    color: 'var(--gray-900)',
    backgroundColor: 'var(--gray-50)',
    border: '1px solid var(--gray-200)',
    padding: '12px 16px',
    width: '100%',
    outline: 'none',
    letterSpacing: '0.02em',
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

  return (
    <div
      className="p-8"
      style={{ border: '1px solid var(--gray-100)' }}
    >
      {error && (
        <div
          className="mb-6 px-4 py-3 text-sm"
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

      {success && (
        <div
          className="mb-6 px-4 py-3 flex items-center gap-2"
          style={{
            backgroundColor: 'rgba(16,185,129,0.06)',
            border: '1px solid rgba(16,185,129,0.2)',
          }}
        >
          <CheckCircle2 size={15} style={{ color: '#10B981' }} />
          <span
            style={{
              fontFamily: 'Jost, sans-serif',
              fontSize: '0.82rem',
              fontWeight: 300,
              color: 'var(--gray-600)',
            }}
          >
            Profile updated successfully
          </span>
        </div>
      )}

      <div className="space-y-6">
        {/* Full Name */}
        <div>
          <label style={labelStyle}>Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            placeholder="Jane Doe"
            style={inputStyle}
          />
        </div>

        {/* Email — read only */}
        <div>
          <label style={labelStyle}>Email Address</label>
          <input
            type="email"
            value={profile?.email ?? ''}
            disabled
            style={{
              ...inputStyle,
              backgroundColor: 'var(--gray-100)',
              color: 'var(--gray-400)',
              cursor: 'not-allowed',
            }}
          />
          <p
            style={{
              fontFamily: 'Jost, sans-serif',
              fontSize: '0.72rem',
              fontWeight: 300,
              color: 'var(--gray-400)',
              marginTop: '6px',
            }}
          >
            Email address cannot be changed
          </p>
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="flex items-center justify-center gap-3 transition-opacity hover:opacity-80 disabled:opacity-40"
          style={{
            backgroundColor: 'var(--navy)',
            color: 'var(--cream)',
            fontFamily: 'Jost, sans-serif',
            fontSize: '0.7rem',
            fontWeight: 500,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            padding: '13px 32px',
          }}
        >
          {isLoading ? (
            <><Loader2 size={14} className="animate-spin" /> Saving...</>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </div>
  )
}
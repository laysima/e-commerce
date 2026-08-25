'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Props {
  profile: { id: string; full_name: string | null; email: string } | null
}

export default function AccountForm({ profile }: Props) {
  const [fullName, setFullName] = useState(profile?.full_name ?? '')
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [supabase] = useState(() => createClient())

  const handleSave = async () => {
    setIsLoading(true)
    setError(null)
    setSuccess(false)
    const { error: updateError } = await supabase.from('profiles').update({ full_name: fullName }).eq('id', profile?.id)
    if (updateError) setError(updateError.message)
    else {
      setSuccess(true)
      window.setTimeout(() => setSuccess(false), 3000)
    }
    setIsLoading(false)
  }

  return (
    <div className="account-form">
      {error && <p className="form-message form-message--error">{error}</p>}
      {success && <p className="form-message">Profile updated successfully.</p>}
      <label><span>Full name</span><input value={fullName} onChange={event => setFullName(event.target.value)} placeholder="Your name" /></label>
      <label><span>Email address</span><input type="email" value={profile?.email ?? ''} disabled /><small>Email address cannot be changed.</small></label>
      <button type="button" onClick={handleSave} disabled={isLoading}>
        <span>{isLoading ? 'Saving…' : 'Save changes'}</span><span aria-hidden="true">↗</span>
      </button>
    </div>
  )
}

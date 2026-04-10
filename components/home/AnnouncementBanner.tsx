'use client'

import { useState } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'

interface Props {
  message: string
  linkText?: string | null
  linkUrl?: string | null
}

export default function AnnouncementBanner({ message, linkText, linkUrl }: Props) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div
      className="relative flex items-center justify-center px-10 py-3 text-center"
      style={{
        backgroundColor: 'var(--gold)',
      }}
    >
      <p
        style={{
          fontFamily: 'Jost, sans-serif',
          fontSize: '0.72rem',
          fontWeight: 400,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'var(--navy)',
        }}
      >
        {message}
        {linkText && linkUrl && (
          <>
            {' · '}
            <Link
              href={linkUrl}
              style={{
                fontWeight: 600,
                textDecoration: 'underline',
                textUnderlineOffset: '2px',
                color: 'var(--navy)',
              }}
            >
              {linkText}
            </Link>
          </>
        )}
      </p>

      {/* Dismiss button */}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-50"
        style={{ color: 'var(--navy)' }}
        aria-label="Dismiss announcement"
      >
        <X size={14} />
      </button>
    </div>
  )
}
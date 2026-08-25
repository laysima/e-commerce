'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Props {
  message: string
  linkText?: string | null
  linkUrl?: string | null
}

export default function AnnouncementBanner({ message, linkText, linkUrl }: Props) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="announcement-bar">
      <p>
        {message}
        {linkText && linkUrl && (
          <>
            {' — '}
            <Link href={linkUrl}>
              {linkText}
            </Link>
          </>
        )}
      </p>
      <button
        type="button"
        onClick={() => setIsVisible(false)}
        aria-label="Dismiss announcement"
      >
        Close
      </button>
    </div>
  )
}

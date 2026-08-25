'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Props {
  message: string
  linkText?: string | null
  linkUrl?: string | null
}

export default function AnnouncementPopup({ message, linkText, linkUrl }: Props) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const dismissed = sessionStorage.getItem('announcement-dismissed')
    if (!dismissed) {
      const timer = setTimeout(() => setIsVisible(true), 800)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    sessionStorage.setItem('announcement-dismissed', 'true')
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <>
      <button className="announcement-backdrop" onClick={handleClose} aria-label="Dismiss announcement" />
      <div className="announcement-popup" role="dialog" aria-modal="true" aria-labelledby="announcement-title">
        <div className="announcement-popup__top">
          <span>Private notice / 01</span>
          <button type="button" onClick={handleClose}>Close</button>
        </div>
        <div className="announcement-popup__body">
          <p>From the Cressida studio</p>
          <h2 id="announcement-title">{message}</h2>
          <div className="announcement-popup__actions">
            {linkText && linkUrl && (
              <Link href={linkUrl} onClick={handleClose}>{linkText} <span aria-hidden="true">↗</span></Link>
            )}
            <button type="button" onClick={handleClose}>Maybe later</button>
          </div>
        </div>
      </div>
    </>
  )
}

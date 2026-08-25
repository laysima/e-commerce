'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import styles from './EditorialMotion.module.css'

type ScrollExpandProps = {
  src: string
  alt?: string
  title?: string
  scrollHint?: string
  useWindowScroll?: boolean
  mediaZoom?: number
  children?: ReactNode
}

export default function ScrollExpand({
  src,
  alt = '',
  title,
  scrollHint = 'Scroll',
  mediaZoom = 1.15,
  children,
}: ScrollExpandProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    let frame = 0
    const update = () => {
      frame = 0
      const rect = element.getBoundingClientRect()
      const travel = Math.max(1, element.offsetHeight - window.innerHeight)
      const progress = Math.max(0, Math.min(1, -rect.top / travel))
      const compact = window.innerWidth <= 760
      const baseWidth = compact ? 92 : window.innerWidth <= 900 ? 88 : 72
      const baseHeight = compact ? 68 : 62
      element.style.setProperty('--expand-progress', progress.toFixed(3))
      element.style.setProperty('--expand-width', `${baseWidth + progress * (100 - baseWidth)}vw`)
      element.style.setProperty('--expand-height', `${baseHeight + progress * (100 - baseHeight)}vh`)
      element.style.setProperty('--expand-scale', String(mediaZoom - progress * (mediaZoom - 1)))
      element.style.setProperty('--title-shift', `${progress * -25}vh`)
      element.style.setProperty('--hint-opacity', String(Math.max(0, 1 - progress * 2)))
      element.style.setProperty('--copy-opacity', String(Math.max(0, Math.min(1, (progress - 0.5) * 2))))
      element.style.setProperty('--copy-shift', `${(1 - progress) * 28}px`)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [mediaZoom])

  return (
    <section ref={ref} className={styles.scrollExpand}>
      <div className={styles.scrollSticky}>
        <div className={styles.scrollFrame}>
          <Image src={src} alt={alt} fill sizes="100vw" className={styles.scrollImage} />
          <div className={styles.scrollShade} />
          {title && <p className={styles.scrollTitle}>{title}</p>}
          <p className={styles.scrollHint}>{scrollHint}</p>
          {children && <div className={styles.scrollCopy}>{children}</div>}
        </div>
      </div>
    </section>
  )
}

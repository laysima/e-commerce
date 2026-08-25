'use client'

import { Children, useEffect, useState } from 'react'
import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'
import styles from './EditorialMotion.module.css'

type CardSwapProps = {
  children: ReactNode
  cardDistance?: number
  verticalDistance?: number
  delay?: number
  pauseOnHover?: boolean
  className?: string
}

export function Card({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`${styles.swapCard} ${className}`} {...props} />
}

export default function CardSwap({
  children,
  cardDistance = 60,
  verticalDistance = 70,
  delay = 5000,
  pauseOnHover = false,
  className = '',
}: CardSwapProps) {
  const cards = Children.toArray(children)
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused || cards.length < 2) return
    const timer = window.setInterval(() => setActive(current => (current + 1) % cards.length), delay)
    return () => window.clearInterval(timer)
  }, [cards.length, delay, paused])

  return (
    <div
      className={`${styles.cardSwap} ${className}`}
      onPointerEnter={pauseOnHover ? () => setPaused(true) : undefined}
      onPointerLeave={pauseOnHover ? () => setPaused(false) : undefined}
    >
      {cards.map((card, index) => {
        const depth = (index - active + cards.length) % cards.length
        const style = {
          '--card-x': `${Math.min(depth, 2) * cardDistance}px`,
          '--card-y': `${Math.min(depth, 2) * verticalDistance}px`,
          '--card-scale': 1 - Math.min(depth, 2) * 0.035,
          zIndex: cards.length - depth,
          opacity: depth > 2 ? 0 : 1,
          pointerEvents: depth === 0 ? 'auto' : 'none',
        } as CSSProperties
        return <div className={styles.cardSlot} style={style} key={index}>{card}</div>
      })}
      <div className={styles.cardCount} aria-live="polite">{String(active + 1).padStart(2, '0')} / {String(cards.length).padStart(2, '0')}</div>
    </div>
  )
}

'use client'

import { useMemo, useState } from 'react'
import type { CSSProperties, KeyboardEvent, ReactNode } from 'react'
import styles from './EditorialMotion.module.css'

type PixelSwapProps = {
  firstContent: ReactNode
  secondContent: ReactNode
  pixelSize?: number
  gap?: number
  pixelRadius?: number
  pixelSpin?: number
  pixelScale?: number
  duration?: number
  pixelDuration?: number
  pattern?: 'random' | 'diagonal' | 'radial'
  randomness?: number
  fade?: boolean
  trigger?: 'click' | 'hover'
  className?: string
}

export default function PixelSwap({
  firstContent,
  secondContent,
  pixelSize = 64,
  gap = 0,
  pixelRadius = 0,
  pixelSpin = 0,
  pixelScale = 0.35,
  duration = 1400,
  pixelDuration = 450,
  pattern = 'random',
  randomness = 0,
  fade = false,
  trigger = 'click',
  className = '',
}: PixelSwapProps) {
  const [swapped, setSwapped] = useState(false)
  const tiles = useMemo(() => Array.from({ length: 96 }), [])
  const toggle = () => setSwapped(value => !value)
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      toggle()
    }
  }

  const rootStyle = {
    '--pixel-size': `${pixelSize}px`,
    '--pixel-gap': `${gap}px`,
    '--pixel-radius': `${pixelRadius}px`,
    '--pixel-spin': `${pixelSpin}deg`,
    '--pixel-scale': pixelScale,
    '--swap-duration': `${duration}ms`,
    '--content-duration': `${duration / 2}ms`,
    '--pixel-duration': `${pixelDuration}ms`,
  } as CSSProperties

  return (
    <div
      className={`${styles.pixelSwap} ${swapped ? styles.pixelSwapped : ''} ${fade ? styles.pixelFade : ''} ${className}`}
      style={rootStyle}
      role="button"
      tabIndex={0}
      aria-pressed={swapped}
      onClick={trigger === 'click' ? toggle : undefined}
      onKeyDown={trigger === 'click' ? onKeyDown : undefined}
      onPointerEnter={trigger === 'hover' ? () => setSwapped(true) : undefined}
      onPointerLeave={trigger === 'hover' ? () => setSwapped(false) : undefined}
    >
      <div className={styles.pixelFirst}>{firstContent}</div>
      <div className={styles.pixelSecond}>{secondContent}</div>
      <div className={styles.pixelGrid} aria-hidden="true">
        {tiles.map((_, index) => {
          const row = Math.floor(index / 12)
          const column = index % 12
          const order = pattern === 'diagonal'
            ? row + column
            : pattern === 'radial'
              ? Math.hypot(row - 3.5, column - 5.5)
              : ((index * 37 + randomness * 17) % 96)
          return <span key={index} style={{ transitionDelay: `${(order / 96) * duration}ms` }} />
        })}
      </div>
    </div>
  )
}

'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useRef } from 'react'
import type { CSSProperties, PointerEvent } from 'react'
import styles from './EditorialMotion.module.css'

export type DriftWallItem = {
  image?: string
  title: string
  href: string
}

type DriftWallProps = {
  items: DriftWallItem[]
  columns?: number
  tileWidth?: number
  tileHeight?: number
  gap?: number
  tilt?: number
  turn?: number
  perspective?: number
  depth?: number
  speed?: number
  direction?: 'up' | 'down'
  variance?: number
  parallax?: number
  lift?: number
  fade?: number
  dim?: number
  overlayColor?: string
}

export default function DriftWall({
  items,
  columns = 5,
  tileWidth = 200,
  tileHeight = 132,
  gap = 18,
  tilt = 16,
  turn = -14,
  perspective = 1200,
  depth = 120,
  speed = 42,
  direction = 'up',
  variance = 0.45,
  parallax = 0.6,
  lift = 64,
  fade = 0.6,
  dim = 0.55,
  overlayColor = '#060010',
}: DriftWallProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const safeItems = useMemo(
    () => items.length ? items : [{ title: 'Collection in preparation', href: '/products' }],
    [items]
  )
  const cycleLength = Math.max(4, safeItems.length)
  const columnItems = useMemo(
    () => Array.from({ length: columns }, (_, column) =>
      Array.from({ length: cycleLength * 3 }, (_, row) =>
        safeItems[((row % cycleLength) + column * 2) % safeItems.length]
      )
    ),
    [columns, cycleLength, safeItems]
  )

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * parallax * 24
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * parallax * 24
    rootRef.current?.style.setProperty('--drift-x', `${x}px`)
    rootRef.current?.style.setProperty('--drift-y', `${y}px`)
  }

  const wallStyle = {
    '--tile-w': `${tileWidth}px`,
    '--tile-h': `${tileHeight}px`,
    '--tile-gap': `${gap}px`,
    '--overlay': overlayColor,
    '--dim': dim,
    '--fade': fade,
    '--lift': `${lift}px`,
    perspective: `${perspective}px`,
  } as CSSProperties

  return (
    <div
      ref={rootRef}
      className={styles.driftWall}
      style={wallStyle}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => {
        rootRef.current?.style.setProperty('--drift-x', '0px')
        rootRef.current?.style.setProperty('--drift-y', '0px')
      }}
    >
      <div
        className={styles.driftPlane}
        style={{ transform: `translate3d(var(--drift-x), var(--drift-y), ${depth}px) rotateX(${tilt}deg) rotateZ(${turn}deg)` }}
      >
        {columnItems.map((column, columnIndex) => {
          const cycleDistance = (tileHeight + gap) * cycleLength
          const duration = Math.max(20, cycleDistance / Math.max(speed, 10)) * (1 + (columnIndex % 3) * variance * 0.22)
          return (
            <div
              className={`${styles.driftColumn} ${direction === 'down' ? styles.driftDown : ''}`}
              key={columnIndex}
              style={{
                animationDuration: `${duration}s`,
                marginTop: `${(columnIndex % 3) * -lift}px`,
                '--cycle-height': `${cycleDistance}px`,
                '--cycle-offset': `${-cycleDistance}px`,
              } as CSSProperties}
            >
              {column.map((item, itemIndex) => (
                <Link className={styles.driftTile} href={item.href} key={`${item.title}-${itemIndex}`}>
                  {item.image ? (
                    <Image src={item.image} alt={item.title} fill sizes={`${tileWidth}px`} className={styles.driftImage} />
                  ) : (
                    <span className={styles.driftPlaceholder} aria-hidden="true" />
                  )}
                  <span>{item.title}</span>
                </Link>
              ))}
            </div>
          )
        })}
      </div>
      <div className={styles.driftOverlay} aria-hidden="true" />
    </div>
  )
}

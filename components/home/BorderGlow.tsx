'use client'

import { useRef } from 'react'
import type { CSSProperties, PointerEvent, ReactNode } from 'react'
import styles from './EditorialMotion.module.css'

type BorderGlowProps = {
  children: ReactNode
  edgeSensitivity?: number
  glowColor?: string
  backgroundColor?: string
  borderRadius?: number
  glowRadius?: number
  glowIntensity?: number
  coneSpread?: number
  animated?: boolean
  colors?: string[]
  className?: string
}

export default function BorderGlow({
  children,
  glowColor = '40 80 80',
  backgroundColor = 'transparent',
  borderRadius = 0,
  glowRadius = 40,
  glowIntensity = 1,
  animated = false,
  colors = ['#c084fc', '#f472b6', '#38bdf8'],
  className = '',
}: BorderGlowProps) {
  const ref = useRef<HTMLDivElement>(null)
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    ref.current?.style.setProperty('--glow-x', `${event.clientX - rect.left}px`)
    ref.current?.style.setProperty('--glow-y', `${event.clientY - rect.top}px`)
  }
  const style = {
    '--glow-color': glowColor,
    '--glow-bg': backgroundColor,
    '--glow-radius': `${glowRadius}px`,
    '--glow-intensity': glowIntensity,
    '--glow-gradient': `linear-gradient(120deg, ${colors.join(', ')})`,
    borderRadius,
  } as CSSProperties

  return (
    <div ref={ref} onPointerMove={onPointerMove} className={`${styles.borderGlow} ${animated ? styles.glowAnimated : ''} ${className}`} style={style}>
      {children}
    </div>
  )
}

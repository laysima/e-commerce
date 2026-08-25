'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import styles from './EditorialMotion.module.css'

type FoldTextProps = {
  text: string
  splitBy?: 'char' | 'word'
  hinge?: 'top' | 'bottom'
  trigger?: 'scroll' | 'load'
  duration?: number
  stagger?: number
  ease?: string
  perspective?: number
  creaseShading?: number
  fontSize?: string
  fontWeight?: number
  color?: string
  className?: string
}

export default function FoldText({
  text,
  splitBy = 'char',
  hinge = 'top',
  trigger = 'scroll',
  duration = 0.65,
  stagger = 0.045,
  perspective = 700,
  creaseShading = 0.55,
  fontSize = 'clamp(3rem, 10vw, 7rem)',
  fontWeight = 800,
  color = '#f7f2e8',
  className = '',
}: FoldTextProps) {
  const ref = useRef<HTMLHeadingElement>(null)
  const [visible, setVisible] = useState(trigger === 'load')
  const pieces = useMemo(
    () => (splitBy === 'word' ? text.split(/(\s+)/) : Array.from(text)),
    [splitBy, text]
  )

  useEffect(() => {
    if (trigger === 'load') {
      const frame = requestAnimationFrame(() => setVisible(true))
      return () => cancelAnimationFrame(frame)
    }

    const element = ref.current
    if (!element) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.25 }
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [trigger])

  const rootStyle = {
    color,
    fontSize,
    fontWeight,
    perspective: `${perspective}px`,
    '--fold-shadow': `${Math.max(0, Math.min(1, creaseShading))}`,
  } as CSSProperties

  return (
    <h1
      ref={ref}
      className={`${styles.foldText} ${visible ? styles.foldVisible : ''} ${className}`}
      style={rootStyle}
      aria-label={text}
    >
      {pieces.map((piece, index) => {
        if (piece === '\n') return <br key={`break-${index}`} />
        return (
          <span
            aria-hidden="true"
            className={styles.foldPiece}
            key={`${piece}-${index}`}
            style={{
              animationDuration: `${duration}s`,
              animationDelay: `${index * stagger}s`,
              transformOrigin: hinge === 'top' ? '50% 0%' : '50% 100%',
            }}
          >
            {piece.trim() ? piece : '\u00a0'}
          </span>
        )
      })}
    </h1>
  )
}

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

  // Group characters into words so a line can only ever break *between* words.
  // Each animated piece is inline-block, so without this the browser is free to
  // wrap mid-word ("Form f / ollows").
  const lines = useMemo(() => {
    let pieceIndex = 0
    return text.split('\n').map(line =>
      line
        .split(/(\s+)/)
        .filter(token => token.length > 0)
        .map(token => {
          if (/^\s+$/.test(token)) return { type: 'space' as const }
          const chars = splitBy === 'word' ? [token] : Array.from(token)
          return {
            type: 'word' as const,
            chars: chars.map(char => ({ char, index: pieceIndex++ })),
          }
        })
    )
  }, [splitBy, text])

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
      {lines.map((tokens, lineIndex) => (
        <span className={styles.foldLine} key={`line-${lineIndex}`}>
          {tokens.map((token, tokenIndex) =>
            token.type === 'space' ? (
              // A real breaking space \u2014 this is where a line is allowed to wrap.
              ' '
            ) : (
              <span className={styles.foldWord} key={`word-${lineIndex}-${tokenIndex}`}>
                {token.chars.map(({ char, index }) => (
                  <span
                    aria-hidden="true"
                    className={styles.foldPiece}
                    key={index}
                    style={{
                      animationDuration: `${duration}s`,
                      animationDelay: `${index * stagger}s`,
                      transformOrigin: hinge === 'top' ? '50% 0%' : '50% 100%',
                    }}
                  >
                    {char}
                  </span>
                ))}
              </span>
            )
          )}
        </span>
      ))}
    </h1>
  )
}

'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import styles from './TrueFocusBits.module.css'

type FocusRect = { x: number; y: number; width: number; height: number }

type TrueFocusProps = {
  sentence?: string
  separator?: string
  manualMode?: boolean
  blurAmount?: number
  borderColor?: string
  glowColor?: string
  animationDuration?: number
  pauseBetweenAnimations?: number
  className?: string
}

export default function TrueFocus({
  sentence = 'True Focus',
  separator = ' ',
  manualMode = false,
  blurAmount = 5,
  borderColor = 'green',
  glowColor = 'rgba(0, 255, 0, 0.6)',
  animationDuration = 0.5,
  pauseBetweenAnimations = 1,
  className = '',
}: TrueFocusProps) {
  const words = useMemo(() => sentence.split(separator).filter(Boolean), [sentence, separator])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [focusRect, setFocusRect] = useState<FocusRect>({ x: 0, y: 0, width: 0, height: 0 })
  const lastActiveIndex = useRef(0)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const wordRefs = useRef<Array<HTMLButtonElement | null>>([])
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (manualMode || words.length < 2 || reduceMotion) return
    const interval = window.setInterval(
      () => setCurrentIndex(previous => (previous + 1) % words.length),
      (animationDuration + pauseBetweenAnimations) * 1000
    )
    return () => window.clearInterval(interval)
  }, [animationDuration, manualMode, pauseBetweenAnimations, reduceMotion, words.length])

  useEffect(() => {
    const container = containerRef.current
    const activeWord = wordRefs.current[currentIndex]
    if (!container || !activeWord) return

    const update = () => {
      const parentRect = container.getBoundingClientRect()
      const activeRect = activeWord.getBoundingClientRect()
      setFocusRect({
        x: activeRect.left - parentRect.left,
        y: activeRect.top - parentRect.top,
        width: activeRect.width,
        height: activeRect.height,
      })
    }

    const frame = requestAnimationFrame(update)
    const observer = new ResizeObserver(update)
    observer.observe(container)
    void document.fonts?.ready.then(update).catch(() => undefined)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [currentIndex, words.length])

  const focusStyle = {
    '--border-color': borderColor,
    '--glow-color': glowColor,
  } as CSSProperties

  return (
    <div className={`${styles.container} ${className}`} ref={containerRef}>
      {words.map((word, index) => {
        const active = index === currentIndex
        return (
          <button
            type="button"
            key={`${word}-${index}`}
            ref={node => { wordRefs.current[index] = node }}
            className={`${styles.word} ${manualMode ? styles.manual : ''} ${active ? styles.active : ''}`}
            style={{ filter: active ? 'blur(0)' : `blur(${blurAmount}px)` }}
            onPointerEnter={() => {
              if (!manualMode) return
              lastActiveIndex.current = currentIndex
              setCurrentIndex(index)
            }}
            onPointerLeave={() => {
              if (manualMode) setCurrentIndex(lastActiveIndex.current)
            }}
            onFocus={() => setCurrentIndex(index)}
          >
            {word}
          </button>
        )
      })}

      <motion.div
        className={styles.frame}
        animate={{
          x: focusRect.x,
          y: focusRect.y,
          width: focusRect.width,
          height: focusRect.height,
          opacity: focusRect.width > 0 ? 1 : 0,
        }}
        transition={{ duration: reduceMotion ? 0 : animationDuration, ease: [0.22, 1, 0.36, 1] }}
        style={focusStyle}
        aria-hidden="true"
      >
        <span className={`${styles.corner} ${styles.topLeft}`} />
        <span className={`${styles.corner} ${styles.topRight}`} />
        <span className={`${styles.corner} ${styles.bottomLeft}`} />
        <span className={`${styles.corner} ${styles.bottomRight}`} />
      </motion.div>
    </div>
  )
}

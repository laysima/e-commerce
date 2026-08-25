'use client'

import Image from 'next/image'
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
} from 'react'
import type { CSSProperties, ElementType, HTMLAttributes } from 'react'
import { gsap } from 'gsap'
import styles from './MaskedHeadingBits.module.css'

const clamp = (value: number, minimum: number, maximum: number) =>
  value < minimum ? minimum : value > maximum ? maximum : value

type MaskedHeadingProps = HTMLAttributes<HTMLElement> & {
  text?: string
  tag?: 'h1' | 'h2' | 'h3' | 'p'
  mediaType?: 'image' | 'video'
  src?: string
  poster?: string
  fillScale?: number
  parallax?: number
  drift?: number
  brightness?: number
  saturation?: number
  grayscale?: boolean
  reveal?: 'rise' | 'wipe' | 'fade' | 'none'
  duration?: number
  stagger?: number
  trigger?: 'view' | 'mount' | 'hover'
  align?: 'left' | 'center' | 'right'
  weight?: number
  tracking?: number
  lineHeight?: number
  textScale?: number
}

type Settings = {
  fillScale: number
  parallax: number
  drift: number
  brightness: number
  saturation: number
  grayscale: boolean
  textScale: number
}

export default function MaskedHeading({
  text = 'Designed in the details',
  tag = 'h2',
  mediaType = 'image',
  src = '',
  poster = '',
  fillScale = 1.25,
  parallax = 26,
  drift = 18,
  brightness = 1,
  saturation = 1,
  grayscale = false,
  reveal = 'rise',
  duration = 1.1,
  stagger = 0.09,
  trigger = 'view',
  align = 'center',
  weight = 700,
  tracking = -0.03,
  lineHeight = 1.06,
  textScale = 0.115,
  className = '',
  style,
  ...rest
}: MaskedHeadingProps) {
  const rootRef = useRef<HTMLElement | null>(null)
  const measureRef = useRef<HTMLSpanElement | null>(null)
  const revealRef = useRef<HTMLSpanElement | null>(null)
  const mediaRef = useRef<HTMLSpanElement | null>(null)
  const wordRefs = useRef<Array<HTMLSpanElement | null>>([])
  const baseRefs = useRef<Array<HTMLElement | null>>([])
  const glyphRefs = useRef<Array<SVGTextElement | null>>([])
  const tweenRef = useRef<gsap.core.Tween | null>(null)
  const offsetRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 })
  const rawId = useId()
  const clipId = `mh-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`
  const words = useMemo(() => String(text).split(/\s+/).filter(Boolean), [text])
  const settingsRef = useRef<Settings>({
    fillScale,
    parallax,
    drift,
    brightness,
    saturation,
    grayscale,
    textScale,
  })

  useEffect(() => {
    settingsRef.current = {
      fillScale,
      parallax,
      drift,
      brightness,
      saturation,
      grayscale,
      textScale,
    }
  }, [brightness, drift, fillScale, grayscale, parallax, saturation, textScale])

  const place = useCallback(() => {
    const root = rootRef.current
    const media = mediaRef.current
    if (!root || !media) return
    const settings = settingsRef.current
    const offset = offsetRef.current
    const maxX = Math.max(0, ((settings.fillScale - 1) / 2) * root.clientWidth)
    const maxY = Math.max(0, ((settings.fillScale - 1) / 2) * root.clientHeight)

    media.style.transform = `translate3d(${clamp(offset.x, -maxX, maxX).toFixed(2)}px, ${clamp(offset.y, -maxY, maxY).toFixed(2)}px, 0) scale(${settings.fillScale})`
    media.style.filter = `brightness(${settings.brightness}) saturate(${settings.saturation})${settings.grayscale ? ' grayscale(1)' : ''}`
  }, [])

  const sync = useCallback(() => {
    const root = rootRef.current
    const measure = measureRef.current
    if (!root || !measure) return
    const settings = settingsRef.current

    root.style.fontSize = `${clamp(root.clientWidth * settings.textScale, 20, 200).toFixed(1)}px`
    const computed = window.getComputedStyle(measure)

    for (let index = 0; index < wordRefs.current.length; index += 1) {
      const box = wordRefs.current[index]
      const baseline = baseRefs.current[index]
      const glyph = glyphRefs.current[index]
      if (!box || !baseline || !glyph) continue

      glyph.setAttribute('x', String(box.offsetLeft))
      glyph.setAttribute('y', String(baseline.offsetTop))
      glyph.style.fontFamily = computed.fontFamily
      glyph.style.fontSize = computed.fontSize
      glyph.style.fontWeight = computed.fontWeight
      glyph.style.fontStyle = computed.fontStyle
      glyph.style.letterSpacing = computed.letterSpacing
    }
    place()
  }, [place])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    sync()
    const resizeObserver = new ResizeObserver(sync)
    resizeObserver.observe(root)
    void document.fonts?.ready.then(sync).catch(() => undefined)

    let frameId = 0
    let last = performance.now()
    let clock = 0
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const frame = (now: number) => {
      const delta = Math.min(0.05, (now - last) / 1000)
      last = now
      clock += delta
      const settings = settingsRef.current
      const offset = offsetRef.current
      const idleDrift = reduceMotion ? 0 : settings.drift
      const dx = Math.sin(clock * 0.21) * idleDrift
      const dy = Math.cos(clock * 0.17) * idleDrift * 0.6
      const easing = 1 - Math.exp(-delta / 0.18)

      offset.x += (offset.tx + dx - offset.x) * easing
      offset.y += (offset.ty + dy - offset.y) * easing
      place()
      frameId = requestAnimationFrame(frame)
    }

    const onMove = (event: PointerEvent) => {
      const settings = settingsRef.current
      if (settings.parallax <= 0 || reduceMotion) return
      const rect = root.getBoundingClientRect()
      const x = ((event.clientX - rect.left) / (rect.width || 1)) * 2 - 1
      const y = ((event.clientY - rect.top) / (rect.height || 1)) * 2 - 1
      offsetRef.current.tx = clamp(x, -1, 1) * -settings.parallax
      offsetRef.current.ty = clamp(y, -1, 1) * -settings.parallax
    }

    const onLeave = () => {
      offsetRef.current.tx = 0
      offsetRef.current.ty = 0
    }

    root.addEventListener('pointermove', onMove)
    root.addEventListener('pointerleave', onLeave)
    frameId = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
      root.removeEventListener('pointermove', onMove)
      root.removeEventListener('pointerleave', onLeave)
    }
  }, [place, sync])

  useEffect(() => {
    sync()
  }, [align, lineHeight, sync, tag, textScale, tracking, weight, words])

  useEffect(() => {
    const root = rootRef.current
    const layer = revealRef.current
    if (!root || !layer) return
    const glyphs = glyphRefs.current.filter((glyph): glyph is SVGTextElement => Boolean(glyph))
    if (!glyphs.length) return

    const riseDistance = () => (parseFloat(window.getComputedStyle(root).fontSize) || 48) * 1.15
    const settle = () => {
      gsap.set(glyphs, { y: 0 })
      gsap.set(layer, { opacity: 1, scale: 1, clipPath: 'inset(0% 0% 0% 0%)' })
    }
    const rest = () => {
      if (reveal === 'rise') gsap.set(glyphs, { y: riseDistance() })
      if (reveal === 'wipe') gsap.set(layer, { clipPath: 'inset(0% 100% 0% 0%)' })
      if (reveal === 'fade') gsap.set(layer, { opacity: 0, scale: 1.08 })
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reveal === 'none' || reduceMotion) {
      settle()
      return
    }

    const play = () => {
      tweenRef.current?.kill()
      if (reveal === 'rise') {
        gsap.set(layer, { opacity: 1, scale: 1, clipPath: 'inset(0% 0% 0% 0%)' })
        tweenRef.current = gsap.fromTo(
          glyphs,
          { y: riseDistance() },
          { y: 0, duration, stagger, ease: 'power4.out', overwrite: 'auto' }
        )
      } else if (reveal === 'wipe') {
        gsap.set(glyphs, { y: 0 })
        const state = { progress: 100 }
        tweenRef.current = gsap.to(state, {
          progress: 0,
          duration,
          ease: 'power3.inOut',
          overwrite: 'auto',
          onUpdate: () => {
            layer.style.clipPath = `inset(0% ${state.progress}% 0% 0%)`
          },
        })
      } else {
        gsap.set(glyphs, { y: 0 })
        tweenRef.current = gsap.fromTo(
          layer,
          { opacity: 0, scale: 1.08 },
          { opacity: 1, scale: 1, duration, ease: 'power3.out', overwrite: 'auto' }
        )
      }
    }

    if (trigger === 'hover') {
      settle()
      root.addEventListener('pointerenter', play)
      return () => {
        root.removeEventListener('pointerenter', play)
        tweenRef.current?.kill()
      }
    }

    if (trigger === 'view') {
      settle()
      rest()
      const observer = new IntersectionObserver(
        entries => {
          if (entries.some(entry => entry.isIntersecting)) {
            play()
            observer.disconnect()
          }
        },
        { threshold: 0.25 }
      )
      observer.observe(root)
      return () => {
        observer.disconnect()
        tweenRef.current?.kill()
      }
    }

    play()
    return () => tweenRef.current?.kill()
  }, [duration, reveal, stagger, trigger, words])

  const Tag = tag as ElementType
  const rootStyle: CSSProperties = {
    textAlign: align,
    fontWeight: weight,
    letterSpacing: `${tracking}em`,
    lineHeight,
    ...style,
  }

  return (
    <Tag
      ref={(node: HTMLElement | null) => { rootRef.current = node }}
      className={`${styles.root} ${className}`.trim()}
      style={rootStyle}
      {...rest}
    >
      <span ref={measureRef} className={styles.measure}>
        {words.map((word, index) => (
          <span
            key={`${word}-${index}`}
            ref={node => { wordRefs.current[index] = node }}
            className={styles.word}
          >
            {word}
            <i ref={node => { baseRefs.current[index] = node }} className={styles.baseline} />
          </span>
        ))}
      </span>

      <svg className={styles.defs} aria-hidden="true" focusable="false">
        <defs>
          <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
            {words.map((word, index) => (
              <text key={`${word}-${index}`} ref={node => { glyphRefs.current[index] = node }}>
                {word}
              </text>
            ))}
          </clipPath>
        </defs>
      </svg>

      <span ref={revealRef} className={styles.reveal}>
        <span className={styles.clip} style={{ clipPath: `url(#${clipId})` }}>
          <span ref={mediaRef} className={styles.media}>
            {mediaType === 'video' ? (
              <video className={styles.source} src={src} poster={poster} autoPlay muted loop playsInline />
            ) : src ? (
              <Image className={styles.source} src={src} alt="" fill sizes="100vw" draggable={false} />
            ) : null}
          </span>
        </span>
      </span>
    </Tag>
  )
}

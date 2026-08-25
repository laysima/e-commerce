'use client'

import type { CSSProperties } from 'react'
import styles from './EditorialMotion.module.css'

type TextLoopProps = {
  text: string
  shape?: 'wave' | 'circle'
  speed?: number
  direction?: 'forward' | 'reverse'
  separator?: string
  curviness?: number
  fontSize?: number
  fontWeight?: number
  letterSpacing?: number
  uppercase?: boolean
  color?: string
  ribbon?: boolean
  ribbonColor?: string
  ribbonWidth?: number
  pauseOnHover?: boolean
  className?: string
}

export default function TextLoop({
  text,
  shape = 'wave',
  speed = 90,
  direction = 'forward',
  separator = '·',
  curviness = 90,
  fontSize = 46,
  fontWeight = 800,
  letterSpacing = 2,
  uppercase = false,
  color = '#ffffff',
  ribbon = false,
  ribbonColor = '#5227FF',
  ribbonWidth = 86,
  pauseOnHover = false,
  className = '',
}: TextLoopProps) {
  const copy = `${text} ${separator} ${text} ${separator} `
  const style = {
    '--loop-duration': `${Math.max(8, 180 - speed)}s`,
    '--loop-direction': direction === 'forward' ? 'normal' : 'reverse',
    '--loop-color': color,
    '--ribbon-color': ribbonColor,
    '--ribbon-width': ribbonWidth,
  } as CSSProperties
  const path = shape === 'circle'
    ? 'M 50,200 A 150,150 0 1,1 350,200 A 150,150 0 1,1 50,200'
    : `M -20,210 Q 100,${210 - curviness} 220,210 T 460,210 T 700,210`

  return (
    <div className={`${styles.textLoop} ${ribbon ? styles.textRibbon : ''} ${pauseOnHover ? styles.loopPause : ''} ${className}`} style={style}>
      <svg viewBox="0 0 680 400" role="img" aria-label={text}>
        <defs><path id={`loop-${text.replace(/\W/g, '').slice(0, 12)}`} d={path} /></defs>
        {ribbon && <use href={`#loop-${text.replace(/\W/g, '').slice(0, 12)}`} className={styles.ribbonPath} />}
        <text style={{ fontSize, fontWeight, letterSpacing, textTransform: uppercase ? 'uppercase' : 'none' }}>
          <textPath href={`#loop-${text.replace(/\W/g, '').slice(0, 12)}`} startOffset="0%">{copy}</textPath>
        </text>
      </svg>
    </div>
  )
}

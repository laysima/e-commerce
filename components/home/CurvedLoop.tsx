'use client'

import styles from './EditorialMotion.module.css'

type CurvedLoopProps = {
  marqueeText: string
  speed?: number
  curveAmount?: number
  direction?: 'left' | 'right'
  interactive?: boolean
  className?: string
}

export default function CurvedLoop({
  marqueeText,
  speed = 2,
  curveAmount = 300,
  direction = 'left',
  interactive = true,
  className = '',
}: CurvedLoopProps) {
  const id = `curve-${marqueeText.replace(/\W/g, '').slice(0, 16)}`
  const copy = `${marqueeText} ${marqueeText} ${marqueeText}`
  return (
    <div className={`${styles.curvedLoop} ${interactive ? styles.curveInteractive : ''} ${className}`}>
      <svg viewBox="0 0 1400 320" role="img" aria-label={marqueeText} preserveAspectRatio="none">
        <defs><path id={id} d={`M -100 230 Q 700 ${230 - curveAmount} 1500 230`} /></defs>
        <text>
          <textPath href={`#${id}`} startOffset={direction === 'right' ? '-60%' : '0%'}>
            {copy}
            <animate
              attributeName="startOffset"
              from={direction === 'right' ? '-60%' : '0%'}
              to={direction === 'right' ? '0%' : '-60%'}
              dur={`${Math.max(12, 46 / speed)}s`}
              repeatCount="indefinite"
            />
          </textPath>
        </text>
      </svg>
    </div>
  )
}

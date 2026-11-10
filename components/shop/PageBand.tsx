import type { CSSProperties, ReactNode } from 'react'
import Image from 'next/image'

type PageBandProps = {
  title: string
  compact?: boolean
  card?: { image: string; color: string }
  children?: ReactNode
}

export default function PageBand({ title, compact = false, card, children }: PageBandProps) {
  return (
    <section className={`page-band${compact ? ' page-band--compact' : ''}`}>
      <h1 style={{ '--title-chars': title.length } as CSSProperties}>{title}</h1>
      {card && (
        <div className="page-band__card" style={{ backgroundColor: card.color }} aria-hidden="true">
          <Image src={card.image} alt="" fill preload sizes="(max-width: 760px) 30vw, 14vw" />
        </div>
      )}
      {children && <div className="page-band__notch">{children}</div>}
    </section>
  )
}

'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'

export default function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const track = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  if (images.length === 0) return <div className="pdp-gallery__empty">Image forthcoming</div>

  const handleScroll = () => {
    const element = track.current
    if (element) setActive(Math.round(element.scrollLeft / element.clientWidth))
  }

  const showImage = (index: number) => {
    const element = track.current
    if (!element) return
    const instant = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    element.scrollTo({ left: index * element.clientWidth, behavior: instant ? 'auto' : 'smooth' })
  }

  return (
    <div className="pdp-gallery">
      <div className="pdp-gallery__track" ref={track} onScroll={handleScroll}>
        {images.map((image, index) => (
          <figure key={image}>
            <Image
              src={image}
              alt={`${name}${index ? `, view ${index + 1}` : ''}`}
              fill
              preload={index === 0}
              sizes="(max-width: 860px) 95vw, 40vw"
            />
          </figure>
        ))}
      </div>
      {images.length > 1 && (
        <div className="pdp-gallery__segments">
          {images.map((image, index) => (
            <button
              type="button"
              key={image}
              onClick={() => showImage(index)}
              className={index === active ? 'is-active' : ''}
              aria-label={`Show image ${index + 1} of ${images.length}`}
              aria-current={index === active}
            />
          ))}
        </div>
      )}
    </div>
  )
}

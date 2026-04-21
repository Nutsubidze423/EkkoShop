'use client'

import { useState, useRef, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ImageCarouselProps {
  urls: string[]
  alt: string
  className?: string
  aspectRatio?: string
  grayscale?: boolean
}

export function ImageCarousel({
  urls,
  alt,
  className = '',
  aspectRatio = 'aspect-[4/3]',
  grayscale = false,
}: ImageCarouselProps) {
  const [index, setIndex] = useState(0)
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)

  const images = urls.length > 0 ? urls : []

  const prev = useCallback(() => setIndex((i) => (i - 1 + images.length) % images.length), [images.length])
  const next = useCallback(() => setIndex((i) => (i + 1) % images.length), [images.length])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return
    const dx = touchStartX.current - e.changedTouches[0].clientX
    const dy = Math.abs(touchStartY.current - e.changedTouches[0].clientY)
    if (Math.abs(dx) > 48 && dy < 30) { if (dx > 0) next(); else prev() }
    touchStartX.current = null
    touchStartY.current = null
  }

  if (images.length === 0) {
    return (
      <div className={`${aspectRatio} ${className} bg-background flex items-center justify-center`}>
        <span className="text-muted text-sm font-sans">No image</span>
      </div>
    )
  }

  return (
    <>
      <div
        className={`relative overflow-hidden group ${aspectRatio} ${className}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={images[index]}
          alt={`${alt} ${index + 1}`}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]${grayscale ? ' retro-img' : ''}`}
          loading="lazy"
        />

        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prev() }}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              style={{ backgroundColor: '#2C2C2C' }}
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next() }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              style={{ backgroundColor: '#2C2C2C' }}
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4 text-white" />
            </button>

            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setIndex(i) }}
                  className="h-1 transition-all duration-200"
                  style={{
                    width: i === index ? '16px' : '6px',
                    backgroundColor: i === index ? '#BC2C2C' : 'rgba(255,255,255,0.6)',
                  }}
                  aria-label={`Image ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}

        {images.length > 1 && (
          <div
            className="absolute top-2 right-2 font-sans font-black text-[9px]"
            style={{ backgroundColor: '#2C2C2C', color: 'white', padding: '2px 6px', letterSpacing: '0.05em' }}
          >
            {index + 1}/{images.length}
          </div>
        )}
      </div>

    </>
  )
}

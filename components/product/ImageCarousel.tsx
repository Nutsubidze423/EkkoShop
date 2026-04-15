'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

interface ImageCarouselProps {
  urls: string[]
  alt: string
  className?: string
  aspectRatio?: string
}

export function ImageCarousel({
  urls,
  alt,
  className = '',
  aspectRatio = 'aspect-[4/3]',
}: ImageCarouselProps) {
  const [index, setIndex] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)

  const images = urls.length > 0 ? urls : []

  const prev = useCallback(() => setIndex((i) => (i - 1 + images.length) % images.length), [images.length])
  const next = useCallback(() => setIndex((i) => (i + 1) % images.length), [images.length])

  // Keyboard nav for lightbox
  useEffect(() => {
    if (!lightbox) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'Escape') setLightbox(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightbox, prev, next])

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
        {/* Image */}
        <img
          src={images[index]}
          alt={`${alt} ${index + 1}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02] cursor-zoom-in"
          onClick={() => setLightbox(true)}
          loading="lazy"
        />

        {/* Prev / Next */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prev() }}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-surface/90 flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-surface"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4 text-dark" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next() }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-surface/90 flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-surface"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4 text-dark" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setIndex(i) }}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                    i === index ? 'bg-surface w-4' : 'bg-surface/50'
                  }`}
                  aria-label={`Image ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Count badge */}
        {images.length > 1 && (
          <div className="absolute top-2 right-2 bg-dark/60 text-white text-[10px] font-medium px-2 py-0.5 font-sans">
            {index + 1}/{images.length}
          </div>
        )}

        {/* Zoom hint */}
        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <ZoomIn className="w-4 h-4 text-white drop-shadow" />
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[950] bg-dark/95 flex items-center justify-center"
            onClick={() => setLightbox(false)}
          >
            <button
              className="absolute top-4 right-4 btn-icon bg-surface/10 hover:bg-surface/20 text-white"
              onClick={() => setLightbox(false)}
              aria-label="Close lightbox"
            >
              <X className="w-5 h-5" />
            </button>

            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prev() }}
                  className="absolute left-4 btn-icon bg-surface/10 hover:bg-surface/20 text-white"
                  aria-label="Previous"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); next() }}
                  className="absolute right-4 btn-icon bg-surface/10 hover:bg-surface/20 text-white"
                  aria-label="Next"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            <motion.img
              key={index}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              src={images[index]}
              alt={`${alt} ${index + 1}`}
              className="max-w-[90vw] max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {images.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setIndex(i) }}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      i === index ? 'bg-white w-6' : 'bg-white/40'
                    }`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

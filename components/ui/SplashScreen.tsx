'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const LETTERS = ['E', 'K', 'K', 'O', 'S', 'H', 'O', 'P']
const LETTER_DELAY = 0.13
const HOLD_MS = 1500
const FADE_S = 0.65

export function SplashScreen() {
  const [mounted, setMounted] = useState<boolean | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('ekko_splash_done')) {
      setMounted(false)
      return
    }
    sessionStorage.setItem('ekko_splash_done', '1')
    setMounted(true)
    setVisible(true)

    const typingMs = LETTERS.length * LETTER_DELAY * 1000
    const dismissAt = typingMs + HOLD_MS
    const removeAt = dismissAt + FADE_S * 1000 + 100

    const t1 = setTimeout(() => setVisible(false), dismissAt)
    const t2 = setTimeout(() => setMounted(false), removeAt)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  if (mounted === null || mounted === false) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: FADE_S, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ backgroundColor: '#BC2C2C' }}
        >
          {/* Watermark */}
          <div
            className="absolute bottom-0 right-0 font-display font-black text-white uppercase pointer-events-none select-none"
            style={{ fontSize: '35vw', opacity: 0.05, lineHeight: 0.8, letterSpacing: '-0.05em', transform: 'translateX(8%)' }}
          >
            EKKO
          </div>

          <div className="relative flex items-baseline">
            {LETTERS.map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: i * LETTER_DELAY,
                  duration: 0.2,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="font-display font-black select-none"
                style={{
                  fontSize: 'clamp(3.5rem, 13vw, 9rem)',
                  lineHeight: 1,
                  letterSpacing: '-0.04em',
                  color: i >= 4 ? '#FCD758' : 'white',
                }}
              >
                {char}
              </motion.span>
            ))}

            {/* Blinking cursor after last letter */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0, 1, 1, 0] }}
              transition={{
                delay: LETTERS.length * LETTER_DELAY + 0.05,
                duration: 1.2,
                times: [0, 0.05, 0.35, 0.45, 0.55, 0.85, 1],
              }}
              className="font-display font-black select-none"
              style={{
                fontSize: 'clamp(3.5rem, 13vw, 9rem)',
                lineHeight: 1,
                marginLeft: '4px',
                color: 'rgba(255,255,255,0.55)',
              }}
            >
              |
            </motion.span>
          </div>

          {/* Tagline fades in after text */}
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: LETTERS.length * LETTER_DELAY + 0.3, duration: 0.4 }}
            className="font-sans font-semibold uppercase select-none"
            style={{ fontSize: '10px', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.45)', marginTop: '20px' }}
          >
            Premium Tech Store
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

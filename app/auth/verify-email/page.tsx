'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { verifyEmail } from '@/lib/api/auth'
import { useTranslation } from '@/lib/i18n'
import { ApiException } from '@/lib/api/client'

function VerifyEmailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useTranslation()

  const emailParam = searchParams.get('email') ?? ''
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await verifyEmail(emailParam, code)
      setSuccess(true)
      setTimeout(() => router.push('/auth/login'), 2000)
    } catch (err) {
      if (err instanceof ApiException) setError(err.error.message)
      else setError(t('common.error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        className="w-full max-w-sm"
      >
        <div className="mb-10">
          <Link href="/" className="font-display text-2xl font-light text-dark tracking-[0.12em] block mb-8">
            EKKO<span className="font-sans text-xs text-muted ml-1 tracking-widest uppercase">shop</span>
          </Link>
          <h1 className="font-display text-3xl font-light text-dark">{t('auth.verifyEmail')}</h1>
          <div className="mt-2 h-px w-10 bg-primary" />
          {emailParam && (
            <p className="mt-4 text-sm font-sans text-muted">
              Code sent to <span className="text-dark">{emailParam}</span>
            </p>
          )}
        </div>

        {success ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
            <div className="w-12 h-12 bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <p className="font-display text-xl font-light text-dark">Email verified!</p>
            <p className="text-sm font-sans text-muted mt-2">Redirecting to sign in…</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="input-floating">
              <input
                type="text"
                placeholder=" "
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
                maxLength={6}
                inputMode="numeric"
                autoComplete="one-time-code"
              />
              <label>{t('auth.verifyCode')}</label>
            </div>

            {error && <p className="text-sm text-danger font-sans">{error}</p>}

            <button type="submit" disabled={loading || code.length < 6} className="btn-primary w-full py-3.5 text-sm tracking-widest uppercase">
              {loading ? t('common.loading') : t('auth.verify')}
            </button>
          </form>
        )}

        <p className="mt-8 text-sm font-sans text-muted text-center">
          <Link href="/auth/login" className="text-dark hover:text-secondary transition-colors">
            {t('auth.backToLogin')}
          </Link>
        </p>
      </motion.div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return <Suspense><VerifyEmailContent /></Suspense>
}

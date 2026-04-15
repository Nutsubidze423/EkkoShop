'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, ArrowLeft } from 'lucide-react'
import {
  sendPasswordRecovery,
  verifyRecoveryCode,
  resetPassword,
} from '@/lib/api/auth'
import { useTranslation } from '@/lib/i18n'
import { ApiException } from '@/lib/api/client'

type Step = 0 | 1 | 2

export default function ForgotPasswordPage() {
  const router = useRouter()
  const { t } = useTranslation()

  const [step, setStep] = useState<Step>(0)
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const clearError = () => setError('')

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    setLoading(true)
    try {
      await sendPasswordRecovery(email)
      setStep(1)
    } catch (err) {
      if (err instanceof ApiException) setError(err.error.message)
      else setError(t('common.error'))
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    setLoading(true)
    try {
      await verifyRecoveryCode(email, code)
      setStep(2)
    } catch (err) {
      if (err instanceof ApiException) setError(err.error.message)
      else setError(t('common.error'))
    } finally {
      setLoading(false)
    }
  }

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    setLoading(true)
    try {
      await resetPassword(email, newPassword, confirmPassword)
      setSuccess(true)
      setTimeout(() => router.push('/auth/login'), 2000)
    } catch (err) {
      if (err instanceof ApiException) setError(err.error.message)
      else setError(t('common.error'))
    } finally {
      setLoading(false)
    }
  }

  const steps: Array<{ title: string; content: React.ReactNode }> = [
    {
      title: t('auth.forgotPassword').replace('?', ''),
      content: (
        <form onSubmit={handleSendCode} className="space-y-8">
          <p className="text-sm font-sans text-muted">Enter your email address and we&apos;ll send a recovery code.</p>
          <div className="input-floating">
            <input type="email" placeholder=" " value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
            <label>{t('auth.email')}</label>
          </div>
          {error && <p className="text-sm text-danger font-sans">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-sm tracking-widest uppercase">
            {loading ? t('common.loading') : t('auth.sendCode')}
          </button>
        </form>
      ),
    },
    {
      title: 'Enter Recovery Code',
      content: (
        <form onSubmit={handleVerifyCode} className="space-y-8">
          <p className="text-sm font-sans text-muted">Code sent to <span className="text-dark">{email}</span></p>
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
            <label>Recovery code</label>
          </div>
          {error && <p className="text-sm text-danger font-sans">{error}</p>}
          <div className="flex gap-3">
            <button type="button" onClick={() => { setStep(0); clearError() }} className="btn-secondary flex-1 text-xs py-3">
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <button type="submit" disabled={loading || code.length < 6} className="btn-primary flex-1 py-3 text-xs tracking-wide uppercase">
              {loading ? t('common.loading') : t('common.next')}
            </button>
          </div>
        </form>
      ),
    },
    {
      title: t('auth.resetPassword'),
      content: (
        <form onSubmit={handleReset} className="space-y-8">
          <div className="input-floating relative">
            <input
              type={showPass ? 'text' : 'password'}
              placeholder=" "
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
            />
            <label>{t('auth.newPassword')}</label>
            <button type="button" onClick={() => setShowPass((v) => !v)} className="absolute right-0 bottom-2 text-muted hover:text-dark transition-colors">
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <div className="input-floating">
            <input
              type={showPass ? 'text' : 'password'}
              placeholder=" "
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
            <label>{t('auth.confirmPassword')}</label>
          </div>
          {error && <p className="text-sm text-danger font-sans">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-sm tracking-widest uppercase">
            {loading ? t('common.loading') : t('auth.resetPassword')}
          </button>
        </form>
      ),
    },
  ]

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

          {/* Step indicators */}
          <div className="flex gap-2 mb-8">
            {steps.map((_, i) => (
              <div key={i} className={`h-0.5 flex-1 transition-all duration-300 ${i <= step ? 'bg-dark' : 'bg-border'}`} />
            ))}
          </div>

          <h1 className="font-display text-3xl font-light text-dark">{steps[step].title}</h1>
          <div className="mt-2 h-px w-10 bg-primary" />
        </div>

        {success ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
            <div className="w-12 h-12 bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <p className="font-display text-xl font-light text-dark">Password reset!</p>
            <p className="text-sm font-sans text-muted mt-2">Redirecting to sign in…</p>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {steps[step].content}
            </motion.div>
          </AnimatePresence>
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

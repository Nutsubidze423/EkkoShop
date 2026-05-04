'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import { login } from '@/lib/api/auth'
import { useAuthStore } from '@/store/authStore'
import { useTranslation } from '@/lib/i18n'
import { useRedirectIfAuthed } from '@/hooks/useAuth'
import { ApiException, BASE_URL } from '@/lib/api/client'

export default function LoginPage() {
  useRedirectIfAuthed()
  const router = useRouter()
  const { login: storeLogin } = useAuthStore()
  const { t } = useTranslation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await login(email, password)
      storeLogin(res.token)
      router.push('/')
    } catch (err) {
      if (err instanceof ApiException) setError(err.error.message)
      else setError(t('common.error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left decorative panel */}
      <div
        className="hidden lg:flex lg:w-1/2 items-center justify-center relative overflow-hidden"
        style={{ backgroundColor: '#BC2C2C' }}
      >
        {/* Grid texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(0,0,0,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.07) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        {/* Watermark */}
        <div
          className="absolute bottom-0 right-0 font-display font-black uppercase pointer-events-none select-none"
          style={{ fontSize: '30vw', opacity: 0.07, lineHeight: 0.8, letterSpacing: '-0.05em', color: 'white', transform: 'translateX(8%)' }}
        >
          EKKO
        </div>
        {/* Content */}
        <div className="relative z-10 text-center px-16">
          <Link href="/">
            <span
              className="font-display font-black uppercase block select-none"
              style={{ fontSize: 'clamp(3rem, 4.5vw, 5rem)', lineHeight: 0.85, letterSpacing: '-0.05em' }}
            >
              <span style={{ color: 'white' }}>EKKO</span>
              <span style={{ color: '#FCD758' }}>SHOP</span>
            </span>
          </Link>
          <p
            className="font-sans font-semibold uppercase select-none mt-6"
            style={{ fontSize: '10px', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.5)' }}
          >
            Premium Tech Store
          </p>
          <div className="mt-10 h-px w-12 mx-auto" style={{ backgroundColor: 'rgba(255,255,255,0.25)' }} />
          <p
            className="font-sans mt-6 max-w-xs mx-auto"
            style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.8, letterSpacing: '0.01em' }}
          >
            Premium tech, curated for performance. Laptops, components, and peripherals — selected for quality.
          </p>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="w-full max-w-sm"
        >
          <div className="mb-10">
            <Link href="/" className="font-display text-2xl font-light text-dark tracking-[0.12em] lg:hidden block mb-8">
              EKKO<span className="font-sans text-xs text-muted ml-1 tracking-widest uppercase">shop</span>
            </Link>
            <h1 className="font-display text-3xl font-light text-dark">{t('auth.login')}</h1>
            <div className="mt-2 h-px w-10 bg-primary" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="input-floating">
              <input
                type="email"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
              <label>{t('auth.email')}</label>
            </div>

            <div className="input-floating relative">
              <input
                type={showPass ? 'text' : 'password'}
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <label>{t('auth.password')}</label>
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-0 bottom-2 text-muted hover:text-dark transition-colors"
                aria-label="Toggle password visibility"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <p className="text-sm text-danger font-sans -mt-2">{error}</p>
            )}

            <div className="flex items-center justify-between">
              <Link href="/auth/forgot-password" className="text-xs font-sans text-muted hover:text-dark transition-colors">
                {t('auth.forgotPassword')}
              </Link>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-sm tracking-widest uppercase">
              {loading ? t('common.loading') : t('auth.login')}
            </button>
          </form>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex-1 h-px" style={{ backgroundColor: '#E5E0D0' }} />
            <span className="font-sans text-[10px] uppercase tracking-widest" style={{ color: '#C8C2B0' }}>or</span>
            <div className="flex-1 h-px" style={{ backgroundColor: '#E5E0D0' }} />
          </div>

          <button
            type="button"
            onClick={() => {
              const callbackUrl = `${window.location.origin}/auth/google/callback`
              window.location.href = `${BASE_URL}/api/Auth/google?returnUrl=${encodeURIComponent(callbackUrl)}`
            }}
            className="mt-4 w-full flex items-center justify-center gap-3 border-2 py-3 font-sans font-medium text-sm transition-colors hover:bg-gray-50"
            style={{ borderColor: '#E5E0D0', color: '#2C2C2C' }}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

          <p className="mt-8 text-sm font-sans text-muted text-center">
            {t('auth.noAccount')}{' '}
            <Link href="/auth/register" className="text-dark hover:text-secondary transition-colors">
              {t('auth.register')}
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

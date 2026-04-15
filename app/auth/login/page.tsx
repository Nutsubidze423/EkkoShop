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
import { ApiException } from '@/lib/api/client'

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
      <div className="hidden lg:flex lg:w-1/2 bg-dark items-center justify-center p-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="absolute border border-white/20 rounded-full"
              style={{ width: `${(i + 1) * 120}px`, height: `${(i + 1) * 120}px`,
                top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
          ))}
        </div>
        <div className="relative z-10 text-center">
          <h2 className="font-display text-5xl font-light text-white tracking-[0.15em] mb-4">EKKO</h2>
          <p className="font-sans text-white/50 text-sm tracking-widest uppercase">Premium Tech Store</p>
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

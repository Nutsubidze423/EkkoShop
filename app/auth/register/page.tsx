'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import { register } from '@/lib/api/auth'
import { useTranslation } from '@/lib/i18n'
import { useRedirectIfAuthed } from '@/hooks/useAuth'
import { ApiException } from '@/lib/api/client'

export default function RegisterPage() {
  useRedirectIfAuthed()
  const router = useRouter()
  const { t } = useTranslation()

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: ''
  })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const set = (key: string, value: string) => {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: '' }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)
    try {
      await register(form.firstName, form.lastName, form.email, form.password, form.confirmPassword)
      router.push(`/auth/verify-email?email=${encodeURIComponent(form.email)}`)
    } catch (err) {
      if (err instanceof ApiException) {
        const field = err.error.field?.toLowerCase() ?? 'general'
        setErrors({ [field]: err.error.message, general: err.error.message })
      }
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    { key: 'firstName', label: t('auth.firstName'), type: 'text', autoComplete: 'given-name' },
    { key: 'lastName', label: t('auth.lastName'), type: 'text', autoComplete: 'family-name' },
    { key: 'email', label: t('auth.email'), type: 'email', autoComplete: 'email' },
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
          <h1 className="font-display text-3xl font-light text-dark">{t('auth.register')}</h1>
          <div className="mt-2 h-px w-10 bg-primary" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {fields.map(({ key, label, type, autoComplete }) => (
            <div key={key}>
              <div className="input-floating">
                <input
                  type={type}
                  placeholder=" "
                  value={form[key as keyof typeof form]}
                  onChange={(e) => set(key, e.target.value)}
                  required
                  autoComplete={autoComplete}
                />
                <label>{label}</label>
              </div>
              {errors[key] && <p className="text-xs text-danger font-sans mt-1">{errors[key]}</p>}
            </div>
          ))}

          <div>
            <div className="input-floating relative">
              <input
                type={showPass ? 'text' : 'password'}
                placeholder=" "
                value={form.password}
                onChange={(e) => set('password', e.target.value)}
                required
                autoComplete="new-password"
                minLength={6}
              />
              <label>{t('auth.password')}</label>
              <button type="button" onClick={() => setShowPass((v) => !v)}
                className="absolute right-0 bottom-2 text-muted hover:text-dark transition-colors">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors['password'] && <p className="text-xs text-danger font-sans mt-1">{errors['password']}</p>}
          </div>

          <div>
            <div className="input-floating">
              <input
                type={showPass ? 'text' : 'password'}
                placeholder=" "
                value={form.confirmPassword}
                onChange={(e) => set('confirmPassword', e.target.value)}
                required
                autoComplete="new-password"
              />
              <label>{t('auth.confirmPassword')}</label>
            </div>
            {errors['confirmpassword'] && <p className="text-xs text-danger font-sans mt-1">{errors['confirmpassword']}</p>}
          </div>

          {errors['general'] && !errors['password'] && !errors['confirmpassword'] && (
            <p className="text-sm text-danger font-sans">{errors['general']}</p>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-sm tracking-widest uppercase">
            {loading ? t('common.loading') : t('auth.register')}
          </button>
        </form>

        <p className="mt-8 text-sm font-sans text-muted text-center">
          {t('auth.hasAccount')}{' '}
          <Link href="/auth/login" className="text-dark hover:text-secondary transition-colors">
            {t('auth.login')}
          </Link>
        </p>
      </motion.div>
    </div>
  )
}

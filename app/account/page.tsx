'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import { useRequireAuth } from '@/hooks/useAuth'
import { useTranslation } from '@/lib/i18n'
import { toast } from '@/store/toastStore'

export default function AccountPage() {
  const { user, hydrated } = useRequireAuth()
  const { t } = useTranslation()

  const [showPass, setShowPass] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [savingPass, setSavingPass] = useState(false)

  if (!hydrated || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    setSavingPass(true)
    // Password change endpoint not in API docs — show info
    setTimeout(() => {
      toast.info('Password change not yet implemented in API')
      setSavingPass(false)
    }, 500)
  }

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className="mb-10">
          <h1 className="font-display text-4xl font-light text-dark tracking-wide">{t('account.title')}</h1>
          <div className="mt-3 h-px w-16 bg-primary" />
        </div>

        {/* Profile */}
        <section className="bg-surface border border-border p-8 mb-6">
          <h2 className="font-display text-xl font-light text-dark mb-6">{t('account.profile')}</h2>
          <div className="flex items-center gap-6 mb-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="font-display text-2xl font-light text-primary">
                {user.firstName[0]}{user.lastName[0]}
              </span>
            </div>
            <div>
              <p className="font-display text-2xl font-light text-dark">
                {user.firstName} {user.lastName}
              </p>
              <span className="inline-block mt-1 text-[10px] px-2 py-0.5 bg-primary/10 text-primary font-medium font-sans tracking-widest uppercase">
                {user.role}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { label: t('auth.firstName'), value: user.firstName },
              { label: t('auth.lastName'), value: user.lastName },
              { label: t('auth.email'), value: user.email },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between py-3 border-b border-border">
                <span className="text-xs font-sans tracking-widest uppercase text-muted">{label}</span>
                <span className="text-sm font-sans text-dark">{value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Password */}
        <section className="bg-surface border border-border p-8">
          <h2 className="font-display text-xl font-light text-dark mb-6">{t('account.changePassword')}</h2>
          <form onSubmit={handlePasswordChange} className="space-y-6">
            {[
              { key: 'currentPassword', label: t('account.currentPassword') },
              { key: 'newPassword', label: t('auth.newPassword') },
              { key: 'confirmPassword', label: t('auth.confirmPassword') },
            ].map(({ key, label }) => (
              <div key={key} className="input-floating relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder=" "
                  value={passwordForm[key as keyof typeof passwordForm]}
                  onChange={(e) =>
                    setPasswordForm((f) => ({ ...f, [key]: e.target.value }))
                  }
                  required
                  minLength={6}
                />
                <label>{label}</label>
                {key === 'currentPassword' && (
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    className="absolute right-0 bottom-2 text-muted hover:text-dark transition-colors"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                )}
              </div>
            ))}
            <button type="submit" disabled={savingPass} className="btn-primary py-3 px-8">
              {savingPass ? t('common.loading') : t('account.save')}
            </button>
          </form>
        </section>
      </motion.div>
    </main>
  )
}

'use client'

import { useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { useAuthStore } from '@/store/authStore'
import { getMe } from '@/lib/api/auth'
import { toast } from '@/store/toastStore'

function GoogleCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const loginFromCookie = useAuthStore((s) => s.loginFromCookie)
  const ran = useRef(false)

  useEffect(() => {
    // Strict-mode guard — prevent double-execution in dev
    if (ran.current) return
    ran.current = true

    const error = searchParams.get('error')

    if (error) {
      const messages: Record<string, string> = {
        access_denied: 'Google sign-in was cancelled.',
        unauthorized: 'Account not authorised.',
      }
      toast.error(messages[error] ?? 'Google sign-in failed. Please try again.')
      router.replace('/auth/login')
      return
    }

    // The backend set the HttpOnly JWT cookie before redirecting here.
    // We can't read it from JS — we just call /api/Auth/Me (credentials: 'include')
    // and the browser sends the cookie automatically.
    getMe()
      .then((user) => {
        loginFromCookie(user)
        toast.success(`Welcome, ${user.firstName}!`)
        router.replace('/')
      })
      .catch(() => {
        toast.error('Sign-in failed — could not verify your session. Please try again.')
        router.replace('/auth/login')
      })
  }, [searchParams, loginFromCookie, router])

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-4"
      style={{ backgroundColor: '#F5F1E3' }}
    >
      <div
        className="w-6 h-6 border-2 rounded-full animate-spin"
        style={{ borderColor: '#BC2C2C', borderTopColor: 'transparent' }}
      />
      <p
        className="font-sans text-xs uppercase tracking-widest"
        style={{ color: '#9C9C8A' }}
      >
        Signing you in…
      </p>
    </div>
  )
}

export default function GoogleCallbackPage() {
  return (
    <Suspense>
      <GoogleCallbackContent />
    </Suspense>
  )
}

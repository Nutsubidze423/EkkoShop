'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { useAuthStore } from '@/store/authStore'
import { toast } from '@/store/toastStore'

function GoogleCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuthStore()

  useEffect(() => {
    const token = searchParams.get('token')
    const error = searchParams.get('error')

    if (error) {
      toast.error('Google sign-in failed. Please try again.')
      router.replace('/auth/login')
      return
    }

    if (token) {
      login(token)
      toast.success('Signed in with Google!')
      router.replace('/')
    } else {
      toast.error('No token received from Google.')
      router.replace('/auth/login')
    }
  }, [searchParams, login, router])

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F1E3' }}>
      <div className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: '#BC2C2C', borderTopColor: 'transparent' }} />
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

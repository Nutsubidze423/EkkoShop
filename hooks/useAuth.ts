'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

export function useRequireAuth(adminOnly = false) {
  const { user, token, hydrated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!hydrated) return
    if (!token) {
      router.replace('/auth/login')
      return
    }
    if (adminOnly && user?.role !== 'Admin') {
      router.replace('/')
    }
  }, [hydrated, token, user, adminOnly, router])

  return { user, token, hydrated, isAdmin: user?.role === 'Admin' }
}

export function useRedirectIfAuthed() {
  const { token, hydrated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!hydrated) return
    if (token) router.replace('/')
  }, [hydrated, token, router])
}

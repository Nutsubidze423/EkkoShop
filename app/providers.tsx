'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { hydrateI18n } from '@/lib/i18n'
import { getCart, getWishlist } from '@/lib/api/products'
import { SplashScreen } from '@/components/ui/SplashScreen'

export function Providers({ children }: { children: React.ReactNode }) {
  const hydrate = useAuthStore((s) => s.hydrate)
  const token = useAuthStore((s) => s.token)
  const user = useAuthStore((s) => s.user)
  const setCartItems = useCartStore((s) => s.setItems)
  const setWishlistItems = useWishlistStore((s) => s.setItems)

  // Hydrate auth + i18n on mount
  useEffect(() => {
    hydrate()
    hydrateI18n()
  }, [hydrate])

  // Seed cart + wishlist when user logs in
  useEffect(() => {
    if (!user || !token) return
    getCart({ UserId: user.id, Page: 1, PageSize: 100 })
      .then((res) => setCartItems(res.value.items))
      .catch(() => {})
    getWishlist({ UserId: user.id, Page: 1, PageSize: 100 })
      .then((res) => setWishlistItems(res.value.items))
      .catch(() => {})
  }, [user, token, setCartItems, setWishlistItems])

  return (
    <>
      <SplashScreen />
      {children}
    </>
  )
}

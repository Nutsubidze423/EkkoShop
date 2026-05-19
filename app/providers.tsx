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
  const hydrated = useAuthStore((s) => s.hydrated)
  const token = useAuthStore((s) => s.token)
  const user = useAuthStore((s) => s.user)
  const setCartItems = useCartStore((s) => s.setItems)
  const loadGuestCart = useCartStore((s) => s.loadGuestCart)
  const setWishlistItems = useWishlistStore((s) => s.setItems)

  // Hydrate auth + i18n on mount
  useEffect(() => {
    hydrate()
    hydrateI18n()
  }, [hydrate])

  // After auth hydrates: load DB cart for logged-in users, guest cart for others
  useEffect(() => {
    if (!hydrated) return
    if (user && token) {
      ;(async () => {
        // Merge any guest cart items before fetching the DB cart
        await useCartStore.getState().mergeAndClearGuest(user.id)
        const [cartRes, wishlistRes] = await Promise.all([
          getCart({ UserId: user.id, Page: 1, PageSize: 100 }),
          getWishlist({ UserId: user.id, Page: 1, PageSize: 100 }),
        ])
        setCartItems(cartRes.value.items)
        setWishlistItems(wishlistRes.value.items)
      })().catch(() => {})
    } else {
      loadGuestCart()
    }
  }, [hydrated, user, token, setCartItems, loadGuestCart, setWishlistItems])

  return (
    <>
      <SplashScreen />
      {children}
    </>
  )
}

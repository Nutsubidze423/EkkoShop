import { create } from 'zustand'
import type { CartItem } from '@/lib/types'
import { addToCart as apiAddToCart, removeFromCart as apiRemoveFromCart } from '@/lib/api/products'
import { mergeGuestCart } from '@/lib/api/orders'
import { toast } from './toastStore'

const GUEST_CART_KEY = 'ekko_guest_cart'

function readGuestCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(GUEST_CART_KEY) ?? '[]')
  } catch {
    return []
  }
}

function writeGuestCart(items: CartItem[]) {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items))
}

function clearGuestCart() {
  localStorage.removeItem(GUEST_CART_KEY)
}

interface CartState {
  items: CartItem[]
  count: number
  setItems: (items: CartItem[]) => void
  loadGuestCart: () => void
  addItem: (item: CartItem) => Promise<void>
  removeItem: (productId: number, userId: number) => Promise<void>
  incrementItem: (productId: number, userId: number) => Promise<void>
  decrementItem: (productId: number, userId: number) => Promise<void>
  mergeAndClearGuest: (userId: number) => Promise<void>
  clear: () => void
}

export const useCartStore = create<CartState>()((set, get) => ({
  items: [],
  count: 0,

  setItems: (items) => set({ items, count: items.reduce((acc, i) => acc + i.amount, 0) }),

  loadGuestCart: () => {
    const items = readGuestCart()
    if (items.length > 0) {
      set({ items, count: items.reduce((acc, i) => acc + i.amount, 0) })
    }
  },

  addItem: async (item) => {
    const isGuest = item.userId === 0
    const prev = get().items
    const existing = prev.find((i) => i.productId === item.productId)
    const next = existing
      ? prev.map((i) => (i.productId === item.productId ? { ...i, amount: i.amount + item.amount } : i))
      : [...prev, item]
    set({ items: next, count: next.reduce((acc, i) => acc + i.amount, 0) })

    if (isGuest) {
      writeGuestCart(next)
      return
    }

    try {
      await apiAddToCart(item.productId, item.userId, item.amount)
    } catch (err: unknown) {
      set({ items: prev, count: prev.reduce((acc, i) => acc + i.amount, 0) })
      const msg = err instanceof Error ? err.message : 'Failed to add to cart'
      toast.error(msg)
    }
  },

  removeItem: async (productId, userId) => {
    const isGuest = userId === 0
    const prev = get().items
    const next = prev.filter((i) => i.productId !== productId)
    set({ items: next, count: next.reduce((acc, i) => acc + i.amount, 0) })

    if (isGuest) {
      writeGuestCart(next)
      return
    }

    try {
      await apiRemoveFromCart(userId, productId)
    } catch (err: unknown) {
      set({ items: prev, count: prev.reduce((acc, i) => acc + i.amount, 0) })
      const msg = err instanceof Error ? err.message : 'Failed to remove from cart'
      toast.error(msg)
    }
  },

  incrementItem: async (productId, userId) => {
    const isGuest = userId === 0
    const prev = get().items
    const next = prev.map((i) => i.productId === productId ? { ...i, amount: i.amount + 1 } : i)
    set({ items: next, count: next.reduce((acc, i) => acc + i.amount, 0) })

    if (isGuest) {
      writeGuestCart(next)
      return
    }

    try {
      await apiAddToCart(productId, userId, 1)
    } catch (err: unknown) {
      set({ items: prev, count: prev.reduce((acc, i) => acc + i.amount, 0) })
      toast.error(err instanceof Error ? err.message : 'Failed to update cart')
    }
  },

  decrementItem: async (productId, userId) => {
    const isGuest = userId === 0
    const prev = get().items
    const item = prev.find((i) => i.productId === productId)
    if (!item) return

    if (item.amount === 1) {
      await get().removeItem(productId, userId)
      return
    }

    const newAmount = item.amount - 1
    const next = prev.map((i) => i.productId === productId ? { ...i, amount: newAmount } : i)
    set({ items: next, count: next.reduce((acc, i) => acc + i.amount, 0) })

    if (isGuest) {
      writeGuestCart(next)
      return
    }

    try {
      await apiRemoveFromCart(userId, productId)
      await apiAddToCart(productId, userId, newAmount)
    } catch (err: unknown) {
      set({ items: prev, count: prev.reduce((acc, i) => acc + i.amount, 0) })
      toast.error(err instanceof Error ? err.message : 'Failed to update cart')
    }
  },

  mergeAndClearGuest: async (userId: number) => {
    const guestItems = readGuestCart()
    if (guestItems.length === 0) return

    try {
      await mergeGuestCart(
        guestItems.map((i) => ({ productId: i.productId, userId, quantity: i.amount }))
      )
      clearGuestCart()
      // Let the normal cart fetch (triggered by auth layout) repopulate items from DB
      set({ items: [], count: 0 })
    } catch {
      // Non-fatal: guest items stay in localStorage, user can retry
    }
  },

  clear: () => set({ items: [], count: 0 }),
}))

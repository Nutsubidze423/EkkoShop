import { create } from 'zustand'
import type { CartItem } from '@/lib/types'
import { addToCart as apiAddToCart, removeFromCart as apiRemoveFromCart } from '@/lib/api/products'
import { toast } from './toastStore'

interface CartState {
  items: CartItem[]
  count: number
  setItems: (items: CartItem[]) => void
  addItem: (item: CartItem) => Promise<void>
  removeItem: (productId: number, userId: number) => Promise<void>
  incrementItem: (productId: number, userId: number) => Promise<void>
  decrementItem: (productId: number, userId: number) => Promise<void>
  clear: () => void
}

export const useCartStore = create<CartState>()((set, get) => ({
  items: [],
  count: 0,

  setItems: (items) => set({ items, count: items.reduce((acc, i) => acc + i.amount, 0) }),

  addItem: async (item) => {
    const prev = get().items
    // Optimistic: add or bump amount
    const existing = prev.find((i) => i.productId === item.productId)
    const next = existing
      ? prev.map((i) => (i.productId === item.productId ? { ...i, amount: i.amount + item.amount } : i))
      : [...prev, item]
    set({ items: next, count: next.reduce((acc, i) => acc + i.amount, 0) })

    try {
      await apiAddToCart(item.productId, item.userId, item.amount)
    } catch (err: unknown) {
      // Rollback
      set({ items: prev, count: prev.reduce((acc, i) => acc + i.amount, 0) })
      const msg = err instanceof Error ? err.message : 'Failed to add to cart'
      toast.error(msg)
    }
  },

  removeItem: async (productId, userId) => {
    const prev = get().items
    const next = prev.filter((i) => i.productId !== productId)
    set({ items: next, count: next.reduce((acc, i) => acc + i.amount, 0) })

    try {
      await apiRemoveFromCart(userId, productId)
    } catch (err: unknown) {
      set({ items: prev, count: prev.reduce((acc, i) => acc + i.amount, 0) })
      const msg = err instanceof Error ? err.message : 'Failed to remove from cart'
      toast.error(msg)
    }
  },

  incrementItem: async (productId, userId) => {
    const prev = get().items
    const next = prev.map((i) => i.productId === productId ? { ...i, amount: i.amount + 1 } : i)
    set({ items: next, count: next.reduce((acc, i) => acc + i.amount, 0) })

    try {
      await apiAddToCart(productId, userId, 1)
    } catch (err: unknown) {
      set({ items: prev, count: prev.reduce((acc, i) => acc + i.amount, 0) })
      toast.error(err instanceof Error ? err.message : 'Failed to update cart')
    }
  },

  decrementItem: async (productId, userId) => {
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

    try {
      await apiRemoveFromCart(userId, productId)
      await apiAddToCart(productId, userId, newAmount)
    } catch (err: unknown) {
      set({ items: prev, count: prev.reduce((acc, i) => acc + i.amount, 0) })
      toast.error(err instanceof Error ? err.message : 'Failed to update cart')
    }
  },

  clear: () => set({ items: [], count: 0 }),
}))

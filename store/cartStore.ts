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

  clear: () => set({ items: [], count: 0 }),
}))

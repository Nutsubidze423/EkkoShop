import { create } from 'zustand'
import type { WishlistItem } from '@/lib/types'
import {
  addToWishlist as apiAdd,
  removeFromWishlist as apiRemove,
} from '@/lib/api/products'
import { toast } from './toastStore'

interface WishlistState {
  items: WishlistItem[]
  count: number
  setItems: (items: WishlistItem[]) => void
  toggleItem: (productId: number, userId: number, productName: string) => Promise<void>
  isInWishlist: (productId: number) => boolean
  clear: () => void
}

export const useWishlistStore = create<WishlistState>()((set, get) => ({
  items: [],
  count: 0,

  setItems: (items) => set({ items, count: items.length }),

  isInWishlist: (productId) => get().items.some((i) => i.productId === productId),

  toggleItem: async (productId, userId, productName) => {
    const prev = get().items
    const inList = prev.some((i) => i.productId === productId)

    if (inList) {
      // Optimistic remove
      const next = prev.filter((i) => i.productId !== productId)
      set({ items: next, count: next.length })
      try {
        await apiRemove(userId, productId)
      } catch (err: unknown) {
        set({ items: prev, count: prev.length })
        const msg = err instanceof Error ? err.message : 'Failed to remove from wishlist'
        toast.error(msg)
      }
    } else {
      // Optimistic add (minimal stub — real data fetched on wishlist page)
      const stub: WishlistItem = {
        wishListItemId: 0,
        userId,
        productId,
        productName,
        productDescription: '',
        price: 0,
        amount: 0,
        productCategoryName: '',
        imageUrls: [],
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
      }
      const next = [...prev, stub]
      set({ items: next, count: next.length })
      try {
        await apiAdd(productId, userId)
      } catch (err: unknown) {
        set({ items: prev, count: prev.length })
        const msg = err instanceof Error ? err.message : 'Failed to add to wishlist'
        toast.error(msg)
      }
    }
  },

  clear: () => set({ items: [], count: 0 }),
}))

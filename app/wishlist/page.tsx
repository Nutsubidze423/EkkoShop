'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Heart, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import { ProductCard } from '@/components/product/ProductCard'
import { ProductGridSkeleton } from '@/components/ui/Skeleton'
import { useRequireAuth } from '@/hooks/useAuth'
import { useWishlistStore } from '@/store/wishlistStore'
import { useTranslation } from '@/lib/i18n'
import { getWishlist } from '@/lib/api/products'
import type { Product } from '@/lib/types'

export default function WishlistPage() {
  const { user, hydrated } = useRequireAuth()
  const { setItems } = useWishlistStore()
  const { t } = useTranslation()

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const res = await getWishlist({ UserId: user.id, Page: 1, PageSize: 100 })
      setItems(res.value.items)
      // Map wishlist items to Product shape for ProductCard
      setProducts(
        res.value.items.map((w) => ({
          productId: w.productId,
          name: w.productName,
          description: w.productDescription,
          price: w.price,
          amount: w.amount,
          categoryId: 0,
          categoryName: w.productCategoryName,
          imageUrl: w.imageUrls,
          creationDate: w.createdDate,
          modifiedDate: w.updatedDate,
        }))
      )
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [user, setItems])

  useEffect(() => {
    if (hydrated && user) load()
  }, [hydrated, user, load])

  if (!hydrated || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-10">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted hover:text-dark font-sans transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          {t('common.back')}
        </Link>
        <h1 className="font-display text-4xl font-light text-dark tracking-wide">{t('wishlist.title')}</h1>
        <div className="mt-3 h-px w-16 bg-primary" />
      </div>

      {loading ? (
        <ProductGridSkeleton count={4} />
      ) : products.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-24 text-center"
        >
          <div className="w-16 h-16 border border-border flex items-center justify-center mb-6">
            <Heart className="w-7 h-7 text-border" />
          </div>
          <p className="font-display text-2xl font-light text-dark mb-2">{t('wishlist.empty')}</p>
          <p className="text-sm font-sans text-muted mb-8">Save items you love</p>
          <Link href="/" className="btn-primary">{t('cart.continueShopping')}</Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-border">
          {products.map((p, i) => (
            <div key={p.productId} className="bg-background">
              <ProductCard product={p} index={i} />
            </div>
          ))}
        </div>
      )}
    </main>
  )
}

'use client'

import { useState, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { Heart, ShoppingBag, Check } from 'lucide-react'
import { motion } from 'framer-motion'
import { ImageCarousel } from './ImageCarousel'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { useTranslation } from '@/lib/i18n'
import { toast } from '@/store/toastStore'
import type { Product } from '@/lib/types'

interface ProductCardProps {
  product: Product
  index?: number
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { user } = useAuthStore()
  const { addItem } = useCartStore()
  const { toggleItem, isInWishlist } = useWishlistStore()
  const { t } = useTranslation()

  const [addedToCart, setAddedToCart] = useState(false)

  const inWishlist = isInWishlist(product.productId)
  const inStock = product.amount > 0
  const images = useMemo(
    () => (Array.isArray(product.imageUrl) ? product.imageUrl : []),
    [product.imageUrl]
  )

  const handleAddToCart = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault()
      if (!user) { toast.info('Please sign in to add to cart'); return }
      if (!inStock) return

      setAddedToCart(true)
      await addItem({
        cartItemId: 0,
        userId: user.id,
        cartId: 0,
        productId: product.productId,
        productName: product.name,
        productDescription: product.description,
        price: product.price,
        amount: 1,
        productCategoryName: product.categoryName,
        imageUrls: images,
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
      })
      setTimeout(() => setAddedToCart(false), 1500)
    },
    [user, inStock, addItem, product, images]
  )

  const handleWishlistToggle = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault()
      if (!user) { toast.info('Please sign in to save items'); return }
      await toggleItem(product.productId, user.id, product.name)
    },
    [user, toggleItem, product]
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <Link href={`/product/${product.productId}`} className="block product-card group">
        {/* Image */}
        <div className="relative overflow-hidden">
          <ImageCarousel
            urls={images}
            alt={product.name}
            aspectRatio="aspect-[4/3]"
          />

          {/* Wishlist */}
          <button
            onClick={handleWishlistToggle}
            className={`absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-surface/90 shadow transition-all duration-200 hover:bg-surface ${
              inWishlist ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}
            aria-label={inWishlist ? t('product.removeFromWishlist') : t('product.addToWishlist')}
          >
            <Heart
              className={`w-4 h-4 transition-colors duration-200 ${
                inWishlist ? 'fill-danger text-danger' : 'text-dark'
              }`}
            />
          </button>

          {/* Stock badge */}
          {!inStock && (
            <div className="absolute top-3 left-3 bg-dark/70 text-white text-[10px] font-medium px-2 py-0.5 font-sans tracking-wide">
              {t('product.outOfStock')}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          {/* Category */}
          <p className="text-[10px] text-muted font-sans tracking-widest uppercase mb-1">
            {product.categoryName}
          </p>

          {/* Name */}
          <h3 className="font-display text-lg font-light text-dark leading-snug mb-2 line-clamp-2 group-hover:text-secondary transition-colors duration-200">
            {product.name}
          </h3>

          {/* Price + CTA */}
          <div className="flex items-center justify-between gap-2 mt-3">
            <span className="font-sans text-base font-medium text-dark tabular-nums">
              {t('common.currency')}{product.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>

            <button
              onClick={handleAddToCart}
              disabled={!inStock || addedToCart}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium font-sans tracking-wide transition-all duration-200 ${
                addedToCart
                  ? 'bg-primary/20 text-primary cursor-default'
                  : inStock
                  ? 'bg-dark text-white hover:bg-secondary'
                  : 'bg-border text-muted cursor-not-allowed'
              }`}
            >
              {addedToCart ? (
                <><Check className="w-3.5 h-3.5" />{t('product.addedToCart')}</>
              ) : (
                <><ShoppingBag className="w-3.5 h-3.5" />{t('product.addToCart')}</>
              )}
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

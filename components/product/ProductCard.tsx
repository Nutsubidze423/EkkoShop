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
      className="h-full"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
    >
      <Link
        href={`/product/${product.productId}`}
        className="product-card group flex flex-col h-full"
        style={{ backgroundColor: '#F5F1E3' }}
      >
        {/* Image */}
        <div className="relative overflow-hidden shrink-0">
          <ImageCarousel
            urls={images}
            alt={product.name}
            aspectRatio="aspect-[4/3]"
            grayscale={true}
          />

          {/* Wishlist */}
          <button
            onClick={handleWishlistToggle}
            className={`absolute top-2 right-2 w-8 h-8 flex items-center justify-center transition-all duration-200 ${
              inWishlist ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}
            style={{ backgroundColor: inWishlist ? '#BC2C2C' : '#2C2C2C' }}
            aria-label={inWishlist ? t('product.removeFromWishlist') : t('product.addToWishlist')}
          >
            <Heart
              className="w-4 h-4"
              style={{ color: 'white', fill: inWishlist ? 'white' : 'none' }}
            />
          </button>

          {/* Out of stock badge */}
          {!inStock && (
            <div
              className="absolute top-2 left-2 font-sans font-black text-white text-[9px] uppercase px-2 py-1"
              style={{ backgroundColor: '#2C2C2C', letterSpacing: '0.1em' }}
            >
              {t('product.outOfStock')}
            </div>
          )}
        </div>

        {/* Info — flex-col flex-1 so price row always sits at the bottom */}
        <div className="flex flex-col flex-1 p-5">
          {/* Category */}
          <p
            className="font-sans font-black uppercase mb-1.5"
            style={{ fontSize: '10px', color: '#BC2C2C', letterSpacing: '0.12em' }}
          >
            {product.categoryName}
          </p>

          {/* Name — clamp to 2 lines so height is consistent */}
          <h3
            className="font-display font-black text-dark uppercase leading-tight mb-3 line-clamp-2 transition-colors duration-200 group-hover:text-[#BC2C2C]"
            style={{ fontSize: '14px', letterSpacing: '-0.02em' }}
          >
            {product.name}
          </h3>

          {/* Price + CTA pushed to bottom */}
          <div className="flex items-center justify-between gap-2 mt-auto pt-3 border-t" style={{ borderColor: '#E8E2D3' }}>
            <span
              className="font-display font-black text-dark tabular-nums"
              style={{ fontSize: '1.05rem', letterSpacing: '-0.02em' }}
            >
              {t('common.currency')}{product.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>

            <button
              onClick={handleAddToCart}
              disabled={!inStock || addedToCart}
              className="flex items-center gap-1.5 px-3 py-2 font-sans font-black text-[10px] uppercase transition-all duration-200"
              style={{
                letterSpacing: '0.08em',
                backgroundColor: addedToCart ? '#5DA4C9' : inStock ? '#2C2C2C' : '#C8C2B0',
                color: 'white',
                cursor: !inStock || addedToCart ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={(e) => {
                if (inStock && !addedToCart)
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#BC2C2C'
              }}
              onMouseLeave={(e) => {
                if (inStock && !addedToCart)
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#2C2C2C'
              }}
            >
              {addedToCart ? (
                <><Check className="w-3 h-3" />{t('product.addedToCart')}</>
              ) : (
                <><ShoppingBag className="w-3 h-3" />{t('product.addToCart')}</>
              )}
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

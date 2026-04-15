'use client'

import { X } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useTranslation } from '@/lib/i18n'
import type { CartItem as CartItemType } from '@/lib/types'

interface CartItemProps {
  item: CartItemType
  userId: number
}

export function CartItem({ item, userId }: CartItemProps) {
  const { removeItem } = useCartStore()
  const { t } = useTranslation()
  const image = item.imageUrls?.[0]

  return (
    <div className="flex gap-4 py-6 border-b border-border">
      {/* Image */}
      <div className="w-20 h-20 bg-background shrink-0 overflow-hidden">
        {image ? (
          <img src={image} alt={item.productName} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-border" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-sans tracking-widest uppercase text-muted mb-1">
          {item.productCategoryName}
        </p>
        <p className="font-display text-lg font-light text-dark leading-snug truncate">
          {item.productName}
        </p>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-4">
            <span className="text-sm font-sans text-muted">
              {t('product.qty')}: {item.amount}
            </span>
            <span className="font-sans text-sm font-medium text-dark tabular-nums">
              {t('common.currency')}{(item.price * item.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <button
            onClick={() => removeItem(item.productId, userId)}
            className="text-muted hover:text-danger transition-colors"
            aria-label={t('cart.remove')}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

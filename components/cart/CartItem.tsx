'use client'

import { Minus, Plus, X } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useTranslation } from '@/lib/i18n'
import type { CartItem as CartItemType } from '@/lib/types'

interface CartItemProps {
  item: CartItemType
  userId: number
}

export function CartItem({ item, userId }: CartItemProps) {
  const { removeItem, incrementItem, decrementItem } = useCartStore()
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
          {/* Qty stepper */}
          <div className="flex items-center gap-0">
            <button
              onClick={() => decrementItem(item.productId, userId)}
              className="w-7 h-7 border border-border flex items-center justify-center transition-colors"
              style={{ color: '#888' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#2C2C2C'
                ;(e.currentTarget as HTMLButtonElement).style.color = 'white'
                ;(e.currentTarget as HTMLButtonElement).style.borderColor = '#2C2C2C'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'
                ;(e.currentTarget as HTMLButtonElement).style.color = '#888'
                ;(e.currentTarget as HTMLButtonElement).style.borderColor = ''
              }}
              aria-label="Decrease quantity"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span
              className="w-8 h-7 flex items-center justify-center font-sans font-black tabular-nums border-y border-border"
              style={{ fontSize: '12px', color: '#2C2C2C' }}
            >
              {item.amount}
            </span>
            <button
              onClick={() => incrementItem(item.productId, userId)}
              className="w-7 h-7 border border-border flex items-center justify-center transition-colors"
              style={{ color: '#888' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#2C2C2C'
                ;(e.currentTarget as HTMLButtonElement).style.color = 'white'
                ;(e.currentTarget as HTMLButtonElement).style.borderColor = '#2C2C2C'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'
                ;(e.currentTarget as HTMLButtonElement).style.color = '#888'
                ;(e.currentTarget as HTMLButtonElement).style.borderColor = ''
              }}
              aria-label="Increase quantity"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-sans text-sm font-medium text-dark tabular-nums">
              {t('common.currency')}{(item.price * item.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
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
    </div>
  )
}

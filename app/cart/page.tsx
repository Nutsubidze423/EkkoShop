'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingBag, ArrowLeft } from 'lucide-react'
import { CartItem } from '@/components/cart/CartItem'
import { useCartStore } from '@/store/cartStore'
import { useRequireAuth } from '@/hooks/useAuth'
import { useTranslation } from '@/lib/i18n'

export default function CartPage() {
  const { user, hydrated } = useRequireAuth()
  const items = useCartStore((s) => s.items)
  const { t } = useTranslation()
  const [promo, setPromo] = useState('')

  if (!hydrated || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const subtotal = items.reduce((acc, i) => acc + i.price * i.amount, 0)

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-10">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted hover:text-dark font-sans transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          {t('common.back')}
        </Link>
        <h1 className="font-display text-4xl font-light text-dark tracking-wide">{t('cart.title')}</h1>
        <div className="mt-3 h-px w-16 bg-primary" />
      </div>

      {items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center justify-center py-24 text-center"
        >
          <div className="w-16 h-16 border border-border flex items-center justify-center mb-6">
            <ShoppingBag className="w-7 h-7 text-border" />
          </div>
          <p className="font-display text-2xl font-light text-dark mb-2">{t('cart.empty')}</p>
          <p className="text-sm font-sans text-muted mb-8">Discover our collection</p>
          <Link href="/" className="btn-primary">
            {t('cart.continueShopping')}
          </Link>
        </motion.div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Items */}
          <div className="lg:col-span-2">
            {items.map((item) => (
              <CartItem key={item.cartItemId || item.productId} item={item} userId={user.id} />
            ))}
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-sans text-muted hover:text-dark transition-colors mt-6">
              <ArrowLeft className="w-4 h-4" />
              {t('cart.continueShopping')}
            </Link>
          </div>

          {/* Summary */}
          <div>
            <div className="bg-surface border border-border p-6 sticky top-24">
              <h2 className="font-display text-xl font-light text-dark mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm font-sans">
                    <span className="text-secondary truncate mr-2">
                      {item.productName} <span className="text-muted">×{item.amount}</span>
                    </span>
                    <span className="text-dark tabular-nums shrink-0">
                      {t('common.currency')}{(item.price * item.amount).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 mb-6">
                <div className="flex justify-between font-sans">
                  <span className="text-sm text-secondary">{t('cart.subtotal')}</span>
                  <span className="text-sm font-medium text-dark tabular-nums">
                    {t('common.currency')}{subtotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Promo */}
              <div className="flex gap-2 mb-6">
                <input
                  type="text"
                  value={promo}
                  onChange={(e) => setPromo(e.target.value)}
                  placeholder={t('cart.promo')}
                  className="flex-1 border-b border-border bg-transparent text-sm text-dark placeholder-muted focus:outline-none focus:border-dark py-2 font-sans transition-colors"
                />
                <button className="text-xs font-sans font-medium text-dark border-b border-dark pb-2 hover:text-secondary transition-colors">
                  {t('cart.apply')}
                </button>
              </div>

              <div className="flex justify-between font-sans mb-6 pt-4 border-t border-border">
                <span className="font-medium text-dark">{t('cart.total')}</span>
                <span className="font-medium text-dark tabular-nums text-lg">
                  {t('common.currency')}{subtotal.toFixed(2)}
                </span>
              </div>

              <Link href="/checkout" className="btn-primary w-full py-4 text-sm tracking-widest uppercase">
                {t('cart.checkout')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

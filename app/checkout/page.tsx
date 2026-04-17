'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, ShoppingBag, Check } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useRequireAuth } from '@/hooks/useAuth'
import { useTranslation } from '@/lib/i18n'
import { toast } from '@/store/toastStore'

export default function CheckoutPage() {
  const { user, hydrated } = useRequireAuth()
  const { items, clear } = useCartStore()
  const { t } = useTranslation()
  const router = useRouter()
  const [placing, setPlacing] = useState(false)
  const [placed, setPlaced] = useState(false)

  if (!hydrated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F1E3' }}>
        <div
          className="w-6 h-6 border-2 rounded-full animate-spin"
          style={{ borderColor: '#BC2C2C', borderTopColor: 'transparent' }}
        />
      </div>
    )
  }

  const subtotal = items.reduce((acc, i) => acc + i.price * i.amount, 0)

  const handlePlaceOrder = async () => {
    setPlacing(true)
    await new Promise((r) => setTimeout(r, 800))
    setPlaced(true)
    clear()
    toast.success('Order placed successfully!')
    setTimeout(() => router.push('/'), 1500)
  }

  if (placed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: '#F5F1E3' }}>
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.35 }}
          className="flex flex-col items-center text-center px-6"
        >
          <div className="w-16 h-16 flex items-center justify-center mb-6" style={{ backgroundColor: '#BC2C2C' }}>
            <Check className="w-8 h-8 text-white" strokeWidth={3} />
          </div>
          <h1
            className="font-display font-black uppercase mb-3"
            style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 0.9, letterSpacing: '-0.04em', color: '#2C2C2C' }}
          >
            Order Placed
          </h1>
          <p className="font-sans text-sm" style={{ color: '#888' }}>Redirecting you home…</p>
        </motion.div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ backgroundColor: '#F5F1E3' }}>
        <ShoppingBag className="w-10 h-10" style={{ color: '#C8C2B0' }} />
        <p className="font-display font-black uppercase text-xl" style={{ color: '#2C2C2C', letterSpacing: '-0.02em' }}>
          Your cart is empty
        </p>
        <Link href="/" className="btn-primary">{t('cart.continueShopping')}</Link>
      </div>
    )
  }

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-10">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 font-sans transition-colors mb-6"
          style={{ fontSize: '12px', color: '#888' }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = '#2C2C2C')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = '#888')}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Cart
        </Link>
        <p
          className="font-sans font-black uppercase mb-3"
          style={{ fontSize: '10px', letterSpacing: '0.15em', color: '#BC2C2C' }}
        >
          Checkout
        </p>
        <h1
          className="font-display font-black uppercase"
          style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 0.9, letterSpacing: '-0.04em', color: '#2C2C2C' }}
        >
          Place Your Order
        </h1>
        <div className="mt-4 h-1.5 w-12" style={{ backgroundColor: '#BC2C2C' }} />
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Left — shipping + payment */}
        <div className="lg:col-span-2 space-y-10">
          <section>
            <h2
              className="font-display font-black uppercase mb-6 pb-3 border-b-2"
              style={{ fontSize: '0.85rem', letterSpacing: '0.06em', color: '#2C2C2C', borderColor: '#2C2C2C' }}
            >
              Shipping Information
            </h2>
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="input-floating">
                <input type="text" placeholder=" " defaultValue={`${user.firstName} ${user.lastName}`} />
                <label>Full Name</label>
              </div>
              <div className="input-floating">
                <input type="email" placeholder=" " defaultValue={user.email} />
                <label>Email</label>
              </div>
              <div className="input-floating sm:col-span-2">
                <input type="text" placeholder=" " />
                <label>Address</label>
              </div>
              <div className="input-floating">
                <input type="text" placeholder=" " />
                <label>City</label>
              </div>
              <div className="input-floating">
                <input type="tel" placeholder=" " />
                <label>Phone</label>
              </div>
            </div>
          </section>

          <section>
            <h2
              className="font-display font-black uppercase mb-6 pb-3 border-b-2"
              style={{ fontSize: '0.85rem', letterSpacing: '0.06em', color: '#2C2C2C', borderColor: '#2C2C2C' }}
            >
              Payment Method
            </h2>
            <div
              className="flex items-start gap-4 p-4 border-2"
              style={{ borderColor: '#BC2C2C', backgroundColor: 'rgba(188,44,44,0.04)' }}
            >
              <div
                className="w-4 h-4 border-2 flex items-center justify-center shrink-0 mt-0.5"
                style={{ borderColor: '#BC2C2C', backgroundColor: '#BC2C2C' }}
              >
                <svg viewBox="0 0 10 8" className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M1 4l3 3 5-6" />
                </svg>
              </div>
              <div>
                <p className="font-display font-black uppercase text-xs" style={{ color: '#2C2C2C', letterSpacing: '0.04em' }}>
                  Cash on Delivery
                </p>
                <p className="font-sans text-[10px] mt-1" style={{ color: '#888', lineHeight: 1.5 }}>
                  Pay when your order arrives. Additional payment methods coming soon.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Right — order summary */}
        <div>
          <div className="sticky top-24 border-2 p-6" style={{ borderColor: '#2C2C2C' }}>
            <h2
              className="font-display font-black uppercase mb-5 pb-3 border-b-2"
              style={{ fontSize: '0.85rem', letterSpacing: '0.06em', color: '#2C2C2C', borderColor: '#2C2C2C' }}
            >
              Order Summary
            </h2>

            <div className="space-y-3 mb-5">
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between text-sm font-sans">
                  <span className="truncate mr-2" style={{ color: '#666' }}>
                    {item.productName}
                    <span className="ml-1" style={{ color: '#999' }}>×{item.amount}</span>
                  </span>
                  <span className="tabular-nums shrink-0 font-medium" style={{ color: '#2C2C2C' }}>
                    {t('common.currency')}{(item.price * item.amount).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 mb-5 border-t-2" style={{ borderColor: '#2C2C2C' }}>
              <div className="flex justify-between">
                <span className="font-sans font-black text-xs uppercase" style={{ letterSpacing: '0.1em', color: '#2C2C2C' }}>
                  Total
                </span>
                <span className="font-display font-black text-xl tabular-nums" style={{ color: '#2C2C2C' }}>
                  {t('common.currency')}{subtotal.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={placing}
              className="btn-primary w-full py-4"
            >
              {placing ? 'Placing Order…' : 'Place Order →'}
            </button>

            <p className="text-center font-sans mt-3" style={{ fontSize: '10px', color: '#C8C2B0' }}>
              Placeholder — no real payment processed
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

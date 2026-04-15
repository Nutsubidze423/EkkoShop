'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Heart, ShoppingBag, Search, ChevronDown, User, Settings, LogOut, X } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { useTranslation } from '@/lib/i18n'
import { getAllProducts } from '@/lib/api/products'
import type { Product } from '@/lib/types'
import { useDebounce } from '@/hooks/useDebounce'

export function Header() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const cartCount = useCartStore((s) => s.count)
  const wishlistCount = useWishlistStore((s) => s.count)
  const { t, lang, setLang } = useTranslation()

  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [searchOpen, setSearchOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const debouncedSearch = useDebounce(searchQuery, 350)

  const searchRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!debouncedSearch.trim()) { setSearchResults([]); return }
    getAllProducts({ Search: debouncedSearch, Page: 1, PageSize: 6 })
      .then((res) => setSearchResults(res.value.items))
      .catch(() => setSearchResults([]))
  }, [debouncedSearch])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    setSearchOpen(false)
    setSearchQuery('')
    router.push(`/?search=${encodeURIComponent(searchQuery)}`)
  }

  const handleResultClick = (productId: number) => {
    setSearchOpen(false)
    setSearchQuery('')
    router.push(`/product/${productId}`)
  }

  const handleLogout = () => {
    logout()
    useCartStore.getState().clear()
    useWishlistStore.getState().clear()
    setUserMenuOpen(false)
    router.push('/')
  }

  return (
    <header className="sticky top-0 z-40" style={{ backgroundColor: '#BC2C2C' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center h-14 gap-4">
        {/* Logo */}
        <Link href="/" className="shrink-0 mr-4">
          <span
            className="font-display font-black text-white uppercase tracking-tight"
            style={{ fontSize: '1.25rem', letterSpacing: '-0.03em' }}
          >
            EKKO
          </span>
          <span
            className="font-sans font-semibold text-white/60 ml-1 uppercase"
            style={{ fontSize: '10px', letterSpacing: '0.15em' }}
          >
            SHOP
          </span>
        </Link>

        {/* Search */}
        <div ref={searchRef} className="flex-1 max-w-md relative">
          <form onSubmit={handleSearchSubmit}>
            <div className="flex items-center gap-2 border-b border-white/30 focus-within:border-white transition-colors duration-200 pb-1">
              <Search className="w-3.5 h-3.5 text-white/60 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true) }}
                onFocus={() => searchQuery && setSearchOpen(true)}
                placeholder={t('nav.search')}
                className="flex-1 bg-transparent text-xs text-white placeholder-white/40 outline-none font-sans py-0.5 uppercase"
                style={{ letterSpacing: '0.05em' }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => { setSearchQuery(''); setSearchResults([]) }}
                  className="text-white/60 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </form>

          {searchOpen && searchResults.length > 0 && (
            <div
              className="absolute top-full left-0 right-0 mt-1 z-50 animate-slide-down border-2"
              style={{ backgroundColor: '#2C2C2C', borderColor: '#2C2C2C' }}
            >
              {searchResults.map((p) => (
                <button
                  key={p.productId}
                  onClick={() => handleResultClick(p.productId)}
                  className="w-full flex items-center gap-3 px-4 py-3 transition-colors duration-150 text-left"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#BC2C2C')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  {p.imageUrl?.[0] ? (
                    <img src={p.imageUrl[0]} alt={p.name} className="w-8 h-8 object-cover shrink-0" style={{ filter: 'grayscale(100%)' }} />
                  ) : (
                    <div className="w-8 h-8 shrink-0" style={{ backgroundColor: '#444' }} />
                  )}
                  <div className="min-w-0">
                    <p className="text-xs text-white truncate font-sans uppercase font-medium" style={{ letterSpacing: '0.05em' }}>{p.name}</p>
                    <p className="text-[10px] font-sans" style={{ color: '#FCD758' }}>
                      {t('common.currency')}{p.price.toFixed(2)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1 ml-auto shrink-0">
          {/* Lang toggle */}
          <button
            onClick={() => setLang(lang === 'en' ? 'ka' : 'en')}
            className="inline-flex items-center justify-center w-8 h-8 text-white/70 hover:text-white hover:bg-white/10 transition-all duration-150"
            style={{ fontSize: '10px', fontFamily: 'var(--font-sans)', fontWeight: 700, letterSpacing: '0.1em' }}
            aria-label="Toggle language"
          >
            {lang === 'en' ? 'KA' : 'EN'}
          </button>

          {/* Wishlist */}
          <Link href="/wishlist" className="relative inline-flex items-center justify-center w-10 h-10 text-white/80 hover:text-white hover:bg-white/10 transition-all duration-150" aria-label={t('nav.wishlist')}>
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="badge-count" style={{ fontFamily: 'var(--font-sans)' }}>
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link href="/cart" className="relative inline-flex items-center justify-center w-10 h-10 text-white/80 hover:text-white hover:bg-white/10 transition-all duration-150" aria-label={t('nav.cart')}>
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="badge-count" style={{ fontFamily: 'var(--font-sans)' }}>
                {cartCount}
              </span>
            )}
          </Link>

          {/* Auth */}
          {user ? (
            <div ref={userMenuRef} className="relative">
              <button
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex items-center gap-1.5 ml-1 pl-3 h-8"
                style={{ borderLeft: '1px solid rgba(255,255,255,0.2)' }}
              >
                <div
                  className="w-7 h-7 flex items-center justify-center"
                  style={{ backgroundColor: '#2C2C2C' }}
                >
                  <span className="text-[10px] font-black text-white font-display">
                    {user.firstName[0]}{user.lastName[0]}
                  </span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-white/60 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {userMenuOpen && (
                <div
                  className="absolute right-0 top-full mt-0 w-56 z-50 animate-slide-down border-2"
                  style={{ backgroundColor: '#2C2C2C', borderColor: '#2C2C2C' }}
                >
                  <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
                    <p className="text-xs font-semibold text-white font-sans uppercase" style={{ letterSpacing: '0.05em' }}>
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-[10px] font-sans truncate" style={{ color: 'rgba(255,255,255,0.5)' }}>{user.email}</p>
                    <span
                      className="inline-block mt-1 text-[9px] px-2 py-0.5 font-black font-sans uppercase"
                      style={{ backgroundColor: '#BC2C2C', color: 'white', letterSpacing: '0.1em' }}
                    >
                      {user.role}
                    </span>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/account"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-xs text-white font-sans uppercase transition-colors"
                      style={{ letterSpacing: '0.05em' }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#BC2C2C')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <User className="w-3.5 h-3.5 opacity-60" />
                      {t('nav.account')}
                    </Link>
                    {user.role === 'Admin' && (
                      <Link
                        href="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-xs text-white font-sans uppercase transition-colors"
                        style={{ letterSpacing: '0.05em' }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#BC2C2C')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <Settings className="w-3.5 h-3.5 opacity-60" />
                        {t('nav.admin')}
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-2.5 text-xs font-sans uppercase w-full text-left transition-colors"
                      style={{ color: '#FCD758', letterSpacing: '0.05em' }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#BC2C2C')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      {t('nav.logout')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1 ml-1 pl-3" style={{ borderLeft: '1px solid rgba(255,255,255,0.2)' }}>
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center px-4 py-1.5 text-[10px] font-black font-sans uppercase tracking-widest transition-all duration-200"
                style={{ backgroundColor: '#2C2C2C', color: 'white', letterSpacing: '0.1em' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FCD758')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2C2C2C')}
              >
                {t('nav.login')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

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

  const [scrolled, setScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [searchOpen, setSearchOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const debouncedSearch = useDebounce(searchQuery, 350)

  const searchRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Live search
  useEffect(() => {
    if (!debouncedSearch.trim()) { setSearchResults([]); return }
    getAllProducts({ Search: debouncedSearch, Page: 1, PageSize: 6 })
      .then((res) => setSearchResults(res.value.items))
      .catch(() => setSearchResults([]))
  }, [debouncedSearch])

  // Close dropdowns on outside click
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
    <header
      className={`sticky top-0 z-40 bg-surface transition-shadow duration-300 ${
        scrolled ? 'shadow-[0_1px_12px_rgba(59,68,61,0.08)]' : 'border-b border-border'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center h-16 gap-4">
        {/* Logo */}
        <Link href="/" className="shrink-0 mr-2">
          <span className="font-display text-2xl font-light tracking-[0.12em] text-dark">
            EKKO
          </span>
          <span className="font-sans text-xs tracking-[0.25em] text-muted ml-1 uppercase">
            shop
          </span>
        </Link>

        {/* Search */}
        <div ref={searchRef} className="flex-1 max-w-lg relative">
          <form onSubmit={handleSearchSubmit}>
            <div className="flex items-center gap-2 border-b border-border focus-within:border-dark transition-colors duration-200 pb-1">
              <Search className="w-4 h-4 text-muted shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true) }}
                onFocus={() => searchQuery && setSearchOpen(true)}
                placeholder={t('nav.search')}
                className="flex-1 bg-transparent text-sm text-dark placeholder-muted outline-none font-sans py-0.5"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => { setSearchQuery(''); setSearchResults([]) }}
                  className="text-muted hover:text-dark"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </form>

          {/* Search dropdown */}
          {searchOpen && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border shadow-modal z-50 animate-slide-down">
              {searchResults.map((p) => (
                <button
                  key={p.productId}
                  onClick={() => handleResultClick(p.productId)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-background transition-colors duration-150 text-left"
                >
                  {p.imageUrl?.[0] ? (
                    <img src={p.imageUrl[0]} alt={p.name} className="w-8 h-8 object-cover shrink-0" />
                  ) : (
                    <div className="w-8 h-8 bg-border shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm text-dark truncate font-sans">{p.name}</p>
                    <p className="text-xs text-muted font-sans">
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
            className="btn-icon text-xs font-medium font-sans tracking-wide w-8 h-8"
            aria-label="Toggle language"
          >
            {lang === 'en' ? 'KA' : 'EN'}
          </button>

          {/* Wishlist */}
          <Link href="/wishlist" className="relative btn-icon" aria-label={t('nav.wishlist')}>
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && <span className="badge-count">{wishlistCount}</span>}
          </Link>

          {/* Cart */}
          <Link href="/cart" className="relative btn-icon" aria-label={t('nav.cart')}>
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && <span className="badge-count">{cartCount}</span>}
          </Link>

          {/* Auth */}
          {user ? (
            <div ref={userMenuRef} className="relative">
              <button
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex items-center gap-1.5 ml-1 pl-3 border-l border-border h-8"
              >
                <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-xs font-semibold text-primary font-sans">
                    {user.firstName[0]}{user.lastName[0]}
                  </span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-muted transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-surface border border-border shadow-modal z-50 animate-slide-down">
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-sm font-medium text-dark font-sans">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-muted font-sans truncate">{user.email}</p>
                    <span className="inline-block mt-1 text-[10px] px-2 py-0.5 bg-primary/10 text-primary font-medium font-sans tracking-wide">
                      {user.role}
                    </span>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/account"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-dark hover:bg-background transition-colors font-sans"
                    >
                      <User className="w-4 h-4 text-muted" />
                      {t('nav.account')}
                    </Link>
                    {user.role === 'Admin' && (
                      <Link
                        href="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-dark hover:bg-background transition-colors font-sans"
                      >
                        <Settings className="w-4 h-4 text-muted" />
                        {t('nav.admin')}
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-danger hover:bg-background transition-colors w-full text-left font-sans"
                    >
                      <LogOut className="w-4 h-4" />
                      {t('nav.logout')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1 ml-1 pl-3 border-l border-border">
              <Link href="/auth/login" className="btn-secondary py-1.5 px-4 text-xs">
                {t('nav.login')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

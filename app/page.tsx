'use client'

import { useState, useEffect, useCallback, Suspense, useRef } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ProductFilters, type FilterState } from '@/components/product/ProductFilters'
import { ProductGrid } from '@/components/product/ProductGrid'
import { getAllProducts } from '@/lib/api/products'
import { getDescendantIds } from '@/lib/categories'
import { useTranslation } from '@/lib/i18n'
import { useDebounce } from '@/hooks/useDebounce'
import { useAuthStore } from '@/store/authStore'
import type { Product } from '@/lib/types'

const PAGE_SIZE = 20

const FEATURED_CATEGORIES = [
  { id: 4, label: 'Gaming PCs & Laptops', sub: 'Desktops & Laptops' },
  { id: 2, label: 'PC Hardware', sub: 'CPU, GPU & More' },
  { id: 1, label: 'Consoles', sub: 'Gamepads & Controllers' },
  { id: 3, label: 'Peripherals', sub: 'Monitors, Keyboards & Mice' },
]

const TICKER_ITEMS = [
  'GAMING PCs', 'PC HARDWARE', 'CONSOLES', 'PERIPHERALS',
  'SERVICES', 'GPU', 'CPU', 'LAPTOPS', 'MONITORS', 'KEYBOARDS',
  'GAMING PCs', 'PC HARDWARE', 'CONSOLES', 'PERIPHERALS',
  'SERVICES', 'GPU', 'CPU', 'LAPTOPS', 'MONITORS', 'KEYBOARDS',
]

function BrandTicker() {
  return (
    <div
      className="overflow-hidden border-y-2"
      style={{ backgroundColor: '#5DA4C9', borderColor: '#2C2C2C' }}
    >
      <div className="flex items-center py-3.5 animate-marquee" style={{ width: 'max-content' }}>
        {TICKER_ITEMS.map((item, i) => (
          <span
            key={i}
            className="font-display font-black text-white uppercase whitespace-nowrap"
            style={{ fontSize: '15px', letterSpacing: '0.2em', padding: '0 2.5rem' }}
          >
            {item}
            <span style={{ marginLeft: '2.5rem', opacity: 0.3 }}>·</span>
          </span>
        ))}
      </div>
    </div>
  )
}

function HeroSection({ onShopNow, onCategoryClick }: { onShopNow: () => void; onCategoryClick: (id: number) => void }) {
  const { user, hydrated } = useAuthStore()
  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: '#BC2C2C' }}>
      {/* Watermark */}
      <div
        className="absolute bottom-0 right-0 font-display font-black text-white uppercase pointer-events-none select-none"
        style={{
          fontSize: '28vw',
          opacity: 0.07,
          lineHeight: 0.8,
          letterSpacing: '-0.05em',
          transform: 'translateX(5%)',
        }}
      >
        EKKO
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-32 lg:py-40 flex flex-col lg:flex-row items-start lg:items-center gap-12 lg:gap-20">
        {/* Left — text */}
        <div className="flex-1 max-w-xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="font-sans font-semibold text-white/50 uppercase mb-5"
            style={{ fontSize: '10px', letterSpacing: '0.3em' }}
          >
            Premium Tech Store
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="font-display font-black text-white uppercase"
            style={{
              fontSize: 'clamp(3.5rem, 9vw, 7rem)',
              lineHeight: 0.85,
              letterSpacing: '-0.05em',
            }}
          >
            TECH<br />BUILT<br />
            <span style={{ color: '#FCD758' }}>TO LAST.</span>
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="h-2 w-20 origin-left mt-6 mb-6"
            style={{ backgroundColor: '#FCD758' }}
          />

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="font-sans text-base max-w-sm mb-10"
            style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.7 }}
          >
            Curated laptops, components, and peripherals — selected for quality, priced for value.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.45 }}
            className="flex items-center gap-5"
          >
            <button
              onClick={onShopNow}
              className="font-sans font-black text-white uppercase transition-all duration-200 active:scale-[0.97]"
              style={{
                backgroundColor: '#2C2C2C',
                padding: '14px 32px',
                fontSize: '11px',
                letterSpacing: '0.12em',
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = '#FCD758')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = '#2C2C2C')}
            >
              SHOP NOW →
            </button>
            {hydrated && !user && (
              <Link
                href="/auth/login"
                className="font-sans font-semibold uppercase transition-colors duration-200"
                style={{ fontSize: '10px', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.55)' }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = 'white')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.55)')}
              >
                SIGN IN
              </Link>
            )}
          </motion.div>
        </div>

        {/* Right — editorial offset card */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="hidden lg:block relative shrink-0"
          style={{ width: '340px', height: '340px' }}
        >
          {/* Shadow offset */}
          <div
            className="absolute inset-0 border-2"
            style={{
              borderColor: '#2C2C2C',
              transform: 'translate(16px, 16px)',
            }}
          />
          {/* Main card */}
          <div
            className="relative z-10 w-full h-full flex flex-col justify-end p-6 overflow-hidden"
            style={{ backgroundColor: '#5DA4C9' }}
          >
            {/* Watermark inside card */}
            <div
              className="absolute inset-0 flex items-center justify-center font-display font-black text-white uppercase pointer-events-none select-none"
              style={{ fontSize: '6rem', opacity: 0.1, letterSpacing: '-0.05em' }}
            >
              SHOP
            </div>
            {/* Category grid */}
            <div className="relative z-10 grid grid-cols-2 gap-2">
              {FEATURED_CATEGORIES.slice(0, 4).map((cat, i) => (
                <motion.button
                  key={cat.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + i * 0.06 }}
                  onClick={() => onCategoryClick(cat.id)}
                  className="text-left p-3 transition-all duration-200"
                  style={{ border: '1px solid rgba(255,255,255,0.3)' }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = 'white'
                    ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(255,255,255,0.15)'
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.3)'
                    ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'
                  }}
                >
                  <p className="font-display font-black text-white uppercase text-xs leading-tight" style={{ letterSpacing: '-0.02em' }}>
                    {cat.label}
                  </p>
                  <p className="font-sans text-[9px] uppercase mt-0.5 tracking-wide" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    {cat.sub}
                  </p>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function CatalogContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const { t } = useTranslation()
  const catalogRef = useRef<HTMLDivElement>(null)

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  const [filters, setFilters] = useState<FilterState>({
    search: searchParams.get('search') ?? '',
    categoryId: searchParams.get('categoryId') ? parseInt(searchParams.get('categoryId')!) : undefined,
    minPrice: searchParams.get('minPrice') ?? '',
    maxPrice: searchParams.get('maxPrice') ?? '',
    available: searchParams.get('available') === '1',
  })

  const debouncedSearch = useDebounce(filters.search, 400)
  const debouncedMin = useDebounce(filters.minPrice, 500)
  const debouncedMax = useDebounce(filters.maxPrice, 500)

  const fetchProducts = useCallback(async (p: number) => {
    setLoading(true)
    try {
      const expandedCategory = filters.categoryId !== undefined
        ? (() => { const ids = getDescendantIds(filters.categoryId); return ids.length === 1 ? ids[0] : ids })()
        : undefined
      const res = await getAllProducts({
        Search: debouncedSearch || undefined,
        CategoryId: expandedCategory,
        MinPrice: debouncedMin ? parseFloat(debouncedMin) : undefined,
        MaxPrice: debouncedMax ? parseFloat(debouncedMax) : undefined,
        Available: filters.available || undefined,
        Page: p,
        PageSize: PAGE_SIZE,
      })
      setProducts(res.value.items)
      setTotalPages(res.value.totalPages)
      setTotalCount(res.value.totalCount)
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch, filters.categoryId, debouncedMin, debouncedMax, filters.available])

  useEffect(() => {
    setPage(1)
    fetchProducts(1)
  }, [fetchProducts])

  const handlePageChange = (p: number) => {
    setPage(p)
    fetchProducts(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    const params = new URLSearchParams()
    if (filters.search) params.set('search', filters.search)
    if (filters.categoryId !== undefined) params.set('categoryId', String(filters.categoryId))
    if (filters.minPrice) params.set('minPrice', filters.minPrice)
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice)
    if (filters.available) params.set('available', '1')
    const qs = params.toString()
    router.replace(`${pathname}${qs ? '?' + qs : ''}`, { scroll: false })
  }, [filters, pathname, router])

  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleCategoryClick = (id: number) => {
    setFilters((f) => ({ ...f, categoryId: id }))
    setPage(1)
    scrollToCatalog()
  }

  return (
    <>
      <HeroSection onShopNow={scrollToCatalog} onCategoryClick={handleCategoryClick} />
      <BrandTicker />

      <main ref={catalogRef} className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Catalog heading */}
        <div className="mb-10">
          <p
            className="font-sans font-black uppercase mb-3"
            style={{ fontSize: '10px', letterSpacing: '0.15em', color: '#BC2C2C' }}
          >
            Browse All
          </p>
          <h2
            className="font-display font-black text-dark uppercase"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', lineHeight: 0.85, letterSpacing: '-0.05em' }}
          >
            {t('catalog.title')}
          </h2>
          <div className="mt-4 h-1.5 w-16" style={{ backgroundColor: '#BC2C2C' }} />
        </div>

        <div className="flex gap-10">
          <ProductFilters filters={filters} onChange={setFilters} total={totalCount} />
          <div className="flex-1 min-w-0">
            <ProductGrid
              products={products}
              loading={loading}
              page={page}
              totalPages={totalPages}
              totalCount={totalCount}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </main>
    </>
  )
}

export default function CatalogPage() {
  return (
    <Suspense>
      <CatalogContent />
    </Suspense>
  )
}

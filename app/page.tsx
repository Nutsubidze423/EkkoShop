'use client'

import { useState, useEffect, useCallback, Suspense, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowDown, ArrowRight } from 'lucide-react'
import { ProductFilters, type FilterState } from '@/components/product/ProductFilters'
import { ProductGrid } from '@/components/product/ProductGrid'
import { getAllProducts } from '@/lib/api/products'
import { useTranslation } from '@/lib/i18n'
import { useDebounce } from '@/hooks/useDebounce'
import type { Product } from '@/lib/types'

const PAGE_SIZE = 20

const FEATURED_CATEGORIES = [
  { id: 100, label: 'Laptops', sub: 'Ultrabooks & Gaming' },
  { id: 200, label: 'Components', sub: 'CPU, GPU & More' },
  { id: 400, label: 'Gaming', sub: 'Consoles & Gear' },
  { id: 600, label: 'Monitors', sub: 'Gaming & Office' },
  { id: 300, label: 'Accessories', sub: 'Keyboards, Mice & Audio' },
  { id: 500, label: 'Storage', sub: 'SSD, HDD & Flash' },
]

function HeroSection({ onShopNow }: { onShopNow: () => void }) {
  return (
    <section className="relative overflow-hidden bg-surface border-b border-border">
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#3b443d 1px, transparent 1px), linear-gradient(90deg, #3b443d 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Accent blobs */}
      <div
        className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-[0.06]"
        style={{ background: 'radial-gradient(circle, #94afe6 0%, transparent 70%)' }}
      />
      <div
        className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full opacity-[0.04]"
        style={{ background: 'radial-gradient(circle, #617291 0%, transparent 70%)' }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-28 sm:py-40 flex flex-col lg:flex-row items-start lg:items-center gap-16 lg:gap-20">
        {/* Left — text */}
        <div className="flex-1 max-w-xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-[10px] font-sans tracking-[0.3em] uppercase text-muted mb-6"
          >
            Premium Tech Store
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.25, 0.1, 0.25, 1] }}
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-light text-dark leading-[1.05] tracking-wide mb-6"
          >
            Engineered
            <br />
            <span className="italic text-secondary">to Perform.</span>
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="h-px w-16 bg-primary origin-left mb-6"
          />

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-base font-sans text-secondary leading-relaxed mb-10 max-w-sm"
          >
            Curated laptops, components, and peripherals — selected for quality, priced for value.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex items-center gap-4"
          >
            <button
              onClick={onShopNow}
              className="btn-primary px-8 py-3.5 text-sm tracking-widest uppercase flex items-center gap-2"
            >
              Shop Now
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
            <Link
              href="/auth/login"
              className="text-sm font-sans text-secondary hover:text-dark transition-colors flex items-center gap-1.5"
            >
              Sign in
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        </div>

        {/* Right — category grid */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="hidden lg:grid grid-cols-2 gap-2 shrink-0 w-72"
        >
          {FEATURED_CATEGORIES.map((cat, i) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.06, ease: [0.25, 0.1, 0.25, 1] }}
              onClick={onShopNow}
              className="group text-left p-4 border border-border bg-background hover:border-primary hover:bg-primary/5 transition-all duration-200"
            >
              <p className="text-sm font-display font-light text-dark group-hover:text-primary transition-colors leading-tight">
                {cat.label}
              </p>
              <p className="text-[10px] font-sans text-muted mt-0.5 tracking-wide">
                {cat.sub}
              </p>
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 cursor-pointer"
        onClick={onShopNow}
      >
        <span className="text-[9px] font-sans tracking-[0.25em] uppercase text-muted">Scroll</span>
        <motion.div
          animate={{ y: [0, 4, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        >
          <ArrowDown className="w-3.5 h-3.5 text-muted" />
        </motion.div>
      </motion.div>
    </section>
  )
}

function CatalogContent() {
  const searchParams = useSearchParams()
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
    minPrice: '',
    maxPrice: '',
    available: false,
  })

  const debouncedSearch = useDebounce(filters.search, 400)
  const debouncedMin = useDebounce(filters.minPrice, 500)
  const debouncedMax = useDebounce(filters.maxPrice, 500)

  const fetchProducts = useCallback(async (p: number) => {
    setLoading(true)
    try {
      const res = await getAllProducts({
        Search: debouncedSearch || undefined,
        CategoryId: filters.categoryId,
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

  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <HeroSection onShopNow={scrollToCatalog} />

      <main ref={catalogRef} className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-10">
          <h2 className="font-display text-4xl sm:text-5xl font-light text-dark tracking-wide">
            {t('catalog.title')}
          </h2>
          <div className="mt-3 h-px w-16 bg-primary" />
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

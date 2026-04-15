'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ProductCard } from './ProductCard'
import { ProductGridSkeleton } from '@/components/ui/Skeleton'
import { useTranslation } from '@/lib/i18n'
import type { Product } from '@/lib/types'

interface ProductGridProps {
  products: Product[]
  loading: boolean
  page: number
  totalPages: number
  totalCount: number
  onPageChange: (page: number) => void
}

export function ProductGrid({
  products,
  loading,
  page,
  totalPages,
  totalCount,
  onPageChange,
}: ProductGridProps) {
  const { t } = useTranslation()

  if (loading) return <ProductGridSkeleton count={8} />

  if (!loading && products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 border border-border flex items-center justify-center mb-6">
          <span className="font-display text-3xl text-border">∅</span>
        </div>
        <p className="font-display text-2xl font-light text-dark mb-2">{t('catalog.noResults')}</p>
        <p className="text-sm text-muted font-sans">Try adjusting your filters</p>
      </div>
    )
  }

  return (
    <div>
      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-px bg-border">
        {products.map((product, i) => (
          <div key={product.productId} className="bg-background">
            <ProductCard product={product} index={i} />
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
          <p className="text-xs text-muted font-sans">
            {t('catalog.showing')} {(page - 1) * 20 + 1}–{Math.min(page * 20, totalCount)}{' '}
            {t('catalog.of')} {totalCount} {t('catalog.products')}
          </p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="btn-icon disabled:opacity-30"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: Math.min(totalPages, 7) }).map((_, i) => {
              const p = i + 1
              return (
                <button
                  key={p}
                  onClick={() => onPageChange(p)}
                  className={`w-8 h-8 text-sm font-sans transition-colors duration-150 ${
                    p === page
                      ? 'bg-dark text-white'
                      : 'text-secondary hover:bg-border hover:text-dark'
                  }`}
                >
                  {p}
                </button>
              )
            })}

            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="btn-icon disabled:opacity-30"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

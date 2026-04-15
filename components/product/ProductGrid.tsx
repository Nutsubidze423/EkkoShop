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
        <div
          className="w-16 h-16 flex items-center justify-center mb-6 border-2"
          style={{ borderColor: '#2C2C2C' }}
        >
          <span className="font-display font-black text-3xl text-dark">∅</span>
        </div>
        <p
          className="font-display font-black text-dark uppercase mb-2"
          style={{ fontSize: '1.5rem', letterSpacing: '-0.03em' }}
        >
          {t('catalog.noResults')}
        </p>
        <p
          className="font-sans text-sm uppercase"
          style={{ color: '#888', letterSpacing: '0.05em' }}
        >
          Try adjusting your filters
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Grid — cards with their own borders, proper gap, no background-color trick */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {products.map((product, i) => (
          <ProductCard key={product.productId} product={product} index={i} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          className="flex items-center justify-between mt-10 pt-6 border-t-2"
          style={{ borderColor: '#2C2C2C' }}
        >
          <p
            className="font-sans uppercase"
            style={{ fontSize: '10px', color: '#888', letterSpacing: '0.08em' }}
          >
            {t('catalog.showing')} {(page - 1) * 20 + 1}–{Math.min(page * 20, totalCount)}{' '}
            {t('catalog.of')} {totalCount} {t('catalog.products')}
          </p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="inline-flex items-center justify-center w-9 h-9 transition-all duration-150 disabled:opacity-30"
              style={{ border: '2px solid #2C2C2C', color: '#2C2C2C' }}
              onMouseEnter={(e) => {
                if (page > 1) {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#2C2C2C'
                  ;(e.currentTarget as HTMLButtonElement).style.color = 'white'
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'
                ;(e.currentTarget as HTMLButtonElement).style.color = '#2C2C2C'
              }}
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
                  className="w-9 h-9 font-sans font-black text-xs uppercase transition-all duration-150"
                  style={{
                    border: '2px solid #2C2C2C',
                    backgroundColor: p === page ? '#2C2C2C' : 'transparent',
                    color: p === page ? 'white' : '#2C2C2C',
                    letterSpacing: '0.05em',
                  }}
                  onMouseEnter={(e) => {
                    if (p !== page) {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#BC2C2C'
                      ;(e.currentTarget as HTMLButtonElement).style.borderColor = '#BC2C2C'
                      ;(e.currentTarget as HTMLButtonElement).style.color = 'white'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (p !== page) {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'
                      ;(e.currentTarget as HTMLButtonElement).style.borderColor = '#2C2C2C'
                      ;(e.currentTarget as HTMLButtonElement).style.color = '#2C2C2C'
                    }
                  }}
                >
                  {p}
                </button>
              )
            })}

            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="inline-flex items-center justify-center w-9 h-9 transition-all duration-150 disabled:opacity-30"
              style={{ border: '2px solid #2C2C2C', color: '#2C2C2C' }}
              onMouseEnter={(e) => {
                if (page < totalPages) {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#2C2C2C'
                  ;(e.currentTarget as HTMLButtonElement).style.color = 'white'
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'
                ;(e.currentTarget as HTMLButtonElement).style.color = '#2C2C2C'
              }}
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

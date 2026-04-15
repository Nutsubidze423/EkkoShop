'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, X, SlidersHorizontal } from 'lucide-react'
import { getParents, getChildren } from '@/lib/categories'
import { useTranslation } from '@/lib/i18n'

export interface FilterState {
  search: string
  categoryId: number | undefined
  minPrice: string
  maxPrice: string
  available: boolean
}

interface ProductFiltersProps {
  filters: FilterState
  onChange: (f: FilterState) => void
  total: number
}

export function ProductFilters({ filters, onChange, total }: ProductFiltersProps) {
  const { t } = useTranslation()
  const [expandedParent, setExpandedParent] = useState<number | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  const parents = getParents()

  const set = (partial: Partial<FilterState>) => onChange({ ...filters, ...partial })

  const clearAll = () =>
    onChange({ search: '', categoryId: undefined, minPrice: '', maxPrice: '', available: false })

  const hasFilters =
    filters.search || filters.categoryId || filters.minPrice || filters.maxPrice || filters.available

  const FiltersContent = () => (
    <div className="space-y-6">
      {/* Clear */}
      {hasFilters && (
        <button
          onClick={clearAll}
          className="flex items-center gap-1.5 text-xs text-danger font-sans hover:text-danger-dark transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          {t('catalog.clear')}
        </button>
      )}

      {/* Category */}
      <div>
        <p className="text-[10px] font-sans font-medium tracking-widest uppercase text-muted mb-3">
          {t('catalog.category')}
        </p>
        <div className="space-y-0.5">
          <button
            onClick={() => set({ categoryId: undefined })}
            className={`w-full text-left text-sm font-sans px-0 py-1 transition-colors ${
              !filters.categoryId ? 'text-dark font-medium' : 'text-secondary hover:text-dark'
            }`}
          >
            All
          </button>
          {parents.map((parent) => {
            const children = getChildren(parent.id)
            const isExpanded = expandedParent === parent.id
            const isActive = filters.categoryId === parent.id ||
              children.some((c) => c.id === filters.categoryId)

            return (
              <div key={parent.id}>
                <button
                  onClick={() => {
                    setExpandedParent(isExpanded ? null : parent.id)
                    set({ categoryId: isActive ? undefined : parent.id })
                  }}
                  className={`w-full flex items-center justify-between text-sm font-sans py-1.5 transition-colors ${
                    isActive ? 'text-dark font-medium' : 'text-secondary hover:text-dark'
                  }`}
                >
                  <span>{parent.name}</span>
                  {children.length > 0 && (
                    isExpanded
                      ? <ChevronDown className="w-3.5 h-3.5 text-muted" />
                      : <ChevronRight className="w-3.5 h-3.5 text-muted" />
                  )}
                </button>
                {isExpanded && children.length > 0 && (
                  <div className="pl-3 border-l border-border ml-1 space-y-0.5 mt-0.5">
                    {children.map((child) => (
                      <button
                        key={child.id}
                        onClick={() => set({ categoryId: child.id })}
                        className={`w-full text-left text-sm font-sans py-1 transition-colors ${
                          filters.categoryId === child.id
                            ? 'text-dark font-medium'
                            : 'text-muted hover:text-dark'
                        }`}
                      >
                        {child.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Price */}
      <div>
        <p className="text-[10px] font-sans font-medium tracking-widest uppercase text-muted mb-3">
          {t('catalog.price')}
        </p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => set({ minPrice: e.target.value })}
            className="w-full border-b border-border bg-transparent text-sm text-dark placeholder-muted focus:outline-none focus:border-dark py-1 font-sans transition-colors"
          />
          <span className="text-muted text-sm">–</span>
          <input
            type="number"
            min="0"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => set({ maxPrice: e.target.value })}
            className="w-full border-b border-border bg-transparent text-sm text-dark placeholder-muted focus:outline-none focus:border-dark py-1 font-sans transition-colors"
          />
        </div>
      </div>

      {/* Available */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer group">
          <div
            onClick={() => set({ available: !filters.available })}
            className={`w-4 h-4 border transition-all duration-150 flex items-center justify-center ${
              filters.available ? 'border-dark bg-dark' : 'border-border group-hover:border-secondary'
            }`}
          >
            {filters.available && (
              <svg viewBox="0 0 10 8" className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 4l3 3 5-6" />
              </svg>
            )}
          </div>
          <span className="text-sm font-sans text-secondary group-hover:text-dark transition-colors">
            {t('catalog.available')}
          </span>
        </label>
      </div>

      {/* Result count */}
      <p className="text-xs text-muted font-sans pt-2 border-t border-border">
        {total} {t('catalog.products')}
      </p>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-56 shrink-0">
        <div className="sticky top-24">
          <p className="font-display text-2xl font-light text-dark mb-8 tracking-wide">
            {t('catalog.filters')}
          </p>
          <FiltersContent />
        </div>
      </aside>

      {/* Mobile toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 text-sm font-sans text-dark border border-border px-4 py-2 hover:bg-background transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
          {t('catalog.filters')}
          {hasFilters && (
            <span className="w-4 h-4 rounded-full bg-danger text-white text-[10px] flex items-center justify-center">
              !
            </span>
          )}
        </button>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div className="absolute inset-0 bg-dark/40" onClick={() => setMobileOpen(false)} />
            <div className="relative bg-surface w-72 h-full overflow-y-auto p-6 ml-auto animate-slide-up">
              <div className="flex items-center justify-between mb-6">
                <p className="font-display text-xl font-light text-dark">
                  {t('catalog.filters')}
                </p>
                <button onClick={() => setMobileOpen(false)} className="btn-icon">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <FiltersContent />
            </div>
          </div>
        )}
      </div>
    </>
  )
}

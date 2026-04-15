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
          className="flex items-center gap-1.5 font-sans font-black uppercase transition-colors"
          style={{ fontSize: '10px', color: '#BC2C2C', letterSpacing: '0.1em' }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = '#9e2424')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = '#BC2C2C')}
        >
          <X className="w-3 h-3" />
          {t('catalog.clear')}
        </button>
      )}

      {/* Category */}
      <div>
        <p
          className="font-sans font-black uppercase mb-3"
          style={{ fontSize: '10px', color: '#888', letterSpacing: '0.12em' }}
        >
          {t('catalog.category')}
        </p>
        <div className="space-y-0.5">
          <button
            onClick={() => set({ categoryId: undefined })}
            className="w-full text-left font-sans uppercase py-1 transition-colors"
            style={{
              fontSize: '11px',
              letterSpacing: '0.05em',
              color: !filters.categoryId ? '#BC2C2C' : '#888',
              fontWeight: !filters.categoryId ? 800 : 500,
            }}
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
                  className="w-full flex items-center justify-between py-1.5 font-sans uppercase transition-colors"
                  style={{
                    fontSize: '11px',
                    letterSpacing: '0.05em',
                    color: isActive ? '#2C2C2C' : '#888',
                    fontWeight: isActive ? 800 : 500,
                  }}
                >
                  <span>{parent.name}</span>
                  {children.length > 0 && (
                    isExpanded
                      ? <ChevronDown className="w-3 h-3" style={{ color: '#888' }} />
                      : <ChevronRight className="w-3 h-3" style={{ color: '#888' }} />
                  )}
                </button>
                {isExpanded && children.length > 0 && (
                  <div
                    className="pl-3 ml-1 space-y-0.5 mt-0.5 border-l-2"
                    style={{ borderColor: '#BC2C2C' }}
                  >
                    {children.map((child) => (
                      <button
                        key={child.id}
                        onClick={() => set({ categoryId: child.id })}
                        className="w-full text-left font-sans uppercase py-1 transition-colors"
                        style={{
                          fontSize: '10px',
                          letterSpacing: '0.05em',
                          color: filters.categoryId === child.id ? '#BC2C2C' : '#888',
                          fontWeight: filters.categoryId === child.id ? 800 : 500,
                        }}
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
        <p
          className="font-sans font-black uppercase mb-3"
          style={{ fontSize: '10px', color: '#888', letterSpacing: '0.12em' }}
        >
          {t('catalog.price')}
        </p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => set({ minPrice: e.target.value })}
            className="w-full bg-transparent text-dark placeholder-[#888] focus:outline-none py-1 font-sans text-sm transition-colors border-b-2"
            style={{ borderColor: '#C8C2B0' }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#2C2C2C')}
            onBlur={(e) => (e.currentTarget.style.borderColor = '#C8C2B0')}
          />
          <span className="font-sans text-sm font-black" style={{ color: '#888' }}>–</span>
          <input
            type="number"
            min="0"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => set({ maxPrice: e.target.value })}
            className="w-full bg-transparent text-dark placeholder-[#888] focus:outline-none py-1 font-sans text-sm transition-colors border-b-2"
            style={{ borderColor: '#C8C2B0' }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#2C2C2C')}
            onBlur={(e) => (e.currentTarget.style.borderColor = '#C8C2B0')}
          />
        </div>
      </div>

      {/* Available */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer group">
          <div
            onClick={() => set({ available: !filters.available })}
            className="w-4 h-4 border-2 flex items-center justify-center transition-all duration-150"
            style={{
              borderColor: filters.available ? '#BC2C2C' : '#C8C2B0',
              backgroundColor: filters.available ? '#BC2C2C' : 'transparent',
            }}
          >
            {filters.available && (
              <svg viewBox="0 0 10 8" className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M1 4l3 3 5-6" />
              </svg>
            )}
          </div>
          <span
            className="font-sans uppercase transition-colors"
            style={{ fontSize: '11px', color: '#888', letterSpacing: '0.05em', fontWeight: 600 }}
          >
            {t('catalog.available')}
          </span>
        </label>
      </div>

      {/* Result count */}
      <p
        className="font-sans font-black uppercase pt-3 border-t-2"
        style={{ fontSize: '10px', color: '#888', letterSpacing: '0.1em', borderColor: '#2C2C2C' }}
      >
        {total} {t('catalog.products')}
      </p>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-52 shrink-0">
        <div className="sticky top-20">
          <p
            className="font-display font-black uppercase mb-8"
            style={{ fontSize: '1.25rem', letterSpacing: '-0.03em', color: '#2C2C2C' }}
          >
            {t('catalog.filters')}
          </p>
          <FiltersContent />
        </div>
      </aside>

      {/* Mobile toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 font-sans font-black uppercase text-dark transition-colors"
          style={{
            fontSize: '11px',
            letterSpacing: '0.1em',
            border: '2px solid #2C2C2C',
            padding: '8px 16px',
          }}
        >
          <SlidersHorizontal className="w-4 h-4" />
          {t('catalog.filters')}
          {hasFilters && (
            <span
              className="w-4 h-4 font-black font-sans text-[9px] flex items-center justify-center"
              style={{ backgroundColor: '#BC2C2C', color: 'white' }}
            >
              !
            </span>
          )}
        </button>

        {mobileOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div
              className="absolute inset-0"
              style={{ backgroundColor: 'rgba(44,44,44,0.5)' }}
              onClick={() => setMobileOpen(false)}
            />
            <div
              className="relative w-72 h-full overflow-y-auto p-6 ml-auto"
              style={{ backgroundColor: '#F5F1E3' }}
            >
              <div
                className="flex items-center justify-between mb-6 pb-4 border-b-2"
                style={{ borderColor: '#2C2C2C' }}
              >
                <p
                  className="font-display font-black uppercase"
                  style={{ fontSize: '1.1rem', letterSpacing: '-0.03em' }}
                >
                  {t('catalog.filters')}
                </p>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center justify-center w-8 h-8 text-white"
                  style={{ backgroundColor: '#2C2C2C' }}
                >
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

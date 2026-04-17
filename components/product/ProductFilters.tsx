'use client'

import { useState, useEffect } from 'react'
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

const PRICE_MAX = 10000

export function ProductFilters({ filters, onChange, total }: ProductFiltersProps) {
  const { t } = useTranslation()
  const [expandedParent, setExpandedParent] = useState<number | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  // Local price draft — only committed to parent on Apply
  const [sliderMin, setSliderMin] = useState(0)
  const [sliderMax, setSliderMax] = useState(PRICE_MAX)

  // Sync slider back when filters are cleared externally
  useEffect(() => {
    if (!filters.minPrice && !filters.maxPrice) {
      setSliderMin(0)
      setSliderMax(PRICE_MAX)
    }
  }, [filters.minPrice, filters.maxPrice])

  const parents = getParents()

  const set = (partial: Partial<FilterState>) => onChange({ ...filters, ...partial })

  const clearAll = () =>
    onChange({ search: '', categoryId: undefined, minPrice: '', maxPrice: '', available: false })

  const applyPrice = () => {
    set({
      minPrice: sliderMin > 0 ? String(sliderMin) : '',
      maxPrice: sliderMax < PRICE_MAX ? String(sliderMax) : '',
    })
  }

  const hasFilters =
    !!filters.search || filters.categoryId !== undefined || !!filters.minPrice || !!filters.maxPrice || filters.available

  const filterCount = [
    !!filters.search,
    filters.categoryId !== undefined,
    !!filters.minPrice || !!filters.maxPrice,
    filters.available,
  ].filter(Boolean).length

  const leftPct = (sliderMin / PRICE_MAX) * 100
  const rightPct = ((PRICE_MAX - sliderMax) / PRICE_MAX) * 100

  function renderFilters() {
    return (
      <div className="space-y-0">
        {/* Clear all */}
        {hasFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 font-sans font-black uppercase transition-colors mb-5"
            style={{ fontSize: '10px', color: '#BC2C2C', letterSpacing: '0.1em' }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = '#9e2424')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = '#BC2C2C')}
          >
            <X className="w-3 h-3" />
            {t('catalog.clear')}
          </button>
        )}

        {/* ── CATEGORY ─────────────────────────────── */}
        <div className="mb-1">
          <p
            className="font-sans font-black uppercase mb-3"
            style={{ fontSize: '9px', color: '#BC2C2C', letterSpacing: '0.22em' }}
          >
            {t('catalog.category')}
          </p>

          {/* All Products */}
          <button
            onClick={() => set({ categoryId: undefined })}
            className="w-full text-left font-display font-black uppercase py-2 px-3 mb-1 transition-all duration-150 flex items-center justify-between"
            style={{
              fontSize: '11px',
              letterSpacing: '0.04em',
              backgroundColor: filters.categoryId === undefined ? '#2C2C2C' : 'transparent',
              color: filters.categoryId === undefined ? 'white' : '#2C2C2C',
              border: '2px solid #2C2C2C',
            }}
            onMouseEnter={(e) => {
              if (filters.categoryId !== undefined) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#2C2C2C'
                ;(e.currentTarget as HTMLButtonElement).style.color = 'white'
              }
            }}
            onMouseLeave={(e) => {
              if (filters.categoryId !== undefined) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'
                ;(e.currentTarget as HTMLButtonElement).style.color = '#2C2C2C'
              }
            }}
          >
            <span>All Products</span>
            <span className="font-sans" style={{ fontSize: '9px', opacity: 0.45 }}>{total}</span>
          </button>

          {/* Parent categories */}
          {parents.map((parent, idx) => {
            const children = getChildren(parent.id)
            const isExpanded = expandedParent === parent.id
            const isActive =
              filters.categoryId === parent.id ||
              children.some((c) => c.id === filters.categoryId)

            return (
              <div key={parent.id} className="mb-1">
                <button
                  onClick={() => {
                    setExpandedParent(isExpanded ? null : parent.id)
                    set({ categoryId: isActive ? undefined : parent.id })
                  }}
                  className="w-full flex items-center justify-between py-2 px-3 font-display font-black uppercase transition-all duration-150"
                  style={{
                    fontSize: '11px',
                    letterSpacing: '0.03em',
                    backgroundColor: isActive ? '#BC2C2C' : 'transparent',
                    color: isActive ? 'white' : '#2C2C2C',
                    border: '2px solid',
                    borderColor: isActive ? '#BC2C2C' : '#C8C2B0',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#2C2C2C'
                      ;(e.currentTarget as HTMLButtonElement).style.color = 'white'
                      ;(e.currentTarget as HTMLButtonElement).style.borderColor = '#2C2C2C'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'
                      ;(e.currentTarget as HTMLButtonElement).style.color = '#2C2C2C'
                      ;(e.currentTarget as HTMLButtonElement).style.borderColor = '#C8C2B0'
                    }
                  }}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="font-sans font-black shrink-0"
                      style={{
                        fontSize: '8px',
                        color: isActive ? 'rgba(255,255,255,0.55)' : '#BC2C2C',
                        letterSpacing: '0.1em',
                      }}
                    >
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="truncate">{parent.name}</span>
                  </div>
                  {children.length > 0 && (
                    isExpanded
                      ? <ChevronDown className="w-3 h-3 shrink-0" style={{ color: isActive ? 'rgba(255,255,255,0.6)' : '#888' }} />
                      : <ChevronRight className="w-3 h-3 shrink-0" style={{ color: isActive ? 'rgba(255,255,255,0.6)' : '#888' }} />
                  )}
                </button>

                {isExpanded && children.length > 0 && (
                  <div className="mt-px ml-2 space-y-px">
                    {children.map((child) => {
                      const childActive = filters.categoryId === child.id
                      return (
                        <button
                          key={child.id}
                          onClick={() => set({ categoryId: child.id })}
                          className="w-full text-left font-sans uppercase py-1.5 px-3 transition-all duration-150"
                          style={{
                            fontSize: '10px',
                            letterSpacing: '0.04em',
                            backgroundColor: childActive ? '#2C2C2C' : 'transparent',
                            color: childActive ? 'white' : '#888',
                            fontWeight: childActive ? 800 : 500,
                            borderLeft: `2px solid ${childActive ? '#BC2C2C' : '#C8C2B0'}`,
                          }}
                          onMouseEnter={(e) => {
                            if (!childActive) {
                              (e.currentTarget as HTMLButtonElement).style.color = '#2C2C2C'
                              ;(e.currentTarget as HTMLButtonElement).style.borderLeftColor = '#BC2C2C'
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!childActive) {
                              (e.currentTarget as HTMLButtonElement).style.color = '#888'
                              ;(e.currentTarget as HTMLButtonElement).style.borderLeftColor = '#C8C2B0'
                            }
                          }}
                        >
                          {child.name}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* ── PRICE RANGE ──────────────────────────── */}
        <div className="pt-5 pb-1 border-t-2 mt-4" style={{ borderColor: '#C8C2B0' }}>
          <p
            className="font-sans font-black uppercase mb-4"
            style={{ fontSize: '9px', color: '#BC2C2C', letterSpacing: '0.22em' }}
          >
            {t('catalog.price')}
          </p>

          {/* Manual price inputs */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1 flex items-center gap-1 border-b-2 pb-1" style={{ borderColor: '#C8C2B0' }}>
              <span className="font-sans font-black shrink-0" style={{ fontSize: '10px', color: '#BC2C2C' }}>
                {t('common.currency')}
              </span>
              <input
                type="number"
                min={0}
                max={sliderMax - 1}
                value={sliderMin}
                onChange={(e) => {
                  const v = Number(e.target.value)
                  if (!isNaN(v)) setSliderMin(Math.min(Math.max(0, v), sliderMax - 1))
                }}
                className="w-full bg-transparent outline-none font-sans font-black tabular-nums appearance-none"
                style={{ fontSize: '11px', color: '#2C2C2C' }}
              />
            </div>
            <span className="font-sans shrink-0" style={{ fontSize: '10px', color: '#C8C2B0' }}>—</span>
            <div className="flex-1 flex items-center gap-1 border-b-2 pb-1" style={{ borderColor: '#C8C2B0' }}>
              <span className="font-sans font-black shrink-0" style={{ fontSize: '10px', color: '#BC2C2C' }}>
                {t('common.currency')}
              </span>
              <input
                type="number"
                min={sliderMin + 1}
                max={PRICE_MAX}
                value={sliderMax}
                onChange={(e) => {
                  const v = Number(e.target.value)
                  if (!isNaN(v)) setSliderMax(Math.min(Math.max(sliderMin + 1, v), PRICE_MAX))
                }}
                className="w-full bg-transparent outline-none font-sans font-black tabular-nums appearance-none"
                style={{ fontSize: '11px', color: '#2C2C2C' }}
              />
            </div>
          </div>

          {/* Track + dual slider */}
          <div className="relative mb-5" style={{ height: '20px' }}>
            {/* Visual track */}
            <div
              className="absolute"
              style={{
                top: '50%',
                transform: 'translateY(-50%)',
                left: 0,
                right: 0,
                height: '4px',
                backgroundColor: '#C8C2B0',
              }}
            >
              <div
                className="absolute h-full"
                style={{
                  left: `${leftPct}%`,
                  right: `${rightPct}%`,
                  backgroundColor: '#BC2C2C',
                }}
              />
            </div>

            {/* Min thumb */}
            <input
              type="range"
              min={0}
              max={PRICE_MAX}
              step={50}
              value={sliderMin}
              onChange={(e) => {
                const v = Math.min(Number(e.target.value), sliderMax - 50)
                setSliderMin(v)
              }}
              className="price-slider"
            />

            {/* Max thumb */}
            <input
              type="range"
              min={0}
              max={PRICE_MAX}
              step={50}
              value={sliderMax}
              onChange={(e) => {
                const v = Math.max(Number(e.target.value), sliderMin + 50)
                setSliderMax(v)
              }}
              className="price-slider"
            />
          </div>

          {/* Apply button */}
          <button
            onClick={applyPrice}
            className="w-full font-sans font-black uppercase text-white transition-all duration-150 active:scale-[0.97]"
            style={{
              fontSize: '10px',
              letterSpacing: '0.14em',
              backgroundColor: '#2C2C2C',
              padding: '9px 0',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = '#BC2C2C')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = '#2C2C2C')}
          >
            Apply Price
          </button>
        </div>

        {/* ── IN STOCK ─────────────────────────────── */}
        <div className="pt-5 border-t-2 mt-4" style={{ borderColor: '#C8C2B0' }}>
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => set({ available: !filters.available })}
              className="w-4 h-4 border-2 flex items-center justify-center transition-all duration-150 shrink-0"
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
              className="font-sans uppercase"
              style={{ fontSize: '11px', color: '#888', letterSpacing: '0.05em', fontWeight: 600 }}
            >
              {t('catalog.available')}
            </span>
          </label>
        </div>

        {/* ── COUNT ────────────────────────────────── */}
        <div className="pt-5 border-t-2 mt-5" style={{ borderColor: '#2C2C2C' }}>
          <p
            className="font-sans font-black uppercase"
            style={{ fontSize: '10px', color: '#888', letterSpacing: '0.1em' }}
          >
            {total} {t('catalog.products')}
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-56 shrink-0">
        <div className="sticky top-20">
          <p
            className="font-display font-black uppercase mb-6"
            style={{ fontSize: '1.1rem', letterSpacing: '-0.03em', color: '#2C2C2C' }}
          >
            {t('catalog.filters')}
          </p>
          {renderFilters()}
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
              {filterCount}
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
              {renderFilters()}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

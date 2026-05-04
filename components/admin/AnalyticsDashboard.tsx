'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { Skeleton } from '@/components/ui/Skeleton'
import {
  getRevenue, getCategoryRevenue, getOrderStatusDist,
  getTopProducts, getTopCustomers, getLowStock,
} from '@/lib/api/analytics'
import type {
  CategoryRevenue, OrderStatusCount, TopProduct, TopCustomer, LowStockProduct,
} from '@/lib/types'

const PALETTE = ['#BC2C2C', '#5DA4C9', '#FCD758', '#2C2C2C', '#C8C2B0', '#E07A5F', '#81B29A', '#F4A261']

const STATUS_COLOR: Record<string, string> = {
  Pending: '#C8C2B0',
  Shipped: '#FCD758',
  Paid: '#86EFAC',
  Completed: '#86EFAC',
  Cancelled: '#BC2C2C',
}

function statusColor(s: string) {
  return STATUS_COLOR[s] ?? '#5DA4C9'
}

type ChartEntry = { name: string; value: number; payload: Record<string, unknown> }

function CardTooltip({ active, payload, unit }: { active?: boolean; payload?: ChartEntry[]; unit?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-[#E5E0D0] px-3 py-2 shadow-sm">
      <p className="font-sans text-xs font-semibold" style={{ color: '#2C2C2C' }}>{String(payload[0].name)}</p>
      <p className="font-sans text-xs" style={{ color: '#888' }}>
        {unit === '₾' ? `₾${Number(payload[0].value).toFixed(2)}` : `${payload[0].value}${unit ? ' ' + unit : ''}`}
      </p>
    </div>
  )
}

function ChartCard({
  title, subtitle, accent = '#2C2C2C', icon, children,
}: {
  title: string
  subtitle?: string
  accent?: string
  icon?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="border border-[#E5E0D0] p-6 bg-white">
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            {icon}
            <p className="font-display font-black uppercase text-sm" style={{ letterSpacing: '-0.01em', color: '#2C2C2C' }}>
              {title}
            </p>
          </div>
          {subtitle && (
            <p className="font-sans text-[10px] uppercase tracking-widest mt-0.5" style={{ color: '#888' }}>{subtitle}</p>
          )}
        </div>
        <div className="w-1 h-5 shrink-0" style={{ backgroundColor: accent }} />
      </div>
      {children}
    </div>
  )
}

function EmptyState({ label = 'No data available' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center h-32">
      <p className="font-sans text-sm" style={{ color: '#C8C2B0' }}>{label}</p>
    </div>
  )
}

export default function AnalyticsDashboard() {
  const [revenue, setRevenue] = useState<number | null>(null)
  const [revenueLoading, setRevenueLoading] = useState(true)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const [categoryRevenue, setCategoryRevenue] = useState<CategoryRevenue[]>([])
  const [orderStatus, setOrderStatus] = useState<OrderStatusCount[]>([])
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [topCustomers, setTopCustomers] = useState<TopCustomer[]>([])
  const [lowStock, setLowStock] = useState<LowStockProduct[]>([])
  const [chartsLoading, setChartsLoading] = useState(true)

  const fetchRevenue = useCallback(async (from?: string, to?: string) => {
    setRevenueLoading(true)
    try {
      const val = await getRevenue(from || undefined, to || undefined)
      setRevenue(val)
    } catch {
      setRevenue(null)
    } finally {
      setRevenueLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRevenue()
    setChartsLoading(true)
    Promise.all([
      getCategoryRevenue(),
      getOrderStatusDist(),
      getTopProducts(8),
      getTopCustomers(8),
      getLowStock(10),
    ])
      .then(([cat, status, products, customers, stock]) => {
        setCategoryRevenue(cat)
        setOrderStatus(status)
        setTopProducts(products)
        setTopCustomers(customers)
        setLowStock(stock)
      })
      .catch(() => {})
      .finally(() => setChartsLoading(false))
  }, [fetchRevenue])

  const handleApply = () => fetchRevenue(dateFrom, dateTo)

  const handleClear = () => {
    setDateFrom('')
    setDateTo('')
    fetchRevenue()
  }

  const maxSold = topProducts[0]?.totalSold ?? 1
  const maxSpent = topCustomers[0]?.totalSpent ?? 1

  return (
    <div className="space-y-6">

      {/* ── Revenue KPI ──────────────────────────────────────────────── */}
      <div className="border-2 border-[#2C2C2C] p-8 bg-white">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div>
            <p
              className="font-sans font-black uppercase mb-3"
              style={{ fontSize: '10px', letterSpacing: '0.2em', color: '#BC2C2C' }}
            >
              {dateFrom || dateTo ? 'Filtered Revenue' : 'All-Time Revenue'}
            </p>

            {revenueLoading ? (
              <Skeleton className="h-16 w-56" />
            ) : (
              <motion.p
                key={revenue}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="font-display font-black tabular-nums"
                style={{
                  fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                  lineHeight: 1,
                  letterSpacing: '-0.05em',
                  color: '#2C2C2C',
                }}
              >
                ₾{revenue != null
                  ? revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                  : '—'}
              </motion.p>
            )}

            {(dateFrom || dateTo) && (
              <p className="font-sans text-xs mt-3" style={{ color: '#888' }}>
                {dateFrom && new Date(dateFrom).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                {dateFrom && dateTo && ' → '}
                {dateTo && new Date(dateTo).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-end gap-3">
            <div>
              <p className="font-sans text-[9px] uppercase tracking-widest mb-1.5" style={{ color: '#888' }}>From</p>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="font-sans text-sm border px-3 py-2 bg-transparent focus:outline-none transition-colors"
                style={{ borderColor: '#C8C2B0', color: '#2C2C2C' }}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#2C2C2C')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#C8C2B0')}
              />
            </div>
            <div>
              <p className="font-sans text-[9px] uppercase tracking-widest mb-1.5" style={{ color: '#888' }}>To</p>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="font-sans text-sm border px-3 py-2 bg-transparent focus:outline-none transition-colors"
                style={{ borderColor: '#C8C2B0', color: '#2C2C2C' }}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#2C2C2C')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#C8C2B0')}
              />
            </div>
            <button
              onClick={handleApply}
              disabled={revenueLoading}
              className="font-sans font-black uppercase text-[10px] px-5 py-[11px] transition-colors"
              style={{ backgroundColor: '#2C2C2C', color: 'white', letterSpacing: '0.1em' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#BC2C2C')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2C2C2C')}
            >
              Apply →
            </button>
            {(dateFrom || dateTo) && (
              <button
                onClick={handleClear}
                className="font-sans text-[10px] uppercase tracking-widest transition-colors pb-0.5"
                style={{ color: '#888', borderBottom: '1px solid #C8C2B0' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#BC2C2C')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#888')}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Row 1: Category pie + Order status donut ─────────────────── */}
      <div className="grid lg:grid-cols-2 gap-6">
        <ChartCard title="Revenue by Category" subtitle="All categories">
          {chartsLoading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : categoryRevenue.length === 0 ? (
            <EmptyState />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryRevenue}
                  dataKey="revenue"
                  nameKey="categoryName"
                  cx="50%"
                  cy="45%"
                  outerRadius={100}
                  paddingAngle={2}
                >
                  {categoryRevenue.map((_, i) => (
                    <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                  ))}
                </Pie>
                <Tooltip content={(props) => (
                  <CardTooltip
                    active={props.active}
                    payload={props.payload as unknown as ChartEntry[]}
                    unit="₾"
                  />
                )} />
                <Legend
                  iconSize={8}
                  iconType="circle"
                  formatter={(value) => (
                    <span style={{ fontFamily: 'sans-serif', fontSize: 11, color: '#2C2C2C' }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Order Status" subtitle="Pipeline distribution">
          {chartsLoading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : orderStatus.length === 0 ? (
            <EmptyState />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderStatus}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="45%"
                  innerRadius={70}
                  outerRadius={105}
                  paddingAngle={3}
                >
                  {orderStatus.map((entry, i) => (
                    <Cell key={i} fill={statusColor(entry.status)} />
                  ))}
                </Pie>
                <Tooltip content={(props) => (
                  <CardTooltip
                    active={props.active}
                    payload={props.payload as unknown as ChartEntry[]}
                    unit="orders"
                  />
                )} />
                <Legend
                  iconSize={8}
                  iconType="circle"
                  formatter={(value) => (
                    <span style={{ fontFamily: 'sans-serif', fontSize: 11, color: '#2C2C2C' }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      {/* ── Row 2: Top products bar + Top customers list ──────────────── */}
      <div className="grid lg:grid-cols-2 gap-6">
        <ChartCard title="Top Products" subtitle="By units sold" accent="#BC2C2C">
          {chartsLoading ? (
            <Skeleton className="h-[320px] w-full" />
          ) : topProducts.length === 0 ? (
            <EmptyState />
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={topProducts}
                layout="vertical"
                margin={{ top: 0, right: 20, bottom: 0, left: 0 }}
              >
                <XAxis
                  type="number"
                  tick={{ fontFamily: 'sans-serif', fontSize: 10, fill: '#888' }}
                  axisLine={false}
                  tickLine={false}
                  domain={[0, maxSold]}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={110}
                  tick={{ fontFamily: 'sans-serif', fontSize: 11, fill: '#2C2C2C' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: string) => v.length > 15 ? v.slice(0, 15) + '…' : v}
                />
                <Tooltip content={(props) => (
                  <CardTooltip
                    active={props.active}
                    payload={props.payload as unknown as ChartEntry[]}
                    unit="sold"
                  />
                )} />
                <Bar dataKey="totalSold" fill="#BC2C2C" radius={[0, 2, 2, 0]} maxBarSize={18} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Top Customers" subtitle="By total spend" accent="#5DA4C9">
          {chartsLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
            </div>
          ) : topCustomers.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-4 pt-1">
              {topCustomers.map((c, i) => (
                <div key={c.userId}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-3">
                      <span
                        className="w-6 h-6 flex items-center justify-center font-display font-black text-[11px] shrink-0"
                        style={{
                          backgroundColor: i === 0 ? '#FCD758' : i === 1 ? '#C8C2B0' : '#F5F1E3',
                          color: '#2C2C2C',
                        }}
                      >
                        {i + 1}
                      </span>
                      <span className="font-sans text-sm font-medium truncate max-w-[140px]" style={{ color: '#2C2C2C' }}>
                        {c.name}
                      </span>
                    </div>
                    <span className="font-sans text-sm tabular-nums font-semibold shrink-0 ml-2" style={{ color: '#2C2C2C' }}>
                      ₾{c.totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="h-1 w-full" style={{ backgroundColor: '#F5F1E3' }}>
                    <motion.div
                      className="h-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(c.totalSpent / maxSpent) * 100}%` }}
                      transition={{ duration: 0.55, delay: i * 0.06, ease: 'easeOut' }}
                      style={{
                        backgroundColor: i === 0 ? '#BC2C2C' : i < 3 ? '#5DA4C9' : '#C8C2B0',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </ChartCard>
      </div>

      {/* ── Low stock ─────────────────────────────────────────────────── */}
      <ChartCard
        title="Low Stock Alert"
        subtitle="Products approaching zero"
        accent="#BC2C2C"
        icon={<AlertTriangle className="w-4 h-4" style={{ color: '#BC2C2C' }} />}
      >
        {chartsLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : lowStock.length === 0 ? (
          <EmptyState label="All products are well-stocked" />
        ) : (
          <div className="overflow-x-auto -mx-6 -mb-6">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid #E5E0D0', borderTop: '1px solid #E5E0D0' }}>
                  {['#', 'Product', 'Stock'].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-2.5 text-left font-sans text-[10px] uppercase tracking-widest"
                      style={{ color: '#888', backgroundColor: '#FAFAF8' }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {lowStock.map((p, i) => (
                  <motion.tr
                    key={p.productId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    style={{ borderBottom: '1px solid #F5F1E3' }}
                  >
                    <td className="px-6 py-3 font-sans text-xs tabular-nums" style={{ color: '#888' }}>
                      {p.productId}
                    </td>
                    <td className="px-6 py-3 font-sans text-sm font-medium" style={{ color: '#2C2C2C' }}>
                      {p.name}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className="inline-flex items-center gap-1.5 font-sans text-[11px] font-semibold px-2.5 py-1"
                        style={{
                          backgroundColor: p.amount === 0 ? '#FEF2F2' : '#FFF9DB',
                          color: p.amount === 0 ? '#991B1B' : '#7A5C00',
                          border: `1px solid ${p.amount === 0 ? '#FCA5A5' : '#FCD758'}`,
                        }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: p.amount === 0 ? '#BC2C2C' : '#FCD758' }}
                        />
                        {p.amount === 0 ? 'Out of stock' : `${p.amount} remaining`}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ChartCard>
    </div>
  )
}

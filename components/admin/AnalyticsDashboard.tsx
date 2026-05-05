'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, Legend, CartesianGrid,
} from 'recharts'
import { Skeleton } from '@/components/ui/Skeleton'
import {
  getRevenue, getCategoryRevenue, getOrderStatusDist,
  getTopProducts, getTopCustomers, getLowStock,
} from '@/lib/api/analytics'
import type {
  RevenuePoint, CategoryRevenue, OrderStatusCount,
  TopProduct, TopCustomer, LowStockProduct,
} from '@/lib/types'

const PALETTE = ['#BC2C2C', '#5DA4C9', '#FCD758', '#2C2C2C', '#C8C2B0', '#E07A5F', '#81B29A', '#F4A261']

const ORDER_STATUS_LABEL: Record<number, string> = {
  0: 'Pending', 1: 'Shipped', 2: 'Paid', 3: 'Cancelled',
}
const ORDER_STATUS_COLOR: Record<number, string> = {
  0: '#C8C2B0', 1: '#FCD758', 2: '#86EFAC', 3: '#BC2C2C',
}

type ChartEntry = { name?: string; value?: number; payload?: Record<string, unknown> }

function ChartTooltip({
  active, payload, valueLabel, valueFormat,
}: {
  active?: boolean
  payload?: ChartEntry[]
  valueLabel?: string
  valueFormat?: (v: number) => string
}) {
  if (!active || !payload?.length) return null
  const val = payload[0]?.value ?? 0
  return (
    <div className="bg-white border border-[#E5E0D0] px-3 py-2 shadow-sm">
      <p className="font-sans text-xs font-semibold mb-0.5" style={{ color: '#2C2C2C' }}>
        {String(payload[0]?.name ?? '')}
      </p>
      <p className="font-sans text-xs" style={{ color: '#888' }}>
        {valueLabel && `${valueLabel}: `}
        {valueFormat ? valueFormat(Number(val)) : val}
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
            <p className="font-sans text-[10px] uppercase tracking-widest mt-0.5" style={{ color: '#888' }}>
              {subtitle}
            </p>
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
  const [revenuePoints, setRevenuePoints] = useState<RevenuePoint[]>([])
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
      setRevenuePoints(await getRevenue(from || undefined, to || undefined))
    } catch {
      setRevenuePoints([])
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
  const handleClear = () => { setDateFrom(''); setDateTo(''); fetchRevenue() }

  const totalRevenue = revenuePoints.reduce((s, p) => s + p.revenue, 0)
  const totalOrders = revenuePoints.reduce((s, p) => s + p.ordersCount, 0)

  const revenueChartData = revenuePoints.map((p) => ({
    date: new Date(p.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
    revenue: p.revenue,
    orders: p.ordersCount,
  }))

  const orderStatusData = orderStatus.map((item) => ({
    status: ORDER_STATUS_LABEL[item.status] ?? `Status ${item.status}`,
    count: item.count,
    fill: ORDER_STATUS_COLOR[item.status] ?? '#5DA4C9',
  }))

  const maxSpent = topCustomers[0]?.totalSpent ?? 1

  return (
    <div className="space-y-6">

      {/* ── Revenue KPI + time-series bar chart ──────────────────────── */}
      <div className="border-2 border-[#2C2C2C] p-8 bg-white">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8 mb-8">
          {/* Left — KPI numbers */}
          <div>
            <p className="font-sans font-black uppercase mb-3" style={{ fontSize: '10px', letterSpacing: '0.2em', color: '#BC2C2C' }}>
              {dateFrom || dateTo ? 'Filtered Revenue' : 'All-Time Revenue'}
            </p>
            {revenueLoading ? (
              <Skeleton className="h-16 w-64 mb-3" />
            ) : (
              <motion.p
                key={totalRevenue}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="font-display font-black tabular-nums"
                style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', lineHeight: 1, letterSpacing: '-0.05em', color: '#2C2C2C' }}
              >
                ₾{totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </motion.p>
            )}
            {!revenueLoading && (
              <p className="font-sans text-sm mt-3" style={{ color: '#888' }}>
                {totalOrders} {totalOrders === 1 ? 'order' : 'orders'}
                {(dateFrom || dateTo) && (
                  <span className="ml-2" style={{ color: '#C8C2B0' }}>
                    · {dateFrom && new Date(dateFrom).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    {dateFrom && dateTo && ' → '}
                    {dateTo && new Date(dateTo).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                )}
              </p>
            )}
          </div>

          {/* Right — date filter */}
          <div className="flex flex-wrap items-end gap-3 shrink-0">
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
                className="font-sans text-[10px] uppercase tracking-widest transition-colors"
                style={{ color: '#888', borderBottom: '1px solid #C8C2B0' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#BC2C2C')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#888')}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Daily revenue bar chart */}
        {revenueLoading ? (
          <Skeleton className="h-[180px] w-full" />
        ) : revenueChartData.length === 0 ? (
          <EmptyState label="No revenue data for this period" />
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={revenueChartData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <CartesianGrid vertical={false} stroke="#F5F1E3" />
              <XAxis
                dataKey="date"
                tick={{ fontFamily: 'sans-serif', fontSize: 11, fill: '#888' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontFamily: 'sans-serif', fontSize: 10, fill: '#888' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `₾${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
                width={45}
              />
              <Tooltip
                content={(props) => (
                  <ChartTooltip
                    active={props.active}
                    payload={props.payload as unknown as ChartEntry[]}
                    valueFormat={(v) => `₾${v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  />
                )}
              />
              <Bar dataKey="revenue" fill="#BC2C2C" radius={[3, 3, 0, 0]} maxBarSize={48} name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* ── Category pie + Order status donut ────────────────────────── */}
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
                <Tooltip
                  content={(props) => (
                    <ChartTooltip
                      active={props.active}
                      payload={props.payload as unknown as ChartEntry[]}
                      valueFormat={(v) => `₾${v.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                    />
                  )}
                />
                <Legend
                  iconSize={8}
                  iconType="circle"
                  formatter={(v) => <span style={{ fontFamily: 'sans-serif', fontSize: 11, color: '#2C2C2C' }}>{v}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Order Status" subtitle="Pipeline distribution">
          {chartsLoading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : orderStatusData.length === 0 ? (
            <EmptyState />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="45%"
                  innerRadius={70}
                  outerRadius={105}
                  paddingAngle={3}
                >
                  {orderStatusData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  content={(props) => (
                    <ChartTooltip
                      active={props.active}
                      payload={props.payload as unknown as ChartEntry[]}
                      valueLabel="orders"
                    />
                  )}
                />
                <Legend
                  iconSize={8}
                  iconType="circle"
                  formatter={(v) => <span style={{ fontFamily: 'sans-serif', fontSize: 11, color: '#2C2C2C' }}>{v}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      {/* ── Top products bar + Top customers ─────────────────────────── */}
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
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={120}
                  tick={{ fontFamily: 'sans-serif', fontSize: 11, fill: '#2C2C2C' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: string) => v.length > 16 ? v.slice(0, 16) + '…' : v}
                />
                <Tooltip
                  content={(props) => (
                    <ChartTooltip
                      active={props.active}
                      payload={props.payload as unknown as ChartEntry[]}
                      valueLabel="sold"
                    />
                  )}
                />
                <Bar dataKey="totalSold" fill="#BC2C2C" radius={[0, 3, 3, 0]} maxBarSize={18} name="Units sold" />
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
                        {c.fullName}
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
                      style={{ backgroundColor: i === 0 ? '#BC2C2C' : i < 3 ? '#5DA4C9' : '#C8C2B0' }}
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
                  {['#', 'Product', 'Price', 'Inventory Value', 'Stock'].map((h) => (
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
                    <td className="px-6 py-3 font-sans text-sm tabular-nums" style={{ color: '#2C2C2C' }}>
                      ₾{p.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-3 font-sans text-sm tabular-nums" style={{ color: '#2C2C2C' }}>
                      ₾{p.inventoryValue.toFixed(2)}
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
                        {p.amount === 0 ? 'Out of stock' : `${p.amount} left`}
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

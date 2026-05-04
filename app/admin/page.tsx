'use client'

import { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { Plus, Pencil, Trash2, ImagePlus, RotateCcw, BarChart2 } from 'lucide-react'

const AnalyticsDashboard = dynamic(() => import('@/components/admin/AnalyticsDashboard'), { ssr: false })
import { useRequireAuth } from '@/hooks/useAuth'
import { useTranslation } from '@/lib/i18n'
import { toast } from '@/store/toastStore'
import { Modal } from '@/components/ui/Modal'
import { Skeleton } from '@/components/ui/Skeleton'
import { CATEGORIES } from '@/lib/categories'
import {
  getAllProducts, getProduct, createProduct, updateProduct,
  deleteProduct, uploadImage, getImageUrls, deleteImage,
  activateProduct, getInactiveProducts,
} from '@/lib/api/products'
import { getOrders } from '@/lib/api/orders'
import type { Product, Order, OrderStatus } from '@/lib/types'

const STATUS_LABEL: Record<OrderStatus, string> = { 0: 'Pending', 1: 'Shipped', 2: 'Paid', 3: 'Cancelled' }
const STATUS_STYLE: Record<OrderStatus, { bg: string; color: string; border: string }> = {
  0: { bg: '#F5F1E3', color: '#2C2C2C', border: '#C8C2B0' },
  1: { bg: '#FFF9DB', color: '#7A5C00', border: '#FCD758' },
  2: { bg: '#EDFBF0', color: '#166534', border: '#86EFAC' },
  3: { bg: '#FEF2F2', color: '#991B1B', border: '#FCA5A5' },
}

interface ProductForm {
  name: string; description: string; price: string; originalPrice: string; amount: string; categoryId: string
}

const EMPTY_FORM: ProductForm = { name: '', description: '', price: '', originalPrice: '', amount: '', categoryId: '' }

export default function AdminPage() {
  const { user, hydrated } = useRequireAuth(true)
  const { t } = useTranslation()

  const [tab, setTab] = useState<'products' | 'inactive' | 'orders' | 'analytics'>('products')

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [inactiveProducts, setInactiveProducts] = useState<Product[]>([])
  const [inactiveLoading, setInactiveLoading] = useState(false)

  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [orderStatusFilter, setOrderStatusFilter] = useState<number | null>(null)

  const [createOpen, setCreateOpen] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)
  const [imagesProduct, setImagesProduct] = useState<Product | null>(null)
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [uploadFile, setUploadFile] = useState<File | null>(null)

  const [form, setForm] = useState<ProductForm>(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)

  const setField = (k: keyof ProductForm, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const load = useCallback(async (p = 1) => {
    setLoading(true)
    try {
      const res = await getAllProducts({ Page: p, PageSize: 20 })
      setProducts(res.value.items)
      setTotalPages(res.value.totalPages)
      setPage(p)
    } catch { setProducts([]) }
    finally { setLoading(false) }
  }, [])

  const loadInactive = useCallback(async () => {
    setInactiveLoading(true)
    try {
      const res = await getInactiveProducts()
      setInactiveProducts(res.value.items)
    } catch { setInactiveProducts([]) }
    finally { setInactiveLoading(false) }
  }, [])

  const loadOrders = useCallback(async (statusFilter: number | null) => {
    setOrdersLoading(true)
    try {
      const res = await getOrders(statusFilter !== null ? { Statuses: [statusFilter] } : {})
      setOrders(res.value)
    } catch { setOrders([]) }
    finally { setOrdersLoading(false) }
  }, [])

  useEffect(() => { if (hydrated && user) load() }, [hydrated, user, load])
  useEffect(() => { if (hydrated && user && tab === 'inactive') loadInactive() }, [hydrated, user, tab, loadInactive])
  useEffect(() => { if (hydrated && user && tab === 'orders') loadOrders(orderStatusFilter) }, [hydrated, user, tab, orderStatusFilter, loadOrders])

  const handleActivate = async (productId: number) => {
    try {
      await activateProduct(productId)
      toast.success('Product activated')
      loadInactive()
    } catch (err: unknown) { toast.error(err instanceof Error ? err.message : 'Failed') }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setSubmitting(true)
    try {
      await createProduct({
        name: form.name, description: form.description,
        price: parseFloat(form.price), amount: parseInt(form.amount),
        categoryId: parseInt(form.categoryId), userId: user.id,
      })
      toast.success('Product created')
      setCreateOpen(false); setForm(EMPTY_FORM); load()
    } catch (err: unknown) { toast.error(err instanceof Error ? err.message : 'Failed') }
    finally { setSubmitting(false) }
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editProduct || !user) return
    setSubmitting(true)
    try {
      await updateProduct({
        productId: editProduct.productId, name: form.name,
        description: form.description, price: parseFloat(form.price),
        originalPrice: form.originalPrice !== '' ? parseFloat(form.originalPrice) : null,
        amount: parseInt(form.amount), userId: user.id,
        modifiedDate: new Date().toISOString(),
      })
      toast.success('Product updated')
      setEditProduct(null); setForm(EMPTY_FORM); load()
    } catch (err: unknown) { toast.error(err instanceof Error ? err.message : 'Failed') }
    finally { setSubmitting(false) }
  }

  const handleDelete = async () => {
    if (!deleteTarget || !user) return
    try {
      await deleteProduct(deleteTarget.productId, user.id)
      toast.success('Product deleted')
      setDeleteTarget(null); load()
    } catch (err: unknown) { toast.error(err instanceof Error ? err.message : 'Failed') }
  }

  const openEdit = async (p: Product) => {
    setEditProduct(p)
    setForm({ name: p.name, description: p.description, price: String(p.price), originalPrice: '', amount: String(p.amount), categoryId: String(p.categoryId) })
    try {
      const res = await getProduct(p.productId)
      const full = res.value
      setForm({ name: full.name, description: full.description, price: String(full.price), originalPrice: full.originalPrice != null ? String(full.originalPrice) : '', amount: String(full.amount), categoryId: String(full.categoryId) })
    } catch { /* keep list data */ }
  }

  const openImages = async (p: Product) => {
    setImagesProduct(p)
    try {
      const res = await getImageUrls(p.productId)
      setImageUrls(res.urls ?? [])
    } catch { setImageUrls([]) }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadFile || !imagesProduct || !user) return
    try {
      await uploadImage(imagesProduct.productId, user.id, uploadFile)
      toast.success('Uploaded')
      setUploadFile(null)
      openImages(imagesProduct)
    } catch (err: unknown) { toast.error(err instanceof Error ? err.message : 'Failed') }
  }

  const handleDeleteImage = async (key: string) => {
    if (!imagesProduct) return
    try {
      await deleteImage(imagesProduct.productId, key)
      toast.success('Removed')
      openImages(imagesProduct)
    } catch (err: unknown) { toast.error(err instanceof Error ? err.message : 'Failed') }
  }

  if (!hydrated || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const ProductFormFields = () => (
    <div className="space-y-6">
      <div className="input-floating">
        <input type="text" placeholder=" " value={form.name} onChange={(e) => setField('name', e.target.value)} required />
        <label>{t('admin.productName')}</label>
      </div>
      <div className="input-floating">
        <textarea placeholder=" " rows={3} value={form.description} onChange={(e) => setField('description', e.target.value)} required style={{ resize: 'none' }} />
        <label>{t('admin.description')}</label>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="input-floating">
          <input type="number" placeholder=" " value={form.price} onChange={(e) => setField('price', e.target.value)} required min="0" step="0.01" />
          <label>{t('admin.price')}</label>
        </div>
        <div className="input-floating">
          <input type="number" placeholder=" " value={form.originalPrice} onChange={(e) => setField('originalPrice', e.target.value)} min="0" step="0.01" />
          <label>Original Price (optional)</label>
        </div>
      </div>
      <div className="input-floating">
        <input type="number" placeholder=" " value={form.amount} onChange={(e) => setField('amount', e.target.value)} required min="0" />
        <label>{t('admin.amount')}</label>
      </div>
      <div>
        <label className="block text-[10px] font-sans tracking-widest uppercase text-muted mb-2">{t('admin.category')}</label>
        <select
          value={form.categoryId}
          onChange={(e) => setField('categoryId', e.target.value)}
          required
          className="w-full border-b border-border bg-transparent text-sm text-dark focus:outline-none focus:border-dark py-2.5 px-3.5 font-sans"
        >
          <option value="">Select category</option>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>{c.parentId ? `  ${c.name}` : c.name}</option>
          ))}
        </select>
      </div>
    </div>
  )

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl font-light text-dark tracking-wide">{t('admin.title')}</h1>
          <div className="mt-3 h-px w-16 bg-danger" />
        </div>
        {tab === 'products' && (
          <button onClick={() => { setCreateOpen(true); setForm(EMPTY_FORM) }} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            {t('admin.createProduct')}
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b-2 border-[#2C2C2C] mb-8">
        {([
          { key: 'products' as const, label: 'Products', icon: undefined },
          { key: 'inactive' as const, label: 'Inactive', icon: undefined },
          { key: 'orders' as const, label: 'Orders', icon: undefined },
          { key: 'analytics' as const, label: 'Analytics', icon: <BarChart2 className="w-3.5 h-3.5" /> },
        ]).map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className="flex items-center gap-1.5 font-sans font-black uppercase text-[11px] px-5 py-2.5 transition-colors"
            style={{
              letterSpacing: '0.08em',
              backgroundColor: tab === key ? '#2C2C2C' : 'transparent',
              color: tab === key ? 'white' : '#888',
              borderBottom: tab === key ? '2px solid #BC2C2C' : '2px solid transparent',
              marginBottom: '-2px',
            }}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      {/* Products Tab */}
      {tab === 'products' && (
        loading ? (
          <div className="space-y-2">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
        ) : (
          <div className="bg-surface border border-border overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {['ID', 'Product', 'Category', 'Price', 'Stock', 'Actions'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] font-sans font-medium tracking-widest uppercase text-muted">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((p, i) => (
                  <motion.tr
                    key={p.productId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-border hover:bg-background transition-colors"
                  >
                    <td className="px-4 py-4 text-xs font-sans text-muted tabular-nums">{p.productId}</td>
                    <td className="px-4 py-4">
                      <p className="text-sm font-sans text-dark max-w-[200px] truncate">{p.name}</p>
                    </td>
                    <td className="px-4 py-4 text-xs font-sans text-muted">{p.categoryName}</td>
                    <td className="px-4 py-4 text-sm font-sans text-dark tabular-nums">₾{p.price.toFixed(2)}</td>
                    <td className="px-4 py-4">
                      <span className={`text-xs font-sans px-2 py-0.5 ${p.amount > 0 ? 'bg-primary/10 text-primary' : 'bg-danger/10 text-danger'}`}>
                        {p.amount > 0 ? p.amount : 'Out'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(p)} className="btn-icon w-8 h-8" aria-label="Edit">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => openImages(p)} className="btn-icon w-8 h-8" aria-label="Images">
                          <ImagePlus className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setDeleteTarget(p)} className="btn-icon w-8 h-8 text-danger hover:bg-danger/5" aria-label="Delete">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-border">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button key={i} onClick={() => load(i + 1)}
                    className={`w-7 h-7 text-xs font-sans ${page === i + 1 ? 'bg-dark text-white' : 'text-secondary hover:bg-border'}`}>
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        )
      )}

      {/* Inactive Tab */}
      {tab === 'inactive' && (
        inactiveLoading ? (
          <div className="space-y-2">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
        ) : inactiveProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-sans text-sm text-muted">No inactive products.</p>
          </div>
        ) : (
          <div className="bg-surface border border-border overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {['ID', 'Product', 'Category', 'Price', 'Stock', 'Action'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] font-sans font-medium tracking-widest uppercase text-muted">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {inactiveProducts.map((p, i) => (
                  <motion.tr
                    key={p.productId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-border hover:bg-background transition-colors"
                  >
                    <td className="px-4 py-4 text-xs font-sans text-muted tabular-nums">{p.productId}</td>
                    <td className="px-4 py-4">
                      <p className="text-sm font-sans text-dark max-w-[200px] truncate">{p.name}</p>
                    </td>
                    <td className="px-4 py-4 text-xs font-sans text-muted">{p.categoryName}</td>
                    <td className="px-4 py-4 text-sm font-sans text-dark tabular-nums">₾{p.price.toFixed(2)}</td>
                    <td className="px-4 py-4">
                      <span className="text-xs font-sans px-2 py-0.5 bg-danger/10 text-danger">
                        {p.amount > 0 ? p.amount : 'Out'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => handleActivate(p.productId)}
                        className="flex items-center gap-1.5 font-sans font-black uppercase text-[10px] px-3 py-1.5 transition-colors"
                        style={{ backgroundColor: '#2C2C2C', color: 'white', letterSpacing: '0.06em' }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = '#BC2C2C')}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = '#2C2C2C')}
                      >
                        <RotateCcw className="w-3 h-3" />
                        Activate
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {/* Orders Tab */}
      {tab === 'orders' && (
        <div>
          {/* Status tab strip */}
          <div className="flex overflow-x-auto" style={{ borderBottom: '1px solid #E5E0D0' }}>
            {([null, 0, 1, 2, 3] as const).map((s) => {
              const active = orderStatusFilter === s
              return (
                <button
                  key={s ?? 'all'}
                  onClick={() => setOrderStatusFilter(s)}
                  className="flex items-center gap-2 font-sans text-[11px] px-5 py-3 whitespace-nowrap transition-colors shrink-0"
                  style={{
                    fontWeight: active ? 700 : 400,
                    color: active ? '#2C2C2C' : '#888',
                    borderBottom: active ? '2px solid #BC2C2C' : '2px solid transparent',
                    marginBottom: '-1px',
                    letterSpacing: '0.04em',
                  }}
                >
                  {s !== null && (
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: STATUS_STYLE[s].border }}
                    />
                  )}
                  {s === null ? 'All Orders' : STATUS_LABEL[s]}
                </button>
              )
            })}
            <div className="flex-1" />
            <div className="flex items-center gap-1 px-3 py-2 shrink-0">
              <span className="font-sans text-[10px] uppercase tracking-widest" style={{ color: '#C8C2B0' }}>
                {orders.length} {orders.length === 1 ? 'order' : 'orders'}
              </span>
            </div>
          </div>

          {ordersLoading ? (
            <div className="border-x border-b" style={{ borderColor: '#E5E0D0' }}>
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
            </div>
          ) : orders.length === 0 ? (
            <div className="border-x border-b py-20 text-center" style={{ borderColor: '#E5E0D0' }}>
              <p className="font-sans text-sm" style={{ color: '#888' }}>No orders found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto" style={{ border: '1px solid #E5E0D0', borderTop: 'none' }}>
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: '#2C2C2C' }}>
                    {['# Order', 'Customer', 'Total', 'Date', 'Phone', 'Address', 'Status'].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3.5 text-left font-sans text-[10px] tracking-widest uppercase"
                        style={{ color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o, i) => {
                    const s = STATUS_STYLE[o.status]
                    return (
                      <motion.tr
                        key={o.orderId}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.02 }}
                        className="border-b transition-colors"
                        style={{ borderColor: '#E5E0D0' }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F5F1E3')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <td className="px-4 py-3.5">
                          <span className="font-sans text-xs tabular-nums font-semibold" style={{ color: '#2C2C2C', letterSpacing: '0.04em' }}>
                            #{o.orderId}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="font-sans text-sm font-medium" style={{ color: '#2C2C2C' }}>{o.customerName}</span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="font-sans text-sm tabular-nums font-semibold" style={{ color: '#2C2C2C' }}>
                            ₾{o.totalAmount.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="font-sans text-xs tabular-nums" style={{ color: '#888' }}>
                            {new Date(o.orderDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="font-sans text-xs tabular-nums" style={{ color: '#888' }}>{o.phoneNumber}</span>
                        </td>
                        <td className="px-4 py-3.5 max-w-[180px]">
                          <span className="font-sans text-xs block truncate" style={{ color: '#888' }}>{o.address}</span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className="inline-flex items-center gap-1.5 font-sans text-[11px] font-medium px-2.5 py-1 rounded-full"
                            style={{ backgroundColor: s.bg, color: s.color, border: `1px solid ${s.border}` }}
                          >
                            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: s.border }} />
                            {STATUS_LABEL[o.status]}
                          </span>
                        </td>
                      </motion.tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Analytics Tab */}
      {tab === 'analytics' && <AnalyticsDashboard />}

      {/* Create */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title={t('admin.createProduct')}>
        <form onSubmit={handleCreate} className="space-y-6">
          <ProductFormFields />
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={submitting} className="btn-primary flex-1">{submitting ? t('common.loading') : t('admin.create')}</button>
            <button type="button" onClick={() => setCreateOpen(false)} className="btn-secondary flex-1">{t('common.cancel')}</button>
          </div>
        </form>
      </Modal>

      {/* Edit */}
      <Modal open={!!editProduct} onClose={() => { setEditProduct(null); setForm(EMPTY_FORM) }} title={t('product.edit')}>
        <form onSubmit={handleEdit} className="space-y-6">
          <ProductFormFields />
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={submitting} className="btn-primary flex-1">{submitting ? t('common.loading') : t('admin.update')}</button>
            <button type="button" onClick={() => { setEditProduct(null); setForm(EMPTY_FORM) }} className="btn-secondary flex-1">{t('common.cancel')}</button>
          </div>
        </form>
      </Modal>

      {/* Delete */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title={t('common.delete')} size="sm">
        <p className="text-sm font-sans text-secondary mb-6">
          Delete <strong className="text-dark">{deleteTarget?.name}</strong>? This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={handleDelete} className="btn-primary !bg-danger flex-1">{t('common.delete')}</button>
          <button onClick={() => setDeleteTarget(null)} className="btn-secondary flex-1">{t('common.cancel')}</button>
        </div>
      </Modal>

      {/* Images */}
      <Modal open={!!imagesProduct} onClose={() => { setImagesProduct(null); setImageUrls([]) }} title={t('admin.manageImages')} size="lg">
        <div className="space-y-6">
          {imageUrls.length > 0 ? (
            <div className="grid grid-cols-3 gap-3">
              {imageUrls.map((url, i) => {
                const key = decodeURIComponent(new URL(url.split('?')[0]).pathname.slice(1))
                return (
                  <div key={i} className="relative group aspect-square">
                    <img src={url} alt={`img-${i}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => handleDeleteImage(key)}
                      className="absolute inset-0 bg-dark/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                    >
                      <Trash2 className="w-5 h-5 text-white" />
                    </button>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-sm font-sans text-muted text-center py-6">No images yet</p>
          )}

          <form onSubmit={handleUpload} className="space-y-3">
            <label className="block border-2 border-dashed border-border p-6 text-center cursor-pointer hover:border-primary transition-colors">
              <input type="file" accept="image/*" className="hidden" onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)} />
              <p className="text-sm font-sans text-muted">{uploadFile ? uploadFile.name : 'Click to select image'}</p>
            </label>
            <button type="submit" disabled={!uploadFile} className="btn-primary w-full">Upload Image</button>
          </form>
        </div>
      </Modal>
    </main>
  )
}

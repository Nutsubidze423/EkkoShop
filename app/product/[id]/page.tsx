'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ShoppingBag, Check, Heart, ArrowLeft, Pencil, Trash2, ImagePlus } from 'lucide-react'
import { motion } from 'framer-motion'
import { ImageCarousel } from '@/components/product/ImageCarousel'
import { Modal } from '@/components/ui/Modal'
import { Skeleton } from '@/components/ui/Skeleton'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { useTranslation } from '@/lib/i18n'
import { toast } from '@/store/toastStore'
import { getProduct, getImageUrls, deleteProduct, updateProduct, uploadImage, deleteImage, getAllProducts } from '@/lib/api/products'
import { ProductCard } from '@/components/product/ProductCard'
import type { Product } from '@/lib/types'
import Link from 'next/link'

export default function ProductPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuthStore()
  const { addItem } = useCartStore()
  const { toggleItem, isInWishlist } = useWishlistStore()
  const { t } = useTranslation()

  const [product, setProduct] = useState<Product | null>(null)
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [addedToCart, setAddedToCart] = useState(false)
  const [qty, setQty] = useState(1)

  // Admin state
  const [similarProducts, setSimilarProducts] = useState<Product[]>([])
  const [similarLoading, setSimilarLoading] = useState(false)

  const [editOpen, setEditOpen] = useState(false)
  const [editForm, setEditForm] = useState({ name: '', description: '', price: '', amount: '' })
  const [editLoading, setEditLoading] = useState(false)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  const isAdmin = user?.role === 'Admin'
  const inWishlist = product ? isInWishlist(product.productId) : false
  const inStock = product ? product.amount > 0 : false

  const load = useCallback(async () => {
    if (!id) return
    setLoading(true)
    try {
      const [productRes, urlsRes] = await Promise.all([
        getProduct(Number(id)),
        getImageUrls(Number(id)).catch(() => ({ productId: Number(id), imageUrls: [] })),
      ])
      setProduct(productRes.value)
      setImageUrls(urlsRes.imageUrls ?? [])
      setEditForm({
        name: productRes.value.name,
        description: productRes.value.description,
        price: String(productRes.value.price),
        amount: String(productRes.value.amount),
      })
    } catch {
      router.push('/')
    } finally {
      setLoading(false)
    }
  }, [id, router])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    if (!product) return
    setSimilarLoading(true)
    getAllProducts({ CategoryId: product.categoryId, Page: 1, PageSize: 5 })
      .then((res) => {
        setSimilarProducts(res.value.items.filter((p) => p.productId !== product.productId).slice(0, 4))
      })
      .catch(() => setSimilarProducts([]))
      .finally(() => setSimilarLoading(false))
  }, [product?.categoryId, product?.productId])

  const handleAddToCart = async () => {
    if (!user) { toast.info('Please sign in to add to cart'); return }
    if (!product || !inStock) return
    setAddedToCart(true)
    await addItem({
      cartItemId: 0, userId: user.id, cartId: 0,
      productId: product.productId, productName: product.name,
      productDescription: product.description, price: product.price,
      amount: qty, productCategoryName: product.categoryName,
      imageUrls, createdDate: new Date().toISOString(), updatedDate: new Date().toISOString(),
    })
    setTimeout(() => setAddedToCart(false), 1500)
  }

  const handleWishlist = async () => {
    if (!user) { toast.info('Please sign in'); return }
    if (!product) return
    await toggleItem(product.productId, user.id, product.name)
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!product || !user) return
    setEditLoading(true)
    try {
      await updateProduct({
        productId: product.productId, name: editForm.name,
        description: editForm.description, price: parseFloat(editForm.price),
        amount: parseInt(editForm.amount), userId: user.id,
        modifiedDate: new Date().toISOString(),
      })
      toast.success('Product updated')
      setEditOpen(false)
      load()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Update failed')
    } finally {
      setEditLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!product || !user) return
    try {
      await deleteProduct(product.productId, user.id)
      toast.success('Product deleted')
      router.push('/')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Delete failed')
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadFile || !product || !user) return
    setUploadLoading(true)
    try {
      await uploadImage(product.productId, user.id, uploadFile)
      toast.success('Image uploaded')
      setUploadOpen(false)
      setUploadFile(null)
      load()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploadLoading(false)
    }
  }

  const handleDeleteImage = async (key: string) => {
    if (!product) return
    try {
      await deleteImage(product.productId, key)
      toast.success('Image removed')
      load()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to remove image')
    }
  }

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid lg:grid-cols-2 gap-12">
          <Skeleton className="aspect-[4/3] w-full" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-12 w-40" />
          </div>
        </div>
      </main>
    )
  }

  if (!product) return null

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Back */}
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted hover:text-dark font-sans transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" />
        {t('common.back')}
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        className="grid lg:grid-cols-2 gap-12 xl:gap-20"
      >
        {/* Images */}
        <div>
          <ImageCarousel urls={imageUrls} alt={product.name} aspectRatio="aspect-square" />

          {/* Admin image management */}
          {isAdmin && (
            <div className="mt-4 space-y-3">
              <p className="text-xs text-muted font-sans tracking-wide uppercase">{t('product.uploadImage')}</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setUploadOpen(true)}
                  className="flex items-center gap-2 text-sm font-sans border border-border px-3 py-2 hover:bg-background transition-colors"
                >
                  <ImagePlus className="w-4 h-4" />
                  {t('product.uploadImage')}
                </button>
              </div>
              {imageUrls.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {imageUrls.map((url, i) => {
                    const key = url.split('?')[0].replace('https://ekkoshop.s3.eu-north-1.amazonaws.com/', '')
                    return (
                      <div key={i} className="relative group">
                        <img src={url} alt={`img-${i}`} className="w-full aspect-square object-cover" />
                        <button
                          onClick={() => handleDeleteImage(key)}
                          className="absolute inset-0 bg-dark/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                          aria-label="Delete image"
                        >
                          <Trash2 className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <p className="text-[10px] font-sans tracking-widest uppercase text-muted mb-3">
            {product.categoryName}
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-light text-dark leading-tight mb-4">
            {product.name}
          </h1>
          <div className="h-px w-12 bg-primary mb-6" />

          <p className="font-sans text-3xl font-medium text-dark tabular-nums mb-2">
            {t('common.currency')}{product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>

          <p className={`text-sm font-sans mb-6 ${inStock ? 'text-primary' : 'text-danger'}`}>
            {inStock ? `${t('product.inStock')} (${product.amount})` : t('product.outOfStock')}
          </p>

          <div className="mb-8">
            <p className="text-[10px] font-sans tracking-widest uppercase text-muted mb-3">
              {t('product.description')}
            </p>
            <p className="text-sm font-sans text-secondary leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Qty + CTA */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center border border-border">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center text-secondary hover:text-dark hover:bg-background transition-colors font-sans"
              >
                −
              </button>
              <span className="w-10 text-center text-sm font-medium font-sans tabular-nums">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(product.amount, q + 1))}
                className="w-10 h-10 flex items-center justify-center text-secondary hover:text-dark hover:bg-background transition-colors font-sans"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!inStock || addedToCart}
              className={`flex-1 btn-primary ${addedToCart ? '!bg-primary' : ''}`}
            >
              {addedToCart ? (
                <><Check className="w-4 h-4" />{t('product.addedToCart')}</>
              ) : (
                <><ShoppingBag className="w-4 h-4" />{t('product.addToCart')}</>
              )}
            </button>

            <button
              onClick={handleWishlist}
              className={`w-12 h-12 border flex items-center justify-center transition-all duration-200 ${
                inWishlist ? 'border-danger bg-danger/5' : 'border-border hover:border-dark'
              }`}
              aria-label={inWishlist ? t('product.removeFromWishlist') : t('product.addToWishlist')}
            >
              <Heart className={`w-5 h-5 ${inWishlist ? 'fill-danger text-danger' : 'text-secondary'}`} />
            </button>
          </div>

          {/* Admin edit/delete */}
          {isAdmin && (
            <div className="flex gap-2 mt-6 pt-6 border-t border-border">
              <button onClick={() => setEditOpen(true)} className="btn-secondary text-xs py-2 px-4 flex items-center gap-2">
                <Pencil className="w-3.5 h-3.5" />
                {t('product.edit')}
              </button>
              <button
                onClick={() => setDeleteConfirm(true)}
                className="flex items-center gap-2 text-xs px-4 py-2 text-danger border border-danger hover:bg-danger hover:text-white transition-colors font-sans"
              >
                <Trash2 className="w-3.5 h-3.5" />
                {t('product.delete')}
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Edit modal */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title={t('product.edit')}>
        <form onSubmit={handleEdit} className="space-y-6">
          {[
            { label: t('admin.productName'), key: 'name', type: 'text' },
            { label: t('admin.price'), key: 'price', type: 'number' },
            { label: t('admin.amount'), key: 'amount', type: 'number' },
          ].map(({ label, key, type }) => (
            <div key={key} className="input-floating">
              <input
                type={type}
                placeholder=" "
                value={editForm[key as keyof typeof editForm]}
                onChange={(e) => setEditForm((f) => ({ ...f, [key]: e.target.value }))}
                required
              />
              <label>{label}</label>
            </div>
          ))}
          <div className="input-floating">
            <textarea
              placeholder=" "
              rows={3}
              value={editForm.description}
              onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
              style={{ resize: 'none' }}
            />
            <label>{t('admin.description')}</label>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={editLoading} className="btn-primary flex-1">
              {editLoading ? t('common.loading') : t('admin.update')}
            </button>
            <button type="button" onClick={() => setEditOpen(false)} className="btn-secondary flex-1">
              {t('common.cancel')}
            </button>
          </div>
        </form>
      </Modal>

      {/* Upload modal */}
      <Modal open={uploadOpen} onClose={() => setUploadOpen(false)} title={t('product.uploadImage')}>
        <form onSubmit={handleUpload} className="space-y-6">
          <label className="block border-2 border-dashed border-border p-8 text-center cursor-pointer hover:border-primary transition-colors">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
            />
            <p className="text-sm font-sans text-muted">
              {uploadFile ? uploadFile.name : 'Click to select image'}
            </p>
          </label>
          <button type="submit" disabled={!uploadFile || uploadLoading} className="btn-primary w-full">
            {uploadLoading ? t('common.loading') : 'Upload'}
          </button>
        </form>
      </Modal>

      {/* Similar products */}
      {(similarLoading || similarProducts.length > 0) && (
        <section className="mt-20 pt-10 border-t border-border">
          <p className="text-[10px] font-sans tracking-widest uppercase text-muted mb-2">
            {t('product.youMayAlsoLike')}
          </p>
          <h2 className="font-display text-2xl font-light text-dark mb-8">
            {product.categoryName}
          </h2>
          {similarLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[4/3] w-full" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {similarProducts.map((p, i) => (
                <ProductCard key={p.productId} product={p} index={i} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Delete confirm */}
      <Modal open={deleteConfirm} onClose={() => setDeleteConfirm(false)} title={t('common.delete')} size="sm">
        <p className="text-sm font-sans text-secondary mb-6">
          Are you sure you want to delete <strong className="text-dark">{product.name}</strong>?
          This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={handleDelete} className="btn-primary !bg-danger flex-1">
            {t('common.delete')}
          </button>
          <button onClick={() => setDeleteConfirm(false)} className="btn-secondary flex-1">
            {t('common.cancel')}
          </button>
        </div>
      </Modal>
    </main>
  )
}

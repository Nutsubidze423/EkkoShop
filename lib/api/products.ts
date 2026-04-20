import { apiRequest, buildQuery } from './client'
import type {
  Product,
  PaginatedResponse,
  WishlistItem,
  CartItem,
  ImageUrlsResponse,
  MessageResponse,
  CreateProductResponse,
  ProductsQuery,
  WishlistQuery,
  CartQuery,
} from '@/lib/types'

// ─── Products ─────────────────────────────────────────────────────────────────

export async function getProduct(id: number): Promise<{ success: true; value: Product }> {
  return apiRequest(`/api/Products/${id}`)
}

export async function getAllProducts(
  query: ProductsQuery
): Promise<{ success: true; value: PaginatedResponse<Product> }> {
  return apiRequest(`/api/Products/All${buildQuery(query as unknown as Record<string, string | number | boolean | number[] | undefined>)}`)
}

export async function getImageUrls(productId: number): Promise<ImageUrlsResponse> {
  return apiRequest(`/api/Products/GetImageUrls/${productId}`)
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export async function getCart(
  query: CartQuery
): Promise<{ success: true; value: PaginatedResponse<CartItem> }> {
  return apiRequest(`/api/Cart${buildQuery(query as unknown as Record<string, string | number | boolean | undefined>)}`)
}

export async function addToCart(
  productId: number,
  userId: number,
  quantity: number
): Promise<MessageResponse> {
  return apiRequest('/api/Cart', {
    method: 'POST',
    body: JSON.stringify({ productId, userId, quantity }),
  })
}

export async function removeFromCart(userId: number, productId: number): Promise<MessageResponse> {
  return apiRequest(`/api/Cart/${productId}`, {
    method: 'DELETE',
    body: JSON.stringify({ userId, productId }),
  })
}

// ─── Wishlist ─────────────────────────────────────────────────────────────────

export async function getWishlist(
  query: WishlistQuery
): Promise<{ success: true; value: PaginatedResponse<WishlistItem> }> {
  return apiRequest(`/api/Wishlist${buildQuery(query as unknown as Record<string, string | number | boolean | undefined>)}`)
}

export async function addToWishlist(productId: number, userId: number): Promise<MessageResponse> {
  return apiRequest('/api/Wishlist', {
    method: 'POST',
    body: JSON.stringify({ productId, userId }),
  })
}

export async function removeFromWishlist(
  userId: number,
  productId: number
): Promise<MessageResponse> {
  return apiRequest(`/api/Wishlist/${productId}`, {
    method: 'DELETE',
    body: JSON.stringify({ userId, productId }),
  })
}

// ─── Admin: Products ──────────────────────────────────────────────────────────

export async function createProduct(data: {
  name: string
  description: string
  price: number
  amount: number
  categoryId: number
  userId: number
}): Promise<CreateProductResponse> {
  return apiRequest('/api/admin/products/Create', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateProduct(data: {
  productId: number
  name: string
  description: string
  price: number
  amount: number
  userId: number
  modifiedDate: string
}): Promise<MessageResponse> {
  return apiRequest('/api/admin/products/Update', {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteProduct(productId: number, userId: number): Promise<MessageResponse> {
  return apiRequest('/api/admin/products/Delete', {
    method: 'DELETE',
    body: JSON.stringify({ productId, userId }),
  })
}

export async function uploadImage(
  productId: number,
  userId: number,
  file: File
): Promise<MessageResponse> {
  const form = new FormData()
  form.append('Image', file)
  return apiRequest(
    `/api/admin/products/UploadImage?ProductId=${productId}&UserId=${userId}`,
    { method: 'POST', body: form },
    true
  )
}

export async function deleteImage(
  productId: number,
  imageKey: string
): Promise<MessageResponse> {
  return apiRequest('/api/admin/products/DeleteImage', {
    method: 'DELETE',
    body: JSON.stringify({ productId, imageKey }),
  })
}

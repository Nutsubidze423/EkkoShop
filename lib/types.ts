// ─── Auth ────────────────────────────────────────────────────────────────────

export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  role: string
}

export interface LoginResponse {
  success: true
  token: string
}

export interface RegisterResponse {
  success: true
  message: string
  userId: number
}

export interface MessageResponse {
  success: true
  message: string
}

// ─── Products ─────────────────────────────────────────────────────────────────

export interface Product {
  productId: number
  name: string
  description: string
  price: number
  amount: number
  categoryId: number
  categoryName: string
  imageUrl: string[] | null
  creationDate: string
  modifiedDate: string
}

export interface PaginatedResponse<T> {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}

export interface WishlistItem {
  wishListItemId: number
  userId: number
  productId: number
  productName: string
  productDescription: string
  price: number
  amount: number
  productCategoryName: string
  imageUrls: string[]
  createdDate: string
  updatedDate: string
}

export interface CartItem {
  cartItemId: number
  userId: number
  cartId: number
  productId: number
  productName: string
  productDescription: string
  price: number
  amount: number
  productCategoryName: string
  imageUrls: string[]
  createdDate: string
  updatedDate: string
}

export interface ImageUrlsResponse {
  productId: number
  imageUrls: string[]
}

export interface CreateProductResponse {
  success: true
  productId: number
}

// ─── Errors ───────────────────────────────────────────────────────────────────

export interface ApiErrorShape {
  code: string
  message: string
  field: string
}

// ─── Query params ─────────────────────────────────────────────────────────────

export interface ProductsQuery {
  Search?: string
  CategoryId?: number | number[]
  MinPrice?: number
  MaxPrice?: number
  Available?: boolean
  Page: number
  PageSize: number
}

export interface WishlistQuery {
  UserId: number
  Available?: boolean
  Page: number
  PageSize: number
}

export interface CartQuery {
  UserId: number
  Available?: boolean
  Page: number
  PageSize: number
}

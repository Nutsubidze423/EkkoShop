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
  originalPrice?: number | null
  amount: number
  categoryId: number
  categoryName: string
  imageUrl: string[] | null
  creationDate: string
  modifiedDate: string
}

export interface Review {
  reviewId: number
  productId: number
  userId: number
  author: string
  rating: number
  comment: string
  createdAt: string
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
  Sort?: string
  Page: number
  PageSize: number
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export type OrderStatus = 0 | 1 | 2 | 3 // Pending | Shipped | Paid | Cancelled

export interface Order {
  orderId: number
  userId: number
  customerName: string
  phoneNumber: string
  address: string
  totalAmount: number
  status: OrderStatus
  orderDate: string
}

export interface CreateOrderRequest {
  userId: number
  fullName: string
  email: string
  address: string
  city: string
  phone: string
  items: { productId: number; quantity: number }[]
}

export interface OrdersQuery {
  Statuses?: number[]
  UserId?: number
  CreatedFrom?: string
  CreatedTo?: string
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

// ─── Analytics ────────────────────────────────────────────────────────────────

export interface CategoryRevenue {
  categoryName: string
  revenue: number
}

export interface OrderStatusCount {
  status: string
  count: number
}

export interface TopProduct {
  productId: number
  name: string
  totalSold: number
}

export interface TopCustomer {
  userId: number
  name: string
  totalSpent: number
}

export interface LowStockProduct {
  productId: number
  name: string
  amount: number
}

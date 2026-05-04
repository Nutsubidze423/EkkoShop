import { apiRequest } from './client'
import type {
  CategoryRevenue, OrderStatusCount, TopProduct, TopCustomer, LowStockProduct,
} from '@/lib/types'

export async function getRevenue(from?: string, to?: string): Promise<number> {
  const params = new URLSearchParams()
  if (from) params.set('from', from)
  if (to) params.set('to', to)
  const qs = params.toString()
  return apiRequest<number>(`/api/analytics/revenue${qs ? '?' + qs : ''}`)
}

export async function getCategoryRevenue(): Promise<CategoryRevenue[]> {
  return apiRequest<CategoryRevenue[]>('/api/analytics/category-revenue')
}

export async function getOrderStatusDist(): Promise<OrderStatusCount[]> {
  return apiRequest<OrderStatusCount[]>('/api/analytics/order-status')
}

export async function getTopProducts(take = 8): Promise<TopProduct[]> {
  return apiRequest<TopProduct[]>(`/api/analytics/top-products?take=${take}`)
}

export async function getTopCustomers(take = 8): Promise<TopCustomer[]> {
  return apiRequest<TopCustomer[]>(`/api/analytics/top-customers?take=${take}`)
}

export async function getLowStock(threshold = 10): Promise<LowStockProduct[]> {
  return apiRequest<LowStockProduct[]>(`/api/analytics/low-stock?threshold=${threshold}`)
}

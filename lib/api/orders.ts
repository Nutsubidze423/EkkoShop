import { apiRequest, buildQuery } from './client'
import type { Order, CreateOrderRequest, OrdersQuery, MessageResponse } from '@/lib/types'

export async function createOrder(data: CreateOrderRequest): Promise<MessageResponse> {
  return apiRequest('/api/Orders', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function getOrders(
  query: OrdersQuery
): Promise<{ success: true; value: Order[] }> {
  return apiRequest(
    `/api/AdminOrder${buildQuery(query as unknown as Record<string, string | number | boolean | number[] | undefined>)}`
  )
}

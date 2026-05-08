import { apiRequest, buildQuery } from './client'
import type { Order, OrderItem, CreateOrderRequest, UpdateOrderRequest, OrdersQuery, MessageResponse } from '@/lib/types'

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

export async function getOrderItems(orderId: number): Promise<{ success: true; value: OrderItem[] }> {
  return apiRequest(`/api/AdminOrder/${orderId}/Items`)
}

export async function updateOrder(data: UpdateOrderRequest): Promise<MessageResponse> {
  return apiRequest('/api/AdminOrder', {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

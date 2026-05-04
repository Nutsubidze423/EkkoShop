import { apiRequest } from './client'
import type { Review, PaginatedResponse, MessageResponse } from '@/lib/types'

export async function getProductReviews(
  productId: number,
  page = 1,
  pageSize = 5
): Promise<{ success: true; value: PaginatedResponse<Review> }> {
  return apiRequest(`/api/Reviews/product/${productId}?Page=${page}&PageSize=${pageSize}`)
}

export async function createReview(data: {
  productId: number
  userId: number
  rating: number
  comment: string
}): Promise<MessageResponse> {
  return apiRequest('/api/Reviews', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateReview(data: {
  reviewId: number
  productId: number
  userId: number
  rating: number
  comment: string
  createdAt: string
}): Promise<MessageResponse> {
  return apiRequest('/api/Reviews', {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteReview(data: {
  reviewId: number
  productId: number
  userId: number
}): Promise<MessageResponse> {
  return apiRequest('/api/Reviews', {
    method: 'DELETE',
    body: JSON.stringify(data),
  })
}

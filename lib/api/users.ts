import { apiRequest, buildQuery } from './client'
import type { PaginatedResponse } from '@/lib/types'

export interface AdminUser {
  id: number
  email: string
  firstName: string
  lastName: string
  isActive: boolean
}

export interface AdminUsersQuery {
  Search?: string
  IsActive?: boolean
  Page: number
  PageSize: number
}

export async function getUsers(
  query: AdminUsersQuery
): Promise<{ success: true; value: PaginatedResponse<AdminUser> }> {
  return apiRequest(`/api/AdminUsers/Users${buildQuery(query as unknown as Record<string, string | number | boolean | undefined>)}`)
}

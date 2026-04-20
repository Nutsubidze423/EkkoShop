import type { ApiErrorShape } from '@/lib/types'

export const BASE_URL = 'https://localhost:7060'

export class ApiException extends Error {
  constructor(public readonly error: ApiErrorShape) {
    super(error.message)
    this.name = 'ApiException'
  }
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null
  try {
    return localStorage.getItem('ekko_token')
  } catch {
    return null
  }
}

function buildHeaders(isFormData: boolean): Record<string, string> {
  const headers: Record<string, string> = {}
  if (!isFormData) headers['Content-Type'] = 'application/json'
  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`
  return headers
}

async function parseError(res: Response): Promise<ApiException> {
  try {
    const body = await res.json()
    // ASP.NET validation error shape: { type, title, errors: { Field: [msg] } }
    if (body.errors && typeof body.errors === 'object') {
      const firstField = Object.keys(body.errors)[0] ?? 'Validation'
      const firstMsg: string = body.errors[firstField]?.[0] ?? body.title ?? 'Validation error'
      return new ApiException({ code: 'Validation.Error', message: firstMsg, field: firstField })
    }
    // EkkoShop error shape: { success: false, error: { code, message, field } }
    if (body.error) {
      return new ApiException(body.error as ApiErrorShape)
    }
    return new ApiException({ code: 'Request.Failed', message: body.title ?? 'Request failed', field: 'Request' })
  } catch {
    return new ApiException({ code: 'Request.Failed', message: `HTTP ${res.status}`, field: 'Request' })
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  isFormData = false
): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      ...buildHeaders(isFormData),
      ...(options.headers as Record<string, string> | undefined),
    },
  })

  if (!response.ok) {
    throw await parseError(response)
  }

  // 204 No Content or empty body
  const text = await response.text()
  if (!text) return {} as T
  return JSON.parse(text) as T
}

export function buildQuery(params: Record<string, string | number | boolean | number[] | undefined>): string {
  const parts: string[] = []
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === '' || v === null) continue
    if (Array.isArray(v)) {
      for (const item of v) parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(item)}`)
    } else {
      parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    }
  }
  return parts.length ? `?${parts.join('&')}` : ''
}

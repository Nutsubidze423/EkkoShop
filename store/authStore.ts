import { create } from 'zustand'
import type { User } from '@/lib/types'
import { toast } from '@/store/toastStore'

const TOKEN_KEY = 'ekko_token'

const EMAIL_CLAIM = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'
const ROLE_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'

function decodeToken(token: string): User {
  const raw = token.split('.')[1]
  const padded = raw.replace(/-/g, '+').replace(/_/g, '/').padEnd(raw.length + ((4 - (raw.length % 4)) % 4), '=')
  const payload = JSON.parse(atob(padded))
  return {
    id: parseInt(payload['UserId'], 10),
    email: payload[EMAIL_CLAIM] ?? '',
    firstName: payload['FirstName'] ?? '',
    lastName: payload['LastName'] ?? '',
    role: payload[ROLE_CLAIM] ?? 'User',
  }
}

function isTokenExpired(token: string): boolean {
  try {
    const raw = token.split('.')[1]
    const padded = raw.replace(/-/g, '+').replace(/_/g, '/').padEnd(raw.length + ((4 - (raw.length % 4)) % 4), '=')
    const payload = JSON.parse(atob(padded))
    return payload.exp ? Date.now() / 1000 > payload.exp : false
  } catch {
    return true
  }
}

interface AuthState {
  user: User | null
  token: string | null
  hydrated: boolean
  // email/password login — token stored in localStorage
  login: (token: string) => void
  // Google OAuth login — no token, session lives in HttpOnly cookie
  loginFromCookie: (user: User) => void
  logout: () => void
  hydrate: () => Promise<void>
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  token: null,
  hydrated: false,

  login: (token: string) => {
    localStorage.setItem(TOKEN_KEY, token)
    set({ token, user: decodeToken(token) })
  },

  loginFromCookie: (user: User) => {
    // No token in localStorage — session authenticated via HttpOnly cookie only.
    // credentials: 'include' on every apiRequest keeps the cookie in play.
    set({ token: null, user })
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY)
    set({ token: null, user: null })
    // Tell the backend to clear the HttpOnly cookie (fire-and-forget)
    import('@/lib/api/auth').then(({ logoutFromServer }) => logoutFromServer())
  },

  hydrate: async () => {
    // --- 1. Try localStorage token (email/password sessions) ---
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) {
      try {
        if (!isTokenExpired(token)) {
          set({ token, user: decodeToken(token), hydrated: true })
          return
        }
      } catch {
        // malformed token, fall through
      }
      localStorage.removeItem(TOKEN_KEY)
    }

    // --- 2. Try HttpOnly cookie (Google OAuth sessions) ---
    // Import lazily to avoid a circular dependency at module initialisation time.
    try {
      const { getMe } = await import('@/lib/api/auth')
      const user = await getMe()
      set({ token: null, user, hydrated: true })
      return
    } catch {
      // 401 or network error — user is not authenticated
    }

    set({ hydrated: true })
  },
}))

// Clear auth state when the API signals session expiry (401)
if (typeof window !== 'undefined') {
  window.addEventListener('ekko:session-expired', () => {
    localStorage.removeItem(TOKEN_KEY)
    useAuthStore.setState({ token: null, user: null })
    toast.info('Your session expired. Please sign in again.')
  })
}

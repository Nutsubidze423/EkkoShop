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
  login: (token: string) => void
  logout: () => void
  hydrate: () => void
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  token: null,
  hydrated: false,

  login: (token: string) => {
    localStorage.setItem(TOKEN_KEY, token)
    set({ token, user: decodeToken(token) })
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY)
    set({ token: null, user: null })
  },

  hydrate: () => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) {
      try {
        if (isTokenExpired(token)) {
          localStorage.removeItem(TOKEN_KEY)
          set({ token: null, user: null, hydrated: true })
          return
        }
        set({ token, user: decodeToken(token), hydrated: true })
      } catch {
        localStorage.removeItem(TOKEN_KEY)
        set({ token: null, user: null, hydrated: true })
      }
    } else {
      set({ hydrated: true })
    }
  },
}))

// Listen for session expiry dispatched by apiRequest on 401 or expired token
if (typeof window !== 'undefined') {
  window.addEventListener('ekko:session-expired', () => {
    useAuthStore.setState({ token: null, user: null })
    toast.info('Your session expired. Please sign in again.')
  })
}

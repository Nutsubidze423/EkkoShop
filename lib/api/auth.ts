import { apiRequest } from './client'
import type {
  LoginResponse,
  RegisterResponse,
  MessageResponse,
} from '@/lib/types'

export async function login(email: string, password: string): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/api/Authentication/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export async function register(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  confirmPassword: string
): Promise<RegisterResponse> {
  return apiRequest<RegisterResponse>('/api/Authentication/Register', {
    method: 'POST',
    body: JSON.stringify({ firstName, lastName, email, password, confirmPassword }),
  })
}

export async function verifyEmail(email: string, verificationCode: string): Promise<MessageResponse> {
  return apiRequest<MessageResponse>('/api/Authentication/VerifyEmail', {
    method: 'POST',
    body: JSON.stringify({ email, verificationCode }),
  })
}

export async function sendPasswordRecovery(email: string): Promise<MessageResponse> {
  return apiRequest<MessageResponse>('/api/Authentication/SendPasswordRecovery', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

export async function verifyRecoveryCode(email: string, recoveryCode: string): Promise<MessageResponse> {
  return apiRequest<MessageResponse>('/api/Authentication/VerifyPasswordRecoveryCode', {
    method: 'POST',
    body: JSON.stringify({ email, recoveryCode }),
  })
}

export async function resetPassword(
  email: string,
  newPassword: string,
  confirmPassword: string
): Promise<MessageResponse> {
  return apiRequest<MessageResponse>('/api/Authentication/ResetPassword', {
    method: 'POST',
    body: JSON.stringify({ email, newPassword, confirmPassword }),
  })
}

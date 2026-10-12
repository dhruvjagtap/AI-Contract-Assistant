import { apiFetch } from '@/lib/api'

export interface RegisterRequest {
  full_name: string
  email: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface TokenResponse {
  access_token: string
  token_type: string
}

export interface UserResponse {
  id: string
  full_name: string | null
  email: string
}

export async function loginUser(
  data: LoginRequest,
): Promise<TokenResponse> {
  return apiFetch<TokenResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function registerUser(
  data: RegisterRequest,
): Promise<TokenResponse> {
  return apiFetch<TokenResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function getCurrentUser(): Promise<UserResponse> {
  return apiFetch<UserResponse>('/auth/me')
}

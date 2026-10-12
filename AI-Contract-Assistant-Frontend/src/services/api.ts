import axios from 'axios'

// Prepared service layer. Currently unused because the app runs on mock
// data, but wired up so a real backend can be swapped in without touching
// components — only the functions in documentService / chatService change.
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('aca_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8000'

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = localStorage.getItem('access_token')

  const headers = new Headers(options.headers)

  if (!(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  let response: Response

  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    })
  } catch {
    throw new Error(
      'Unable to connect to the server. Please check your connection and try again.',
    )
  }

  if (!response.ok) {
    let message = 'Something went wrong. Please try again.'

    try {
      const error = await response.json()

      if (typeof error.detail === 'string') {
  message = error.detail
} else if (Array.isArray(error.detail)) {
  const validationErrors = error.detail
    .map((item: any) => {
      if (item.loc?.includes('password')) {
        return 'Password must be at least 8 characters long.'
      }

      return item.msg
    })
    .filter(Boolean)

  message = validationErrors.join(', ')
}

      if (typeof error.detail === 'string') {
        message = error.detail
      } else if (typeof error.message === 'string') {
        message = error.message
      } else if (Array.isArray(error.detail)) {
        message = error.detail
          .map((item: any) => item.msg)
          .filter(Boolean)
          .join(', ')
      }
    } catch {
      // Response was not JSON.
    }

    // Friendly fallback messages for common HTTP errors
    if (message === 'Something went wrong. Please try again.') {
      switch (response.status) {
        case 400:
          message = 'Invalid request. Please check your input.'
          break

        case 401:
          message = 'Invalid email or password.'
          break

        case 403:
          message = 'You do not have permission to perform this action.'
          break

        case 404:
          message = 'The requested resource was not found.'
          break

        case 409:
          message = 'This information already exists.'
          break

        case 422:
          message = 'Please check the information you entered.'
          break

        case 429:
          message = 'Too many requests. Please try again later.'
          break

        case 500:
          message = 'Server error. Please try again later.'
          break

        case 502:
        case 503:
        case 504:
          message = 'The server is temporarily unavailable. Please try again later.'
          break
      }
    }

    throw new Error(message)
  }

  // DELETE returns 204 and therefore has no JSON body.
  if (response.status === 204) {
    return undefined as T
  }

  return response.json()
}
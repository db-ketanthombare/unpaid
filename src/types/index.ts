export interface ApiResponse<T> {
  data: T
  message?: string
  error?: string
}

export interface PaginationParams {
  page: number
  limit: number
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user' | 'guest'
  createdAt: string
  updatedAt: string
}

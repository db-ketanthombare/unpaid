export const APP_CONFIG = {
  NAME: 'Unpaid UI',
  VERSION: '1.0.0',
  DESCRIPTION: 'Production-grade React application',
} as const

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',
  TIMEOUT: 10000,
} as const

export const ROUTES = {
  HOME: '/',
  NOT_FOUND: '/404',
} as const

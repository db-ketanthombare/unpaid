export const config = {
  app: {
    name: 'Unpaid UI',
    version: '1.0.0',
    environment: import.meta.env.MODE,
  },
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
    timeout: 10000,
  },
  features: {
    analytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    errorReporting: import.meta.env.VITE_ENABLE_ERROR_REPORTING === 'true',
  },
} as const

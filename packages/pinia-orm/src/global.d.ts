// Global compile-time constants
declare let __DEV__: boolean
declare let __TEST__: boolean
declare let __FEATURE_PROD_DEVTOOLS__: boolean
declare let __BROWSER__: boolean
declare let __CI__: boolean
declare let __VUE_DEVTOOLS_TOAST__: (
  message: string,
  type?: 'normal' | 'error' | 'warn'
) => void

declare module '@/composables'

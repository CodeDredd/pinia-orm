export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt',
    '@pinia-orm/nuxt'
  ],

  vite: {
    esbuild: {
      tsconfigRaw: {
        compilerOptions: {
          experimentalDecorators: true,
        }
      }
    }
  },

  compatibilityDate: '2025-04-10'
})
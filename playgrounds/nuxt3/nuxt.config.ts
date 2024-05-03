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
  }
})

import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt',
    '@pinia-orm/nuxt'
  ],
  // See https://github.com/nuxt/framework/issues/2371
  nitro: {
    externals: {
      inline: ['uuid'],
    },
  },
})

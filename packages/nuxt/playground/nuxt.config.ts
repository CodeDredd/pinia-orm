import { defineNuxtConfig } from 'nuxt/config'
import PiniaOrm from '../src/module'

export default defineNuxtConfig({
  modules: [
    '@nuxt/devtools',
    '@pinia/nuxt',
    PiniaOrm,
  ],
  // See https://github.com/nuxt/framework/issues/2371
  nitro: {
    externals: {
      inline: ['uuid'],
    },
  },
})

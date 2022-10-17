import { defineNuxtConfig } from 'nuxt/config'
import PiniaOrm from '..'

export default defineNuxtConfig({
  buildModules: ['@pinia/nuxt'],
  modules: [PiniaOrm],
  // See https://github.com/nuxt/framework/issues/2371
  nitro: {
    externals: {
      inline: ['uuid']
    }
  }
})

import { defineNuxtConfig } from 'nuxt'
import PiniaOrm from '../../nuxt'

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

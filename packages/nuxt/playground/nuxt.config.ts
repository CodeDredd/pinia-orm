import { defineNuxtConfig } from 'nuxt3'
import PiniaOrm from '../../nuxt'

export default defineNuxtConfig({
  buildModules: ['@pinia/nuxt'],
  modules: [PiniaOrm],
  piniaOrm: {
    addPlugin: true,
  },
})

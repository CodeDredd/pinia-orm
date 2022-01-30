import { defineNuxtPlugin } from '#app'
import PiniaOrm from 'pinia-orm'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.pinia.use(PiniaOrm.install())
})

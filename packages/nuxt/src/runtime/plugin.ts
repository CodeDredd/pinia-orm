import { defineNuxtPlugin } from '#app'
import PiniaOrm from 'pinia-orm'
import { setActivePinia } from 'pinia'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.pinia.use(PiniaOrm.install())
  setActivePinia(nuxtApp.pinia)
})

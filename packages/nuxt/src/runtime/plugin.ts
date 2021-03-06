import PiniaOrm from 'pinia-orm'
import { setActivePinia } from 'pinia'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  // eslint-disable-next-line import/no-named-as-default-member
  nuxtApp.pinia.use(PiniaOrm.install())
  setActivePinia(nuxtApp.pinia)
})

import { defineNuxtPlugin } from '#app'
import PiniaOrm from 'pinia-orm'
import { setActivePinia } from 'pinia'

export default defineNuxtPlugin(nuxtApp => {
  // eslint-disable-next-line import/no-named-as-default-member
  nuxtApp.pinia.use(PiniaOrm.install())
  setActivePinia(nuxtApp.pinia)
})

import { createORM } from 'pinia-orm'
import { setActivePinia } from 'pinia'
import { defineNuxtPlugin } from '#app'
import { ormOptions } from '#build/orm-options'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.$pinia.use(createORM(ormOptions))
  setActivePinia(nuxtApp.$pinia)
})

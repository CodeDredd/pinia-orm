import { createORM } from 'pinia-orm'
import { setActivePinia } from 'pinia'
import { defineNuxtPlugin } from '#imports'
import { ormOptions } from '#build/orm-options'

export default defineNuxtPlugin((nuxtApp) => {
  // eslint-disable-next-line import/no-named-as-default-member
  nuxtApp.$pinia.use(createORM(ormOptions))
  setActivePinia(nuxtApp.$pinia)
})

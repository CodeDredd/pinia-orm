import { defineNuxtPlugin } from '@nuxtjs/composition-api'
import { createORM } from 'pinia-orm'

export default defineNuxtPlugin(ctx => {
  // @ts-ignore
  ctx.$pinia.use(createORM())
})

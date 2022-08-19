import { defineNuxtPlugin } from '@nuxtjs/composition-api'
import { createORM } from 'pinia-orm'

export default defineNuxtPlugin(ctx => {
  ctx.pinia.use(createORM())
})

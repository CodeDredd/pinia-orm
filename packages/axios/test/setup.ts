import { createPinia, setActivePinia } from 'pinia'
import { beforeEach } from 'vitest'
import { createApp } from 'vue'
import { Model, createORM, useRepo } from 'pinia-orm'
import axios from 'axios'
import { createPiniaOrmAxios } from '../src'

beforeEach(() => {
  const app = createApp({})
  const pinia = createPinia()
  const piniaOrm = createORM({
    plugins: [
      createPiniaOrmAxios({
        axios,
      }),
    ],
  })
  pinia.use(piniaOrm)
  app.use(pinia)
  setActivePinia(pinia)
  Model.clearBootedModels()
  useRepo(Model).hydratedDataCache.clear()
})

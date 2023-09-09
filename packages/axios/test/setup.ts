import { createPinia, setActivePinia } from 'pinia'
import { beforeAll, beforeEach } from 'vitest'
import { Vue2, createApp, install, isVue2 } from 'vue-demi'
import { Model, createORM, useRepo } from 'pinia-orm'
import axios from 'axios'

beforeAll(() => {
  if (isVue2) {
    Vue2.config.productionTip = false
    Vue2.config.devtools = false
    install(Vue2)
  }
})

beforeEach(() => {
  const app = createApp({})
  const pinia = createPinia()
  pinia.use(createORM({
    axiosApi: {
      axios: axios
    }
  }))
  app.use(pinia)
  setActivePinia(pinia)
  Model.clearBootedModels()
  useRepo(Model).hydratedDataCache.clear()
})

import { createPinia, setActivePinia } from 'pinia'
import { beforeAll, beforeEach, vi } from 'vitest'
import { createApp, install, isVue2, Vue2 } from 'vue-demi'

import PiniaOrm, { Model } from '../src'

vi.mock('uuid', () => ({
  v1: vi.fn(),
}))

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
  pinia.use(PiniaOrm.install())
  app.use(pinia)
  setActivePinia(pinia)
  Model.clearBootedModels()
})

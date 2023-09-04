import { createPinia, setActivePinia } from 'pinia'
import { beforeAll, beforeEach, vi } from 'vitest'
import { Vue2, createApp, install, isVue2 } from 'vue-demi'

import { Model, createORM, useRepo } from '../src'

vi.mock('nanoid/non-secure', () => ({
  customAlphabet: vi.fn(),
  nanoid: vi.fn()
}))

vi.mock('nanoid', () => ({
  customAlphabet: vi.fn(),
  nanoid: vi.fn()
}))

vi.mock('nanoid/async', () => ({
  customAlphabet: vi.fn(),
  nanoid: vi.fn()
}))

vi.mock('uuid', () => ({
  v1: vi.fn(),
  v4: vi.fn()
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
  pinia.use(createORM())
  app.use(pinia)
  setActivePinia(pinia)
  Model.clearBootedModels()
  useRepo(Model).hydratedDataCache.clear()
})

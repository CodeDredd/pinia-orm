import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, vi } from 'vitest'
import { createApp } from 'vue'

import { Model, createORM, useRepo } from '../src'

vi.mock('nanoid/non-secure', () => ({
  customAlphabet: vi.fn(),
  nanoid: vi.fn(),
}))

vi.mock('nanoid', () => ({
  customAlphabet: vi.fn(),
  nanoid: vi.fn(),
}))

vi.mock('uuid', () => ({
  v1: vi.fn(),
  v4: vi.fn(),
}))

beforeEach(() => {
  const app = createApp({})
  const pinia = createPinia()
  pinia.use(createORM())
  app.use(pinia)
  setActivePinia(pinia)
  Model.clearBootedModels()
  useRepo(Model).hydratedDataCache.clear()
})

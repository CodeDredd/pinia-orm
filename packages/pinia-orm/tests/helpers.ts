import { createPinia, getActivePinia, setActivePinia } from 'pinia'
import { nanoid } from 'nanoid'
import { nanoid as nanoidNS } from 'nanoid/non-secure'
import { nanoid as nanoidAsync } from 'nanoid/async'
import { v1, v4 } from 'uuid'
import type { Mock } from 'vitest'
import { expect, vi } from 'vitest'

import { createApp } from 'vue'
import type { Collection, Elements, InstallOptions, Model, PiniaOrmPlugin } from '../src'
import * as Utils from '../src/support/Utils'
import { createORM } from '../src'

interface Entities {
  [name: string]: Elements
}

export function createPiniaORM (options?: InstallOptions, plugins?: PiniaOrmPlugin[]) {
  const app = createApp({})
  const pinia = createPinia()
  const piniaOrm = createORM({ ...options, plugins })
  pinia.use(piniaOrm)
  app.use(pinia)
  setActivePinia(pinia)
}

export function createState (entities: Entities, additionalStoreProperties = {}): any {
  const state = {} as any

  for (const entity in entities) {
    if (!state[entity]) { state[entity] = { data: {}, ...additionalStoreProperties } }

    state[entity].data = entities[entity]
  }

  return state
}

export function fillState (entities: Entities): void {
  getActivePinia().state.value = createState(entities)
}

export function assertState (entities: Entities, additionalStoreProperties?: Record<string, any>): void {
  expect(getActivePinia()?.state.value).toEqual(createState(entities, additionalStoreProperties))
}

export function assertModel<M extends Model> (
  model: M,
  record: Element | any,
): void {
  expect(model.$toJson()).toEqual(record)
}

export function assertModels<M extends Model> (
  models: Collection<M>,
  record: Element[] | any[],
): void {
  models.forEach((model, index) => {
    expect(model.$toJson()).toEqual(record[index])
  })
}

export function assertInstanceOf (
  collection: Collection<any>,
  model: typeof Model,
): void {
  collection.forEach((item) => {
    expect(item).toBeInstanceOf(model)
  })
}

export function mockUid (ids: any[]): void {
  const spy = vi.spyOn(Utils, 'generateId')
  ids.forEach(id => spy.mockImplementationOnce(() => id))
}

export function mockNanoId (ids: any[]): void {
  ids.forEach(id => (nanoid as Mock).mockImplementationOnce(() => id))
}

export function mockNanoIdNS (ids: any[]): void {
  ids.forEach(id => (nanoidNS as Mock).mockImplementationOnce(() => id))
}

export function mockNanoIdAsync (ids: any[]): void {
  ids.forEach(id => (nanoidAsync as Mock).mockImplementationOnce(() => id))
}

export function mockUuidV1 (ids: any[]): void {
  ids.forEach(id => (v1 as Mock).mockImplementationOnce(() => id))
}

export function mockUuidV4 (ids: any[]): void {
  ids.forEach(id => (v4 as Mock).mockImplementationOnce(() => id))
}

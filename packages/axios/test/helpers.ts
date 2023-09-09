import { getActivePinia } from 'pinia'
import { expect } from 'vitest'
import type { Elements } from 'pinia-orm'

interface Entities {
  [name: string]: Elements
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
  // @ts-expect-error
  getActivePinia().state.value = createState(entities)
}

export function assertState (entities: Entities, additionalStoreProperties?: Record<string, any>): void {
  expect(getActivePinia()?.state.value).toEqual(createState(entities, additionalStoreProperties))
}

import { getActivePinia } from 'pinia'
import { nanoid } from 'nanoid/non-secure'
import type { Mock } from 'vitest'
import { expect } from 'vitest'

import type { Collection, Elements, Model } from '../src'

interface Entities {
  [name: string]: Elements
}

export function createState(entities: Entities): any {
  const state = {} as any

  for (const entity in entities) {
    if (!state[entity])
      state[entity] = { data: {} }

    state[entity].data = entities[entity]
  }

  return state
}

export function fillState(entities: Entities): void {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  getActivePinia().state.value = createState(entities)
}

export function assertState(entities: Entities): void {
  expect(getActivePinia()?.state.value).toEqual(createState(entities))
}

export function assertModel<M extends Model>(
  model: M,
  record: Element | any,
): void {
  expect(model.$toJson()).toEqual(record)
}

export function assertModels<M extends Model>(
  models: Collection<M>,
  record: Element[] | any[],
): void {
  models.forEach((model, index) => {
    expect(model.$toJson()).toEqual(record[index])
  })
}

export function assertInstanceOf(
  collection: Collection<any>,
  model: typeof Model,
): void {
  collection.forEach((item) => {
    expect(item).toBeInstanceOf(model)
  })
}

export function mockUid(ids: any[]): void {
  ids.forEach(id => (nanoid as Mock).mockImplementationOnce(() => id))
}

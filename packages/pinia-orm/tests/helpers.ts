import { getActivePinia } from 'pinia'
import { v1 as uuid } from 'uuid'
import { expect, Mock } from 'vitest'

import { Collection, Elements, Model, RootState } from '../src'

interface Entities {
  [name: string]: Elements
}

export function createState(entities: Entities): RootState {
  const state = {} as RootState

  // eslint-disable-next-line no-restricted-syntax
  for (const entity in entities) {
    state[entity] = { data: {} }

    state[entity].data = entities[entity]
  }

  return state
}

export function fillState(entities: Entities): void {
  const state: any = {}
  // eslint-disable-next-line no-restricted-syntax
  for (const entity in entities) {
    if (!state[entity]) state[entity] = { data: {} }

    state[entity].data = entities[entity]
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  getActivePinia().state.value = state
}

export function assertState(entities: Entities): void {
  expect(getActivePinia()?.state.value).toEqual(createState(entities))
}

export function assertModel<M extends Model>(
  model: M,
  record: Element | any
): void {
  expect(model.$toJson()).toEqual(record)
}

export function assertModels<M extends Model>(
  models: Collection<M>,
  record: Element[] | any[]
): void {
  models.forEach((model, index) => {
    expect(model.$toJson()).toEqual(record[index])
  })
}

export function assertInstanceOf(
  collection: Collection<any>,
  model: typeof Model
): void {
  collection.forEach((item) => {
    expect(item).toBeInstanceOf(model)
  })
}

export function mockUid(ids: any[]): void {
  ids.forEach((id) => (uuid as Mock).mockImplementationOnce(() => id))
}

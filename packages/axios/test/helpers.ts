import { createPinia, getActivePinia, setActivePinia } from 'pinia'
import { expect } from 'vitest'
import { Repository, Model, useRepo } from 'pinia-orm'
import type { Elements } from 'pinia-orm'
import axios from 'axios'
import { useAxiosApi } from '../src'

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

class ApiRepository<M extends Model> extends Repository<M> {
  axios = axios
  globalApiConfig = {}
  apiConfig = {}

  api () {
    return useAxiosApi(this)
  }
}

export function useApiRepo<M extends Model> (model: M): ApiRepository<M> {
  ApiRepository.useModel = model
  return useRepo(ApiRepository)
}

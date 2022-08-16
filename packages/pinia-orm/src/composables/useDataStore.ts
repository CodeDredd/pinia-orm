import { defineStore } from 'pinia'
import type { Model } from '../model/Model'
import { useStoreActions } from './useStoreActions'

export function useDataStore<M extends Model = Model>(
  id: string,
  options: Record<string, any> | null = null,
) {
  return defineStore(id, {
    state: (): DataStoreState<M> => ({ data: {} }),
    actions: useStoreActions(),
    ...options,
  })
}

export interface DataStoreState<M extends Model = Model> {
  data: Record<string, M>
}

export type DataStore = ReturnType<typeof import('@/composables')['useDataStore']>

import { defineStore } from 'pinia'
import type { Model } from '../model/Model'
import type { InstallOptions } from '../store/Store'
import { useStoreActions } from './useStoreActions'

export function useDataStore<M extends Model = Model>(
  id: string,
  options: Record<string, any> | null = null,
) {
  return defineStore(id, {
    state: (): DataStoreState<M> => ({ data: {}, config: {} }),
    actions: useStoreActions(),
    ...options,
  })
}

export interface DataStoreState<M extends Model = Model> {
  data: Record<string, M>
  config: InstallOptions
}

export type DataStore = ReturnType<typeof import('@/composables')['useDataStore']>

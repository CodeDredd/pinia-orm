import type { DefineStoreOptionsBase } from 'pinia'
import { defineStore } from 'pinia'
import type { Query } from '../query/Query'
import { useStoreActions } from './useStoreActions'

export function useDataStore<S extends DataStoreState, T extends DataStore = DataStore> (
  id: string,
  options: DefineStoreOptionsBase<S, T>,
  query?: Query
) {
  return defineStore(id, {
    state: () => ({ data: {} } as S),
    actions: useStoreActions(query),
    ...options
  })
}

export interface DataStoreState {
  data: Record<string, any>
  [s: string]: any
}

export type DataStore = ReturnType<typeof import('@/composables')['useDataStore']>

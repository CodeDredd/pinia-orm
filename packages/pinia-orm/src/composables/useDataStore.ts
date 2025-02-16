import type { DefineSetupStoreOptions, DefineStoreOptionsBase } from 'pinia'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Query } from '../'
import { config } from '../'
import { useStoreActions } from './useStoreActions'

export function useDataStore<S extends DataStoreState, T extends DataStore = DataStore> (
  id: string,
  options: DefineStoreOptionsBase<S, T>,
  customOptions?: DefineSetupStoreOptions<string, S, T, any>,
  query?: Query<any>,
) {
  if (config.pinia.storeType === 'optionStore') {
    return defineStore(id, {
      state: () => ({ data: {} } as S),
      actions: useStoreActions(query),
      ...options,
    })
  }
  return defineStore(id, () => ({
    data: ref<Record<string, any>>({}),
    ...useStoreActions(query),
    ...options,
  }), customOptions)
}

export interface DataStoreState {
  data: Record<string, any>
  [s: string]: any
}

export type DataStore = ReturnType<typeof import('@/composables')['useDataStore']>

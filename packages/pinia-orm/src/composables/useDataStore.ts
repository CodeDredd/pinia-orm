import { defineStore } from 'pinia'
import { useStoreActions } from './useStoreActions'

export function useDataStore(
  id: string,
  options: Record<string, any> | null = null,
) {
  return defineStore(id, {
    state: (): DataStoreState => ({ data: {} }),
    actions: useStoreActions(),
    ...options,
  })
}

export interface DataStoreState {
  data: Record<string, Record<string, any>>
}

export type DataStore = ReturnType<typeof import('@/composables')['useDataStore']>

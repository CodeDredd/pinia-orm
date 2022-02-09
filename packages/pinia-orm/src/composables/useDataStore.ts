import { defineStore } from 'pinia'
import { useStoreActions } from './useStoreActions'

export function useDataStore(id: string) {
  return defineStore(id, {
    state: () => ({ data: {} }),
    actions: useStoreActions(),
  })
}

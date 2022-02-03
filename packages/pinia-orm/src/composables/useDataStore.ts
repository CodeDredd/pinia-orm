import { defineStore } from 'pinia'
import { useStoreActions } from './useStoreActions'

export const useDataStore = (id: string) =>
  defineStore(id, {
    state: () => ({ data: {} }),
    actions: useStoreActions(),
  })

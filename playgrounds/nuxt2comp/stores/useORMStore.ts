import { defineStore } from 'pinia'
import { useStoreActions } from 'pinia-orm'

export const useORMStore = (id: string) =>
  defineStore(id, {
    state: () => ({ data: {} }),
    actions: useStoreActions(),
  })

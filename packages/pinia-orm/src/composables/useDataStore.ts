import { defineStore } from 'pinia'
import { useStoreActions } from './useStoreActions'

export function useDataStore(
  id: string,
  options: Record<string, any> | null = null,
) {
  return defineStore(id, {
    state: () => ({ data: {} }),
    actions: useStoreActions(),
    ...options,
  })
}

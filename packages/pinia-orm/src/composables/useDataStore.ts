import type { StoreDefinition } from 'pinia'
import { defineStore } from 'pinia'
import { useStoreActions } from './useStoreActions'

export function useDataStore(
  id: string,
  options: Record<string, any> | null = null,
): StoreDefinition {
  return defineStore(id, {
    state: () => ({ data: {} }),
    actions: useStoreActions(),
    ...options,
  })
}

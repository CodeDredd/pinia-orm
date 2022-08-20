import type { Elements } from '../data/Data'
import type { DataStore } from './useDataStore'

export function useStoreActions() {
  return {
    save(this: DataStore, records: Elements) {
      this.data = { ...this.data, ...records }
    },
    insert(this: DataStore, records: Elements) {
      this.data = { ...this.data, ...records }
    },
    update(this: DataStore, records: Elements) {
      this.data = { ...this.data, ...records }
    },
    fresh(this: DataStore, records: Elements) {
      this.data = records
    },
    destroy(this: DataStore, ids: string[]): void {
      const data: Elements = {}

      for (const id in this.data) {
        if (!ids.includes(id))
          data[id] = this.data[id]
      }

      this.data = data
    },
    /**
     * Commit `delete` change to the store.
     */
    delete(this: DataStore, ids: string[]): void {
      const data: Elements = {}

      for (const id in this.data) {
        if (!ids.includes(id))
          data[id] = this.data[id]
      }

      this.data = data
    },
    flush(this: DataStore): void {
      this.data = {}
    },
  }
}

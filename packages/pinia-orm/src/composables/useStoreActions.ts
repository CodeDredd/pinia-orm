import { StoreActions } from 'pinia'

import { Elements } from '../data/Data'

export function useStoreActions(): StoreActions<any> {
  return {
    save(records: Elements) {
      this.data = { ...this.data, ...records }
    },
    insert(records: Elements) {
      this.data = { ...this.data, ...records }
    },
    update(records: Elements) {
      this.data = { ...this.data, ...records }
    },
    fresh(records: Elements) {
      this.data = records
    },
    destroy(ids: string[]): void {
      const data: Elements = {}

      for (const id in this.data) {
        if (!ids.includes(id)) data[id] = this.data[id]
      }

      this.data = data
    },
    /**
     * Commit `delete` change to the store.
     */
    delete(ids: string[]): void {
      const data: Elements = {}

      for (const id in this.data) {
        if (!ids.includes(id)) data[id] = this.data[id]
      }

      this.data = data
    },
    flush(): void {
      this.data = {}
    },
  }
}

import type { Elements } from '../data/Data'
import type { Query } from '../query/Query'
import type { DataStore } from './useDataStore'

export function useStoreActions(query?: Query) {
  return {
    save(this: DataStore, records: Elements, triggerQueryAction = true) {
      this.data = { ...this.data, ...records }

      if (triggerQueryAction && query)
        query.save(Object.values(records))
    },
    insert(this: DataStore, records: Elements, triggerQueryAction = true) {
      this.data = { ...this.data, ...records }

      if (triggerQueryAction && query)
        query.insert(Object.values(records))
    },
    update(this: DataStore, records: Elements, triggerQueryAction = true) {
      this.data = { ...this.data, ...records }

      if (triggerQueryAction && query)
        query.update(Object.values(records))
    },
    fresh(this: DataStore, records: Elements, triggerQueryAction = true) {
      this.data = records

      if (triggerQueryAction && query)
        query.fresh(Object.values(records))
    },
    destroy(this: DataStore, ids: string[], triggerQueryAction = true): void {
      const data: Elements = {}

      for (const id in this.data) {
        if (!ids.includes(id))
          data[id] = this.data[id]
      }

      this.data = data

      if (triggerQueryAction && query)
        query.destroy(ids)
    },
    /**
     * Commit `delete` change to the store.
     */
    delete(this: DataStore, ids: string[], triggerQueryAction = true): void {
      const data: Elements = {}

      for (const id in this.data) {
        if (!ids.includes(id))
          data[id] = this.data[id]
      }

      this.data = data

      if (triggerQueryAction && query)
        query.destroy(ids)
    },
    flush(this: DataStore, _records: Elements, triggerQueryAction = true): void {
      this.data = {}

      if (triggerQueryAction && query)
        query.flush()
    },
  }
}

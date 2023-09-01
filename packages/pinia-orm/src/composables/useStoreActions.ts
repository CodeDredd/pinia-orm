import type { Elements } from '../data/Data'
import type { Query } from '../query/Query'
import type { DataStore } from './useDataStore'

export function useStoreActions (query?: Query) {
  return {
    save (this: DataStore, records: Elements, triggerQueryAction = true) {
      this.data = { ...this.data, ...records }

      if (triggerQueryAction && query) { query.newQuery(this.$id).save(Object.values(records)) }
    },
    insert (this: DataStore, records: Elements, triggerQueryAction = true) {
      this.data = { ...this.data, ...records }

      if (triggerQueryAction && query) { query.newQuery(this.$id).insert(Object.values(records)) }
    },
    update (this: DataStore, records: Elements, triggerQueryAction = true) {
      this.data = { ...this.data, ...records }

      if (triggerQueryAction && query) { query.newQuery(this.$id).update(Object.values(records)) }
    },
    fresh (this: DataStore, records: Elements, triggerQueryAction = true) {
      this.data = records

      if (triggerQueryAction && query) { query.newQuery(this.$id).fresh(Object.values(records)) }
    },
    destroy (this: DataStore, ids: (string | number)[], triggerQueryAction = true): void {
      if (triggerQueryAction && query) {
        query.newQuery(this.$id).newQuery(this.$id).destroy(ids)
      } else {
        const data: Elements = {}

        for (const id in this.data) {
          if (!ids.includes(id)) { data[id] = this.data[id] }
        }

        this.data = data
      }
    },
    /**
     * Commit `delete` change to the store.
     */
    delete (this: DataStore, ids: (string | number)[], triggerQueryAction = true): void {
      if (triggerQueryAction && query) {
        query.whereId(ids).delete()
      } else {
        const data: Elements = {}

        for (const id in this.data) {
          if (!ids.includes(id)) { data[id] = this.data[id] }
        }

        this.data = data
      }
    },
    flush (this: DataStore, _records?: Elements, triggerQueryAction = true): void {
      this.data = {}

      if (triggerQueryAction && query) { query.newQuery(this.$id).flush() }
    }
  }
}

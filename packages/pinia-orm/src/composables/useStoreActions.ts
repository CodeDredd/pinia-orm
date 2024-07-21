import type { Elements } from '../data/Data'
import type { Query } from '../query/Query'
import type { DataStore } from './useDataStore'

export function useStoreActions (query?: Query) {
  return {
    save (this: DataStore, records: Elements, triggerQueryAction = true) {
      this.data = Object.assign({}, this.data, records)

      if (triggerQueryAction && query) { query.newQuery(this.$id).save(Object.values(records)) }
    },
    insert (this: DataStore, records: Elements, triggerQueryAction = true) {
      this.data = Object.assign({}, this.data, records)

      if (triggerQueryAction && query) { query.newQuery(this.$id).insert(Object.values(records)) }
    },
    update (this: DataStore, records: Elements, triggerQueryAction = true) {
      this.data = Object.assign({}, this.data, records)

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
        ids.forEach(id => delete this.data[id])
        // Trigger Vue 2 reactivity
        /* v8 ignore next 3 */
        if (this.data.__ob__) {
          this.data.__ob__.dep.notify()
        }
      }
    },
    /**
     * Commit `delete` change to the store.
     */
    delete (this: DataStore, ids: (string | number)[], triggerQueryAction = true): void {
      if (triggerQueryAction && query) {
        query.whereId(ids).delete()
      } else {
        ids.forEach(id => delete this.data[id])
        // Trigger Vue 2 reactivity
        /* v8 ignore next 3 */
        if (this.data.__ob__) {
          this.data.__ob__.dep.notify()
        }
      }
    },
    flush (this: DataStore, _records?: Elements, triggerQueryAction = true): void {
      this.data = {}

      if (triggerQueryAction && query) { query.newQuery(this.$id).flush() }
    },
  }
}

export type StoreActions = 'insert' | 'flush' | 'delete' | 'update' | 'destroy' | 'save' | 'fresh'

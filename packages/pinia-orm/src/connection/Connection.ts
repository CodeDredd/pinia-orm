import type { Element, Elements } from '../data/Data'
import type { Database } from '../database/Database'
import type { Model } from '../model/Model'
import { useDataStore } from '../composables/useDataStore'

export class Connection {
  /**
   * The database instance.
   */
  database: Database

  /**
   * The entity name.
   */
  model: Model

  /**
   * Create a new connection instance.
   */
  constructor(database: Database, model: Model) {
    this.database = database
    this.model = model
  }

  /**
   * Commit a namespaced store mutation.
   */
  protected commit(name: string, payload?: any): void {
    const newStore = useDataStore(this.model.$entity(), this.model.$piniaOptions())
    const store = newStore()
    if (name && typeof store[name] === 'function')
      store[name](payload)
  }

  /**
   * Get all existing records.
   */
  get(): Elements {
    const newStore = useDataStore(this.model.$entity(), this.model.$piniaOptions())
    const store = newStore()

    return store.$state.data
  }

  /**
   * Find a model by its index id.
   */
  find(id: string): Element | null {
    return this.get()[id] ?? null
  }

  /**
   * Commit `save` mutation to the store.
   */
  save(elements: Elements): void {
    this.commit('save', elements)
  }

  /**
   * Commit `insert` mutation to the store.
   */
  insert(records: Elements): void {
    this.commit('insert', records)
  }

  /**
   * Commit `fresh` mutation to the store.
   */
  fresh(records: Elements): void {
    this.commit('fresh', records)
  }

  /**
   * Commit `update` mutation to the store.
   */
  update(records: Elements): void {
    this.commit('update', records)
  }

  /**
   * Commit `destroy` mutation to the store.
   */
  destroy(ids: string[]): void {
    this.commit('destroy', ids)
  }

  /**
   * Commit `delete` mutation to the store.
   */
  delete(ids: string[]): void {
    this.commit('delete', ids)
  }

  /**
   * Commit `flush` mutation to the store.
   */
  flush(): string[] {
    const deleted = [] as string[]

    const data = this.get()

    for (const id in data) deleted.push(id)

    this.commit('flush')

    return deleted
  }
}

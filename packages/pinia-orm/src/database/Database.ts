import { Pinia, StoreDefinition } from 'pinia'
import { schema as Normalizr } from 'normalizr'
import { Schema, Schemas } from '../schema/Schema'
import { Model } from '../model/Model'
import { Relation } from '../model/attributes/relations/Relation'

export class Database {
  /**
   * The Pinia instance.
   */
  storeGenerator!: (id: string) => StoreDefinition

  store: Pinia | null | undefined = undefined

  /**
   * The name of Vuex Module namespace. Vuex ORM will create Vuex Modules from
   * the registered models, and modules, and define them under this namespace.
   */
  connection!: string

  /**
   * The list of registered models.
   */
  models: Record<string, Model> = {}

  /**
   * The schema definition for the registered models.
   */
  schemas: Schemas = {}

  /**
   * Whether the database has already been installed to Vuex or not.
   * The model registration procedure depends on this flag.
   */
  started: boolean = false

  /**
   * Set the store.
   */
  setStoreGenerator(store: (id: string) => StoreDefinition): this {
    this.storeGenerator = store

    return this
  }

  setStore(store: Pinia): this {
    this.store = store

    return this
  }

  /**
   * Set the connection.
   */
  setConnection(connection: string): this {
    this.connection = connection

    return this
  }

  /**
   * Initialize the database before a user can start using it.
   */
  start(): void {
    this.started = true
  }

  /**
   * Register the given model.
   */
  register<M extends Model>(model: M): void {
    const entity = model.$entity()

    if (!this.models[entity]) {
      this.models[entity] = model

      this.createSchema(model)

      this.registerRelatedModels(model)
    }
  }

  /**
   * Register all related models.
   */
  private registerRelatedModels<M extends Model>(model: M): void {
    const fields = model.$fields()

    for (const name in fields) {
      const attr = fields[name]

      if (attr instanceof Relation) {
        attr.getRelateds().forEach((m) => {
          this.register(m)
        })
      }
    }
  }

  /**
   * Get a model by the specified entity name.
   */
  getModel<M extends Model>(name: string): M {
    return this.models[name] as M
  }

  /**
   * Get schema by the specified entity name.
   */
  getSchema(name: string): Normalizr.Entity {
    return this.schemas[name]
  }

  /**
   * Create schema from the given model.
   */
  private createSchema<M extends Model>(model: M): Normalizr.Entity {
    return (this.schemas[model.$entity()] = new Schema(model).one())
  }
}

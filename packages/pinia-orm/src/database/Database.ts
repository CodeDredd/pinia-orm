import type { Model } from '../model/Model'
import { Relation } from '../model/attributes/relations/Relation'

export class Database {
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
   * Whether the database has already been installed to Pinia or not.
   * The model registration procedure depends on this flag.
   */
  started = false

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
}

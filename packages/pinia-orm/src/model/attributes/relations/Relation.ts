import type { Schema as NormalizrSchema } from '@pinia-orm/normalizr'
import type { Schema } from '../../../schema/Schema'
import type { Collection, Element } from '../../../data/Data'
import type { Query } from '../../../query/Query'
import type { Model } from '../../Model'
import { Attribute } from '../Attribute'

export interface Dictionary {
  [id: string]: Model[]
}

export type deleteModes = 'cascade' | 'set null'

export abstract class Relation extends Attribute {
  /**
   * The parent model.
   */
  parent: Model

  /**
   * The related model.
   */
  related: Model

  /**
   * The delete mode
   */
  onDeleteMode?: deleteModes

  /**
   * Create a new relation instance.
   */
  protected constructor(parent: Model, related: Model) {
    super(parent)
    this.parent = parent
    this.related = related
  }

  /**
   * Get all related models for the relationship.
   */
  abstract getRelateds(): Model[]

  /**
   * Get the related model of the relation.
   */
  getRelated(): Model {
    return this.related
  }

  /**
   * Define the normalizr schema for the relation.
   */
  abstract define(schema: Schema): NormalizrSchema

  /**
   * Attach the relational key to the given relation.
   */
  abstract attach(record: Element, child: Element): void

  /**
   * Set the constraints for an eager loading relation.
   */
  abstract addEagerConstraints(query: Query, models: Collection): void

  /**
   * Match the eagerly loaded results to their parents.
   */
  abstract match(relation: string, models: Collection, query: Query): void

  /**
   * Get all of the primary keys for an array of models.
   */
  protected getKeys(models: Collection, key: string): (string | number)[] {
    return models.map(model => model[key])
  }

  /**
   * Specify how this model should behave on delete
   */
  onDelete(mode?: deleteModes): this {
    this.onDeleteMode = mode

    return this
  }

  /**
   * Run a dictionary map over the items.
   */
  protected mapToDictionary(
    models: Collection,
    callback: (model: Model) => [string, Model],
  ): Dictionary {
    return models.reduce<Dictionary>((dictionary, model) => {
      const [key, value] = callback(model)
      if (!dictionary[key])
        dictionary[key] = []

      dictionary[key].push(value)

      return dictionary
    }, {})
  }
}

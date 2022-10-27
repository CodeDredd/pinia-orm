import type { Schema as NormalizrSchema } from '@pinia-orm/normalizr'
import type { Schema } from '../../../schema/Schema'
import type { Collection, Element } from '../../../data/Data'
import type { Query } from '../../../query/Query'
import type { Model } from '../../Model'
import { Relation } from './Relation'

export class MorphOne extends Relation {
  /**
   * The field name that contains id of the parent model.
   */
  morphId: string

  /**
   * The field name that contains type of the parent model.
   */
  morphType: string

  /**
   * The local key of the model.
   */
  localKey: string

  /**
   * Create a new morph-one relation instance.
   */
  constructor(
    parent: Model,
    related: Model,
    morphId: string,
    morphType: string,
    localKey: string,
  ) {
    super(parent, related)
    this.morphId = morphId
    this.morphType = morphType
    this.localKey = localKey
  }

  /**
   * Get all related models for the relationship.
   */
  getRelateds(): Model[] {
    return [this.related]
  }

  /**
   * Define the normalizr schema for the relation.
   */
  define(schema: Schema): NormalizrSchema {
    return schema.one(this.related, this.parent)
  }

  /**
   * Attach the parent type and id to the given relation.
   */
  attach(record: Element, child: Element): void {
    child[this.morphId] = record[this.localKey]
    child[this.morphType] = this.parent.$entity()
  }

  /**
   * Set the constraints for an eager load of the relation.
   */
  addEagerConstraints(query: Query, models: Collection): void {
    query
      .where(this.morphType, this.parent.$entity())
      .whereIn(this.morphId, this.getKeys(models, this.localKey))
  }

  /**
   * Match the eagerly loaded results to their parents.
   */
  match(relation: string, models: Collection, query: Query): void {
    const dictionary = this.buildDictionary(query.get(false))

    models.forEach((model) => {
      const key = model[this.localKey]

      dictionary[key]
        ? model.$setRelation(relation, dictionary[key])
        : model.$setRelation(relation, null)
    })
  }

  /**
   * Build model dictionary keyed by the relation's foreign key.
   */
  protected buildDictionary(models: Collection): Record<string, Model> {
    return models.reduce<Record<string, Model>>((dictionary, model) => {
      dictionary[model[this.morphId]] = model

      return dictionary
    }, {})
  }

  /**
   * Make a related model.
   */
  make(element?: Element): Model | null {
    return element ? this.related.$newInstance(element) : null
  }
}

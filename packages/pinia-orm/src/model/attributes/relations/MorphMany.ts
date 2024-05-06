import type { Schema as NormalizrSchema } from '@pinia-orm/normalizr'
import type { Schema } from '../../../schema/Schema'
import type { Collection, Element } from '../../../data/Data'
import type { Query } from '../../../query/Query'
import type { Model } from '../../Model'
import type { Dictionary } from './Relation'
import { Relation } from './Relation'

export class MorphMany extends Relation {
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
   * Create a new morph-many relation instance.
   */
  constructor (
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
  getRelateds (): Model[] {
    return [this.related]
  }

  /**
   * Define the normalizr schema for the relation.
   */
  define (schema: Schema): NormalizrSchema {
    return schema.many(this.related, this.parent)
  }

  /**
   * Attach the parent type and id to the given relation.
   */
  attach (record: Element, child: Element): void {
    child[this.morphId] = record[this.localKey]
    child[this.morphType] = this.parent.$entity()
  }

  /**
   * Set the constraints for an eager load of the relation.
   */
  addEagerConstraints (query: Query<any>, models: Collection<any>): void {
    query.where(this.morphType, this.parent.$entity())
    query.whereIn(this.morphId, this.getKeys(models, this.localKey))
  }

  /**
   * Match the eagerly loaded results to their parents.
   */
  match (relation: string, models: Collection<any>, query: Query<any>): void {
    const dictionary = this.buildDictionary(query.get(false))

    models.forEach((model) => {
      const key = model[this.localKey]

      dictionary[key]
        ? model.$setRelation(relation, dictionary[key])
        : model.$setRelation(relation, [])
    })
  }

  /**
   * Build model dictionary keyed by the relation's foreign key.
   */
  protected buildDictionary (results: Collection<any>): Dictionary {
    return this.mapToDictionary(results, (result) => {
      return [result[this.morphId as keyof Model] as string, result]
    })
  }

  /**
   * Make related models.
   */
  make (elements?: Element[]): Model[] {
    return elements
      ? elements.map(element => this.related.$newInstance(element))
      : []
  }
}

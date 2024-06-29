import type { Schema as NormalizrSchema } from '@pinia-orm/normalizr'
import type { Schema } from '../../../schema/Schema'
import type { Collection, Element } from '../../../data/Data'
import type { Query } from '../../../query/Query'
import type { Model } from '../../Model'
import { Relation } from './Relation'

export class MorphToMany extends Relation {
  /**
   * The pivot model.
   */
  pivot: Model

  /**
   * The field name that contains id of the parent model.
   */
  morphId: string

  /**
   * The field name that contains type of the parent model.
   */
  morphType: string

  /**
   * The associated key of the relation.
   */
  relatedId: string

  /**
   * The key name of the parent model.
   */
  parentKey: string

  /**
   * The key name of the related model.
   */
  relatedKey: string

  /**
   * The key name of the pivot data.
   */
  pivotKey = 'pivot'

  /**
   * Create a new morph to many to instance.
   */
  constructor (
    parent: Model,
    related: Model,
    pivot: Model,
    relatedId: string,
    morphId: string,
    morphType: string,
    parentKey: string,
    relatedKey: string,
  ) {
    super(parent, related)

    this.pivot = pivot
    this.morphId = morphId
    this.morphType = morphType
    this.relatedId = relatedId
    this.parentKey = parentKey
    this.relatedKey = relatedKey
  }

  /**
   * Get all related models for the relationship.
   */
  getRelateds (): Model[] {
    return [this.related, this.pivot]
  }

  /**
   * Define the normalizr schema for the relationship.
   */
  define (schema: Schema): NormalizrSchema {
    return schema.many(this.related, this.parent)
  }

  /**
   * Attach the parent type and id to the given relation.
   */
  attach (record: Element, child: Element): void {
    const pivot = child.pivot ?? {}
    pivot[this.morphId] = record[this.parentKey]
    pivot[this.morphType] = this.parent.$entity()
    pivot[this.relatedId] = child[this.relatedKey]
    child[`pivot_${this.relatedId}_${this.pivot.$entity()}`] = pivot
  }

  /**
   * Convert given value to the appropriate value for the attribute.
   */
  make (elements?: Element[]): Model[] {
    return elements
      ? elements.map(element => this.related.$newInstance(element))
      : []
  }

  /**
   * Match the eagerly loaded results to their parents.
   */
  match (relation: string, models: Collection<any>, query: Query<any>): void {
    const relatedModels = query.get(false)
    const pivotModels = query
      .newQuery(this.pivot.$modelEntity())
      .whereIn(this.relatedId, this.getKeys(relatedModels, this.relatedKey))
      .whereIn(this.morphId, this.getKeys(models, this.parentKey))
      .groupBy(this.morphId, this.relatedId, this.morphType)
      .get<'group'>()

    models.forEach((parentModel) => {
      const relationResults: Model[] = []
      relatedModels.forEach((relatedModel) => {
        const pivot = pivotModels[`[${parentModel[this.parentKey]},${relatedModel[this.relatedKey]},${this.parent.$entity()}]`]?.[0] ?? null

        const relatedModelCopy = relatedModel.$newInstance(relatedModel.$toJson(), { operation: undefined })
        relatedModelCopy.$setRelation('pivot', pivot)

        if (pivot) { relationResults.push(relatedModelCopy) }
      })
      parentModel.$setRelation(relation, relationResults)
    })
  }

  /**
   * Set the constraints for the related relation.
   */
  addEagerConstraints (_query: Query, _collection: Collection): void {}
}

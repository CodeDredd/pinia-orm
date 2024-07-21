import type { Schema as NormalizrSchema } from '@pinia-orm/normalizr'
import type { Schema } from '../../../schema/Schema'
import type { Collection, Element } from '../../../data/Data'
import type { Query } from '../../../query/Query'
import type { Model } from '../../Model'
import { Relation } from './Relation'

export class MorphedByMany extends Relation {
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
    const pivot = record[this.pivotKey] ?? {}
    pivot[this.morphId] = child[this.relatedKey]
    pivot[this.morphType] = this.related.$entity()
    pivot[this.relatedId] = record[this.parentKey]
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
      .whereIn(this.relatedId, this.getKeys(models, this.parentKey))
      .whereIn(this.morphId, this.getKeys(relatedModels, this.relatedKey))
      .groupBy(this.relatedId, this.morphType)
      .get<'group'>()

    models.forEach((parentModel) => {
      const relationResults: Model[] = []
      const resultModelIds = this.getKeys(pivotModels[`[${parentModel[this.parentKey]},${this.related.$entity()}]`] ?? [], this.morphId)
      const relatedModelsFiltered = relatedModels.filter(filterdModel => resultModelIds.includes(filterdModel[this.relatedKey]))

      relatedModelsFiltered.forEach((relatedModel) => {
        const pivot = (pivotModels[`[${parentModel[this.parentKey]},${this.related.$entity()}]`] ?? []).find(pivotModel => pivotModel[this.morphId] === relatedModel[this.relatedKey]) ?? null
        const relatedModelCopy = relatedModel.$newInstance(relatedModel.$toJson(), { operation: undefined })
        if (pivot) { relatedModelCopy.$setRelation(this.pivotKey, pivot, true) }
        relationResults.push(relatedModelCopy)
      })
      parentModel.$setRelation(relation, relationResults)
    })
  }

  /**
   * Set the constraints for the related relation.
   */
  addEagerConstraints (_query: Query, _collection: Collection<any>): void {}

  /**
   * Specify the custom pivot accessor to use for the relationship.
   */
  as (accessor: string): this {
    this.pivotKey = accessor

    return this
  }
}

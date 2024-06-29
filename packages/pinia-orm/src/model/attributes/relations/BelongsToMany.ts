import type { Schema as NormalizrSchema } from '@pinia-orm/normalizr'
import type { Schema } from '../../../schema/Schema'
import type { Collection, Element } from '../../../data/Data'
import type { Query } from '../../../query/Query'
import type { Model } from '../../Model'
import { Relation } from './Relation'

export class BelongsToMany extends Relation {
  /**
   * The pivot model.
   */
  pivot: Model

  /**
   * The foreign key of the parent model.
   */
  foreignPivotKey: string

  /**
   * The associated key of the relation.
   */
  relatedPivotKey: string

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
   * Create a new belongs to instance.
   */
  constructor (
    parent: Model,
    related: Model,
    pivot: Model,
    foreignPivotKey: string,
    relatedPivotKey: string,
    parentKey: string,
    relatedKey: string,
  ) {
    super(parent, related)

    this.pivot = pivot
    this.foreignPivotKey = foreignPivotKey
    this.relatedPivotKey = relatedPivotKey
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
    pivot[this.foreignPivotKey] = record[this.parentKey]
    pivot[this.relatedPivotKey] = child[this.relatedKey]
    child[`pivot_${this.relatedPivotKey}_${this.pivot.$entity()}`] = pivot
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
      .whereIn(this.relatedPivotKey, this.getKeys(relatedModels, this.relatedKey))
      .whereIn(this.foreignPivotKey, this.getKeys(models, this.parentKey))
      .groupBy(this.foreignPivotKey, this.relatedPivotKey)
      .get<'group'>()

    models.forEach((parentModel) => {
      const relationResults: Model[] = []
      relatedModels.forEach((relatedModel) => {
        const pivot = pivotModels[`[${parentModel[this.parentKey]},${relatedModel[this.relatedKey]}]`]?.[0] ?? null

        if (!pivot) { return }

        const relatedModelCopy = relatedModel.$newInstance(relatedModel.$toJson(), { operation: undefined })
        relatedModelCopy.$setRelation('pivot', pivot)
        relationResults.push(relatedModelCopy)
      })
      parentModel.$setRelation(relation, relationResults)
    })
  }

  /**
   * Set the constraints for the related relation.
   */
  addEagerConstraints (_query: Query, _collection: Collection): void {}
}

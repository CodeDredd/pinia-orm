import type { Schema as NormalizrSchema } from 'normalizr'
import type { Schema } from '../../../schema/Schema'
import type { Collection, Element } from '../../../data/Data'
import type { Query } from '../../../query/Query'
import type { Model } from '../../Model'
import type { Dictionary } from './Relation'
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
  constructor(
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
  getRelateds(): Model[] {
    return [this.related]
  }

  /**
   * Define the normalizr schema for the relationship.
   */
  define(schema: Schema): NormalizrSchema {
    return schema.many(this.related)
  }

  /**
   * Attach the parent type and id to the given relation.
   */
  attach(record: Element, child: Element): void {
    child.pivot = { user_id: record[this.parentKey], role_id: child[this.relatedKey], ...(child.pivot ? child.pivot : {}) }
  }

  /**
   * Build model dictionary keyed by the relation's foreign key.
   */
  protected buildDictionary(results: Collection): Dictionary {
    return this.mapToDictionary(results, (result) => {
      if (!result.pivot)
        console.error('Pinia ORM - Pivot not found')

      return [result.pivot[this.foreignPivotKey], result]
    })
  }

  /**
   * Convert given value to the appropriate value for the attribute.
   */
  make(elements?: Element[]): Model[] {
    return elements
      ? elements.map(element => this.related.$newInstance(element))
      : []
  }

  /**
   * Match the eagerly loaded results to their parents.
   */
  /**
   * Match the eagerly loaded results to their parents.
   */
  match(relation: string, models: Collection, query: Query): void {
    const relatedModels = query.get()
    relatedModels.forEach((model) => {
      const key = model[this.relatedKey]
      const pivot = query.newQuery(this.pivot.$entity())
        .where(this.relatedPivotKey, key)
        // .where(this.relatedPivotKey, this.model.$getLocalKey())
        .first()
      model.$setRelation('pivot', pivot)
    })

    const dictionary = this.buildDictionary(relatedModels)

    models.forEach((model) => {
      const key = model[this.relatedKey]

      dictionary[key]
        ? model.$setRelation(relation, dictionary[key])
        : model.$setRelation(relation, [])
    })
  }

  /**
   * Set the constraints for the related relation.
   */
  addEagerConstraints(query: Query, collection: Collection): void {
    query.database.register(this.pivot)

    const pivotKeys = query.newQuery(this.pivot.$entity()).where(
      this.foreignPivotKey,
      this.getKeys(collection, this.parentKey),
    ).get().map((item: Model) => item[this.relatedPivotKey])

    query.whereIn(
      this.relatedKey,
      pivotKeys,
    )
  }
}

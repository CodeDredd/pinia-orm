import type { Schema as NormalizrSchema } from '@pinia-orm/normalizr'
import type { Schema } from '../../../schema/Schema'
import type { Collection, Element } from '../../../data/Data'
import type { Query } from '../../../query/Query'
import type { Model, PrimaryKey } from '../../Model'
import type { Dictionary } from './Relation'
import { Relation } from './Relation'

export class HasMany extends Relation {
  /**
   * The foreign key of the parent model.
   */
  foreignKey: PrimaryKey

  /**
   * The local key of the parent model.
   */
  localKey: PrimaryKey

  /**
   * Create a new has-many relation instance.
   */
  constructor (
    parent: Model,
    related: Model,
    foreignKey: PrimaryKey,
    localKey: PrimaryKey,
  ) {
    super(parent, related)
    this.foreignKey = foreignKey
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
   * Attach the relational key to the given relation.
   */
  attach (record: Element, child: Element): void {
    this.compositeKeyMapper(
      this.foreignKey,
      this.localKey,
      (foreignKey, localKey) => {
        child[foreignKey] = record[localKey]
      },
    )
  }

  /**
   * Set the constraints for an eager load of the relation.
   */
  addEagerConstraints (query: Query, models: Collection): void {
    this.compositeKeyMapper(
      this.foreignKey,
      this.localKey,
      (foreignKey, localKey) => query.whereIn(foreignKey, this.getKeys(models, localKey)),
    )
  }

  /**
   * Match the eagerly loaded results to their parents.
   */
  match (relation: string, models: Collection<any>, query: Query<any>): void {
    const dictionary = this.buildDictionary(query.get(false))

    models.forEach((model) => {
      const key = this.getResolvedKey(model, this.localKey)

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
      const key = this.getResolvedKey(result, this.foreignKey)
      return [key, result]
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

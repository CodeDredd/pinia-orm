import type { Schema as NormalizrSchema } from '@pinia-orm/normalizr'
import type { Schema } from '../../../schema/Schema'
import type { Collection, Element } from '../../../data/Data'
import type { Query } from '../../../query/Query'
import type { Model, PrimaryKey } from '../../Model'
import { Relation } from './Relation'

export class BelongsTo extends Relation {
  /**
   * The child model instance of the relation.
   */
  child: Model

  /**
   * The foreign key of the parent model.
   */
  foreignKey: PrimaryKey

  /**
   * The associated key on the parent model.
   */
  ownerKey: PrimaryKey

  /**
   * Create a new belongs-to relation instance.
   */
  constructor (
    parent: Model,
    child: Model,
    foreignKey: PrimaryKey,
    ownerKey: PrimaryKey,
  ) {
    super(parent, child)
    this.foreignKey = foreignKey
    this.ownerKey = ownerKey

    // In the underlying base relation class, this property is referred to as
    // the "parent" as most relations are not inversed. But, since this
    // one is, we will create a "child" property for improved readability.
    this.child = child
  }

  /**
   * Get all related models for the relationship.
   */
  getRelateds (): Model[] {
    return [this.child]
  }

  /**
   * Define the normalizr schema for the relation.
   */
  define (schema: Schema): NormalizrSchema {
    return schema.one(this.child, this.parent)
  }

  /**
   * Attach the relational key to the given relation.
   */
  attach (record: Element, child: Element): void {
    this.compositeKeyMapper(
      this.foreignKey,
      this.ownerKey,
      (foreignKey, ownerKey) => {
        record[foreignKey] = child[ownerKey]
      },
    )
  }

  /**
   * Set the constraints for an eager load of the relation.
   */
  addEagerConstraints (query: Query, models: Collection): void {
    this.compositeKeyMapper(
      this.foreignKey,
      this.ownerKey,
      (foreignKey, ownerKey) => query.whereIn(ownerKey, this.getEagerModelKeys(models, foreignKey)),
    )
  }

  /**
   * Gather the keys from a collection of related models.
   */
  protected getEagerModelKeys (models: Collection<any>, foreignKey: string): (string | number)[] {
    return models.reduce<(string | number)[]>((keys, model) => {
      if (model[foreignKey] !== null) { keys.push(model[foreignKey]) }

      return keys
    }, [])
  }

  /**
   * Match the eagerly loaded results to their respective parents.
   */
  match (relation: string, models: Collection<any>, query: Query): void {
    const dictionary = this.buildDictionary(query.get(false))

    models.forEach((model) => {
      const key = model[this.getKey(this.foreignKey)]

      dictionary[key]
        ? model.$setRelation(relation, dictionary[key])
        : model.$setRelation(relation, null)
    })
  }

  /**
   * Build model dictionary keyed by relation's parent key.
   */
  protected buildDictionary (models: Collection<any>): Record<string, Model> {
    return models.reduce<Record<string, Model>>((dictionary, model) => {
      dictionary[model[this.getKey(this.ownerKey)]] = model

      return dictionary
    }, {})
  }

  /**
   * Make a related model.
   */
  make (element?: Element): Model | null {
    return element ? this.child.$newInstance(element) : null
  }
}

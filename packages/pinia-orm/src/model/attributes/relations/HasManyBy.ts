import type { Schema as NormalizrSchema } from 'normalizr'
import type { Schema } from '../../../schema/Schema'
import type { Collection, Element } from '../../../data/Data'
import type { Query } from '../../../query/Query'
import type { Model } from '../../Model'
import { Relation } from './Relation'

export class HasManyBy extends Relation {
  /**
   * The child model instance of the relation.
   */
  protected child: Model

  /**
   * The foreign key of the parent model.
   */
  protected foreignKey: string

  /**
   * The owner key of the parent model.
   */
  protected ownerKey: string

  /**
   * Create a new has-many-by relation instance.
   */
  constructor(
    parent: Model,
    child: Model,
    foreignKey: string,
    ownerKey: string
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
  getRelateds(): Model[] {
    return [this.child]
  }

  /**
   * Define the normalizr schema for the relation.
   */
  define(schema: Schema): NormalizrSchema {
    return schema.many(this.child, this.parent)
  }

  /**
   * Attach the relational key to the given relation.
   */
  attach(record: Element, child: Element): void {
    // If the child doesn't contain the owner key, just skip here. This happens
    // when child items have uid attribute as its primary key, and it's missing
    // when inserting records. Those ids will be generated later and will be
    // looped again. At that time, we can attach the correct owner key value.
    if (child[this.ownerKey] === undefined) return

    if (!record[this.foreignKey]) record[this.foreignKey] = []

    this.attachIfMissing(record[this.foreignKey], child[this.ownerKey])
  }

  /**
   * Push owner key to foregin key array if owner key doesn't exist in foreign
   * key array.
   */
  protected attachIfMissing(
    foreignKey: (string | number)[],
    ownerKey: string | number
  ): void {
    if (!foreignKey.includes(ownerKey)) foreignKey.push(ownerKey)
  }

  /**
   * Set the constraints for an eager load of the relation.
   */
  addEagerConstraints(query: Query, models: Collection): void {
    query.whereIn(this.ownerKey, this.getEagerModelKeys(models))
  }

  /**
   * Gather the keys from a collection of related models.
   */
  protected getEagerModelKeys(models: Collection): (string | number)[] {
    return models.reduce<(string | number)[]>((keys, model) => {
      return [...keys, ...model[this.foreignKey]]
    }, [])
  }

  /**
   * Match the eagerly loaded results to their parents.
   */
  match(relation: string, models: Collection, query: Query): void {
    const dictionary = this.buildDictionary(query.get())

    models.forEach(model => {
      const relatedModels = this.getRelatedModels(
        dictionary,
        model[this.foreignKey]
      )

      model.$setRelation(relation, relatedModels)
    })
  }

  /**
   * Build model dictionary keyed by the relation's foreign key.
   */
  protected buildDictionary(models: Collection): Record<string, Model> {
    return models.reduce<Record<string, Model>>((dictionary, model) => {
      dictionary[model[this.ownerKey]] = model

      return dictionary
    }, {})
  }

  /**
   * Get all related models from the given dictionary.
   */
  protected getRelatedModels(
    dictionary: Record<string, Model>,
    keys: (string | number)[]
  ): Model[] {
    return keys.reduce<Model[]>((items, key) => {
      const item = dictionary[key]

      item && items.push(item)

      return items
    }, [])
  }

  /**
   * Make related models.
   */
  make(elements?: Element[]): Model[] {
    return elements
      ? elements.map(element => this.child.$newInstance(element))
      : []
  }
}

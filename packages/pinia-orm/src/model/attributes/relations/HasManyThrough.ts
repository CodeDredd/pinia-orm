import type { Schema as NormalizrSchema } from '@pinia-orm/normalizr'
import type { Schema } from '../../../schema/Schema'
import type { Collection, Element } from '../../../data/Data'
import type { Query } from '../../../query/Query'
import type { Model } from '../../Model'
import type { Dictionary } from './Relation'
import { Relation } from './Relation'

export class HasManyThrough extends Relation {
  /**
   * The "through" parent model.
   */
  through: Model

  /**
   * The near key on the relationship.
   */
  firstKey: string

  /**
   * The far key on the relationship.
   */
  secondKey: string

  /**
   * The local key on the relationship.
   */
  localKey: string

  /**
   * The local key on the intermediary model.
   */
  secondLocalKey: string

  /**
   * Create a new has-many-through relation instance.
   */
  constructor (
    parent: Model,
    related: Model,
    through: Model,
    firstKey: string,
    secondKey: string,
    localKey: string,
    secondLocalKey: string,
  ) {
    super(parent, related)
    this.through = through
    this.firstKey = firstKey
    this.secondKey = secondKey
    this.localKey = localKey
    this.secondLocalKey = secondLocalKey
  }

  /**
   * Get all related models for the relationship.
   */
  getRelateds (): Model[] {
    return [this.related, this.through]
  }

  /**
   * Define the normalizr schema for the relation.
   */
  define (schema: Schema): NormalizrSchema {
    return schema.many(this.related, this.parent)
  }

  /**
   * Attach the relational key to the given data. Since has many through
   * relationship doesn't have any foreign key, it would do nothing.
   */
  attach (_record: Element, _child: Element): void {}

  /**
   * Only register missing through relation
   */
  addEagerConstraints (_query: Query, _models: Collection): void {}

  /**
   * Match the eagerly loaded results to their parents.
   */
  match (relation: string, models: Collection, query: Query): void {
    const throughModels = query
      .newQuery(this.through.$entity())
      .where(this.firstKey, this.getKeys(models, this.localKey))
      .get(false)
    const relatedModels = query
      .where(this.secondKey, this.getKeys(throughModels, this.secondLocalKey))
      .groupBy(this.secondKey)
      .get(false)
    const dictionary = this.buildDictionary(throughModels, relatedModels)

    models.forEach((model) => {
      const key = model[this.localKey]

      dictionary[key]
        ? model.$setRelation(relation, dictionary[key][0])
        : model.$setRelation(relation, [])
    })
  }

  /**
   * Build model dictionary keyed by the relation's foreign key.
   */
  protected buildDictionary (throughResults: Collection, results: Collection): Dictionary {
    return this.mapToDictionary(throughResults, (throughResult) => {
      return [throughResult[this.firstKey], results[throughResult[this.secondLocalKey]]]
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

import type { Schema as NormalizrSchema } from 'normalizr'
import { schema as Normalizr } from 'normalizr'
import { isArray, isNullish } from '../support/Utils'
import { Uid } from '../model/attributes/types/Uid'
import { Relation } from '../model/attributes/relations/Relation'
import type { Model } from '../model/Model'

export type Schemas = Record<string, Normalizr.Entity>

export class Schema {
  /**
   * The list of generated schemas.
   */
  private schemas: Schemas = {}

  /**
   * The model instance.
   */
  private model: Model

  /**
   * Create a new Schema instance.
   */
  constructor(model: Model) {
    this.model = model
  }

  /**
   * Create a single schema.
   */
  one(model?: Model, parent?: Model): Normalizr.Entity {
    model = model || this.model
    parent = parent || this.model

    const entity = `${model.$entity()}${parent.$entity()}`

    if (this.schemas[entity]) return this.schemas[entity]

    const schema = this.newEntity(model, parent)

    this.schemas[entity] = schema

    const definition = this.definition(model)

    schema.define(definition)

    return schema
  }

  /**
   * Create an array schema for the given model.
   */
  many(model: Model, parent?: Model): Normalizr.Array {
    return new Normalizr.Array(this.one(model, parent))
  }

  /**
   * Create an union schema for the given models.
   */
  union(models: Model[], callback: Normalizr.SchemaFunction): Normalizr.Union {
    const schemas = models.reduce<Schemas>((schemas, model) => {
      schemas[model.$entity()] = this.one(model)

      return schemas
    }, {})

    return new Normalizr.Union(schemas, callback)
  }

  /**
   * Create a new normalizr entity.
   */
  private newEntity(model: Model, parent: Model): Normalizr.Entity {
    const entity = model.$entity()
    const idAttribute = this.idAttribute(model, parent)

    return new Normalizr.Entity(entity, {}, { idAttribute })
  }

  /**
   * The `id` attribute option for the normalizr entity.
   *
   * Generates any missing primary keys declared by a Uid attribute. Missing
   * primary keys where the designated attributes do not exist will
   * throw an error.
   *
   * Note that this will only generate uids for primary key attributes since it
   * is required to generate the "index id" while the other attributes are not.
   *
   * It's especially important when attempting to "update" records since we'll
   * want to retain the missing attributes in-place to prevent them being
   * overridden by newly generated uid values.
   *
   * If uid primary keys are omitted, when invoking the "update" method, it will
   * fail because the uid values will never exist in the store.
   *
   * While it would be nice to throw an error in such a case, instead of
   * silently failing an update, we don't have a way to detect whether users
   * are trying to "update" records or "inserting" new records at this stage.
   * Something to consider for future revisions.
   */
  private idAttribute(
    model: Model,
    parent: Model
  ): Normalizr.StrategyFunction<string> {
    // We'll first check if the model contains any uid attributes. If so, we
    // generate the uids during the normalization process, so we'll keep that
    // check result here. This way, we can use this result while processing each
    // record, instead of looping through the model fields each time.
    const uidFields = this.getUidPrimaryKeyPairs(model)

    return (record, parentRecord, key) => {
      // If the `key` is not `null`, that means this record is a nested
      // relationship of the parent model. In this case, we'll attach any
      // missing foreign keys to the record first.
      if (key !== null)
        (parent.$fields()[key] as Relation).attach(parentRecord, record)

      // Next, we'll generate any missing primary key fields defined as
      // uid field.
      for (const key in uidFields) {
        if (isNullish(record[key]))
          record[key] = uidFields[key].make(record[key])
      }

      // Finally, obtain the index id, attach it to the current record at the
      // special `__id` key. The `__id` key is used when we try to retrieve
      // the models via the `revive` method using the data that is currently
      // being normalized.
      const id = model.$getIndexId(record)

      return id
    }
  }

  /**
   * Get all primary keys defined by the Uid attribute for the given model.
   */
  private getUidPrimaryKeyPairs(model: Model): Record<string, Uid> {
    const fields = model.$fields()
    const key = model.$getKeyName()
    const keys = isArray(key) ? key : [key]

    const attributes = {} as Record<string, Uid>

    keys.forEach(k => {
      const attr = fields[k]

      if (attr instanceof Uid) attributes[k] = attr
    })

    return attributes
  }

  /**
   * Create a definition for the given model.
   */
  private definition(model: Model): NormalizrSchema {
    const fields = model.$fields()
    const definition: NormalizrSchema = {}

    for (const key in fields) {
      const field = fields[key]

      if (field instanceof Relation) definition[key] = field.define(this)
    }

    return definition
  }
}

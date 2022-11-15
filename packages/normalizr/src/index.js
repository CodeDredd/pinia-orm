import EntitySchema from './schemas/Entity'
import UnionSchema from './schemas/Union'
import ArraySchema, * as ArrayUtils from './schemas/Array'
import * as ObjectUtils from './schemas/Object'

const visit = (value, parent, key, schema, addEntity, visitedEntities) => {
  if (typeof value !== 'object' || !value) {
    return value
  }

  if (typeof schema === 'object' && (!schema.normalize || typeof schema.normalize !== 'function')) {
    const method = Array.isArray(schema) ? ArrayUtils.normalize : ObjectUtils.normalize
    return method(schema, value, parent, key, visit, addEntity, visitedEntities)
  }

  return schema.normalize(value, parent, key, visit, addEntity, visitedEntities)
}

const addEntities = entities => (schema, processedEntity, value, parent, key) => {
  const schemaKey = schema.key
  const id = schema.getId(value, parent, key)
  if (!(schemaKey in entities)) {
    entities[schemaKey] = {}
  }

  entities[schemaKey][id] = entities[schemaKey][id] ? schema.merge(entities[schemaKey][id], processedEntity) : processedEntity
}

export const schema = {
  Array: ArraySchema,
  Entity: EntitySchema,
  Union: UnionSchema
}

export const normalize = (input, schema) => {
  if (!input || typeof input !== 'object') {
    throw new Error(
      `Unexpected input given to normalize. Expected type to be "object", found "${
        input === null ? 'null' : typeof input
      }".`
    )
  }

  const entities = {}
  const addEntity = addEntities(entities)
  const visitedEntities = {}

  const result = visit(input, input, null, schema, addEntity, visitedEntities)
  return { entities, result }
}

export default class EntitySchema {
  constructor (key, definition = {}, options = {}) {
    if (!key || typeof key !== 'string') {
      throw new Error(`Expected a string key for Entity, but found ${key}.`)
    }

    const {
      idAttribute = 'id',
      mergeStrategy = (entityA, entityB) => {
        return { ...entityA, ...entityB }
      },
      processStrategy = input => ({ ...input })
    } = options

    this._key = key
    this._getId = idAttribute
    this._mergeStrategy = mergeStrategy
    this._processStrategy = processStrategy
    this.define(definition)
  }

  get key () {
    return this._key
  }

  define (definition) {
    this.schema = Object.keys(definition).reduce((entitySchema, key) => {
      const schema = definition[key]
      return { ...entitySchema, [key]: schema }
    }, this.schema || {})
  }

  getId (input, parent, key) {
    return this._getId(input, parent, key)
  }

  merge (entityA, entityB) {
    return this._mergeStrategy(entityA, entityB)
  }

  normalize (input, parent, key, visit, addEntity, visitedEntities) {
    const id = this.getId(input, parent, key)
    const entityType = this.key

    if (!(entityType in visitedEntities)) {
      visitedEntities[entityType] = {}
    }
    if (!(id in visitedEntities[entityType])) {
      visitedEntities[entityType][id] = []
    }
    if (visitedEntities[entityType][id].includes(input)) {
      return id
    }
    visitedEntities[entityType][id].push(input)

    const processedEntity = this._processStrategy(input, parent, key)
    Object.keys(this.schema).forEach((key) => {
      // eslint-disable-next-line no-prototype-builtins
      if (processedEntity.hasOwnProperty(key) && typeof processedEntity[key] === 'object') {
        const schema = this.schema[key]
        const resolvedSchema = typeof schema === 'function' ? schema(input) : schema
        processedEntity[key] = visit(
          processedEntity[key],
          processedEntity,
          key,
          resolvedSchema,
          addEntity,
          visitedEntities
        )
      }
    })

    addEntity(this, processedEntity, input, parent, key)
    return id
  }
}

import PolymorphicSchema from './Polymorphic'

const validateSchema = (definition) => {
  if (Array.isArray(definition) && definition.length > 1) {
    throw new Error(`Expected schema definition to be a single schema, but found ${definition.length}.`)
  }

  return definition[0]
}

const getValues = input => (Array.isArray(input) ? input : Object.keys(input).map(key => input[key]))

export const normalize = (schema, input, parent, key, visit, addEntity, visitedEntities) => {
  // Special case: Arrays pass *their* parent on to their children, since there
  // is not any special information that can be gathered from themselves directly
  return getValues(input).map(value => visit(value, parent, key, validateSchema(schema), addEntity, visitedEntities))
}

export default class ArraySchema extends PolymorphicSchema {
  normalize (input, parent, key, visit, addEntity, visitedEntities) {
    return getValues(input)
      .map(value => this.normalizeValue(value, parent, key, visit, addEntity, visitedEntities))
      .filter(value => value !== undefined && value !== null)
  }
}

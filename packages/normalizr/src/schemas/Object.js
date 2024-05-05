export const normalize = (schema, input, parent, key, visit, addEntity, visitedEntities) => {
  const object = { ...input }
  Object.keys(schema).forEach((key) => {
    const localSchema = schema[key]
    const resolvedLocalSchema = typeof localSchema === 'function' ? localSchema(input) : localSchema
    const value = visit(input[key], input, key, resolvedLocalSchema, addEntity, visitedEntities)
    if (value === undefined || value === null) {
      delete object[key]
    } else {
      object[key] = value
    }
  })
  return object
}

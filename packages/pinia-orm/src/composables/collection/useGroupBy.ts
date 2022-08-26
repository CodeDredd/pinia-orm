/**
 * The useGroupBy method groups the collection's items by a given key.
 */
export function useGroupBy<T>(models: T[], fields: string[] | string): Record<string, T[]> {
  const grouped: Record<string, T[]> = {}
  const props = Array.isArray(fields) ? fields : [fields]

  models.forEach((model) => {
    const key = props.length === 1 ? model[props[0]] : `[${props.map(field => model[field]).toString()}]`
    grouped[key] = (grouped[key] || []).concat(model)
  })

  return grouped
}

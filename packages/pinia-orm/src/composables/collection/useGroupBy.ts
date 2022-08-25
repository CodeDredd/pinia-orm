import type { Collection, Model } from '../../../src'

/**
 * Get the sum value of the specified filed.
 */
export function useGroupBy<M extends Model = Model>(models: Collection<M>, fields: string[] | string): Record<string, Collection<M>> {
  const grouped: Record<string, Collection<M>> = {}
  const props = Array.isArray(fields) ? fields : [fields]

  models.forEach((model) => {
    const key = props.length === 1 ? model[props[0]] : `[${props.map(field => model[field]).toString()}]`
    grouped[key] = (grouped[key] || []).concat(model)
  })

  return grouped
}

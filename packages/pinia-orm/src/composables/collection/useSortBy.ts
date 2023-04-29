import type { SortFlags } from '../../support/Utils'
import { orderBy } from '../../support/Utils'

export type sorting<T> = ((record: T) => any) | string | [string, 'asc' | 'desc'][]

/**
 * Creates an array of elements, sorted in specified order by the results
 * of running each element in a collection thru each iteratee.
 */
export function useSortBy<T extends Record<string, any>>(collection: T[], sort: sorting<T>, flags?: SortFlags): T[] {
  const directions = []
  const iteratees = []

  typeof sort === 'function' && iteratees.push(sort) && directions.push('asc')
  Array.isArray(sort) && sort.forEach(item => iteratees.push(item[0]) && directions.push(item[1]))
  iteratees.length === 0 && iteratees.push(sort as string)

  return orderBy(collection, iteratees, directions, flags)
}

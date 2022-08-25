import type { Collection, Model } from '../../../src'
import { useSum } from './useSum'
import { useMax } from './useMax'
import { useMin } from './useMin'
import { usePluck } from './usePluck'
import { useKeys } from './useKeys'
import { useGroupBy } from './useGroupBy'
import type { sorting } from './useSortBy'
import { useSortBy } from './useSortBy'

export interface UseCollect<M extends Model = Model> {
  sum: (field: string) => number
  min: (field: string) => number
  max: (field: string) => number
  pluck: (field: string) => any[]
  groupBy: (fields: string[] | string) => Record<string, Collection<M>>
  sortBy: (sort: sorting<M>) => M[]
  keys: () => string[]
}

/**
 * Return all possible helper functions for the collection
 */
export function useCollect<M extends Model = Model>(models: Collection<M>): UseCollect<M> {
  return {
    sum: field => useSum(models, field),
    min: field => useMin(models, field),
    max: field => useMax(models, field),
    pluck: field => usePluck(models, field),
    groupBy: fields => useGroupBy(models, fields),
    sortBy: sort => useSortBy(models, sort),
    keys: () => useKeys(models),
  }
}

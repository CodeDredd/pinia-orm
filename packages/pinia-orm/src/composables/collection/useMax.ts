import type { Collection } from '../../../src'
import { usePluck } from './usePluck'

/**
 * Get the max value of the specified filed.
 */
export function useMax(models: Collection, field: string): number {
  const numbers = usePluck(models, field).filter(item => typeof item === 'number')

  return numbers.length === 0 ? 0 : Math.max(...numbers)
}

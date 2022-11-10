import type { ModelFields } from '../Model'
import { CastAttribute } from './CastAttribute'

export class DateCast extends CastAttribute {
  /**
   * Create a new String attribute instance.
   */
  constructor(attributes: ModelFields) {
    super(attributes)
  }

  get(value: string | null): Date | null {
    return typeof value === 'string' ? new Date(value) : value
  }

  /**
   * Make the value for the attribute.
   */

  set(value: string | Date | null): string | null {
    if (typeof value === 'string')
      return new Date(Date.parse(value)).toISOString()
    if (value instanceof Date)
      return value.toISOString()
    return null
  }
}

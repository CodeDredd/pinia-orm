import type { ModelFields } from '../Model'
import { CastAttribute } from './CastAttribute'

export class DateCast extends CastAttribute {
  /**
   * Create a new String attribute instance.
   */
  constructor (attributes: ModelFields) {
    super(attributes)
  }

  get (value: string | null): Date | null {
    return value === null ? null : new Date(value)
  }

  /**
   * Make the value for the attribute.
   */

  set (value: string | number | Date | null): string | null {
    if (value === null) { return null }

    if (typeof value === 'number') { return new Date(value).toISOString() }
    if (typeof value === 'string') { return new Date(Date.parse(value)).toISOString() }
    return value.toISOString()
  }
}

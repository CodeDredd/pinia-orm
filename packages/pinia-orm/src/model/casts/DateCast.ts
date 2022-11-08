import type { ModelFields } from '../Model'
import { CastAttribute } from './CastAttribute'

export class DateCast extends CastAttribute {
  /**
   * Create a new String attribute instance.
   */
  constructor(attributes: ModelFields) {
    super(attributes)
  }

  get(value?: any): Date {
    return new Date(value)
  }

  /**
   * Make the value for the attribute.
   */
  set(value: string | Date): string {
    return (typeof value === 'string' ? new Date(Date.parse(value)) : value).toISOString()
  }
}

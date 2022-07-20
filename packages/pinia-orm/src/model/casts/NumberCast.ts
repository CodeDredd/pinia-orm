import type { ModelFields } from '../Model'
import { CastAttribute } from './CastAttribute'

export class NumberCast extends CastAttribute {
  /**
   * Create a new String attribute instance.
   */
  constructor(attributes: ModelFields) {
    super(attributes)
  }

  get(value?: any): any {
    if (typeof value === 'number' || value === undefined || value === null)
      return value

    if (typeof value === 'string')
      return parseFloat(value)

    if (typeof value === 'boolean')
      return value ? 1 : 0

    return 0
  }

  /**
   * Make the value for the attribute.
   */
  set(value: any): string | null {
    return this.get(value)
  }
}

import type { ModelFields } from '../Model'
import { CastAttribute } from './CastAttribute'

export class BooleanCast extends CastAttribute {
  /**
   * Create a new String attribute instance.
   */
  constructor(attributes: ModelFields) {
    super(attributes)
  }

  get(value?: any): any {
    if (typeof value === 'boolean' || value === undefined || value === null)
      return value

    if (typeof value === 'string') {
      if (value.length === 0)
        return false

      const int = parseInt(value, 0)

      return isNaN(int) ? true : !!int
    }

    if (typeof value === 'number')
      return !!value

    return false
  }

  /**
   * Make the value for the attribute.
   */
  set(value: any): string | null {
    return this.get(value)
  }
}

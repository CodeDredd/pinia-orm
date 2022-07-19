import type { ModelFields } from '../Model'
import { CastAttribute } from './CastAttribute'

export class StringCast extends CastAttribute {
  /**
   * Create a new String attribute instance.
   */
  constructor(attributes: ModelFields) {
    super(attributes)
  }

  get(value?: any): any {
    return typeof value === 'string' || value === undefined || value === null ? value : `${value}`
  }

  /**
   * Make the value for the attribute.
   */
  set(value: any): string | null {
    return this.get(value)
  }
}

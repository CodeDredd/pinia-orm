import type { ModelFields } from '../Model'
import { CastAttribute } from './CastAttribute'

export class ArrayCast extends CastAttribute {
  /**
   * Create a new String attribute instance.
   */
  constructor(attributes: ModelFields) {
    super(attributes)
  }

  get(value?: any): any {
    return typeof value !== 'string' ? value : JSON.parse(value)
  }

  /**
   * Make the value for the attribute.
   */
  set(value: any): string | null {
    return JSON.stringify(value)
  }
}

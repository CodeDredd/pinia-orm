import type { Model } from '../../Model'
import { Type } from './Type'

export class Boolean extends Type {
  /**
   * Create a new Boolean attribute instance.
   */
  constructor(model: Model, value: boolean | null) {
    super(model, value)
  }

  /**
   * Make the value for the attribute.
   */
  make(value: any): boolean | null {
    return this.makeReturn<boolean | null>('boolean', value, false)
  }
}

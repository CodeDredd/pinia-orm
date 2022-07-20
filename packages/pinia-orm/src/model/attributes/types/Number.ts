import type { Model } from '../../Model'
import { Type } from './Type'

export class Number extends Type {
  /**
   * Create a new Number attribute instance.
   */
  constructor(model: Model, value: number | null) {
    super(model, value)
  }

  /**
   * Make the value for the attribute.
   */
  make(value: any): number | null {
    return this.makeReturn<number | null>('number', value, 0)
  }
}

import type { Model } from '../../Model'
import type { TypeDefault } from './Type'
import { Type } from './Type'

export class Number extends Type {
  /**
   * Create a new Number attribute instance.
   */
  constructor(model: Model, value: TypeDefault<number>) {
    super(model, value)
  }

  /**
   * Make the value for the attribute.
   */
  make(value: any): number | null {
    return this.makeReturn<number | null>('number', value)
  }
}

import type { Model } from '../../Model'
import type { TypeDefault } from './Type'
import { Type } from './Type'

export class Boolean extends Type {
  /**
   * Create a new Boolean attribute instance.
   */
  constructor(model: Model, value: TypeDefault<boolean>) {
    super(model, value)
  }

  /**
   * Make the value for the attribute.
   */
  make(value: any): boolean | null {
    return this.makeReturn<boolean | null>('boolean', value)
  }
}

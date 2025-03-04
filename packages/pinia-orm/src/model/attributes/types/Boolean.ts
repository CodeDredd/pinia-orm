import type { Model } from '../../Model'
import type { TypeDefault } from './Type'
import { Type } from './Type'
import { BooleanCast } from '../../casts/BooleanCast'

export class Boolean extends Type {
  /**
   * Create a new Boolean attribute instance.
   */
  constructor (model: Model, value: TypeDefault<boolean>) {
    super(model, value)
  }

  /**
   * Make the value for the attribute.
   */
  make (value: any): boolean | null {
    const booleanCast = new BooleanCast(value)
    return booleanCast.get(this.makeReturn<boolean | null>('boolean', value))
  }
}

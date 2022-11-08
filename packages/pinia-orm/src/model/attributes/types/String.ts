import type { Model } from '../../Model'
import type { TypeDefault } from './Type'
import { Type } from './Type'

export class String extends Type {
  /**
   * Create a new String attribute instance.
   */
  constructor(model: Model, value: TypeDefault<string>) {
    super(model, value)
  }

  /**
   * Make the value for the attribute.
   */
  make(value: any): string | null {
    return this.makeReturn<string | null>('string', value)
  }
}

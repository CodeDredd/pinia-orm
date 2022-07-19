import type { Model } from '../../Model'
import { Type } from './Type'

export class String extends Type {
  /**
   * Create a new String attribute instance.
   */
  constructor(model: Model, value: string | null) {
    super(model, value)
  }

  /**
   * Make the value for the attribute.
   */
  make(value: any): string | null {
    if (value === undefined)
      return this.value

    if (value === null)
      return this.isNullable ? value : `${value}`

    if (typeof value !== 'string')
      this.throwWarning('string', value)

    return value
  }
}

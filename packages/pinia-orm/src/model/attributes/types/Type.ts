import type { Model } from '../../Model'
import { Attribute } from '../Attribute'

export abstract class Type extends Attribute {
  /**
   * The default value for the attribute.
   */
  protected value: any

  /**
   * Whether the attribute accepts `null` value or not.
   */
  protected isNullable = false

  /**
   * Create a new Type attribute instance.
   */
  constructor(model: Model, value: any = null) {
    super(model)
    this.value = value
  }

  /**
   * Set the nullable option to true.
   */
  nullable(): this {
    this.isNullable = true

    return this
  }

  /**
   * Throw warning for wrong type
   */
  protected throwWarning(type: string, value: any) {
    console.warn(['[Pinia ORM]'].concat([`${this.model.$entity()}:`, value, 'is not a', type]).join(' '))
  }
}

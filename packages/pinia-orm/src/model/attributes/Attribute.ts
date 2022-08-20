import type { Model } from '../Model'

export abstract class Attribute {
  /**
   * The model instance.
   */
  protected model: Model

  /**
   * The field name
   */
  protected key: string

  /**
   * Create a new Attribute instance.
   */
  constructor(model: Model) {
    this.model = model
    this.key = ''
  }

  /**
   * Set the key name of the field
   */
  setKey(key: string): this {
    this.key = key
    return this
  }

  /**
   * Make the value for the attribute.
   */
  abstract make(value?: any): any
}

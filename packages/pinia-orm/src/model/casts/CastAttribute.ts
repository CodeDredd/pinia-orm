import type { ModelFields } from '../Model'

export interface Casts {
  [name: string]: () => CastAttribute | string
}

export abstract class CastAttribute {
  /**
   * The model instance.
   */
  protected attributes: ModelFields

  /**
   * Create a new Attribute instance.
   */
  constructor(attributes: ModelFields) {
    this.attributes = attributes
  }

  /**
   * Make the value for the attribute.
   */
  abstract get(value?: any): any

  /**
   * Make the value for the attribute.
   */
  abstract set(value?: any): any
}

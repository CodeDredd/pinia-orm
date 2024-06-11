import type { Model } from '../../Model'
import { Attribute } from '../Attribute'

export type TypeDefault<T> = T | null | (() => T | null)

export abstract class Type extends Attribute {
  /**
   * The raw default value for the attribute (can be a function).
   */
  rawDefaultValue: any

  /**
   * Whether the attribute accepts `null` value or not.
   */
  protected isNullable = true

  /**
   * Create a new Type attribute instance.
   */
  constructor (model: Model, defaultValue: TypeDefault<any> = null) {
    super(model)
    this.rawDefaultValue = defaultValue
  }

  /**
   * The computed default value of the attribute.
   */
  get defaultValue (): any {
    return typeof this.rawDefaultValue === 'function' ? this.rawDefaultValue() : this.rawDefaultValue
  }

  /**
   * Set the nullable option to false.
   */
  notNullable (): this {
    this.isNullable = false
    return this
  }

  protected makeReturn<T> (type: 'boolean' | 'number' | 'string', value: any): T {
    if (value === undefined) { return this.defaultValue }

    if (value === null) {
      if (!this.isNullable) { this.throwWarning(['is set as non nullable!']) }

      return value
    }

    if (typeof value !== type) { this.throwWarning([value, 'is not a', type]) }

    return value
  }

  /**
   * Throw warning for wrong type
   */
  protected throwWarning (message: string[]) {
    console.warn(['[Pinia ORM]'].concat([`Field ${this.model.$entity()}:${this.key} - `, ...message]).join(' '))
  }
}

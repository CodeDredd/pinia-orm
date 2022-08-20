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
  protected isNullable = true

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
  notNullable(): this {
    this.isNullable = false

    return this
  }

  protected makeReturn<T>(type: string, value: any): T {
    if (value === undefined)
      return this.value

    if (value === null) {
      if (!this.isNullable)
        this.throwWarning(['is set as non nullable!'])

      return value
    }

    if (typeof value !== type)
      this.throwWarning([value, 'is not a', type])

    return value
  }

  /**
   * Throw warning for wrong type
   */
  protected throwWarning(message: string[]) {
    // eslint-disable-next-line no-console
    console.warn(['[Pinia ORM]'].concat([`Field ${this.model.$entity()}:${this.key} - `, ...message]).join(' '))
  }
}

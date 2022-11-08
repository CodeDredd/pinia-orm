import type { ModelFields } from '../Model'

export interface Casts {
  [name: string]: typeof CastAttribute
}

export class CastAttribute {
  /**
   * The model instance.
   */
  protected static attributes: ModelFields | undefined

  /**
   * Cast parameters
   */
  static parameters: Record<string, any>

  /**
   * Default parameters
   */
  $parameters: Record<string, any> = {}

  /**
   * Create a new Attribute instance.
   */
  constructor(attributes: ModelFields | undefined) {
    this.$self().attributes = attributes
    this.$parameters = {
      ...this.$parameters,
      ...this.$self().parameters,
    }
  }

  /**
   * Get the value for return.
   */
  get(value?: any): any {
    return value
  }

  /**
   * Set the value for the store.
   */
  set(value?: any): any {
    return value
  }

  static withParameters(parameters: Record<string, any>): typeof CastAttribute {
    this.parameters = parameters
    return this
  }

  /**
   * Get the cast parameters
   */
  getParameters(): Record<string, any> {
    return this.$parameters
  }

  /**
   * Get the constructor for this cast.
   */
  $self(): typeof CastAttribute {
    return this.constructor as typeof CastAttribute
  }

  /**
   * Generate new instance of cast
   */
  static newRawInstance<M extends typeof CastAttribute>(this: M, attributes: any): InstanceType<M> {
    return new this(attributes) as InstanceType<M>
  }
}

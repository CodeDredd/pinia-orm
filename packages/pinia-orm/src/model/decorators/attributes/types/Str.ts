import type { PropertyDecorator, TypeOptions } from '../../Contracts'
import type { TypeDefault } from '../../../attributes/types/Type'

/**
 * Create a String attribute property decorator.
 */
export function Str(
  value: TypeDefault<string>,
  options: TypeOptions = {},
): PropertyDecorator {
  return (target, propertyKey) => {
    const self = target.$self()

    self.setRegistry(propertyKey, () => {
      const attr = self.string(value)

      if (options.notNullable)
        attr.notNullable()

      return attr
    })
  }
}

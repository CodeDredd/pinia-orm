import type { PropertyDecorator, TypeOptions } from '../../Contracts'
import type { TypeDefault } from '../../../attributes/types/Type'

/**
 * Create a Boolean attribute property decorator.
 */
export function Bool(
  value: TypeDefault<boolean>,
  options: TypeOptions = {},
): PropertyDecorator {
  return (target, propertyKey) => {
    const self = target.$self()

    self.setRegistry(propertyKey, () => {
      const attr = self.boolean(value)

      if (options.notNullable)
        attr.notNullable()

      return attr
    })
  }
}

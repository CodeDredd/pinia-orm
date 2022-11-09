import type { PropertyDecorator, TypeOptions } from '../../Contracts'
import type { TypeDefault } from '../../../attributes/types/Type'

/**
 * Create a Number attribute property decorator.
 */
export function Num(
  value: TypeDefault<number>,
  options: TypeOptions = {},
): PropertyDecorator {
  return (target, propertyKey) => {
    const self = target.$self()

    self.setRegistry(propertyKey, () => {
      const attr = self.number(value)

      if (options.notNullable)
        attr.notNullable()

      return attr
    })
  }
}

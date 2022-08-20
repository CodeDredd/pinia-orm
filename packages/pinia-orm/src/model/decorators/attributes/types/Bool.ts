import type { PropertyDecorator, TypeOptions } from '../../Contracts'

/**
 * Create a Boolean attribute property decorator.
 */
export function Bool(
  value: boolean | null,
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

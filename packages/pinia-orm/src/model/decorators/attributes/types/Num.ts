import type { PropertyDecorator, TypeOptions } from '../../Contracts'

/**
 * Create a Number attribute property decorator.
 */
export function Num(
  value: number | null,
  options: TypeOptions = {},
): PropertyDecorator {
  return (target, propertyKey) => {
    const self = target.$self()

    self.setRegistry(propertyKey, () => {
      const attr = self.number(value)

      if (options.nullable)
        attr.nullable()

      return attr
    })
  }
}

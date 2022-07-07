import type { PropertyDecorator } from '../../Contracts'

/**
 * Create an Attr attribute property decorator.
 */
export function Attr(value?: any): PropertyDecorator {
  return (target, propertyKey) => {
    const self = target.$self()

    self.setRegistry(propertyKey, () => self.attr(value))
  }
}

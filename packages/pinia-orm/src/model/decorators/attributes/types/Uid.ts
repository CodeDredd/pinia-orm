import type { PropertyDecorator } from '../../Contracts'

/**
 * Create a Uid attribute property decorator.
 */
export function Uid(): PropertyDecorator {
  return (target, propertyKey) => {
    const self = target.$self()

    self.setRegistry(propertyKey, () => self.uid())
  }
}

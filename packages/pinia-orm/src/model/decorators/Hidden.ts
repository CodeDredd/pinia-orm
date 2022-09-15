import type { PropertyDecorator } from './Contracts'

/**
 * Create an Mutate attribute property decorator.
 */
export function Hidden(): PropertyDecorator {
  return (target, propertyKey) => {
    const self = target.$self()
    self.setHidden(propertyKey)
  }
}

import type { Model } from '../../../Model'
import type { PropertyDecorator } from '../../Contracts'

/**
 * Create a has-many attribute property decorator.
 */
export function HasManyThrough(
  related: () => typeof Model,
  through: () => typeof Model,
  firstKey: string,
  secondKey: string,
  localKey?: string,
  secondLocalKey?: string,
): PropertyDecorator {
  return (target, propertyKey) => {
    const self = target.$self()

    self.setRegistry(propertyKey, () =>
      self.hasManyThrough(related(), through(), firstKey, secondKey, localKey, secondLocalKey),
    )
  }
}

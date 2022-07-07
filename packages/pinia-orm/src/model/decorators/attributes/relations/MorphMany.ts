import type { Model } from '../../../Model'
import type { PropertyDecorator } from '../../Contracts'

/**
 * Create a morph-many attribute property decorator.
 */
export function MorphMany(
  related: () => typeof Model,
  id: string,
  type: string,
  localKey?: string,
): PropertyDecorator {
  return (target, propertyKey) => {
    const self = target.$self()

    self.setRegistry(propertyKey, () =>
      self.morphMany(related(), id, type, localKey),
    )
  }
}

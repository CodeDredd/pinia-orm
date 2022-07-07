import type { Model } from '../../../Model'
import type { PropertyDecorator } from '../../Contracts'

/**
 * Create a morph-one attribute property decorator.
 */
export function MorphOne(
  related: () => typeof Model,
  id: string,
  type: string,
  localKey?: string,
): PropertyDecorator {
  return (target, propertyKey) => {
    const self = target.$self()

    self.setRegistry(propertyKey, () =>
      self.morphOne(related(), id, type, localKey),
    )
  }
}

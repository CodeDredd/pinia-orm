import type { Model } from '../../../Model'
import type { PropertyDecorator } from '../../Contracts'

/**
 * Create a morph-to attribute property decorator.
 */
export function MorphTo(
  related: () => typeof Model[],
  id: string,
  type: string,
  ownerKey?: string,
): PropertyDecorator {
  return (target, propertyKey) => {
    const self = target.$self()

    self.setRegistry(propertyKey, () =>
      self.morphTo(related(), id, type, ownerKey),
    )
  }
}

import type { Model } from '../../../Model'
import type { PropertyDecorator } from '../../Contracts'

/**
 * Create a morph-to attribute property decorator.
 */
export function MorphToMany(
  related: () => typeof Model,
  pivot: () => typeof Model,
  relatedId: string,
  id: string,
  type: string,
  parentKey?: string,
  relatedKey?: string,
): PropertyDecorator {
  return (target, propertyKey) => {
    const self = target.$self()

    self.setRegistry(propertyKey, () =>
      self.morphToMany(related(), pivot(), relatedId, id, type, parentKey, relatedKey),
    )
  }
}

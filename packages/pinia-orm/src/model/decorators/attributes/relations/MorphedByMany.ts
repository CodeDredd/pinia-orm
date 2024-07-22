import type { Model } from '../../../Model'
import type { PropertyDecorator } from '../../Contracts'

/**
 * Create a morph-to-many attribute property decorator.
 */
export function MorphedByMany (
  related: () => typeof Model,
  pivot: (() => typeof Model) | {
    as: string
    model: () => typeof Model
  },
  relatedId: string,
  id: string,
  type: string,
  parentKey?: string,
  relatedKey?: string,
): PropertyDecorator {
  return (target, propertyKey) => {
    const self = target.$self()

    self.setRegistry(propertyKey, () => {
      if (typeof pivot === 'function') { return self.morphedByMany(related(), pivot(), relatedId, id, type, parentKey, relatedKey) }

      return self.morphedByMany(related(), pivot.model(), relatedId, id, type, parentKey, relatedKey).as(pivot.as)
    })
  }
}

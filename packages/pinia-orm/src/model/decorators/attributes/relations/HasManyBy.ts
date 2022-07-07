import type { Model } from '../../../Model'
import type { PropertyDecorator } from '../../Contracts'

/**
 * Create a has-many-by attribute property decorator.
 */
export function HasManyBy(
  related: () => typeof Model,
  foreignKey: string,
  ownerKey?: string,
): PropertyDecorator {
  return (target, propertyKey) => {
    const self = target.$self()

    self.setRegistry(propertyKey, () =>
      self.hasManyBy(related(), foreignKey, ownerKey),
    )
  }
}

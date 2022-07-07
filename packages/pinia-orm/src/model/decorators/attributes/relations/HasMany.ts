import type { Model } from '../../../Model'
import type { PropertyDecorator } from '../../Contracts'

/**
 * Create a has-many attribute property decorator.
 */
export function HasMany(
  related: () => typeof Model,
  foreignKey: string,
  localKey?: string,
): PropertyDecorator {
  return (target, propertyKey) => {
    const self = target.$self()

    self.setRegistry(propertyKey, () =>
      self.hasMany(related(), foreignKey, localKey),
    )
  }
}

import type { deleteModes } from '../attributes/relations/Relation'
import type { PropertyDecorator } from './Contracts'

/**
 * Define the delete behaviour for a relation
 */
export function OnDelete(mode: deleteModes): PropertyDecorator {
  return (target, propertyKey) => {
    const self = target.$self()
    self.setFieldDeleteMode(propertyKey, mode)
  }
}

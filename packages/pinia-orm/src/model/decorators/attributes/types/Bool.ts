import type { TypeOptions } from '../../Contracts'
import type { FieldDecorator } from '../../Metadata'
import { createFieldDecorator } from '../../Metadata'
import type { TypeDefault } from '../../../attributes/types/Type'

/**
 * Create a Boolean attribute property decorator.
 */
export function Bool (
  value: TypeDefault<boolean>,
  options: TypeOptions = {},
): FieldDecorator {
  return createFieldDecorator((model) => {
    const attr = model.boolean(value)

    if (options.notNullable) { attr.notNullable() }

    return attr
  })
}

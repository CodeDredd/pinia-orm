import type { TypeOptions } from '../../Contracts'
import type { FieldDecorator } from '../../Metadata'
import { createFieldDecorator } from '../../Metadata'
import type { TypeDefault } from '../../../attributes/types/Type'

/**
 * Create a Number attribute property decorator.
 */
export function Num (
  value: TypeDefault<number>,
  options: TypeOptions = {},
): FieldDecorator {
  return createFieldDecorator((model) => {
    const attr = model.number(value)

    if (options.notNullable) { attr.notNullable() }

    return attr
  })
}

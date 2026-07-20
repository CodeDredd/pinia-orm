import type { TypeOptions } from '../../Contracts'
import type { FieldDecorator } from '../../Metadata'
import { createFieldDecorator } from '../../Metadata'
import type { TypeDefault } from '../../../attributes/types/Type'

/**
 * Create a String attribute property decorator.
 */
export function Str (
  value: TypeDefault<string>,
  options: TypeOptions = {},
): FieldDecorator {
  return createFieldDecorator((model) => {
    const attr = model.string(value)

    if (options.notNullable) { attr.notNullable() }

    return attr
  })
}

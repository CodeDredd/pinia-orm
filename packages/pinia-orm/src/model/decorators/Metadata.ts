import type { Model } from '../Model'
import type { Attribute } from '../attributes/Attribute'
import type { MutatorFunctions } from '../../types'
import type { CastAttribute } from '../casts/CastAttribute'
import type { deleteModes } from '../attributes/relations/Relation'
import { throwError } from '../../support/Utils'

// `Symbol.metadata` is required for decorator metadata but not yet shipped
// by all runtimes. The compiled decorator helpers of TypeScript and esbuild
// only attach metadata when it exists, so it has to be polyfilled before
// any decorated model class is defined.

(Symbol as any).metadata ??= Symbol.for('Symbol.metadata')

export const FIELDS = Symbol.for('pinia-orm:fields')
export const MUTATORS = Symbol.for('pinia-orm:mutators')
export const CASTS = Symbol.for('pinia-orm:casts')
export const HIDDEN = Symbol.for('pinia-orm:hidden')
export const FIELDS_ON_DELETE = Symbol.for('pinia-orm:fieldsOnDelete')

/**
 * Creates the attribute for a decorated field. The model class is only
 * known when the schema is built, so it is passed in at that point.
 */
export type AttributeFactory = (model: typeof Model) => Attribute

export interface ModelMetadata {
  [FIELDS]?: Record<string, AttributeFactory>
  [MUTATORS]?: Record<string, MutatorFunctions<any>>
  [CASTS]?: Record<string, typeof CastAttribute>
  [HIDDEN]?: Record<string, true>
  [FIELDS_ON_DELETE]?: Record<string, deleteModes>
}

/**
 * Get a writable record from the decorator metadata for the given key.
 * Metadata objects inherit from the parent class metadata, so the parent
 * entries are copied on first write to keep inheritance intact while not
 * mutating the parent.
 */
export function ownMetadataRecord<T> (metadata: DecoratorMetadata, key: symbol): Record<string, T> {
  if (!Object.prototype.hasOwnProperty.call(metadata, key)) {
    (metadata as ModelMetadata)[key as keyof ModelMetadata] = { ...((metadata as Record<symbol, object>)[key] ?? {}) } as any
  }

  return (metadata as Record<symbol, Record<string, T>>)[key]
}

/**
 * Ensure the decorator runs with the standard (TC39) decorator semantics.
 * With `experimentalDecorators` enabled the second argument is the property
 * name instead of a context object.
 */
export function assertFieldContext (context: unknown): asserts context is ClassFieldDecoratorContext {
  if (!context || typeof context !== 'object' || (context as ClassFieldDecoratorContext).kind !== 'field') {
    throwError([
      'Decorators require the standard ECMAScript decorator semantics.',
      'Please remove "experimentalDecorators" from your tsconfig and use TypeScript >= 5.2.',
    ])
  }
}

/**
 * The initializer returned by field decorators. The model constructor has
 * already hydrated the fields when class field initializers run, so the
 * hydrated value is kept instead of letting the field wipe it.
 */
function keepHydratedValue<This, Value> (context: ClassFieldDecoratorContext<This, Value>) {
  return function (this: This, _initialValue: Value): Value {
    return (this as Model)[context.name as keyof Model] as Value
  }
}

export type FieldDecorator = <This, Value>(value: undefined, context: ClassFieldDecoratorContext<This, Value>) => (this: This, value: Value) => Value

/**
 * Create a standard field decorator which registers the given attribute
 * factory for the decorated field.
 */
export function createFieldDecorator (factory: AttributeFactory): FieldDecorator {
  return (_value, context) => {
    assertFieldContext(context)
    ownMetadataRecord<AttributeFactory>(context.metadata, FIELDS)[String(context.name)] = factory

    return keepHydratedValue(context)
  }
}

/**
 * Create a standard field decorator which only registers metadata (mutators,
 * casts, ...) for the decorated field without touching its value.
 */
export function createRegistrationDecorator (register: (context: ClassFieldDecoratorContext) => void): FieldDecorator {
  return (_value, context) => {
    assertFieldContext(context)
    register(context as ClassFieldDecoratorContext)

    return keepHydratedValue(context)
  }
}

import { throwError } from '../../support/Utils'

/**
 * Marks a property as non enumerable so it is skipped during enumeration
 * (e.g. Object.keys, for...in or JSON.stringify). Must be used together
 * with the `accessor` keyword: `@NonEnumerable accessor pivot!: Pivot`.
 */
export function NonEnumerable (
  _target: ClassAccessorDecoratorTarget<unknown, unknown>,
  context: ClassAccessorDecoratorContext | { kind?: string },
): void {
  if (!context || typeof context !== 'object' || context.kind !== 'accessor') {
    throwError([
      'The NonEnumerable decorator requires the `accessor` keyword,',
      'e.g. `@NonEnumerable accessor hidden!: string`.',
    ])
  }

  (context as ClassAccessorDecoratorContext).addInitializer(function (this: unknown) {
    // Ensure the accessor property on the prototype is non enumerable —
    // some transpilers define it as enumerable.
    let proto = Object.getPrototypeOf(this)

    while (proto) {
      const descriptor = Object.getOwnPropertyDescriptor(proto, (context as ClassAccessorDecoratorContext).name)

      if (descriptor) {
        if (descriptor.enumerable) {
          Object.defineProperty(proto, (context as ClassAccessorDecoratorContext).name, { ...descriptor, enumerable: false })
        }
        break
      }

      proto = Object.getPrototypeOf(proto)
    }
  })
}

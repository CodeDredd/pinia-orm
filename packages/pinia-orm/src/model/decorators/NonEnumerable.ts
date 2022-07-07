/**
 * Sets an object property to be innumerable.
 */
export function NonEnumerable(target: any, propertyKey: string) {
  const descriptor
    = Object.getOwnPropertyDescriptor(target, propertyKey)
    || (Object.create(null) as PropertyDescriptor)

  /* istanbul ignore else */
  if (descriptor.enumerable !== false) {
    // eslint-disable-next-line accessor-pairs
    Object.defineProperty(target, propertyKey, {
      enumerable: false,
      set(value: any) {
        Object.defineProperty(this, propertyKey, {
          enumerable: false,
          writable: true,
          value,
        })
      },
    })
  }
}

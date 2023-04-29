import type { Element } from '@'

interface SortableArray<T> {
  criteria: any[]
  index: number
  value: T
}

export type SortFlags = 'SORT_REGULAR' | 'SORT_FLAG_CASE'

/**
 * Compare two values with custom string operator
 */
export function compareWithOperator(leftValue: any, rightValue: any, operator?: string): boolean {
  switch (operator) {
    case '>': return leftValue > rightValue
    case '>=': return leftValue >= rightValue
    case '<': return leftValue < rightValue
    case '<=': return leftValue <= rightValue
    case '=': return leftValue === rightValue
    case '!=': return leftValue !== rightValue
    default: return leftValue === rightValue
  }
}

/**
 * Check if the given value is the type of undefined or null.
 */
export function isNullish(value: any): value is undefined | null {
  return value === undefined || value === null
}

/**
 * Check if the given value is the type of array.
 */
export function isArray(value: any): value is any[] {
  return Array.isArray(value)
}

/**
 * Check if the given value is the type of array.
 */
export function isFunction(value: any): value is Function {
  return typeof value === 'function'
}

/**
 * Check if the given array or object is empty.
 */
export function isEmpty(collection: any[] | object): boolean {
  return size(collection) === 0
}

/**
 * Gets the size of collection by returning its length for array-like values
 * or the number of own enumerable string keyed properties for objects.
 */
export function size(collection: any[] | object): number {
  return isArray(collection)
    ? collection.length
    : Object.keys(collection).length
}

/**
 * Creates an array of elements, sorted in specified order by the results
 * of running each element in a collection thru each iteratee.
 */
export function orderBy<T extends Element>(
  collection: T[],
  iteratees: (((record: T) => any) | string)[],
  directions: string[],
  flags: SortFlags = 'SORT_REGULAR',
): T[] {
  let index = -1

  const result = collection.map<SortableArray<T>>((value) => {
    const criteria = iteratees.map((iteratee) => {
      return typeof iteratee === 'function' ? iteratee(value) : value[iteratee]
    })

    return { criteria, index: ++index, value }
  })

  return baseSortBy(result, (object, other) => {
    return compareMultiple(object, other, directions, flags)
  })
}

/**
 * Creates an array of elements, sorted in ascending order by the results of
 * running each element in a collection thru each iteratee. This method
 * performs a stable sort, that is, it preserves the original sort order
 * of equal elements.
 */
function baseSortBy<T>(
  array: SortableArray<T>[],
  comparer: (a: SortableArray<T>, B: SortableArray<T>) => number,
): T[] {
  let length = array.length

  array.sort(comparer)

  const newArray: T[] = []

  while (length--) newArray[length] = array[length].value

  return newArray
}

/**
 * Used by `orderBy` to compare multiple properties of a value to another
 * and stable sort them.
 *
 * If `orders` is unspecified, all values are sorted in ascending order.
 * Otherwise, specify an order of "desc" for descending or "asc" for
 * ascending sort order of corresponding values.
 */
function compareMultiple<T>(
  object: SortableArray<T>,
  other: SortableArray<T>,
  directions: string[],
  flags: SortFlags,
): number {
  let index = -1

  const objCriteria = object.criteria
  const othCriteria = other.criteria
  const length = objCriteria.length

  while (++index < length) {
    const result = compareAscending(objCriteria[index], othCriteria[index], flags)

    if (result) {
      const direction = directions[index]
      return result * (direction === 'desc' ? -1 : 1)
    }
  }

  return object.index - other.index
}

/**
 * Compares values to sort them in ascending order.
 */
function compareAscending(value: any, other: any, flags: SortFlags): number {
  if (value !== other) {
    const valIsDefined = value !== undefined
    const valIsNull = value === null
    const valIsReflexive = value === value

    const othIsDefined = other !== undefined
    const othIsNull = other === null

    if (typeof value !== 'number' || typeof other !== 'number') {
      value = String(value)
      other = String(other)

      if (flags === 'SORT_FLAG_CASE') {
        value = value.toUpperCase()
        other = other.toUpperCase()
      }
    }

    if (
      (!othIsNull && value > other)
      || (valIsNull && othIsDefined)
      || !valIsDefined
      || !valIsReflexive
    )
      return 1

    return -1
  }

  return 0
}

/**
 * Creates an object composed of keys generated from the results of running
 * each element of collection through iteratee.
 */
export function groupBy<T extends Element>(
  collection: T[],
  iteratee: (record: T) => string,
): { [key: string]: T[] } {
  return collection.reduce((records: Record<string, any>, record) => {
    const key = iteratee(record)

    if (records[key] === undefined)
      records[key] = []

    records[key].push(record)

    return records
  }, {})
}

/**
 * Asserts that the condition is truthy, throwing immediately if not.
 */
export function throwError(
  message: string[],
): void {
  throw new Error(['[Pinia ORM]'].concat(message).join(' '))
}

/**
 * Asserts that the condition is truthy, throwing immediately if not.
 */
export function assert(
  condition: boolean,
  message: string[],
): asserts condition {
  if (!condition)
    throwError(message)
}

export function generateId(size: number, urlAlphabet: string) {
  let id = ''
  // A compact alternative for `for (var i = 0; i < step; i++)`.
  let i = size
  while (i--) {
    // `| 0` is more compact and faster than `Math.floor()`.
    id += urlAlphabet[(Math.random() * 64) | 0]
  }
  return id
}

/**
 * Get a unique string for an key with object params
 */
export function generateKey(key: string, params?: any): string {
  const keyValues = params ? { key, params } : { key }
  const stringifiedKey = JSON.stringify(keyValues)

  // This check allows to generate base64 strings depending on the current environment.
  // If the window object exists, we can assume this code is running in a browser.
  return typeof process === 'undefined'
    ? btoa(stringifiedKey)
    : stringifiedKey
}

/**
 * Get a value based on a dot-notation key.
 */
export function getValue(obj: Record<string, any>, keys: string | string[]): any {
  keys = (typeof keys === 'string') ? keys.split('.') : keys
  const key = keys.shift() as string
  // eslint-disable-next-line no-prototype-builtins
  if (obj && obj.hasOwnProperty(key) && keys.length === 0)
    return obj[key]
  // eslint-disable-next-line no-prototype-builtins
  else if (!obj || !obj.hasOwnProperty(key))
    return obj
  else
    return getValue(obj[key], keys)
}

/**
 * Compare two objects deep.
 */
export function equals(a: any, b: any): Boolean {
  if (a === b)
    return true
  if (a instanceof Date && b instanceof Date)
    return a.getTime() === b.getTime()
  if (!a || !b || (typeof a !== 'object' && typeof b !== 'object'))
    return a === b
  if (a.prototype !== b.prototype)
    return false
  const keys = Object.keys(a)
  if (keys.length !== Object.keys(b).length)
    return false
  return keys.every(k => equals(a[k], b[k]))
}

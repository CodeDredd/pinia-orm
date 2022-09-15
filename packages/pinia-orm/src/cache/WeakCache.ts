export class WeakCache<K, V extends object> implements Map<K, V> {
  // @ts-expect-error dont know
  readonly [Symbol.toStringTag]: string

  #map = new Map<K, WeakRef<V>>()

  has(key: K) {
    return !!(this.#map.has(key) && this.#map.get(key)?.deref())
  }

  get(key: K): V {
    const weakRef = this.#map.get(key)
    if (!weakRef)
      // @ts-expect-error object has no undefined
      return undefined

    const value = weakRef.deref()
    if (value)
      return value

    // If it cant be dereference, remove the key
    this.#map.delete(key)
    // @ts-expect-error object has no undefined
    return undefined
  }

  set(key: K, value: V) {
    this.#map.set(key, new WeakRef<V>(value))
    return this
  }

  get size(): number {
    return this.#map.size
  }

  clear(): void {
    this.#map.clear()
  }

  delete(key: K): boolean {
    this.#map.delete(key)
    return false
  }

  forEach(cb: (value: V, key: K, map: Map<K, V>) => void): void {
    for (const [key, value] of this) cb(value, key, this)
  }

  * [Symbol.iterator](): IterableIterator<[K, V]> {
    for (const [key, weakRef] of this.#map) {
      const ref = weakRef.deref()

      // If it cant be dereference, remove the key
      if (!ref) {
        this.#map.delete(key)
        continue
      }
      yield [key, ref]
    }
  }

  * entries(): IterableIterator<[K, V]> {
    for (const [key, value] of this) yield [key, value]
  }

  * keys(): IterableIterator<K> {
    for (const [key] of this) yield key
  }

  * values(): IterableIterator<V> {
    for (const [, value] of this) yield value
  }
}

import { describe, expect, it } from 'vitest'

import { WeakCache } from '../../../src/cache/WeakCache'

describe('unit/support/Weakcache', () => {
  const data = [
    {
      id: 1,
      name: 'Test'
    },
    {
      id: 2,
      name: 'Test2'
    }
  ]
  const cache = new WeakCache()

  it('can cache data', () => {
    cache.set('key1', data)
    expect(cache.get('key1')).toEqual(data)
  })

  it('can use size getter', () => {
    cache.set('key2', data)
    expect(cache.get('key1')).toEqual(data)
    expect(cache.get('key2')).toEqual(data)
    expect(cache.get('key3')).toEqual(undefined)
    expect(cache.size).toEqual(2)
  })

  it('can use foreach function', () => {
    cache.forEach((value, key, map) => {
      expect(map).toBeInstanceOf(WeakCache)
      // @ts-expect-error saving only string keys
      expect(key.includes('key')).toBeTruthy()
      expect(value).toEqual(data)
    })
  })

  it('can iterate values', () => {
    const values = cache.values()
    expect(values.next().value).toEqual(data)
    expect(values.next().value).toEqual(data)
    expect(values.next().value).toBeUndefined()
  })

  it('can iterate keys', () => {
    const values = cache.keys()
    expect(values.next().value).toEqual('key1')
    expect(values.next().value).toEqual('key2')
    expect(values.next().value).toBeUndefined()
  })

  it('can iterate entries', () => {
    const values = cache.entries()
    expect(values.next().value).toEqual(['key1', data])
    expect(values.next().value).toEqual(['key2', data])
    expect(values.next().value).toBeUndefined()
  })

  it('can delete items', () => {
    cache.delete('key2')
    expect(cache.size).toEqual(1)
  })

  it('can use has for search', () => {
    expect(cache.has('key1')).toBeTruthy()
    expect(cache.has('key2')).toBeFalsy()
  })

  it('can clear all', () => {
    cache.clear()
    expect(cache.size).toEqual(0)
  })
})

import { describe, expect, it } from 'vitest'

import { orderBy } from '../../../src/support/Utils'

describe('unit/support/Utils_Order_by', () => {
  it('can order collection by given key in asc order', () => {
    const collection = [{ id: 2 }, { id: 3 }, { id: 10 }, { id: 1 }]

    const expected = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 10 }]

    expect(orderBy(collection, ['id'], ['asc'])).toEqual(expected)
  })

  it('can order collection by given key in desc order', () => {
    const collection = [{ id: 2 }, { id: 3 }, { id: 10 }, { id: 1 }]

    const expected = [{ id: 10 }, { id: 3 }, { id: 2 }, { id: 1 }]

    expect(orderBy(collection, ['id'], ['desc'])).toEqual(expected)
  })

  it('can order collection of mixed value types', () => {
    const collection = [
      { id: 2 },
      { id: 'id3' },
      { name: 'John Doe' },
      { name: 'Andy Newman' },
      { id: null },
      { id: 'id1' },
      { id: 1 }
    ]

    const expected = [
      { id: 1 },
      { id: 2 },
      { id: 'id1' },
      { id: 'id3' },
      { id: null },
      { name: 'John Doe' },
      { name: 'Andy Newman' }
    ]

    expect(orderBy(collection, ['id'], ['asc'])).toEqual(expected)
  })

  it('can order collection with multiple keys', () => {
    const collection = [
      { id: 1, name: 'John Doe' },
      { id: 3, name: 'Peter Ericsson' },
      { id: 2, name: 'Andrew Black' },
      { id: 3, name: 'George Mac' },
      { id: 1, name: 'Bob Green' },
      { id: 2, name: 'Chris Brian' }
    ]

    const expected = [
      { id: 1, name: 'Bob Green' },
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Andrew Black' },
      { id: 2, name: 'Chris Brian' },
      { id: 3, name: 'George Mac' },
      { id: 3, name: 'Peter Ericsson' }
    ]

    expect(orderBy(collection, ['id', 'name'], ['asc', 'asc'])).toEqual(
      expected
    )
  })

  it('can order collection with multiple keys with mixed key types', () => {
    const collection = [
      { id: 1, name: 'John Doe' },
      { name: 'Peter Ericsson' },
      { id: 2, name: 'Andrew Black' },
      { name: 'George Mac' },
      { id: 1 },
      { id: 2, name: 'Chris Brian' }
    ]

    const expected = [
      { id: 1 },
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Chris Brian' },
      { id: 2, name: 'Andrew Black' },
      { name: 'Peter Ericsson' },
      { name: 'George Mac' }
    ]

    expect(orderBy(collection, ['id', 'name'], ['asc', 'desc'])).toEqual(
      expected
    )
  })

  it('can order collection with function', () => {
    const collection = [{ id: 2 }, { id: 3 }, { id: 1 }]

    const expected = [{ id: 1 }, { id: 2 }, { id: 3 }]

    expect(orderBy(collection, [v => v.id], ['asc'])).toEqual(expected)
  })
})

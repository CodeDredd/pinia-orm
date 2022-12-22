import { describe, expect, it } from 'vitest'

import { equals } from '../../../src/support/Utils'

describe('unit/support/Utils_Equals', () => {
  it('compare two objects', () => {
    const date = Date.now()
    expect(equals({ keyA: 'a', keyB: 'b' }, { keyA: 'a', keyB: 'b' })).toBeTruthy()
    expect(equals({ keyA: 'a', keyB: 1 }, { keyA: 'a', keyB: 2 })).toBeFalsy()
    expect(equals({ keyA: 'a', keyB: new Date(date) }, { keyA: 'a', keyB: new Date(date) })).toBeTruthy()
    expect(equals({ keyA: 'a', keyB: { keyA: 'a', keyB: 'b' } }, { keyA: 'a', keyB: { keyA: 'a', keyB: 'b' } })).toBeTruthy()
  })
})

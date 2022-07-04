import { describe, it, expect } from 'vitest'

import { size } from '../../../src/support/Utils'

describe('unit/support/Utils_Size', () => {
  it('get the length of the given array or object', () => {
    expect(size({ keyA: 'a', keyB: 'b' })).toBe(2)
    expect(size([1, 2, 3])).toBe(3)
  })
})

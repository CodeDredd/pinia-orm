import { describe, expect, it } from 'vitest'

import { compareWithOperator } from '../../../src/support/Utils'

describe('unit/support/Utils_Compare_With_Operator', () => {
  it('can compare with string operator', () => {
    expect(compareWithOperator(1, 2, '<')).toBe(true)
    expect(compareWithOperator(1, 2, '<=')).toBe(true)
    expect(compareWithOperator(1, 2, '>')).toBe(false)
    expect(compareWithOperator(1, 2, '>=')).toBe(false)
    expect(compareWithOperator(1, 2, '!=')).toBe(true)
    expect(compareWithOperator(1, 2)).toBe(false)
    expect(compareWithOperator(1, 1)).toBe(true)
  })
})

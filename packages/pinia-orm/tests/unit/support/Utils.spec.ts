import { describe, expect, it } from 'vitest'

import { throwError } from '../../../src/support/Utils'

describe('unit/support/Utils', () => {
  it('can throw error', () => {
    expect(() => throwError(['Test'])).toThrowError('[Pinia ORM] Test')
  })
})

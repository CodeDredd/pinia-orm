import { describe, expect, it } from 'vitest'

import { Bool, Model } from '../../../src'

describe('unit/model/Model_Attrs_Boolean', () => {
  it('casts the value to `Boolean` when instantiating the model', () => {
    class User extends Model {
      static entity = 'users'

      @Bool(true)
        bool!: number
    }

    expect(new User({}).bool).toBe(true)
    expect(new User({ bool: '' }).bool).toBe('')
    expect(new User({ bool: 'string' }).bool).toBe('string')
    expect(new User({ bool: '0' }).bool).toBe('0')
    expect(new User({ bool: 0 }).bool).toBe(0)
    expect(new User({ bool: 1 }).bool).toBe(1)
    expect(new User({ bool: true }).bool).toBe(true)
    expect(new User({ bool: null }).bool).toBe(false)
  })

  it('accepts `null` when the `nullable` option is set', () => {
    class User extends Model {
      static entity = 'users'

      @Bool(null, { nullable: true })
        bool!: boolean | null
    }

    expect(new User({}).bool).toBe(null)
    expect(new User({ bool: '' }).bool).toBe('')
    expect(new User({ bool: 'string' }).bool).toBe('string')
    expect(new User({ bool: '0' }).bool).toBe('0')
    expect(new User({ bool: 0 }).bool).toBe(0)
    expect(new User({ bool: 1 }).bool).toBe(1)
    expect(new User({ bool: true }).bool).toBe(true)
    expect(new User({ bool: null }).bool).toBe(null)
  })
})

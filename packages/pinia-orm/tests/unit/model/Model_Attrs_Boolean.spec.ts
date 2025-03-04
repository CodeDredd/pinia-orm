import { describe, expect, it, vi } from 'vitest'

import { Model } from '../../../src'
import { Bool } from '../../../src/decorators'

describe('unit/model/Model_Attrs_Boolean', () => {
  it('casts not the value to `Boolean` when instantiating the model', () => {
    class User extends Model {
      static entity = 'users'

      @Bool(true)
        bool!: number
    }

    expect(new User({}).bool).toBe(true)
    expect(new User({ bool: '' }).bool).toBe(false)
    expect(new User({ bool: 'string' }).bool).toBe(true)
    expect(new User({ bool: '0' }).bool).toBe(false)
    expect(new User({ bool: 0 }).bool).toBe(false)
    expect(new User({ bool: 1 }).bool).toBe(true)
    expect(new User({ bool: true }).bool).toBe(true)
    expect(new User({ bool: null }).bool).toBe(null)
  })

  it('accepts `null` when the `notNullable` option is set', () => {
    class User extends Model {
      static entity = 'users'

      @Bool(null, { notNullable: true })
        bool!: boolean | null
    }

    const logger = vi.spyOn(console, 'warn')

    expect(new User({}).bool).toBe(null)
    expect(new User({ bool: '' }).bool).toBe(false)
    expect(new User({ bool: 'string' }).bool).toBe(true)
    expect(new User({ bool: '0' }).bool).toBe(false)
    expect(new User({ bool: 0 }).bool).toBe(false)
    expect(new User({ bool: 1 }).bool).toBe(true)
    expect(new User({ bool: true }).bool).toBe(true)
    expect(new User({ bool: null }).bool).toBe(null)
    expect(logger).toBeCalledTimes(6)
  })
})

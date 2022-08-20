import { describe, expect, it, vi } from 'vitest'

import { Model } from '../../../src'
import { Str } from '../../../src/decorators'

describe('unit/model/Model_Attrs_String', () => {
  it('casts the value to `String` when instantiating the model', () => {
    class User extends Model {
      static entity = 'users'

      @Str('default')
        str!: string
    }

    expect(new User({}).str).toBe('default')
    expect(new User({ str: 'value' }).str).toBe('value')
    expect(new User({ str: 1 }).str).toBe(1)
    expect(new User({ str: true }).str).toBe(true)
    expect(new User({ str: null }).str).toBe(null)
  })

  it('accepts `null` when the `notNullable` option is set', () => {
    class User extends Model {
      static entity = 'users'

      @Str(null, { notNullable: true })
        str!: string | null
    }

    const logger = vi.spyOn(console, 'warn')

    expect(new User({}).str).toBe(null)
    expect(new User({ str: 'value' }).str).toBe('value')
    expect(new User({ str: 1 }).str).toBe(1)
    expect(new User({ str: true }).str).toBe(true)
    expect(new User({ str: null }).str).toBe(null)
    expect(logger).toBeCalledTimes(3)
  })
})

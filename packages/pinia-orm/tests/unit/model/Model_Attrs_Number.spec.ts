import { describe, expect, it, vi } from 'vitest'

import { Model } from '../../../src'
import { Num } from '../../../src/decorators'

describe('unit/model/Model_Attrs_Number', () => {
  it('casts the value to `Number` when instantiating the model', () => {
    class User extends Model {
      static entity = 'users'

      @Num(0)
        num!: number
    }

    expect(new User({}).num).toBe(0)
    expect(new User({ num: 1 }).num).toBe(1)
    expect(new User({ num: '2' }).num).toBe('2')
    expect(new User({ num: true }).num).toBe(true)
    expect(new User({ num: false }).num).toBe(false)
    expect(new User({ num: null }).num).toBe(null)
  })

  it('accepts `null` when the `notNullable` option is set', () => {
    class User extends Model {
      static entity = 'users'

      @Num(null, { notNullable: true })
        num!: number | null
    }

    const logger = vi.spyOn(console, 'warn')

    expect(new User({}).num).toBe(null)
    expect(new User({ num: 1 }).num).toBe(1)
    expect(new User({ num: '2' }).num).toBe('2')
    expect(new User({ num: true }).num).toBe(true)
    expect(new User({ num: false }).num).toBe(false)
    expect(new User({ num: null }).num).toBe(null)
    expect(logger).toBeCalledTimes(4)
  })
})

import { describe, expect, it } from 'vitest'

import { Model } from '../../../src'

describe('feature/model/default_attr', () => {
  it('should not modify default value by reference', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(null),
          str: this.string(''),
          num: this.number(0),
          bool: this.boolean(false),
          parameters: this.attr(() => ({})),
        }
      }

      id!: any
      str!: string
      num!: number
      bool!: boolean
      parameters!: any
    }

    const user = new User({
      str: 'string',
      num: 1,
      bool: true,
    })

    // Modify the default value by reference
    user.parameters.a = 1

    expect(user.id).toBe(null)
    expect(user.str).toBe('string')
    expect(user.num).toBe(1)
    expect(user.bool).toBe(true)
    expect(user.parameters).toEqual({ a: 1 })

    const user2 = new User({
      str: 'string',
      num: 1,
      bool: true,
    })

    expect(user2.id).toBe(null)
    expect(user2.str).toBe('string')
    expect(user2.num).toBe(1)
    expect(user2.bool).toBe(true)
    expect(user2.parameters).toEqual({})
  })
})

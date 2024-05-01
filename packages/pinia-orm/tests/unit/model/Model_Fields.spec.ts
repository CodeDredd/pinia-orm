import { describe, expect, it } from 'vitest'

import { Model } from '../../../src'

describe('unit/model/Model_Fields', () => {
  it('can define model fields as a static function', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.attr(() => undefined),
          str: this.string(''),
          num: this.number(0),
          bool: this.boolean(false),
        }
      }

      id!: any
      str!: string
      num!: number
      bool!: boolean
    }

    const user = new User({
      str: 'string',
      num: 1,
      bool: true,
    })

    expect(user.id).toBe(undefined)
    expect(user.str).toBe('string')
    expect(user.num).toBe(1)
    expect(user.bool).toBe(true)
  })
})

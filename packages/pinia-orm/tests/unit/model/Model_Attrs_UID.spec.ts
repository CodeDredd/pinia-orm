import { describe, expect, it } from 'vitest'

import { Model } from '../../../src'
import { Uid } from '../../../src/decorators'
import { mockUid } from '../../helpers'

describe('unit/model/Model_Attrs_UID', () => {
  it('creates a random Uid', () => {
    class User extends Model {
      static entity = 'users'

      @Uid({ alphabet: 'abcde', size: 5 })
      id!: string
    }

    mockUid(['uid1'])

    expect(new User().id).toBe('uid1')
  })

  it('creates a random Uid with correct alphabet usage', () => {
    class User extends Model {
      static entity = 'users'

      @Uid({ alphabet: '123456789', size: 5 })
      id!: string
    }

    expect(new User().id.length).toBe(5)
    expect(typeof Number(new User().id)).toBe('number')
  })

  it('creates a random Uid with options', () => {
    class User extends Model {
      static entity = 'users'

      @Uid(5)
      id!: string
    }

    mockUid(['uid2'])

    expect(new User().id).toBe('uid2')
  })
})

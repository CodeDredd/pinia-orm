import { beforeEach, describe, expect, it } from 'vitest'

import { Model } from '../../../../src'
import { Uid, UidCast } from '../../../../src/packages/nanoid/non-secure'
import { mockNanoIdNS } from '../../../helpers'

describe('unit/packages/nanoid/non_secure_uid', () => {
  beforeEach(() => {
    Model.clearRegistries()
  })
  it('returns unique non secure id with decorator', () => {
    class User extends Model {
      static entity = 'users'

      @Uid({ alphabet: 'abcde', size: 5 })
        id!: string
    }

    mockNanoIdNS(['uid1'])

    expect(new User().id).toBe('uid1')
  })

  it('returns unique non secure id with cast', () => {
    class User extends Model {
      static entity = 'users'

      static fields () {
        return {
          id: this.uid()
        }
      }

      static casts () {
        return {
          id: UidCast
        }
      }
    }

    mockNanoIdNS(['uid2'])

    expect(new User().id).toBe('uid2')
  })
})

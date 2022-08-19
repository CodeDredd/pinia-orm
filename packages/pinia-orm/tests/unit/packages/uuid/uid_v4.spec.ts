import { beforeEach, describe, expect, it } from 'vitest'

import { Model } from '../../../../src'
import { Uid, UidCast } from '../../../../src/packages/uuid/v4'
import { mockUuidV4 } from '../../../helpers'

describe('unit/packages/uuid/uid_v4', () => {
  beforeEach(() => {
    Model.clearRegistries()
  })
  it('returns unique non secure id with decorator', () => {
    class User extends Model {
      static entity = 'users'

      @Uid()
        id!: string
    }

    mockUuidV4(['uid1'])

    expect(new User().id).toBe('uid1')
  })

  it('returns unique non secure id with cast', () => {
    class User extends Model {
      static entity = 'users'

      static fields() {
        return {
          id: this.attr(''),
        }
      }

      static casts() {
        return {
          id: UidCast,
        }
      }
    }

    mockUuidV4(['uid2'])

    expect(new User().id).toBe('uid2')
  })
})

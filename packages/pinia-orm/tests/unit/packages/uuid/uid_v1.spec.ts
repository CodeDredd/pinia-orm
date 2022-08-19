import { beforeEach, describe, expect, it } from 'vitest'

import { Model } from '../../../../src'
import { Uid, UidCast } from '../../../../src/packages/uuid/v1'
import { mockUuidV1 } from '../../../helpers'

describe('unit/packages/uuid/uid_v1', () => {
  beforeEach(() => {
    Model.clearRegistries()
  })
  it('returns unique non secure id with decorator', () => {
    class User extends Model {
      static entity = 'users'

      @Uid()
        id!: string
    }

    mockUuidV1(['uid1'])

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

    mockUuidV1(['uid2'])

    expect(new User().id).toBe('uid2')
  })
})

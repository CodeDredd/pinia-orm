import { beforeEach, describe, expect, it } from 'vitest'

import { Model } from '../../../../src'
import { Uid, UidCast } from '../../../../src/packages/nanoid'
import { mockNanoId } from '../../../helpers'

describe('unit/packages/nanoid/uid', () => {
  beforeEach(() => {
    Model.clearRegistries()
  })
  it('returns unique non secure id with decorator', () => {
    class User extends Model {
      static entity = 'users'

      @Uid()
        id!: string
    }

    mockNanoId(['uid1'])

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

    mockNanoId(['uid2'])

    expect(new User().id).toBe('uid2')
  })
})

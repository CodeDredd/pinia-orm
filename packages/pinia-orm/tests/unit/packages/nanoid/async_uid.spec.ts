import { beforeEach, describe, expect, it } from 'vitest'

import { Model } from '../../../../src'
import { Uid, UidCast } from '../../../../src/packages/nanoid/async'
import { mockNanoIdAsync } from '../../../helpers'

describe('unit/packages/nanoid/async_uid', () => {
  beforeEach(() => {
    Model.clearRegistries()
  })
  it('returns unique non secure id with decorator', async () => {
    class User extends Model {
      static entity = 'users'

      @Uid()
        id!: Promise<string>
    }

    mockNanoIdAsync(['uid1'])

    expect(await new User().id).toBe('uid1')
  })

  it('returns unique non secure id with cast', async () => {
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

    mockNanoIdAsync(['uid2'])

    expect(await new User().id).toBe('uid2')
  })
})

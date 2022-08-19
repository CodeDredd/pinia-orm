import { describe, expect, it } from 'vitest'

import { Model } from '../../../src'
import { Uid } from '../../../src/decorators'
import { mockUid } from '../../helpers'

describe('unit/model/Model_Attrs_UID', () => {
  it('returns `null` when the model is instantiated', () => {
    class User extends Model {
      static entity = 'users'

      @Uid()
        id!: string
    }

    mockUid(['uid1'])

    expect(new User().id).toBe('uid1')
  })
})

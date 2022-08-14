import { describe, it } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Str, Uid } from '../../../src/decorators'
import { assertState, mockUid } from '../../helpers'

describe('feature/uid/fresh_uid', () => {
  class User extends Model {
    static entity = 'users'

    @Uid() id!: string | null
    @Str('') name!: string
  }

  it('generates unique ids if the model field contains a `uid` attribute', () => {
    mockUid(['uid1', 'uid2'])

    const userRepo = useRepo(User)

    userRepo.fresh([{ name: 'John Doe' }, { name: 'Jane Doe' }])

    assertState({
      users: {
        uid1: { id: 'uid1', name: 'John Doe' },
        uid2: { id: 'uid2', name: 'Jane Doe' },
      },
    })
  })
})

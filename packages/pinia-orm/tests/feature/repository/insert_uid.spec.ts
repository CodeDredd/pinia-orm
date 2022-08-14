import { describe, it } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Str, Uid } from '../../../src/decorators'
import { assertState, mockUid } from '../../helpers'

describe('feature/repository/insert_uid', () => {
  class User extends Model {
    static entity = 'users'

    @Uid() id!: string | null
    @Str('') name!: string
  }

  it('generates a unique id for a `uid` attribute', () => {
    mockUid(['uid1', 'uid2'])

    const userRepo = useRepo(User)

    userRepo.insert([{ name: 'John Doe' }, { name: 'Jane Doe' }])

    assertState({
      users: {
        uid1: { id: 'uid1', name: 'John Doe' },
        uid2: { id: 'uid2', name: 'Jane Doe' },
      },
    })
  })
})

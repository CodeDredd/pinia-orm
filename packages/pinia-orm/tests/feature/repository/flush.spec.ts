import { describe, it } from 'vitest'

import { Attr, Model, Str, useRepo } from '../../../src'
import { assertInstanceOf, assertState, fillState } from '../../helpers'

describe('feature/repository/flush', () => {
  class User extends Model {
    static entity = 'users'

    @Attr() id!: any
    @Str('') name!: string
  }

  it('deletes all records in the store', () => {
    const userRepo = useRepo(User)

    fillState({
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' },
        3: { id: 3, name: 'Johnny Doe' }
      }
    })

    const users = userRepo.flush()

    assertState({
      users: {}
    })

    assertInstanceOf(users, User)
  })
})

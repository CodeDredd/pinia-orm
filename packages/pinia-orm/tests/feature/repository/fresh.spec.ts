import { describe, it } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Attr, Str } from '../../../src/decorators'
import { assertState, fillState } from '../../helpers'

describe('feature/repository/fresh', () => {
  class User extends Model {
    static entity = 'users'

    @Attr() id!: any
    @Str('') name!: string
  }

  it('inserts a new record to the store', () => {
    const userRepo = useRepo(User)

    userRepo.fresh({ id: 1, name: 'John Doe' })

    assertState({
      users: {
        1: { id: 1, name: 'John Doe' },
      },
    })
  })

  it('inserts multiple records to the store', () => {
    const userRepo = useRepo(User)

    userRepo.fresh([
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' },
    ])

    assertState({
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' },
      },
    })
  })

  it('replaces existing records', () => {
    const userRepo = useRepo(User)

    fillState({
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' },
      },
    })

    userRepo.fresh([
      { id: 3, name: 'Johnny Doe' },
      { id: 4, name: 'David Doe' },
    ])

    assertState({
      users: {
        3: { id: 3, name: 'Johnny Doe' },
        4: { id: 4, name: 'David Doe' },
      },
    })
  })
})

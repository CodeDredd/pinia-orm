import { describe, expect, it } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Attr, Str } from '../../../src/decorators'
import { assertInstanceOf, assertModels, fillState } from '../../helpers'

describe('feature/repository/retrieve_offset', () => {
  class User extends Model {
    static entity = 'users'

    @Attr() id!: any
    @Str('') name!: string
  }

  it('can offset the records', () => {
    const userRepo = useRepo(User)

    fillState({
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' },
        3: { id: 3, name: 'Johnny Doe' },
      },
    })

    const users = userRepo.offset(1).get()

    const expected = [
      { id: 2, name: 'Jane Doe' },
      { id: 3, name: 'Johnny Doe' },
    ]

    expect(users).toHaveLength(2)
    assertInstanceOf(users, User)
    assertModels(users, expected)
  })
})

import { describe, expect, it } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Attr, Str } from '../../../src/decorators'
import { assertState } from '../../helpers'

describe('feature/repository/delete', () => {
  class User extends Model {
    static entity = 'users'

    @Attr() id!: any
    @Str('') name!: string
  }

  it('deletes a record specified by the where clause', () => {
    const userRepo = useRepo(User)

    userRepo.save([
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' },
      { id: 3, name: 'Johnny Doe' },
    ])

    userRepo.where('name', 'Jane Doe').delete()

    assertState({
      users: {
        1: { id: 1, name: 'John Doe' },
        3: { id: 3, name: 'Johnny Doe' },
      },
    })
  })

  it('can delete multiple records specified by the where clause', () => {
    const userRepo = useRepo(User)

    userRepo.save([
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' },
      { id: 3, name: 'Johnny Doe' },
    ])

    userRepo.where('name', 'Jane Doe').orWhere('name', 'Johnny Doe').delete()

    assertState({
      users: {
        1: { id: 1, name: 'John Doe' },
      },
    })
  })

  it('returns an empty array if there are no matching records', () => {
    const userRepo = useRepo(User)

    userRepo.save([
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' },
      { id: 3, name: 'Johnny Doe' },
    ])

    const users = userRepo.where('name', 'No match').delete()

    expect(users).toEqual([])

    assertState({
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' },
        3: { id: 3, name: 'Johnny Doe' },
      },
    })
  })
})

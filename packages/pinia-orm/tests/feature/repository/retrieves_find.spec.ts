import { describe, expect, it } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Attr, Str } from '../../../src/decorators'
import {
  assertInstanceOf,
  assertModel,
  assertModels,
  fillState,
} from '../../helpers'

describe('feature/repository/retrieves_find', () => {
  class User extends Model {
    static entity = 'users'

    @Attr() id!: any
    @Str('') name!: string
  }

  it('can find a record by id', () => {
    const userRepo = useRepo(User)

    fillState({
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' },
        3: { id: 3, name: 'Johnny Doe' },
      },
    })

    const user = userRepo.find(2)!

    expect(user).toBeInstanceOf(User)
    assertModel(user, { id: 2, name: 'Jane Doe' })
  })

  it('returns `null` if the record is not found', () => {
    const userRepo = useRepo(User)

    fillState({
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' },
        3: { id: 3, name: 'Johnny Doe' },
      },
    })

    const user = userRepo.find(4)

    expect(user).toBe(null)
  })

  it('can find records by ids', () => {
    const userRepo = useRepo(User)

    fillState({
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' },
        3: { id: 3, name: 'Johnny Doe' },
      },
    })

    const users = userRepo.find([1, 3])

    expect(users.length).toBe(2)
    assertInstanceOf(users, User)
    assertModels(users, [
      { id: 1, name: 'John Doe' },
      { id: 3, name: 'Johnny Doe' },
    ])
  })

  it('can find records by ids with cache usage', () => {
    const userRepo = useRepo(User)

    fillState({
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' },
        3: { id: 3, name: 'Johnny Doe' },
      },
    })

    const users = userRepo.useCache().find([1, 3])

    expect(users.length).toBe(2)
    assertInstanceOf(users, User)
    assertModels(users, [
      { id: 1, name: 'John Doe' },
      { id: 3, name: 'Johnny Doe' },
    ])

    const users2 = userRepo.useCache('users', {
      ids: [1, 3],
    }).find([1, 3])

    expect(users2.length).toBe(2)
    assertInstanceOf(users2, User)
    assertModels(users2, [
      { id: 1, name: 'John Doe' },
      { id: 3, name: 'Johnny Doe' },
    ])
  })
})

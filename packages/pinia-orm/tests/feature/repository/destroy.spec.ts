import { describe, expect, it } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Attr, Str } from '../../../src/decorators'
import { assertInstanceOf, assertState } from '../../helpers'

describe('feature/repository/destroy', () => {
  class User extends Model {
    static entity = 'users'

    @Attr() id!: any
    @Str('') name!: string
  }

  it('deletes record by the id', () => {
    const userRepo = useRepo(User)

    userRepo.save([
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' },
      { id: 3, name: 'Johnny Doe' },
    ])

    userRepo.destroy(2)

    assertState({
      users: {
        1: { id: 1, name: 'John Doe' },
        3: { id: 3, name: 'Johnny Doe' },
      },
    })
  })

  it('deletes multiple records by an array of ids', () => {
    const userRepo = useRepo(User)

    userRepo.save([
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' },
      { id: 3, name: 'Johnny Doe' },
    ])

    userRepo.destroy([2, 3])

    assertState({
      users: {
        1: { id: 1, name: 'John Doe' },
      },
    })
  })

  it('returns the deleted model', () => {
    const userRepo = useRepo(User)

    userRepo.save([
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' },
      { id: 3, name: 'Johnny Doe' },
    ])

    const user = userRepo.destroy(2)

    expect(user).toBeInstanceOf(User)
    expect(user!.id).toBe(2)
  })

  it('returns `null` when no record was deleted', () => {
    const userRepo = useRepo(User)

    userRepo.save([{ id: 1, name: 'John Doe' }])

    const user = userRepo.destroy(2)

    expect(user).toBe(null)

    assertState({
      users: {
        1: { id: 1, name: 'John Doe' },
      },
    })
  })

  it('returns index ids of deleted items', () => {
    const userRepo = useRepo(User)

    userRepo.save([
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' },
      { id: 3, name: 'Johnny Doe' },
    ])

    const users = userRepo.destroy([1, 3])

    assertInstanceOf(users, User)
  })

  it('returns empty array if no record was deleted', () => {
    const userRepo = useRepo(User)

    userRepo.save([
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' },
      { id: 3, name: 'Johnny Doe' },
    ])

    const users = userRepo.destroy([4])

    expect(users).toEqual([])
  })
})

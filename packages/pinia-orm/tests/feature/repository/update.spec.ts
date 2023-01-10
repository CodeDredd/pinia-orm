import { describe, expect, it } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Attr, Num, Str } from '../../../src/decorators'
import { assertModel, assertState, fillState } from '../../helpers'

describe('feature/repository/update', () => {
  class User extends Model {
    static entity = 'users'

    @Attr() id!: any
    @Str('') name!: string
    @Num(0) age!: number
  }

  it('updates a record specified by the query chain', () => {
    const userRepo = useRepo(User)

    fillState({
      users: {
        1: { id: 1, name: 'John Doe', age: 40 },
        2: { id: 2, name: 'Jane Doe', age: 30 },
        3: { id: 3, name: 'Johnny Doe', age: 20 },
      },
    })

    userRepo.where('name', 'Jane Doe').update({ age: 50 })

    assertModel(userRepo.where('name', 'Jane Doe').first()!, { id: 2, name: 'Jane Doe', age: 50 })
    assertState({
      users: {
        1: { id: 1, name: 'John Doe', age: 40 },
        2: { id: 2, name: 'Jane Doe', age: 50 },
        3: { id: 3, name: 'Johnny Doe', age: 20 },
      },
    })
  })

  it('updates multiple records specified by the query chain', () => {
    const userRepo = useRepo(User)

    fillState({
      users: {
        1: { id: 1, name: 'John Doe', age: 40 },
        2: { id: 2, name: 'Jane Doe', age: 30 },
        3: { id: 3, name: 'Johnny Doe', age: 20 },
      },
    })

    userRepo.where('name', 'Jane Doe').orWhere('age', 20).update({ age: 50 })

    assertState({
      users: {
        1: { id: 1, name: 'John Doe', age: 40 },
        2: { id: 2, name: 'Jane Doe', age: 50 },
        3: { id: 3, name: 'Johnny Doe', age: 50 },
      },
    })
  })

  it('returns an empty array if there are no matching records', () => {
    const userRepo = useRepo(User)

    fillState({
      users: {
        1: { id: 1, name: 'John Doe', age: 40 },
        2: { id: 2, name: 'Jane Doe', age: 30 },
        3: { id: 3, name: 'Johnny Doe', age: 20 },
      },
    })

    const users = userRepo.where('name', 'No match').update({ age: 50 })

    expect(users).toEqual([])

    assertState({
      users: {
        1: { id: 1, name: 'John Doe', age: 40 },
        2: { id: 2, name: 'Jane Doe', age: 30 },
        3: { id: 3, name: 'Johnny Doe', age: 20 },
      },
    })
  })
})

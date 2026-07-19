import { describe, expect, it } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Attr, Num, Str } from '../../../src/decorators'
import { assertInstanceOf, assertModels, fillState } from '../../helpers'

describe('feature/repository/retrieves_where_like', () => {
  class User extends Model {
    static entity = 'users'

    @Attr() id!: any
    @Str('') name!: string
    @Num(0) age!: number
  }

  const state = {
    users: {
      1: { id: 1, name: 'John Doe', age: 30 },
      2: { id: 2, name: 'Jane Doe', age: 30 },
      3: { id: 3, name: 'johnny walker', age: 20 },
      4: { id: 4, name: 'Doe John', age: 40 },
    },
  }

  it('can filter with a contains pattern', () => {
    const userRepo = useRepo(User)

    fillState(state)

    const users = userRepo.whereLike('name', '%john%').get()

    const expected = [
      { id: 1, name: 'John Doe', age: 30 },
      { id: 3, name: 'johnny walker', age: 20 },
      { id: 4, name: 'Doe John', age: 40 },
    ]

    expect(users).toHaveLength(3)
    assertInstanceOf(users, User)
    assertModels(users, expected)
  })

  it('can filter with a starts with pattern', () => {
    const userRepo = useRepo(User)

    fillState(state)

    const users = userRepo.whereLike('name', 'john%').get()

    const expected = [
      { id: 1, name: 'John Doe', age: 30 },
      { id: 3, name: 'johnny walker', age: 20 },
    ]

    expect(users).toHaveLength(2)
    assertModels(users, expected)
  })

  it('matches case sensitive when the flag is set', () => {
    const userRepo = useRepo(User)

    fillState(state)

    const users = userRepo.whereLike('name', 'john%', true).get()

    expect(users).toHaveLength(1)
    assertModels(users, [{ id: 3, name: 'johnny walker', age: 20 }])
  })

  it('supports single character wildcards', () => {
    const userRepo = useRepo(User)

    fillState(state)

    const users = userRepo.whereLike('name', 'J_hn Doe').get()

    expect(users).toHaveLength(1)
    assertModels(users, [{ id: 1, name: 'John Doe', age: 30 }])
  })

  it('matches without wildcards like an equality check', () => {
    const userRepo = useRepo(User)

    fillState(state)

    const users = userRepo.whereLike('name', 'jane doe').get()

    expect(users).toHaveLength(1)
    assertModels(users, [{ id: 2, name: 'Jane Doe', age: 30 }])
  })

  it('can filter with `orWhereLike`', () => {
    const userRepo = useRepo(User)

    fillState(state)

    const users = userRepo.where('age', 40).orWhereLike('name', 'jane%').get()

    const expected = [
      { id: 2, name: 'Jane Doe', age: 30 },
      { id: 4, name: 'Doe John', age: 40 },
    ]

    expect(users).toHaveLength(2)
    assertModels(users, expected)
  })

  it('can filter non string fields', () => {
    const userRepo = useRepo(User)

    fillState(state)

    const users = userRepo.whereLike('age', '3%').get()

    const expected = [
      { id: 1, name: 'John Doe', age: 30 },
      { id: 2, name: 'Jane Doe', age: 30 },
    ]

    expect(users).toHaveLength(2)
    assertModels(users, expected)
  })
})

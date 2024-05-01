import { describe, expect, it } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Attr, Num, Str } from '../../../src/decorators'
import { assertInstanceOf, assertModels, fillState } from '../../helpers'

describe('feature/repository/retrieves_order_by', () => {
  class User extends Model {
    static entity = 'users'

    @Attr() id!: any
    @Str('') name!: string
    @Num(0) age!: number
  }

  it('can sort records using the `orderBy` modifier', () => {
    const userRepo = useRepo(User)

    fillState({
      users: {
        1: { id: 1, name: 'James', age: 40 },
        2: { id: 2, name: 'Andy', age: 30 },
        3: { id: 3, name: 'David', age: 20 },
      },
    })

    const users = userRepo.orderBy('name').get()

    const expected = [
      { id: 2, name: 'Andy', age: 30 },
      { id: 3, name: 'David', age: 20 },
      { id: 1, name: 'James', age: 40 },
    ]

    expect(users).toHaveLength(3)
    assertInstanceOf(users, User)
    assertModels(users, expected)
  })

  it('can sort records in descending order', () => {
    const userRepo = useRepo(User)

    fillState({
      users: {
        1: { id: 1, name: 'James', age: 40 },
        2: { id: 2, name: 'Andy', age: 30 },
        3: { id: 3, name: 'David', age: 20 },
      },
    })

    const users = userRepo.orderBy('name', 'desc').get()

    const expected = [
      { id: 1, name: 'James', age: 40 },
      { id: 3, name: 'David', age: 20 },
      { id: 2, name: 'Andy', age: 30 },
    ]

    expect(users).toHaveLength(3)
    assertInstanceOf(users, User)
    assertModels(users, expected)
  })

  it('can sort records by combining multiple `orderBy` modifiers', () => {
    const userRepo = useRepo(User)

    fillState({
      users: {
        1: { id: 1, name: 'James', age: 40 },
        2: { id: 2, name: 'Andy', age: 30 },
        3: { id: 3, name: 'Andy', age: 20 },
        4: { id: 4, name: 'David', age: 20 },
        5: { id: 5, name: 'David', age: 50 },
      },
    })

    const users = userRepo.orderBy('name', 'desc').orderBy('age').get()

    const expected = [
      { id: 1, name: 'James', age: 40 },
      { id: 4, name: 'David', age: 20 },
      { id: 5, name: 'David', age: 50 },
      { id: 3, name: 'Andy', age: 20 },
      { id: 2, name: 'Andy', age: 30 },
    ]

    expect(users).toHaveLength(5)
    assertInstanceOf(users, User)
    assertModels(users, expected)
  })

  it('can sort records by specifying a callback', () => {
    const userRepo = useRepo(User)

    fillState({
      users: {
        1: { id: 1, name: 'James', age: 40 },
        2: { id: 2, name: 'Andy', age: 30 },
        3: { id: 3, name: 'David', age: 20 },
      },
    })

    const users = userRepo.orderBy(user => user.age, 'desc').get()

    const expected = [
      { id: 1, name: 'James', age: 40 },
      { id: 2, name: 'Andy', age: 30 },
      { id: 3, name: 'David', age: 20 },
    ]

    expect(users).toHaveLength(3)
    assertInstanceOf(users, User)
    assertModels(users, expected)
  })
})

import { describe, it, expect } from 'vitest'

import { Model, Str, Num, useRepo } from '../../../src'
import {
  assertInstanceOf,
  assertModel,
  assertModels,
  assertState,
  fillState,
} from '../../helpers'

describe('feature/repository/save', () => {
  class User extends Model {
    static entity = 'users'

    @Num(0) id!: number
    @Str('') name!: string
    @Num(0) age!: number
  }

  it('does nothing when passing in an empty array', () => {
    const userRepo = useRepo(User)

    userRepo.save([])

    assertState({})
  })

  it('saves a model to the store', () => {
    const userRepo = useRepo(User)

    userRepo.save({ id: 1, name: 'John Doe', age: 30 })

    assertState({
      users: {
        1: { id: 1, name: 'John Doe', age: 30 },
      },
    })
  })

  it('saves multiple models to the store', () => {
    const userRepo = useRepo(User)

    userRepo.save([
      { id: 1, name: 'John Doe', age: 30 },
      { id: 2, name: 'Jane Doe', age: 20 },
    ])

    assertState({
      users: {
        1: { id: 1, name: 'John Doe', age: 30 },
        2: { id: 2, name: 'Jane Doe', age: 20 },
      },
    })
  })

  it('updates existing model if it exists', () => {
    const userRepo = useRepo(User)

    fillState({
      users: {
        1: { id: 1, name: 'John Doe', age: 30 },
      },
    })

    userRepo.save({ id: 1, age: 20 })

    assertState({
      users: {
        1: { id: 1, name: 'John Doe', age: 20 },
      },
    })
  })

  it('updates existing model if it exists when saving multiple model', () => {
    const userRepo = useRepo(User)

    fillState({
      users: {
        1: { id: 1, name: 'John Doe', age: 30 },
      },
    })

    userRepo.save([
      { id: 1, age: 20 },
      { id: 2, name: 'Jane Doe', age: 10 },
    ])

    assertState({
      users: {
        1: { id: 1, name: 'John Doe', age: 20 },
        2: { id: 2, name: 'Jane Doe', age: 10 },
      },
    })
  })

  it('returns a model', () => {
    const userRepo = useRepo(User)

    const user = userRepo.save({ id: 1, name: 'John Doe', age: 30 })

    expect(user).toBeInstanceOf(User)
    assertModel(user, { id: 1, name: 'John Doe', age: 30 })
  })

  it('returns multiple models when saving multiple records', () => {
    const userRepo = useRepo(User)

    const users = userRepo.save([
      { id: 1, name: 'John Doe', age: 30 },
      { id: 2, name: 'Jane Doe', age: 20 },
    ])

    assertInstanceOf(users, User)
    assertModels(users, [
      { id: 1, name: 'John Doe', age: 30 },
      { id: 2, name: 'Jane Doe', age: 20 },
    ])
  })
})

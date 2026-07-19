import { describe, expect, it } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Attr, Num, Str } from '../../../src/decorators'
import { assertState } from '../../helpers'

describe('feature/repository/first_or_create', () => {
  class User extends Model {
    static entity = 'users'

    @Attr() id!: any
    @Str('') name!: string
    @Num(0) age!: number
  }

  it('returns the first record matching the attributes', () => {
    const userRepo = useRepo(User)

    userRepo.save([
      { id: 1, name: 'John Doe', age: 30 },
      { id: 2, name: 'Jane Doe', age: 40 },
    ])

    const user = userRepo.firstOrCreate({ name: 'Jane Doe' }, { age: 50 })

    expect(user.id).toBe(2)
    expect(user.age).toBe(40)

    assertState({
      users: {
        1: { id: 1, name: 'John Doe', age: 30 },
        2: { id: 2, name: 'Jane Doe', age: 40 },
      },
    })
  })

  it('creates a new record from the merged attributes and values if none matches', () => {
    const userRepo = useRepo(User)

    userRepo.save({ id: 1, name: 'John Doe', age: 30 })

    const user = userRepo.firstOrCreate({ id: 2, name: 'Jane Doe' }, { age: 40 })

    expect(user.id).toBe(2)

    assertState({
      users: {
        1: { id: 1, name: 'John Doe', age: 30 },
        2: { id: 2, name: 'Jane Doe', age: 40 },
      },
    })
  })
})

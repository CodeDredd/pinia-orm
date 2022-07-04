import { describe, it, expect } from 'vitest'

import { Model, Uid, Str, Num, Bool, Attr, useRepo } from '../../../src'
import { assertState, mockUid } from '../../helpers'

describe('feature/repository/new', () => {
  it('inserts with a models default values', () => {
    class User extends Model {
      static entity = 'users'

      @Uid() id!: string
      @Str('John Doe') name!: string
      @Num(21) age!: number
      @Bool(true) active!: boolean
    }

    mockUid(['uid1'])

    const userRepo = useRepo(User)

    userRepo.new()

    assertState({
      users: {
        uid1: { id: 'uid1', name: 'John Doe', age: 21, active: true },
      },
    })
  })

  it('throws if a primary key is not capable of being generated', () => {
    class User extends Model {
      static entity = 'users'

      @Attr() id!: any
      @Str('John Doe') name!: string
    }

    const userRepo = useRepo(User)

    expect(() => userRepo.new()).toThrow()
  })
})

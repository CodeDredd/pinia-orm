import { describe, expect, it } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Attr, Bool, Cast, Num, Str, Uid } from '../../../src/decorators'
import { assertState, mockUid } from '../../helpers'
import { ArrayCast } from '../../../src/model/casts/ArrayCast'

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
        uid1: { id: 'uid1', name: 'John Doe', age: 21, active: true }
      }
    })
  })

  it('it trigger casts on hooks', () => {
    class User extends Model {
      static entity = 'users'

      @Uid() declare id: string

      @Cast(() => ArrayCast) @Attr('{}') declare items: string[]
      @Str('John Doe') declare name: string
      @Num(21) declare age: number
      @Bool(true) declare active: boolean

      static creating (model: User) {
        model.items = ['t', 's']
      }
    }

    mockUid(['uid1'])

    const userRepo = useRepo(User)

    userRepo.new()

    assertState({
      users: {
        uid1: { id: 'uid1', name: 'John Doe', items: '["t","s"]', age: 21, active: true }
      }
    })

    expect(userRepo.hydratedDataCache.get('usersuid1')?.items).toBeInstanceOf(Array)
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

import { describe, expect, it } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Num, Str } from '../../../src/decorators'
import { fillState } from '../../helpers'

describe('feature/repository/retrieves_revive', () => {
  class User extends Model {
    static entity = 'users'

    @Num(0) id!: number
    @Str('') name!: string
  }

  it('retrieves a model from the store by the given schema', () => {
    const userRepo = useRepo(User)

    fillState({
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' },
        3: { id: 3, name: 'Johnny Doe' },
      },
    })

    const schema = {
      id: 2,
    }

    const user = userRepo.revive(schema)!

    expect(user).toBeInstanceOf(User)
    expect(user.id).toBe(2)
  })

  it('returns null if result can not be found when passing object schema', () => {
    const userRepo = useRepo(User)

    fillState({
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' },
        3: { id: 3, name: 'Johnny Doe' },
      },
    })

    // Test missing id in the store.
    expect(userRepo.revive({ id: 4 })).toBe(null)
  })

  it('retrieves multiple models from the store by the given schema', () => {
    const userRepo = useRepo(User)

    fillState({
      users: {
        1: { id: 1, name: 'John Doe' },
        2: { id: 2, name: 'Jane Doe' },
        3: { id: 3, name: 'Johnny Doe' },
      },
    })

    const schema = [{ id: 3 }, { id: 1 }]

    const users = userRepo.revive(schema)

    expect(users.length).toBe(2)
    expect(users[0].id).toBe(3)
    expect(users[1].id).toBe(1)
  })
})

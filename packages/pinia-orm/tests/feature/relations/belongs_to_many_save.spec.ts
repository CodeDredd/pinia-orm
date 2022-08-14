import { describe, it } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Attr, BelongsToMany, Num } from '../../../src/decorators'
import { assertState } from '../../helpers'

describe('feature/relations/belongs_to_many_save', () => {
  class User extends Model {
    static entity = 'users'

    @Num(0) id!: number
    @BelongsToMany(() => Role, () => RoleUser, 'user_id', 'role_id')
      roles!: Role
  }

  class Role extends Model {
    static entity = 'roles'

    @Num(0) id!: number
  }

  class RoleUser extends Model {
    static entity = 'roleUser'

    static primaryKey = ['role_id', 'user_id']

    @Attr(null) role_id!: number | null
    @Attr(null) user_id!: number | null
    @Attr(null) level!: number | null
  }

  it('saves a model to the store with "belongs to many" relation', () => {
    const userRepo = useRepo(User)

    userRepo.save([
      {
        id: 1,
        roles: [{ id: 1, pivot: { level: 1 } }, { id: 2 }],
      },
      {
        id: 2,
        roles: [{ id: 1, pivot: { level: 2 } }],
      },
    ])

    assertState({
      users: {
        1: { id: 1 },
        2: { id: 2 },
      },
      roles: {
        1: { id: 1 },
        2: { id: 2 },
      },
      roleUser: {
        '[1,1]': { role_id: 1, user_id: 1, level: 1 },
        '[2,1]': { role_id: 2, user_id: 1, level: null },
        '[1,2]': { role_id: 1, user_id: 2, level: 2 },
      },
    })
  })

  it('can insert a record with missing relational key', () => {
    const usersRepo = useRepo(User)

    usersRepo.save({
      id: 1,
    })

    assertState({
      users: {
        1: { id: 1 },
      },
    })
  })
})

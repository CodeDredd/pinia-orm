import { describe, it } from 'vitest'

import { Model, Num, useRepo } from '../../../src'
import { assertState } from '../../helpers'

describe('feature/relations/belongs_to_many_save', () => {
  class User extends Model {
    static entity = 'users'

    static fields() {
      return {
        id: this.attr(null),
        permissions: this.belongsToMany(Role, RoleUser, 'user_id', 'role_id'),
      }
    }
  }

  class Role extends Model {
    static entity = 'roles'

    @Num(0) id!: number
  }

  class RoleUser extends Model {
    static entity = 'roleUser'

    static primaryKey = ['role_id', 'user_id']

    static fields() {
      return {
        role_id: this.attr(null),
        user_id: this.attr(null),
        level: this.attr(null),
      }
    }
  }

  it('saves a model to the store with "belongs to many" relation', () => {
    const userRepo = useRepo(User)

    userRepo.save([
      {
        id: 1,
        permissions: [{ id: 1, pivot: { level: 1 } }, { id: 2 }],
      },
      {
        id: 2,
        permissions: [{ id: 2 }],
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
        '[2,2]': { role_id: 2, user_id: 2, level: null },
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

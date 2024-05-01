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

    @BelongsToMany(() => Role, () => SuperRoleUser, 'user_id', 'role_id')
      superRoles!: Role
  }

  class Role extends Model {
    static entity = 'roles'

    @Num(0) declare id: number
    declare pivot: RoleUser | SuperRoleUser
  }

  class RoleUser extends Model {
    static entity = 'roleUser'

    static primaryKey = ['role_id', 'user_id']

    @Attr(null) role_id!: number | null
    @Attr(null) user_id!: number | null
    @Attr(null) level!: number | null
  }

  class SuperRoleUser extends Model {
    static entity = 'superRoleUser'

    static primaryKey = ['role_id', 'user_id']

    @Attr(null) role_id!: number | null
    @Attr(null) user_id!: number | null
    @Attr(false) super!: boolean
  }

  it('saves a model to the store with "belongs to many" relation', () => {
    const userRepo = useRepo(User)

    userRepo.save([
      {
        id: 1,
        roles: [{ id: 1, pivot: { level: 1 } }, { id: 2 }, { id: 4 }],
        superRoles: [{ id: 2, pivot: { super: true } }],
      },
      {
        id: 2,
        roles: [{ id: 1, pivot: { level: 2 } }],
        superRoles: [{ id: 1 }, { id: 3, pivot: { super: true } }],
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
        3: { id: 3 },
        4: { id: 4 },
      },
      roleUser: {
        '[1,1]': { role_id: 1, user_id: 1, level: 1 },
        '[2,1]': { role_id: 2, user_id: 1, level: null },
        '[4,1]': { role_id: 4, user_id: 1, level: null },
        '[1,2]': { role_id: 1, user_id: 2, level: 2 },
      },
      superRoleUser: {
        '[2,1]': { role_id: 2, user_id: 1, super: true },
        '[1,2]': { role_id: 1, user_id: 2, super: false },
        '[3,2]': { role_id: 3, user_id: 2, super: true },
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

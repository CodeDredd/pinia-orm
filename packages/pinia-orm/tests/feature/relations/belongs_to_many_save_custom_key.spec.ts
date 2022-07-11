import { beforeEach, describe, it } from 'vitest'

import { Attr, BelongsToMany, Model, Num, useRepo } from '../../../src'
import { assertState } from '../../helpers'

describe('feature/relations/belongs_to_many_save_custom_key', () => {
  beforeEach(() => {
    Model.clearRegistries()
  })

  it('inserts "belongs to many" relation with custom primary key', () => {
    class User extends Model {
      static entity = 'users'

      static primaryKey = 'belongsToManyId'

      @Num(0) belongsToManyId!: number
      @BelongsToMany(() => Role, () => RoleUser, 'user_id', 'role_id')
        permissions!: Role
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

    useRepo(User).save([
      {
        belongsToManyId: 1,
        permissions: [{ id: 1, pivot: { level: 1 } }, { id: 2 }],
      },
      {
        belongsToManyId: 2,
        permissions: [{ id: 2 }],
      },
    ])

    assertState({
      users: {
        1: { belongsToManyId: 1 },
        2: { belongsToManyId: 2 },
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

  it('inserts "belongs to many" relation with custom local key', () => {
    class User extends Model {
      static entity = 'users'

      static primaryKey = 'belongsToManyId'

      @Num(0) belongsToManyId!: number
      @BelongsToMany(() => Role, () => RoleUser, 'user_id', 'role_id')
        permissions!: Role
    }

    class Role extends Model {
      static entity = 'roles'

      static primaryKey = 'newRoleId'

      @Num(0) newRoleId!: number
    }

    class RoleUser extends Model {
      static entity = 'roleUser'

      static primaryKey = ['role_id', 'user_id']

      @Attr(null) role_id!: number | null
      @Attr(null) user_id!: number | null
      @Attr(null) level!: number | null
    }

    useRepo(User).save([
      {
        belongsToManyId: 1,
        permissions: [{ newRoleId: 1, pivot: { level: 1 } }, { newRoleId: 2 }],
      },
      {
        belongsToManyId: 2,
        permissions: [{ newRoleId: 2 }],
      },
    ])

    assertState({
      users: {
        1: { belongsToManyId: 1 },
        2: { belongsToManyId: 2 },
      },
      roles: {
        1: { newRoleId: 1 },
        2: { newRoleId: 2 },
      },
      roleUser: {
        '[1,1]': { role_id: 1, user_id: 1, level: 1 },
        '[2,1]': { role_id: 2, user_id: 1, level: null },
        '[2,2]': { role_id: 2, user_id: 2, level: null },
      },
    })
  })
})

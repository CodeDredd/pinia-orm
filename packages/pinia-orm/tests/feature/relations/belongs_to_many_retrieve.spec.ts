import { describe, expect, it } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Attr, BelongsToMany, Str } from '../../../src/decorators'
import { assertInstanceOf, assertModel, fillState } from '../../helpers'

describe('feature/relations/belongs_to_many_retrieve', () => {
  class User extends Model {
    static entity = 'users'

    @Attr() id!: number
    @Str('') name!: string
    @BelongsToMany(() => Role, () => RoleUser, 'user_id', 'role_id')
    roles!: Role[]
  }

  class Role extends Model {
    static entity = 'roles'

    @Attr() id!: number
    @BelongsToMany(() => User, () => RoleUser, 'role_id', 'user_id')
    users!: User[]

    pivot!: RoleUser
  }

  class RoleUser extends Model {
    static entity = 'roleUser'

    static primaryKey = ['role_id', 'user_id']

    @Attr() role_id!: number
    @Attr() user_id!: number
    @Attr() level!: number
  }

  it('can eager load belongs to many relation', () => {
    const userRepo = useRepo(User)

    fillState({
      users: {
        1: { id: 1 },
        2: { id: 2 },
        3: { id: 3 },
      },
      roles: {
        1: { id: 1 },
        2: { id: 2 },
      },
      roleUser: {
        '[1,1]': { role_id: 1, user_id: 1, level: 1 },
        '[1,2]': { role_id: 1, user_id: 2, level: 2 },
        '[2,1]': { role_id: 2, user_id: 1, level: null },
      },
    })

    const user = userRepo.with('roles').find(1)
    const user2 = userRepo.with('roles').find(2)

    expect(user).toBeInstanceOf(User)
    assertInstanceOf(user!.roles, Role)

    expect(user?.roles.length).toBe(2)
    expect(user?.roles[0].pivot.level).toBe(1)
    expect(user2?.roles.length).toBe(1)
    expect(user2?.roles[0].pivot.level).toBe(2)

    const userWithoutRoles = userRepo.with('roles').find(3)
    expect(userWithoutRoles?.roles.length).toBe(0)
  })

  it('can eager load belongs to many relations with pivots', () => {
    fillState({
      users: {
        1: { id: 1 },
        2: { id: 2 },
        3: { id: 3 },
      },
      roles: {
        1: { id: 1 },
        2: { id: 2 },
      },
      roleUser: {
        '[1,1]': { role_id: 1, user_id: 1, level: 1 },
        '[1,2]': { role_id: 1, user_id: 2, level: 2 },
        '[2,1]': { role_id: 2, user_id: 1, level: null },
      },
    })

    const users = useRepo(User).with('roles').get()

    expect(users[0].id).toBe(1)
    expect(users[0].roles[0].id).toBe(1)
    expect(users[0].roles[0].pivot.role_id).toBe(1)
    expect(users[0].roles[0].pivot.user_id).toBe(1)
    expect(users[0].roles[0].pivot.level).toBe(1)
    expect(users[0].roles[1].id).toBe(2)
    expect(users[0].roles[1].pivot.role_id).toBe(2)
    expect(users[0].roles[1].pivot.user_id).toBe(1)
    expect(users[0].roles[1].pivot.level).toBe(null)
    expect(users[1].id).toBe(2)
    expect(users[1].roles[0].id).toBe(1)
    expect(users[1].roles[0].pivot.role_id).toBe(1)
    expect(users[1].roles[0].pivot.user_id).toBe(2)
    expect(users[1].roles[0].pivot.level).toBe(2)

    const roles = useRepo(Role).with('users').get()

    expect(roles[0].id).toBe(1)
    expect(roles[0].users[0].id).toBe(1)
    expect(roles[0].users[0].pivot.role_id).toBe(1)
    expect(roles[0].users[0].pivot.user_id).toBe(1)
    expect(roles[0].users[0].pivot.level).toBe(1)

    expect(roles[0].users[1].id).toBe(2)
    expect(roles[0].users[1].pivot.role_id).toBe(1)
    expect(roles[0].users[1].pivot.user_id).toBe(2)
    expect(roles[0].users[1].pivot.level).toBe(2)

    expect(roles[1].id).toBe(2)
    expect(roles[1].users[0].id).toBe(1)
    expect(roles[1].users[0].pivot.role_id).toBe(2)
    expect(roles[1].users[0].pivot.user_id).toBe(1)
    expect(roles[1].users[0].pivot.level).toBe(null)
  })

  it('can eager load missing relation as empty array', () => {
    const usersRepo = useRepo(User)

    usersRepo.save({ id: 1, name: 'John Doe' })

    const user = usersRepo.with('roles').first()!

    expect(user).toBeInstanceOf(User)
    assertModel(user, {
      id: 1,
      name: 'John Doe',
      roles: [],
    })
  })

  it('can revive "belongs to many" relations', () => {
    const usersRepo = useRepo(User)

    fillState({
      users: {
        1: { id: 1, name: 'John Doe', permissions: [] },
      },
      roles: {
        1: { id: 1 },
        2: { id: 2 },
      },
      roleUser: {
        '[1,1]': { role_id: 1, user_id: 1, level: 1 },
        '[2,1]': { role_id: 2, user_id: 1, level: null },
      },
    })

    const schema = {
      id: '1',
      roles: [{ id: 2 }, { id: 1 }],
    }

    const user = usersRepo.revive(schema)!

    expect(user.roles.length).toBe(2)
    expect(user.roles[0]).toBeInstanceOf(Role)
    expect(user.roles[1]).toBeInstanceOf(Role)
    expect(user.roles[0].id).toBe(2)
    expect(user.roles[1].id).toBe(1)
  })
})

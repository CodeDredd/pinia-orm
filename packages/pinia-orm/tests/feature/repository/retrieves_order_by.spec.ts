import { describe, expect, it } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Attr, BelongsToMany, Cast, Num, Str } from '../../../src/decorators'
import { assertInstanceOf, assertModels, fillState } from '../../helpers'
import { useSortBy } from '@/composables/collection/useSortBy'
import { DateCast } from '@/model/casts/DateCast'

describe('feature/repository/retrieves_order_by', () => {
  class User extends Model {
    static entity = 'users'

    @Attr() id!: any
    @Str('') name!: string
    @Num(0) age!: number
  }

  it('can sort records using the `orderBy` modifier', () => {
    const userRepo = useRepo(User)

    fillState({
      users: {
        1: { id: 1, name: 'James', age: 40 },
        2: { id: 2, name: 'Andy', age: 30 },
        3: { id: 3, name: 'David', age: 20 },
      },
    })

    const users = userRepo.orderBy('name').get()

    const expected = [
      { id: 2, name: 'Andy', age: 30 },
      { id: 3, name: 'David', age: 20 },
      { id: 1, name: 'James', age: 40 },
    ]

    expect(users).toHaveLength(3)
    assertInstanceOf(users, User)
    assertModels(users, expected)
  })

  it('can sort records in descending order', () => {
    const userRepo = useRepo(User)

    fillState({
      users: {
        1: { id: 1, name: 'James', age: 40 },
        2: { id: 2, name: 'Andy', age: 30 },
        3: { id: 3, name: 'David', age: 20 },
      },
    })

    const users = userRepo.orderBy('name', 'desc').get()

    const expected = [
      { id: 1, name: 'James', age: 40 },
      { id: 3, name: 'David', age: 20 },
      { id: 2, name: 'Andy', age: 30 },
    ]

    expect(users).toHaveLength(3)
    assertInstanceOf(users, User)
    assertModels(users, expected)
  })

  it('can sort records by combining multiple `orderBy` modifiers', () => {
    const userRepo = useRepo(User)

    fillState({
      users: {
        1: { id: 1, name: 'James', age: 40 },
        2: { id: 2, name: 'Andy', age: 30 },
        3: { id: 3, name: 'Andy', age: 20 },
        4: { id: 4, name: 'David', age: 20 },
        5: { id: 5, name: 'David', age: 50 },
      },
    })

    const users = userRepo.orderBy('name', 'desc').orderBy('age').get()

    const expected = [
      { id: 1, name: 'James', age: 40 },
      { id: 4, name: 'David', age: 20 },
      { id: 5, name: 'David', age: 50 },
      { id: 3, name: 'Andy', age: 20 },
      { id: 2, name: 'Andy', age: 30 },
    ]

    expect(users).toHaveLength(5)
    assertInstanceOf(users, User)
    assertModels(users, expected)
  })

  it('can sort records by specifying a callback', () => {
    const userRepo = useRepo(User)

    fillState({
      users: {
        1: { id: 1, name: 'James', age: 40 },
        2: { id: 2, name: 'Andy', age: 30 },
        3: { id: 3, name: 'David', age: 20 },
      },
    })

    const users = userRepo.orderBy(user => user.age, 'desc').get()

    const expected = [
      { id: 1, name: 'James', age: 40 },
      { id: 2, name: 'Andy', age: 30 },
      { id: 3, name: 'David', age: 20 },
    ]

    expect(users).toHaveLength(3)
    assertInstanceOf(users, User)
    assertModels(users, expected)
  })

  it('can sort nested records by pivot', () => {
    Model.clearRegistries()
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
    const userRepo = useRepo(User)

    fillState({
      users: {
        1: { id: 1, name: 'James' },
        2: { id: 2, name: 'Andy' },
        3: { id: 3, name: 'David' },
      },
      roles: {
        1: { id: 1 },
        2: { id: 2 },
      },
      roleUser: {
        '[1,1]': { role_id: 1, user_id: 1, level: 4 },
        '[1,2]': { role_id: 1, user_id: 2, level: 3 },
        '[2,1]': { role_id: 2, user_id: 1, level: 1 },
      },
    })

    const users = userRepo.with('roles').orderBy((user) => {
      user.roles = useSortBy(user.roles, [['pivot.level', 'asc']])
    }).get()

    const expected = [
      { id: 1, name: 'James', roles: [
        { id: 2, users: [], pivot_roleUser: null },
        { id: 1, users: [], pivot_roleUser: null },
      ],
      },
      { id: 2, name: 'Andy', roles: [
        { id: 1, users: [], pivot_roleUser: null },
      ],
      },
      { id: 3, name: 'David', roles: [] },
    ]

    expect(users).toHaveLength(3)
    assertInstanceOf(users, User)
    assertModels(users, expected)
  })

  it('can sort records by Date using the `orderBy` modifier', () => {
    Model.clearRegistries()
    class User extends Model {
      static entity = 'users'

      @Attr() id!: any
      @Str('') name!: string
      @Num(0) age!: number
      @Cast(() => DateCast) @Attr(null) declare createdAt: Date
    }

    const userRepo = useRepo(User)

    fillState({
      users: {
        1: { id: 1, name: 'James', age: 40, createdAt: new Date ('2023-01-26').toISOString() },
        2: { id: 2, name: 'Andy', age: 30, createdAt: new Date ('2023-01-25').toISOString() },
        3: { id: 3, name: 'David', age: 20, createdAt: new Date ('2023-03-26').toISOString() },
      },
    })

    const users = userRepo.orderBy('createdAt').get()

    const expected = [
      { id: 2, name: 'Andy', age: 30, createdAt: new Date ('2023-01-25').toISOString() },
      { id: 1, name: 'James', age: 40, createdAt: new Date ('2023-01-26').toISOString() },
      { id: 3, name: 'David', age: 20, createdAt: new Date ('2023-03-26').toISOString() },
    ]

    expect(users).toHaveLength(3)
    assertInstanceOf(users, User)
    assertModels(users, expected)
  })
})

import { describe, expect, it } from 'vitest'

import { Model, useRepo } from '../../src'
import { Attr, BelongsToMany, Num, Str } from '../../src/decorators'

/* eslint-disable no-console */
describe.skip('performance/save_belongs_to_many_relation.spec', () => {
  class Role extends Model {
    static entity = 'roles'

    @Num(0) declare id: number
    declare pivot: RoleUser
  }

  class RoleUser extends Model {
    static entity = 'roleUser'

    static primaryKey = ['role_id', 'user_id']

    @Attr(null) role_id!: number | null
    @Attr(null) user_id!: number | null
    @Attr(null) level!: number | null
  }

  class User extends Model {
    static entity = 'users'

    @Num(0) id!: number
    @Str('') name!: string

    @BelongsToMany(() => Role, () => RoleUser, 'user_id', 'role_id')
      roles!: Role
  }

  it('saves data with bleongs to many relation within decent time', () => {
    const userRepo = useRepo(User)

    const users = []

    for (let i = 1; i <= 500; i++) {
      users.push({
        id: i,
        name: `Username ${i}`,
        roles: [{ id: i, title: `Title ${i}` }],
      })
      users.push({
        id: i + 1,
        name: `Username ${i}`,
        roles: [{ id: i, title: `Title ${i}` }],
      })
    }

    console.time('time')
    userRepo.save(users)
    console.timeEnd('time')
    console.log('Get Speed test for 1k saved items and 5 queries')
    console.time('get(): with cache')
    const timeStart = performance.now()
    for (let i = 1; i <= 5; i++) {
      console.time(`time query ${i}`)
      userRepo.useCache().with('roles').get()
      console.timeEnd(`time query ${i}`)
    }
    expect(userRepo.cache()?.size).toBe(1)

    const useCacheTime = performance.now()
    console.timeEnd('get(): with cache')
    console.time('get(): without cache')
    for (let i = 1; i <= 5; i++) {
      console.time(`time query without ${i}`)
      userRepo.with('roles').get()
      console.timeEnd(`time query without ${i}`)
    }
    const useWtihoutCacheTime = performance.now()
    console.timeEnd('get(): without cache')
    console.log(`Time with Cache ${useCacheTime - timeStart}, without: ${useWtihoutCacheTime - useCacheTime}`)

    expect(useCacheTime - timeStart).toBeLessThan(useWtihoutCacheTime - useCacheTime)
  })
})

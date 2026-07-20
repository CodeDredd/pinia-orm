import { describe, expect, it } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Attr, Num, Str, Uid } from '../../../src/decorators'
import { assertState } from '../../helpers'

describe('feature/repository/update_or_create', () => {
  class User extends Model {
    static entity = 'users'

    @Attr() id!: any
    @Str('') name!: string
    @Num(0) age!: number
  }

  it('creates a new record if no record matches the attributes', () => {
    const userRepo = useRepo(User)

    userRepo.save({ id: 1, name: 'John Doe', age: 30 })

    const user = userRepo.updateOrCreate({ id: 2 }, { name: 'Jane Doe', age: 40 })

    expect(user.id).toBe(2)

    assertState({
      users: {
        1: { id: 1, name: 'John Doe', age: 30 },
        2: { id: 2, name: 'Jane Doe', age: 40 },
      },
    })
  })

  it('updates the matching record with the given values', () => {
    const userRepo = useRepo(User)

    userRepo.save([
      { id: 1, name: 'John Doe', age: 30 },
      { id: 2, name: 'Jane Doe', age: 40 },
    ])

    const user = userRepo.updateOrCreate({ name: 'Jane Doe' }, { age: 41 })

    expect(user.id).toBe(2)

    assertState({
      users: {
        1: { id: 1, name: 'John Doe', age: 30 },
        2: { id: 2, name: 'Jane Doe', age: 41 },
      },
    })
  })

  it('matches records by multiple attributes', () => {
    const userRepo = useRepo(User)

    userRepo.save([
      { id: 1, name: 'John Doe', age: 30 },
      { id: 2, name: 'John Doe', age: 40 },
    ])

    userRepo.updateOrCreate({ name: 'John Doe', age: 40 }, { name: 'Johnny Doe' })

    assertState({
      users: {
        1: { id: 1, name: 'John Doe', age: 30 },
        2: { id: 2, name: 'Johnny Doe', age: 40 },
      },
    })
  })

  it('updates records with a composite primary key', () => {
    class RoleUser extends Model {
      static entity = 'roleUser'

      static primaryKey = ['role_id', 'user_id']

      @Attr(null) role_id!: number | null
      @Attr(null) user_id!: number | null
      @Num(0) level!: number
    }

    const roleUserRepo = useRepo(RoleUser)

    roleUserRepo.save([
      { role_id: 1, user_id: 1, level: 1 },
      { role_id: 2, user_id: 1, level: 2 },
    ])

    roleUserRepo.updateOrCreate({ role_id: 2, user_id: 1 }, { level: 5 })

    assertState({
      roleUser: {
        '[2,1]': { role_id: 2, user_id: 1, level: 5 },
        '[1,1]': { role_id: 1, user_id: 1, level: 1 },
      },
    })
  })

  it('creates a record with a generated uid', () => {
    class Tag extends Model {
      static entity = 'tags'

      @Uid() id!: string
      @Str('') name!: string
    }

    const tagRepo = useRepo(Tag)

    const tag = tagRepo.updateOrCreate({ name: 'news' })

    expect(tag.id).not.toBeNull()
    expect(tagRepo.all().length).toBe(1)
  })
})

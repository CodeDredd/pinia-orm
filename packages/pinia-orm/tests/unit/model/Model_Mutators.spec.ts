import { beforeEach, describe, expect, it } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Attr, BelongsToMany, HasMany, Mutate, Num, Str } from '../../../src/decorators'
import { assertState } from '../../helpers'

beforeEach(() => {
  Model.clearRegistries()
})

describe('unit/model/Model_Mutators', () => {
  it('should mutate data if mutators are present', () => {
    class User extends Model {
      static entity = 'users'

      @Attr('') name!: string

      static mutators () {
        return {
          name (value: any) {
            return value.toUpperCase()
          },
        }
      }
    }

    expect(new User({ name: 'john doe' }, { operation: 'get' }).name).toBe('JOHN DOE')
  })

  it('should mutate data if mutators are present with decorator', () => {
    class User extends Model {
      static entity = 'users'

      @Mutate((value: any) => value.toUpperCase())
      @Attr('')
        name!: string
    }

    expect(new User({ name: 'john doe' }, { operation: 'get' }).name).toBe('JOHN DOE')
  })

  it('should mutate data if mutators with getter are present', () => {
    class User extends Model {
      static entity = 'users'

      @Attr('') name!: string

      static mutators () {
        return {
          name: {
            get: (value: any) => value.toUpperCase(),
          },
        }
      }
    }

    expect(new User({ name: 'john doe' }, { operation: 'get' }).name).toBe('JOHN DOE')
  })

  it('should not mutate data in the store with get', () => {
    class User extends Model {
      static entity = 'users'

      @Attr(0) id!: number
      @Attr('') name!: string

      static mutators () {
        return {
          name: {
            get: (value: any) => value.toUpperCase(),
          },
        }
      }
    }

    const userRepo = useRepo(User)
    userRepo.save({
      id: 1,
      name: 'John Doe',
    })

    assertState({
      users: {
        1: { id: 1, name: 'John Doe' },
      },
    })

    expect(userRepo.find(1)?.name).toBe('JOHN DOE')
  })

  it('should mutate data in the store with set', () => {
    class User extends Model {
      static entity = 'users'

      @Attr(0) id!: number
      @Attr('') name!: string

      static mutators () {
        return {
          name: {
            set: (value: any) => { return value.toUpperCase() },
            get: (value: any) => { return value.toLowerCase() },
          },
        }
      }
    }

    const userRepo = useRepo(User)
    userRepo.save({
      id: 1,
      name: 'John Doe',
    })

    assertState({
      users: {
        1: { id: 1, name: 'JOHN DOE' },
      },
    })

    expect(userRepo.find(1)?.name).toBe('john doe')

    userRepo.save({
      id: 1,
      name: 'Jane Doe',
    })

    assertState({
      users: {
        1: { id: 1, name: 'JANE DOE' },
      },
    })

    expect(userRepo.find(1)?.name).toBe('jane doe')

    userRepo.where('id', 1).update({ name: 'Stefan Raab' })

    assertState({
      users: {
        1: { id: 1, name: 'STEFAN RAAB' },
      },
    })

    expect(userRepo.find(1)?.name).toBe('stefan raab')
  })

  it('should mutate data in the store with set', () => {
    class User extends Model {
      static entity = 'users'

      @Attr(0) id!: number
      @Attr('') name!: string

      static mutators () {
        return {
          name: {
            set: (value: any) => { return value + ' (modified)' },
          },
        }
      }
    }

    const userRepo = useRepo(User)
    userRepo.save({
      id: 1,
      name: 'test',
    })

    assertState({
      users: {
        1: { id: 1, name: 'test (modified)' },
      },
    })

    expect(userRepo.find(1)?.name).toBe('test (modified)')

    userRepo.save({
      id: 1,
      name: 'jane',
    })

    assertState({
      users: {
        1: { id: 1, name: 'jane (modified)' },
      },
    })

    expect(userRepo.find(1)?.name).toBe('jane (modified)')
  })

  it('should mutate data in the store with set/get on relations hasMany', () => {
    class Post extends Model {
      static entity = 'posts'

      @Num(0) declare id: number
      @Num(0) declare userId: number
      @Str('') declare title: string

      static mutators () {
        return {
          title: {
            set: (value: any) => { return value.toUpperCase() },
            get: (value: any) => { return value.toLowerCase() },
          },
        }
      }
    }

    class User extends Model {
      static entity = 'users'

      @Num(0) declare id: number
      @Str('') declare name: string

      @HasMany(() => Post, 'userId')
      declare posts: Post[]
    }

    const userRepo = useRepo(User)

    userRepo.save({
      id: 1,
      name: 'John Doe',
      posts: [
        { id: 1, userId: 1, title: 'Color' },
        { id: 2, userId: 1, title: 'Test' },
      ],
    })

    assertState({
      users: {
        1: { id: 1, name: 'John Doe' },
      },
      posts: {
        1: { id: 1, userId: 1, title: 'COLOR' },
        2: { id: 2, userId: 1, title: 'TEST' },
      },
    })

    const result = userRepo.with('posts').first()

    expect(result?.posts[0].title).toBe('color')
  })

  it('should mutate data in the store with set/get on relations belongsToMany', () => {
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
      @Str('') name!: string

      static mutators () {
        return {
          name: {
            set: (value: any) => { return value.toUpperCase() },
            get: (value: any) => { return value.toLowerCase() },
          },
        }
      }
    }

    class RoleUser extends Model {
      static entity = 'roleUser'

      static primaryKey = ['role_id', 'user_id']

      @Attr(null) role_id!: number | null
      @Attr(null) user_id!: number | null
      @Attr(null) level!: number | null
    }

    const userRepo = useRepo(User)

    userRepo.save([
      {
        belongsToManyId: 1,
        permissions: [{ id: 1, pivot: { level: 1 }, name: 'Color' }, { id: 2, name: 'Test' }],
      },
      {
        belongsToManyId: 2,
        permissions: [{ id: 2, name: 'Test' }],
      },
    ])

    assertState({
      users: {
        1: { belongsToManyId: 1 },
        2: { belongsToManyId: 2 },
      },
      roles: {
        1: { id: 1, name: 'COLOR' },
        2: { id: 2, name: 'TEST' },
      },
      roleUser: {
        '[1,1]': { role_id: 1, user_id: 1, level: 1 },
        '[2,1]': { role_id: 2, user_id: 1, level: null },
        '[2,2]': { role_id: 2, user_id: 2, level: null },
      },
    })

    console.log('calling with request')
    const result = userRepo.with('permissions').first()

    expect(result?.permissions[0].name).toBe('color')
  })
})

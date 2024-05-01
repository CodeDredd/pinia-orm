import { beforeEach, describe, expect, it } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Attr, HasMany, Str } from '../../../src/decorators'
import { assertState } from '../../helpers'

describe('feature/relations/has_many_save_custom_key', () => {
  beforeEach(() => {
    Model.clearRegistries()
  })

  it('inserts "has many" relation with custom primary key', () => {
    class Post extends Model {
      static entity = 'posts'

      @Attr() id!: number
      @Attr() userId!: number
      @Str('') title!: string
    }

    class User extends Model {
      static entity = 'users'

      static primaryKey = 'userId'

      @Attr() userId!: string
      @Str('') name!: string

      @HasMany(() => Post, 'userId')
        posts!: Post[]
    }

    const usersRepo = useRepo(User)

    usersRepo.save({
      userId: 1,
      name: 'John Doe',
      posts: [
        { id: 1, title: 'Title 01' },
        { id: 2, title: 'Title 02' },
      ],
    })

    assertState({
      users: {
        1: { userId: 1, name: 'John Doe' },
      },
      posts: {
        1: { id: 1, userId: 1, title: 'Title 01' },
        2: { id: 2, userId: 1, title: 'Title 02' },
      },
    })
  })

  it('inserts "has many" relation with custom local key', () => {
    class User extends Model {
      static entity = 'users'

      @Attr() id!: number
      @Attr() userId!: number
      @Str('') name!: string

      @HasMany(() => Post, 'userId', 'userId')
        posts!: Post[]
    }

    class Post extends Model {
      static entity = 'posts'

      @Attr() id!: number
      @Attr() userId!: string
      @Str('') title!: string
    }

    const usersRepo = useRepo(User)

    usersRepo.save({
      id: 1,
      userId: 2,
      name: 'John Doe',
      posts: [
        { id: 1, title: 'Title 01' },
        { id: 2, title: 'Title 02' },
      ],
    })

    assertState({
      users: {
        1: { id: 1, userId: 2, name: 'John Doe' },
      },
      posts: {
        1: { id: 1, userId: 2, title: 'Title 01' },
        2: { id: 2, userId: 2, title: 'Title 02' },
      },
    })
  })

  it('throws an error with wrong key match', () => {
    class Post extends Model {
      static entity = 'posts'

      @Attr() declare id: number
      @Attr() declare userId: number
      @Attr() declare userSecondId: number
      @Str('') declare title: string
    }

    class User extends Model {
      static entity = 'users'
      static primaryKey = ['id', 'secondId']

      @Attr() declare id: number
      @Attr() declare secondId: number
      @Str('') declare name: string

      @HasMany(() => Post, ['userId', 'userSecondId'], 'id')
      declare posts: Post[]
    }

    const usersRepo = useRepo(User)

    expect(() => {
      usersRepo.save({
        id: 1,
        secondId: 2,
        name: 'John Doe',
        posts: [
          { id: 1, title: 'Title 01' },
          { id: 2, title: 'Title 02' },
        ],
      })
    }).toThrowError()
  })
})

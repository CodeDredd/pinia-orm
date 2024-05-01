import { beforeEach, describe, it } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Attr, HasMany, Str, Uid } from '../../../src/decorators'
import { assertState, mockUid } from '../../helpers'

describe('feature/relations/has_many_insert_uid', () => {
  beforeEach(() => {
    Model.clearRegistries()
  })

  it('inserts "has many" relation with parent having "uid" field as the primary key', () => {
    class Post extends Model {
      static entity = 'posts'

      @Attr() id!: number
      @Attr() userId!: number
      @Str('') title!: string
    }

    class User extends Model {
      static entity = 'users'

      @Uid() id!: string
      @Str('') name!: string

      @HasMany(() => Post, 'userId')
        posts!: Post[]
    }

    mockUid(['uid1'])

    const usersRepo = useRepo(User)

    usersRepo.save({
      name: 'John Doe',
      posts: [
        { id: 1, title: 'Title 01' },
        { id: 2, title: 'Title 02' },
      ],
    })

    assertState({
      users: {
        uid1: { id: 'uid1', name: 'John Doe' },
      },
      posts: {
        1: { id: 1, userId: 'uid1', title: 'Title 01' },
        2: { id: 2, userId: 'uid1', title: 'Title 02' },
      },
    })
  })

  it('inserts "has many" relation with child having "uid" as the foreign key', () => {
    class Post extends Model {
      static entity = 'posts'

      @Attr() id!: number
      @Uid() userId!: string
      @Str('') title!: string
    }

    class User extends Model {
      static entity = 'users'

      @Uid() id!: string
      @Str('') name!: string

      @HasMany(() => Post, 'userId')
        posts!: Post[]
    }

    mockUid(['uid1', 'uid2', 'uid3'])

    const usersRepo = useRepo(User)

    usersRepo.save({
      name: 'John Doe',
      posts: [
        { id: 1, title: 'Title 01' },
        { id: 2, title: 'Title 02' },
      ],
    })

    assertState({
      users: {
        uid1: { id: 'uid1', name: 'John Doe' },
      },
      posts: {
        1: { id: 1, userId: 'uid1', title: 'Title 01' },
        2: { id: 2, userId: 'uid1', title: 'Title 02' },
      },
    })
  })
})

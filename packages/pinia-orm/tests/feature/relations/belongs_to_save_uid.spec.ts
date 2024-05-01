import { beforeEach, describe, it } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Attr, BelongsTo, Str, Uid } from '../../../src/decorators'
import { assertState, mockUid } from '../../helpers'

describe('feature/relations/belongs_to_save_uid', () => {
  beforeEach(() => {
    Model.clearRegistries()
  })

  it('inserts "belongs to" relation with parent having "uid" field as the primary key', () => {
    class User extends Model {
      static entity = 'users'

      @Attr() id!: number
      @Str('') name!: string
    }

    class Post extends Model {
      static entity = 'posts'

      @Uid() id!: string
      @Attr() userId!: number | null
      @Str('') title!: string

      @BelongsTo(() => User, 'userId')
        author!: User | null
    }

    mockUid(['uid1'])

    const postsRepo = useRepo(Post)

    postsRepo.save({
      title: 'Title 01',
      author: { id: 1, name: 'John Doe' },
    })

    assertState({
      users: {
        1: { id: 1, name: 'John Doe' },
      },
      posts: {
        uid1: { id: 'uid1', userId: 1, title: 'Title 01' },
      },
    })
  })

  it('inserts "belongs to" relation with child having "uid" as the owner key', () => {
    class User extends Model {
      static entity = 'users'

      @Uid() id!: string
      @Str('') name!: string
    }

    class Post extends Model {
      static entity = 'posts'

      @Uid() id!: number
      @Attr() userId!: number | null
      @Str('') title!: string

      @BelongsTo(() => User, 'userId')
        author!: User | null
    }

    mockUid(['uid1', 'uid2'])

    const postsRepo = useRepo(Post)

    postsRepo.save({
      title: 'Title 01',
      author: { name: 'John Doe' },
    })

    assertState({
      users: {
        uid2: { id: 'uid2', name: 'John Doe' },
      },
      posts: {
        uid1: { id: 'uid1', userId: 'uid2', title: 'Title 01' },
      },
    })
  })
})

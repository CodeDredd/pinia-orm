import { describe, it } from 'vitest'

import { Model, useRepo } from '../../../../src'
import { Attr, BelongsTo, HasMany, Str } from '../../../../src/decorators'
import { assertState } from '../../../helpers'

describe('feature/relations/nested/nested_relations', () => {
  class Follower extends Model {
    static entity = 'followers'

    @Attr() id!: number
    @Attr() userId!: number
  }

  class User extends Model {
    static entity = 'users'

    @Attr() id!: number
    @Str('') name!: string

    @HasMany(() => Follower, 'userId')
      followers!: Follower[]
  }

  class Post extends Model {
    static entity = 'posts'

    @Attr() id!: number
    @Attr() userId!: number | null
    @Str('') title!: string

    @BelongsTo(() => User, 'userId')
      author!: User | null
  }

  it('inserts a nested relations with missing foreign key', () => {
    const postsRepo = useRepo(Post)

    postsRepo.save({
      id: 1,
      userId: 1,
      title: 'Title 01',
      author: {
        id: 1,
        name: 'John Doe',
        followers: [{ id: 1 }, { id: 2 }],
      },
    })

    assertState({
      users: {
        1: { id: 1, name: 'John Doe' },
      },
      followers: {
        1: { id: 1, userId: 1 },
        2: { id: 2, userId: 1 },
      },
      posts: {
        1: { id: 1, userId: 1, title: 'Title 01' },
      },
    })
  })
})

import { describe, expect, it } from 'vitest'

import { Model, useRepo } from '../../../../src'
import { Attr, BelongsTo, HasMany, Str } from '../../../../src/decorators'
import { assertInstanceOf, assertModel } from '../../../helpers'

describe('feature/relations/eager_loads_all', () => {
  class User extends Model {
    static entity = 'users'

    @Attr() id!: number
    @Str('') name!: string
  }

  class Comment extends Model {
    static entity = 'comments'

    @Attr() id!: number
    @Attr() postId!: number
    @Str('') content!: string
  }

  class Post extends Model {
    static entity = 'posts'

    @Attr() id!: number
    @Attr() userId!: number
    @Str('') title!: string

    @BelongsTo(() => User, 'userId')
      author!: User | null

    @HasMany(() => Comment, 'postId')
      comments!: Comment[]
  }

  it('eager loads all top level relations', () => {
    const usersRepo = useRepo(User)
    const postsRepo = useRepo(Post)
    const commentsRepo = useRepo(Comment)

    usersRepo.save({ id: 1, name: 'John Doe' })

    postsRepo.save({ id: 1, userId: 1, title: 'Title 01' })

    commentsRepo.save({ id: 1, postId: 1, content: 'Content 01' })

    const post = postsRepo.withAll().first()!

    expect(post.author).toBeInstanceOf(User)
    assertInstanceOf(post.comments, Comment)
    assertModel(post, {
      id: 1,
      userId: 1,
      title: 'Title 01',
      author: { id: 1, name: 'John Doe' },
      comments: [{ id: 1, postId: 1, content: 'Content 01' }],
    })
  })
})

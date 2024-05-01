import { describe, expect, it } from 'vitest'

import { Model, useRepo } from '../../../../src'
import { Attr, BelongsTo, HasMany } from '../../../../src/decorators'

describe('feature/relations/nested/nested_revive', () => {
  class User extends Model {
    static entity = 'users'

    @Attr() id!: number

    @HasMany(() => Post, 'userId')
      posts!: Post[]
  }

  class Comment extends Model {
    static entity = 'comments'

    @Attr() id!: number
    @Attr() postId!: number
    @Attr() userId!: number

    @BelongsTo(() => User, 'userId')
      author!: User | null
  }

  class Post extends Model {
    static entity = 'posts'

    @Attr() id!: number
    @Attr() userId!: number | null

    @BelongsTo(() => User, 'userId')
      author!: User | null

    @HasMany(() => Comment, 'postId')
      comments!: Comment[]
  }

  it('can revive a complex nested schema', () => {
    const usersRepo = useRepo(User)
    const postsRepo = useRepo(Post)
    const commentsRepo = useRepo(Comment)

    usersRepo.save([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }])

    postsRepo.save([
      { id: 1, userId: 2 },
      { id: 2, userId: 2 },
      { id: 3, userId: 1 },
      { id: 4, userId: 1 },
    ])

    commentsRepo.save([
      { id: 1, postId: 4, userId: 4 },
      { id: 2, postId: 1, userId: 2 },
      { id: 3, postId: 2, userId: 3 },
      { id: 4, postId: 4, userId: 3 },
      { id: 5, postId: 2, userId: 1 },
    ])

    const schema = [
      {
        id: 2,
        posts: [
          {
            id: 4,
            comments: [{ id: 2 }],
          },
          {
            id: 3,
            comments: [
              {
                id: 1,
                author: { id: 4 },
              },
            ],
          },
        ],
      },
      {
        id: 1,
        posts: [{ id: 1 }, { id: 2 }],
      },
    ]

    const users = usersRepo.revive(schema)

    expect(users.length).toBe(2)
    expect(users[0].id).toBe(2)
    expect(users[1].id).toBe(1)
    expect(users[0].posts.length).toBe(2)
    expect(users[0].posts[0].comments.length).toBe(1)
    expect(users[0].posts[0].comments[0].id).toBe(2)
    expect(users[0].posts[1].comments.length).toBe(1)
    expect(users[0].posts[1].comments[0].id).toBe(1)
  })
})

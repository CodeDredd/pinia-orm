import { describe, expect, it } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Attr, HasMany, Str } from '../../../src/decorators'
import { assertInstanceOf, assertModel } from '../../helpers'

describe('feature/relations/has_many_retrieve_composite', () => {
  class Post extends Model {
    static entity = 'posts'

    @Attr() id!: number
    @Attr() userId!: number
    @Attr() userSecondId!: number
    @Str('') title!: string
  }

  class User extends Model {
    static entity = 'users'
    static primaryKey = ['id', 'secondId']

    @Attr() id!: number
    @Attr() secondId!: number
    @Str('') name!: string

    @HasMany(() => Post, ['userId', 'userSecondId'])
      posts!: Post[]
  }

  it('can eager load has many relation', () => {
    const postsRepo = useRepo(Post)
    const usersRepo = useRepo(User)

    postsRepo.save([
      { id: 1, userSecondId: 1, userId: 1, title: 'Title 01' },
      { id: 2, userSecondId: 1, userId: 1, title: 'Title 02' },
    ])
    usersRepo.save({ id: 1, secondId: 1, name: 'John Doe' })

    const user = usersRepo.with('posts').first()!

    expect(user).toBeInstanceOf(User)
    assertInstanceOf(user.posts, Post)
    assertModel(user, {
      id: 1,
      secondId: 1,
      name: 'John Doe',
      posts: [
        { id: 1, userId: 1, userSecondId: 1, title: 'Title 01' },
        { id: 2, userId: 1, userSecondId: 1, title: 'Title 02' },
      ],
    })
  })

  it('can eager load missing relation as empty array', () => {
    const usersRepo = useRepo(User)

    usersRepo.save({ id: 1, secondId: 1, name: 'John Doe' })

    const user = usersRepo.with('posts').first()!

    expect(user).toBeInstanceOf(User)
    assertModel(user, {
      id: 1,
      secondId: 1,
      name: 'John Doe',
      posts: [],
    })
  })

  it('can revive "has many" relations', () => {
    const postsRepo = useRepo(Post)
    const usersRepo = useRepo(User)

    postsRepo.save([
      { id: 1, userSecondId: 1, userId: 1, title: 'Title 01' },
      { id: 2, userSecondId: 1, userId: 1, title: 'Title 02' },
    ])
    usersRepo.save({ id: 1, secondId: 1, name: 'John Doe' })

    const schema = {
      id: 1,
      secondId: 1,
      posts: [{ id: 2 }, { id: 1 }],
    }

    const user = usersRepo.revive(schema)!

    expect(user.posts.length).toBe(2)
    expect(user.posts[0]).toBeInstanceOf(Post)
    expect(user.posts[1]).toBeInstanceOf(Post)
    expect(user.posts[0].id).toBe(2)
    expect(user.posts[1].id).toBe(1)
  })
})

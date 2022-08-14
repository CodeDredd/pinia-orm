import { describe, expect, it } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Attr, BelongsTo, Str } from '../../../src/decorators'

describe('feature/relations/belongs_to_retrieve', () => {
  class User extends Model {
    static entity = 'users'

    @Attr() id!: number
    @Str('') name!: string
  }

  class Post extends Model {
    static entity = 'posts'

    @Attr() id!: number
    @Attr() userId!: number | null
    @Str('') title!: string

    @BelongsTo(() => User, 'userId')
      author!: User | null
  }

  it('can eager load belongs to relation', () => {
    const userRepo = useRepo(User)
    const postsRepo = useRepo(Post)

    userRepo.save({ id: 1, name: 'John Doe' })
    postsRepo.save({ id: 1, userId: 1, title: 'Title 01' })

    const post = postsRepo.with('author').first()

    expect(post).toBeInstanceOf(Post)
    expect(post?.author).toBeInstanceOf(User)
    expect(post).toEqual({
      id: 1,
      userId: 1,
      title: 'Title 01',
      author: { id: 1, name: 'John Doe' },
    })
  })

  it('can eager load missing relation as `null`', () => {
    const postsRepo = useRepo(Post)

    postsRepo.save({ id: 1, userId: 1, title: 'Title 01' })

    const post = postsRepo.with('author').first()

    expect(post).toBeInstanceOf(Post)
    expect(post).toEqual({
      id: 1,
      userId: 1,
      title: 'Title 01',
      author: null,
    })
  })

  it('ignores the relation with the empty foreign key', () => {
    const userRepo = useRepo(User)
    const postsRepo = useRepo(Post)

    userRepo.save({ id: 1, name: 'John Doe' })
    postsRepo.save({ id: 1, userId: null, title: 'Title 01' })

    const post = postsRepo.with('author').first()

    expect(post).toBeInstanceOf(Post)
    expect(post).toEqual({
      id: 1,
      userId: null,
      title: 'Title 01',
      author: null,
    })
  })
})

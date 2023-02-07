import { describe, expect, it } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Attr, BelongsTo, Str } from '../../../src/decorators'

describe('feature/relations/belongs_to_retrieve_composite', () => {
  Model.clearRegistries()
  class User extends Model {
    static entity = 'users'

    static primaryKey = ['id', 'secondId']

    @Attr() declare id: number
    @Attr() declare secondId: number
    @Str('') declare name: string
  }

  class Post extends Model {
    static entity = 'posts'

    @Attr() declare id: number
    @Attr() declare userId: number | null
    @Attr() declare userSecondId: number | null
    @Str('') declare title: string

    @BelongsTo(() => User, ['userId', 'userSecondId'])
    declare author: User | null
  }

  it('can eager load belongs to relation', () => {
    const userRepo = useRepo(User)
    const postsRepo = useRepo(Post)

    userRepo.save({ id: 1, secondId: 1, name: 'John Doe' })
    userRepo.save({ id: 1, secondId: 1, name: 'John Doe' })
    postsRepo.save({ id: 1, userId: 1, userSecondId: 1, title: 'Title 01' })

    const post = postsRepo.with('author').first()

    expect(post).toBeInstanceOf(Post)
    expect(post?.author).toBeInstanceOf(User)
    expect(post).toEqual({
      id: 1,
      userId: 1,
      userSecondId: 1,
      title: 'Title 01',
      author: { id: 1, secondId: 1, name: 'John Doe' },
    })
  })

  it('can eager load missing relation as `null`', () => {
    const postsRepo = useRepo(Post)

    postsRepo.save({ id: 1, userId: 1, userSecondId: 1, title: 'Title 01' })

    const post = postsRepo.with('author').first()

    expect(post).toBeInstanceOf(Post)
    expect(post).toEqual({
      id: 1,
      userId: 1,
      userSecondId: 1,
      title: 'Title 01',
      author: null,
    })
  })

  it('ignores the relation with the empty foreign key', () => {
    const userRepo = useRepo(User)
    const postsRepo = useRepo(Post)

    userRepo.save({ id: 1, secondId: 1, name: 'John Doe' })
    postsRepo.save({ id: 1, userId: null, userSecondId: null, title: 'Title 01' })

    const post = postsRepo.with('author').first()

    expect(post).toBeInstanceOf(Post)
    expect(post).toEqual({
      id: 1,
      userId: null,
      userSecondId: null,
      title: 'Title 01',
      author: null,
    })
  })
})

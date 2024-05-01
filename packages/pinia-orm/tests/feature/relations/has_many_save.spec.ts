import { describe, it } from 'vitest'

import { Model, useRepo } from '../../../src'
import { HasMany, Num, Str } from '../../../src/decorators'
import { assertState } from '../../helpers'

describe('feature/relations/has_many_save', () => {
  class Post extends Model {
    static entity = 'posts'

    @Num(0) id!: number
    @Num(0) userId!: number
    @Str('') title!: string
  }

  class User extends Model {
    static entity = 'users'

    @Num(0) id!: number
    @Str('') name!: string

    @HasMany(() => Post, 'userId')
      posts!: Post[]
  }

  it('saves a model to the store with "has many" relation', () => {
    const postsRepo = useRepo(Post)
    const usersRepo = useRepo(User)

    postsRepo.save({ id: 1, userId: 1, title: 'Title 01' })

    usersRepo.save({
      id: 1,
      name: 'John Doe',
      posts: [
        { id: 1, userId: 1, title: '100' },
        { id: 2, userId: 1, title: '200' },
      ],
    })

    assertState({
      users: {
        1: { id: 1, name: 'John Doe' },
      },
      posts: {
        1: { id: 1, userId: 1, title: '100' },
        2: { id: 2, userId: 1, title: '200' },
      },
    })
  })

  it('generates missing foreign key', () => {
    const usersRepo = useRepo(User)

    usersRepo.save({
      id: 1,
      name: 'John Doe',
      posts: [
        { id: 1, title: 'Title 01' },
        { id: 2, title: 'Title 02' },
      ],
    })

    assertState({
      users: {
        1: { id: 1, name: 'John Doe' },
      },
      posts: {
        1: { id: 1, userId: 1, title: 'Title 01' },
        2: { id: 2, userId: 1, title: 'Title 02' },
      },
    })
  })

  it('can insert a record with missing relational key', () => {
    const usersRepo = useRepo(User)

    usersRepo.save({
      id: 1,
      name: 'John Doe',
    })

    assertState({
      users: {
        1: { id: 1, name: 'John Doe' },
      },
    })
  })
})

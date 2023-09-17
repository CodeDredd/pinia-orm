import { describe, it, expect } from 'vitest'

import { Model, useRepo } from '../../../src'
import { Attr, BelongsTo, Str } from '../../../src/decorators'
import { assertState } from '../../helpers'

describe('feature/relations/belongs_to_save', () => {
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

  it('inserts a record to the store with "belongs to" relation', () => {
    const postsRepo = useRepo(Post)

    postsRepo.save({
      id: 1,
      userId: 1,
      title: 'Title 01',
      author: { id: 1, name: 'John Doe' }
    })

    assertState({
      users: {
        1: { id: 1, name: 'John Doe' }
      },
      posts: {
        1: { id: 1, userId: 1, title: 'Title 01' }
      }
    })
  })

  it('generates missing foreign key', () => {
    const postsRepo = useRepo(Post)

    postsRepo.save({
      id: 1,
      title: 'Title 01',
      author: { id: 1, name: 'John Doe' }
    })

    assertState({
      users: {
        1: { id: 1, name: 'John Doe' }
      },
      posts: {
        1: { id: 1, userId: 1, title: 'Title 01' }
      }
    })
  })

  it('throws a error if a list is passed to the relation', () => {
    const postsRepo = useRepo(Post)

    expect(() => {
      postsRepo.save({
        id: 1,
        title: 'Title 01',
        author: [{ id: 1, name: 'John Doe' }]
      })
    }).toThrowError('[Pinia ORM] You are passing a list to " posts.author " which is a one to one Relation(BelongsTo): [{"id":1,"name":"John Doe"}]')
  })

  it('can insert a record with missing relational key', () => {
    const postsRepo = useRepo(Post)

    postsRepo.save({
      id: 1,
      title: 'Title 01'
    })

    assertState({
      posts: {
        1: { id: 1, userId: null, title: 'Title 01' }
      }
    })
  })

  it('can insert a record with relational key set to `null`', () => {
    const postsRepo = useRepo(Post)

    postsRepo.save({
      id: 1,
      title: 'Title 01',
      author: null
    })

    assertState({
      posts: {
        1: { id: 1, userId: null, title: 'Title 01' }
      }
    })
  })
})
